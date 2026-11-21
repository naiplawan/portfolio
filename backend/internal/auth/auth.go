// Package auth implements the single-admin login: a bcrypt password check,
// HMAC-signed session tokens and a per-client lockout after repeated failures.
package auth

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/base64"
	"encoding/binary"
	"errors"
	"strings"
	"sync"
	"time"

	"golang.org/x/crypto/bcrypt"
)

var (
	// ErrInvalidCredentials is returned for a wrong password.
	ErrInvalidCredentials = errors.New("invalid credentials")
	// ErrLocked is returned while a client is locked out after repeated failures.
	ErrLocked = errors.New("too many failed attempts; try again later")
	// ErrInvalidToken is returned for a malformed, forged or expired token.
	ErrInvalidToken = errors.New("invalid or expired session")
)

const (
	maxFailures = 5
	failWindow  = 15 * time.Minute
	lockout     = 15 * time.Minute
	// Bounds memory if many clients fail; stale entries are pruned first.
	maxClients = 10_000
)

type attempts struct {
	failures    []time.Time
	inFlight    int
	lockedUntil time.Time
}

// Auth verifies the admin password and issues session tokens.
type Auth struct {
	passwordHash []byte
	secret       []byte
	ttl          time.Duration
	now          func() time.Time

	mu      sync.Mutex
	clients map[string]*attempts
}

// New returns an Auth. secret must be at least 32 bytes.
func New(passwordHash string, secret []byte, ttl time.Duration) (*Auth, error) {
	if _, err := bcrypt.Cost([]byte(passwordHash)); err != nil {
		return nil, errors.New("ADMIN_PASSWORD_HASH must be a bcrypt hash (go run ./cmd/hash-password)")
	}
	if len(secret) < 32 {
		return nil, errors.New("SESSION_SECRET must be at least 32 bytes")
	}
	return &Auth{passwordHash: []byte(passwordHash), secret: secret, ttl: ttl, now: time.Now, clients: map[string]*attempts{}}, nil
}

// Login checks the password for the given client (its IP address) and returns
// a token and its expiry. Each client gets maxFailures guesses per window;
// attempts still being checked count toward the limit, so parallel requests
// cannot exceed it.
func (a *Auth) Login(client, password string) (string, time.Time, error) {
	if err := a.reserve(client); err != nil {
		return "", time.Time{}, err
	}
	ok := bcrypt.CompareHashAndPassword(a.passwordHash, []byte(password)) == nil
	a.finish(client, ok)
	if !ok {
		return "", time.Time{}, ErrInvalidCredentials
	}
	expires := a.now().Add(a.ttl)
	return a.sign(expires), expires, nil
}

func (a *Auth) reserve(client string) error {
	a.mu.Lock()
	defer a.mu.Unlock()
	now := a.now()
	state := a.clients[client]
	if state == nil {
		a.prune(now)
		state = &attempts{}
		a.clients[client] = state
	}
	if now.Before(state.lockedUntil) {
		return ErrLocked
	}
	state.failures = recent(state.failures, now)
	if len(state.failures)+state.inFlight >= maxFailures {
		return ErrLocked
	}
	state.inFlight++
	return nil
}

func (a *Auth) finish(client string, ok bool) {
	a.mu.Lock()
	defer a.mu.Unlock()
	state := a.clients[client]
	state.inFlight--
	if ok {
		state.failures = nil
		return
	}
	now := a.now()
	state.failures = append(recent(state.failures, now), now)
	if len(state.failures) >= maxFailures {
		state.lockedUntil = now.Add(lockout)
		state.failures = nil
	}
}

// prune drops idle clients when the table is full. Called with a.mu held.
func (a *Auth) prune(now time.Time) {
	if len(a.clients) < maxClients {
		return
	}
	for client, state := range a.clients {
		if state.inFlight == 0 && now.After(state.lockedUntil) && len(recent(state.failures, now)) == 0 {
			delete(a.clients, client)
		}
	}
}

func recent(failures []time.Time, now time.Time) []time.Time {
	kept := failures[:0]
	for _, at := range failures {
		if now.Sub(at) < failWindow {
			kept = append(kept, at)
		}
	}
	return kept
}

func (a *Auth) sign(expires time.Time) string {
	payload := make([]byte, 8)
	binary.BigEndian.PutUint64(payload, uint64(expires.Unix()))
	return encode(payload) + "." + encode(a.mac(payload))
}

func (a *Auth) mac(payload []byte) []byte {
	h := hmac.New(sha256.New, a.secret)
	h.Write([]byte("portfolio-admin-session:"))
	h.Write(payload)
	return h.Sum(nil)
}

// Verify checks a token's signature and expiry.
func (a *Auth) Verify(token string) error {
	payloadPart, macPart, ok := strings.Cut(token, ".")
	if !ok {
		return ErrInvalidToken
	}
	payload, err := decode(payloadPart)
	if err != nil || len(payload) != 8 {
		return ErrInvalidToken
	}
	mac, err := decode(macPart)
	if err != nil || !hmac.Equal(mac, a.mac(payload)) {
		return ErrInvalidToken
	}
	if a.now().Unix() >= int64(binary.BigEndian.Uint64(payload)) {
		return ErrInvalidToken
	}
	return nil
}

func encode(b []byte) string          { return base64.RawURLEncoding.EncodeToString(b) }
func decode(s string) ([]byte, error) { return base64.RawURLEncoding.DecodeString(s) }

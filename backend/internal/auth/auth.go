// Package auth implements the single-admin login: a bcrypt password check,
// HMAC-signed session tokens and a lockout after repeated failures.
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
	// ErrLocked is returned while logins are locked after repeated failures.
	ErrLocked = errors.New("too many failed attempts; try again later")
	// ErrInvalidToken is returned for a malformed, forged or expired token.
	ErrInvalidToken = errors.New("invalid or expired session")
)

const (
	maxFailures = 5
	failWindow  = 15 * time.Minute
	lockout     = 15 * time.Minute
)

// Auth verifies the admin password and issues session tokens.
type Auth struct {
	passwordHash []byte
	secret       []byte
	ttl          time.Duration
	now          func() time.Time

	mu          sync.Mutex
	failures    []time.Time
	lockedUntil time.Time
}

// New returns an Auth. secret must be at least 32 bytes.
func New(passwordHash string, secret []byte, ttl time.Duration) (*Auth, error) {
	if _, err := bcrypt.Cost([]byte(passwordHash)); err != nil {
		return nil, errors.New("ADMIN_PASSWORD_HASH must be a bcrypt hash (go run ./cmd/hash-password)")
	}
	if len(secret) < 32 {
		return nil, errors.New("SESSION_SECRET must be at least 32 bytes")
	}
	return &Auth{passwordHash: []byte(passwordHash), secret: secret, ttl: ttl, now: time.Now}, nil
}

// Login checks the password and returns a token and its expiry. Failures are
// counted globally: there is one admin, so a lockout cannot hurt anyone else.
func (a *Auth) Login(password string) (string, time.Time, error) {
	a.mu.Lock()
	now := a.now()
	if now.Before(a.lockedUntil) {
		a.mu.Unlock()
		return "", time.Time{}, ErrLocked
	}
	a.mu.Unlock()

	if bcrypt.CompareHashAndPassword(a.passwordHash, []byte(password)) != nil {
		a.mu.Lock()
		defer a.mu.Unlock()
		recent := a.failures[:0]
		for _, at := range a.failures {
			if now.Sub(at) < failWindow {
				recent = append(recent, at)
			}
		}
		a.failures = append(recent, now)
		if len(a.failures) >= maxFailures {
			a.lockedUntil = now.Add(lockout)
			a.failures = nil
		}
		return "", time.Time{}, ErrInvalidCredentials
	}

	a.mu.Lock()
	a.failures = nil
	a.mu.Unlock()
	expires := now.Add(a.ttl)
	return a.sign(expires), expires, nil
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

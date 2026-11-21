package auth

import (
	"strings"
	"sync"
	"testing"
	"time"

	"golang.org/x/crypto/bcrypt"
)

func newAuth(t *testing.T) (*Auth, *time.Time) {
	t.Helper()
	hash, _ := bcrypt.GenerateFromPassword([]byte("correct horse"), bcrypt.MinCost)
	a, err := New(string(hash), []byte(strings.Repeat("s", 32)), time.Hour)
	if err != nil {
		t.Fatal(err)
	}
	now := time.Date(2026, 11, 21, 12, 0, 0, 0, time.UTC)
	a.now = func() time.Time { return now }
	return a, &now
}

func TestLoginAndVerify(t *testing.T) {
	a, now := newAuth(t)
	token, expires, err := a.Login("203.0.113.1", "correct horse")
	if err != nil {
		t.Fatal(err)
	}
	if !expires.Equal(now.Add(time.Hour)) {
		t.Fatalf("expires = %v", expires)
	}
	if err := a.Verify(token); err != nil {
		t.Fatalf("fresh token: %v", err)
	}
	*now = now.Add(time.Hour)
	if err := a.Verify(token); err != ErrInvalidToken {
		t.Fatalf("expired token: %v", err)
	}
}

func TestVerifyRejectsForgedTokens(t *testing.T) {
	a, _ := newAuth(t)
	token, _, _ := a.Login("203.0.113.1", "correct horse")
	other, _ := New(string(a.passwordHash), []byte(strings.Repeat("x", 32)), time.Hour)
	for label, candidate := range map[string]string{
		"empty":        "",
		"no signature": strings.Split(token, ".")[0],
		"tampered":     "AAAAAAAAAAA." + strings.Split(token, ".")[1],
		"other secret": other.sign(time.Now().Add(time.Hour)),
	} {
		if err := a.Verify(candidate); err != ErrInvalidToken {
			t.Errorf("%s: got %v", label, err)
		}
	}
}

func TestLockoutAfterRepeatedFailures(t *testing.T) {
	a, now := newAuth(t)
	for i := 0; i < maxFailures; i++ {
		if _, _, err := a.Login("203.0.113.1", "wrong"); err != ErrInvalidCredentials {
			t.Fatalf("attempt %d: %v", i, err)
		}
	}
	if _, _, err := a.Login("203.0.113.1", "correct horse"); err != ErrLocked {
		t.Fatalf("while locked: %v", err)
	}
	*now = now.Add(lockout)
	if _, _, err := a.Login("203.0.113.1", "correct horse"); err != nil {
		t.Fatalf("after lockout: %v", err)
	}
}

func TestNewRejectsWeakConfig(t *testing.T) {
	if _, err := New("plaintext", []byte(strings.Repeat("s", 32)), time.Hour); err == nil {
		t.Error("plaintext password accepted")
	}
	hash, _ := bcrypt.GenerateFromPassword([]byte("x"), bcrypt.MinCost)
	if _, err := New(string(hash), []byte("short"), time.Hour); err == nil {
		t.Error("short secret accepted")
	}
}

func TestLockoutIsPerClient(t *testing.T) {
	a, _ := newAuth(t)
	for i := 0; i < maxFailures; i++ {
		_, _, _ = a.Login("198.51.100.7", "wrong")
	}
	if _, _, err := a.Login("198.51.100.7", "correct horse"); err != ErrLocked {
		t.Fatalf("attacker should be locked: %v", err)
	}
	if _, _, err := a.Login("203.0.113.1", "correct horse"); err != nil {
		t.Fatalf("another client must not be locked out: %v", err)
	}
}

func TestParallelGuessesCannotExceedTheLimit(t *testing.T) {
	hash, _ := bcrypt.GenerateFromPassword([]byte("correct horse"), 10) // slow enough to overlap
	a, err := New(string(hash), []byte(strings.Repeat("s", 32)), time.Hour)
	if err != nil {
		t.Fatal(err)
	}
	var wg sync.WaitGroup
	var mu sync.Mutex
	checked := 0
	for i := 0; i < 50; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			if _, _, err := a.Login("198.51.100.7", "wrong"); err == ErrInvalidCredentials {
				mu.Lock()
				checked++
				mu.Unlock()
			}
		}()
	}
	wg.Wait()
	if checked > maxFailures {
		t.Fatalf("%d passwords were checked, want at most %d", checked, maxFailures)
	}
}

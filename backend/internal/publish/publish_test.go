package publish

import (
	"io"
	"log/slog"
	"net/http"
	"net/http/httptest"
	"sync/atomic"
	"testing"
	"time"
)

func TestScheduleBatchesSaves(t *testing.T) {
	var calls atomic.Int32
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			t.Errorf("method = %s", r.Method)
		}
		calls.Add(1)
	}))
	defer server.Close()

	hook := NewDeployHook(server.URL, 50*time.Millisecond, slog.New(slog.NewTextHandler(io.Discard, nil)))
	for i := 0; i < 5; i++ {
		hook.Schedule()
		time.Sleep(10 * time.Millisecond)
	}
	time.Sleep(200 * time.Millisecond)
	if got := calls.Load(); got != 1 {
		t.Fatalf("deploy hook called %d times, want 1", got)
	}
}

func TestScheduleWithoutURLIsANoop(t *testing.T) {
	NewDeployHook("", time.Millisecond, slog.New(slog.NewTextHandler(io.Discard, nil))).Schedule()
}

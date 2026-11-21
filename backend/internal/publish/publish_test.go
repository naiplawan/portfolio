package publish

import (
	"context"
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

func TestFlushFiresAPendingDeploy(t *testing.T) {
	var calls atomic.Int32
	server := httptest.NewServer(http.HandlerFunc(func(http.ResponseWriter, *http.Request) { calls.Add(1) }))
	defer server.Close()
	hook := NewDeployHook(server.URL, time.Hour, slog.New(slog.NewTextHandler(io.Discard, nil)))
	hook.Flush(context.Background()) // nothing pending
	hook.Schedule()
	hook.Flush(context.Background())
	if got := calls.Load(); got != 1 {
		t.Fatalf("deploy hook called %d times, want 1", got)
	}
}

func TestDeployRetriesFailures(t *testing.T) {
	saved := retryDelays
	retryDelays = []time.Duration{time.Millisecond, time.Millisecond}
	defer func() { retryDelays = saved }()
	var calls atomic.Int32
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, _ *http.Request) {
		if calls.Add(1) < 3 {
			w.WriteHeader(http.StatusBadGateway)
		}
	}))
	defer server.Close()
	NewDeployHook(server.URL, time.Hour, slog.New(slog.NewTextHandler(io.Discard, nil))).deploy(context.Background())
	if got := calls.Load(); got != 3 {
		t.Fatalf("deploy hook called %d times, want 3", got)
	}
}

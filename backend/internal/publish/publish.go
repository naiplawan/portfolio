// Package publish triggers a Vercel deploy hook after content changes. Saves
// are batched: the hook fires once the content has been quiet for `delay`.
package publish

import (
	"context"
	"fmt"
	"log/slog"
	"net/http"
	"sync"
	"time"
)

// Publisher schedules site rebuilds.
type Publisher interface {
	Schedule()
}

// DeployHook calls a Vercel deploy hook URL.
type DeployHook struct {
	url    string
	delay  time.Duration
	client *http.Client
	log    *slog.Logger

	mu    sync.Mutex
	timer *time.Timer
}

// NewDeployHook returns a Publisher. An empty url disables publishing.
func NewDeployHook(url string, delay time.Duration, log *slog.Logger) *DeployHook {
	return &DeployHook{url: url, delay: delay, client: &http.Client{Timeout: 15 * time.Second}, log: log}
}

// Schedule (re)starts the countdown to the next deploy.
func (d *DeployHook) Schedule() {
	if d.url == "" {
		d.log.Info("content changed; VERCEL_DEPLOY_HOOK_URL is not set, so no rebuild was triggered")
		return
	}
	d.mu.Lock()
	defer d.mu.Unlock()
	if d.timer != nil {
		d.timer.Stop()
	}
	d.timer = time.AfterFunc(d.delay, func() {
		if err := d.trigger(context.Background()); err != nil {
			d.log.Error("deploy hook failed", "error", err)
			return
		}
		d.log.Info("deploy hook triggered")
	})
}

func (d *DeployHook) trigger(ctx context.Context) error {
	req, err := http.NewRequestWithContext(ctx, http.MethodPost, d.url, nil)
	if err != nil {
		return err
	}
	res, err := d.client.Do(req)
	if err != nil {
		return err
	}
	defer res.Body.Close()
	if res.StatusCode >= 300 {
		return fmt.Errorf("deploy hook returned %s", res.Status)
	}
	return nil
}

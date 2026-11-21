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

// retryDelays are the waits between deploy hook attempts.
var retryDelays = []time.Duration{2 * time.Second, 10 * time.Second, 30 * time.Second}

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
	d.timer = time.AfterFunc(d.delay, func() { d.deploy(context.Background()) })
}

// Flush fires a pending deploy immediately, so a save made just before a
// restart still reaches the site. Call it on shutdown.
func (d *DeployHook) Flush(ctx context.Context) {
	d.mu.Lock()
	pending := d.timer != nil && d.timer.Stop()
	d.timer = nil
	d.mu.Unlock()
	if pending {
		d.deploy(ctx)
	}
}

func (d *DeployHook) deploy(ctx context.Context) {
	err := d.trigger(ctx)
	for _, wait := range retryDelays {
		if err == nil {
			break
		}
		d.log.Warn("deploy hook failed; retrying", "error", err, "in", wait)
		select {
		case <-time.After(wait):
		case <-ctx.Done():
			d.log.Error("deploy hook abandoned", "error", ctx.Err())
			return
		}
		err = d.trigger(ctx)
	}
	if err != nil {
		d.log.Error("deploy hook failed; publish manually from Vercel", "error", err)
		return
	}
	d.log.Info("deploy hook triggered")
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

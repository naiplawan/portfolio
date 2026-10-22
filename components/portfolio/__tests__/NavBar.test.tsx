import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import NavBar from '../NavBar';

vi.mock('next/navigation', () => ({ usePathname: () => '/' }));

let desktop: MediaQueryList;

beforeEach(() => {
  desktop = Object.assign(new EventTarget(), {
    matches: false,
    media: '(min-width: 768px)',
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
  }) as MediaQueryList;
  const matchMedia = window.matchMedia.bind(window);
  vi.spyOn(window, 'matchMedia').mockImplementation((query) =>
    query === desktop.media ? desktop : matchMedia(query)
  );
});

afterEach(() => {
  vi.restoreAllMocks();
  document.body.style.overflow = '';
});

function renderPage() {
  return render(<><NavBar /><main>Page content</main><footer>Footer content</footer></>);
}

async function openMenu() {
  fireEvent.click(screen.getByRole('button', { name: 'Menu' }));
  const dialog = screen.getByRole('dialog', { name: 'Site navigation' });
  await waitFor(() => expect(dialog.contains(document.activeElement)).toBe(true));
  return dialog;
}

describe('mobile navigation', () => {
  it('provides a Close button inside the dialog and returns focus to its trigger', async () => {
    renderPage();
    const dialog = await openMenu();
    fireEvent.click(within(dialog).getByRole('button', { name: 'Close' }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Menu' })).toHaveFocus();
    expect(document.body.style.overflow).toBe('');
    expect(screen.getByRole('main')).not.toHaveAttribute('inert');
  });

  it('wraps keyboard focus through the dialog Close button in both directions', async () => {
    renderPage();
    const dialog = await openMenu();
    const close = within(dialog).getByRole('button', { name: 'Close' });
    const email = within(dialog).getByRole('link', { name: 'rachaphol.plo@gmail.com' });

    email.focus();
    fireEvent.keyDown(document, { key: 'Tab' });
    expect(close).toHaveFocus();
    fireEvent.keyDown(document, { key: 'Tab', shiftKey: true });
    expect(email).toHaveFocus();
  });

  it('closes on Escape and releases the page', async () => {
    renderPage();
    await openMenu();
    expect(document.body.style.overflow).toBe('hidden');
    expect(document.querySelector('main')).toHaveAttribute('inert');

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Menu' })).toHaveFocus();
    expect(document.body.style.overflow).toBe('');
    expect(document.querySelector('footer')).not.toHaveAttribute('inert');
  });

  it('releases scroll and inert state when the desktop breakpoint is crossed', async () => {
    renderPage();
    await openMenu();

    act(() => {
      Object.defineProperty(desktop, 'matches', { value: true, configurable: true });
      desktop.dispatchEvent(new Event('change'));
    });

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(document.body.style.overflow).toBe('');
    expect(document.querySelector('main')).not.toHaveAttribute('inert');
    expect(document.querySelector('footer')).not.toHaveAttribute('inert');
    expect(screen.getByRole('link', { name: 'Work' })).toHaveFocus();
  });

  it('restores the previous scroll style when unmounted with the menu open', async () => {
    document.body.style.overflow = 'auto';
    const { unmount } = renderPage();
    await openMenu();
    unmount();
    expect(document.body.style.overflow).toBe('auto');
  });
});

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SolveButton from './SolveButton';

vi.mock('sonner', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

describe('SolveButton', () => {
  const originalFetch = global.fetch;
  let locationHref = '';

  beforeEach(() => {
    locationHref = '';
    // mock location
    Object.defineProperty(window, 'location', {
      value: { href: '' },
      writable: true,
    });
    vi.clearAllMocks();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('renders "Mark as Solved" when not initially solved', () => {
    render(<SolveButton problemId="p1" initialSolved={false} />);
    expect(screen.getByRole('button', { name: /mark as solved/i })).toBeInTheDocument();
  });

  it('renders "Solved" and is disabled when initially solved', () => {
    render(<SolveButton problemId="p1" initialSolved={true} />);
    const btn = screen.getByRole('button', { name: /solved/i });
    expect(btn).toBeDisabled();
  });

  it('does nothing when already solved and clicked', async () => {
    const fetchMock = vi.fn();
    global.fetch = fetchMock as any;
    render(<SolveButton problemId="p1" initialSolved={true} />);
    fireEvent.click(screen.getByRole('button'));
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('marks solved and shows success on 200', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      status: 200,
      ok: true,
      json: async () => ({ solved: true }),
    }) as any;

    render(<SolveButton problemId="p1" initialSolved={false} />);
    fireEvent.click(screen.getByRole('button', { name: /mark as solved/i }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /solved/i })).toBeInTheDocument();
    });
  });

  it('shows error toast on non-ok response', async () => {
    const { toast } = await import('sonner');
    global.fetch = vi.fn().mockResolvedValue({
      status: 500,
      ok: false,
      json: async () => ({}),
    }) as any;

    render(<SolveButton problemId="p1" initialSolved={false} />);
    fireEvent.click(screen.getByRole('button', { name: /mark as solved/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
    });
    expect(screen.getByRole('button', { name: /mark as solved/i })).toBeInTheDocument();
  });

  it('on 401 shows login toast and redirects', async () => {
    const { toast } = await import('sonner');
    global.fetch = vi.fn().mockResolvedValue({ status: 401, ok: false }) as any;

    render(<SolveButton problemId="p1" initialSolved={false} />);
    fireEvent.click(screen.getByRole('button', { name: /mark as solved/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Please log in to submit your solution');
    });
  });
});
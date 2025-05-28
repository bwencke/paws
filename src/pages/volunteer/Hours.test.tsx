import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import HoursPage from './Hours';
import { MemoryRouter } from 'react-router-dom'; // <-- Add this import
import { vi } from 'vitest';

// Mock dependencies
vi.mock('../../../lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: { user: { id: 'test-user' } } } }),
      onAuthStateChange: vi.fn().mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } }),
    },
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({ data: [] }),
      update: vi.fn().mockResolvedValue({ error: null }),
      insert: vi.fn().mockResolvedValue({ error: null }),
    })),
  },
}));

vi.mock('../../components/VolunteerHoursGroupedByMonth', () => ({
  __esModule: true,
  default: ({ hourEntries, onEdit }: any) => (
    <div data-testid="grouped-list">
      {hourEntries.map((entry: any) => (
        <div key={entry.id} data-testid="hour-entry" onClick={() => onEdit(entry)}>
          {entry.type?.name} - {entry.hours}
        </div>
      ))}
    </div>
  ),
}));

vi.mock('../../components/AddVolunteerHoursForm', () => ({
  __esModule: true,
  default: ({ onSubmit, onCancel }: any) => (
    <div>
      <button onClick={() => onSubmit({ date: '2024-01-01', hours: '2', typeId: '1', locationId: '1' })}>
        Submit
      </button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  ),
}));

vi.mock('../../components/ThankYouModal', () => ({
  __esModule: true,
  default: ({ onDismiss }: any) => (
    <div data-testid="thank-you-modal">
      <button onClick={onDismiss}>Close</button>
    </div>
  ),
}));

describe('HoursPage', () => {
  it('renders the volunteer hours grouped by month list', async () => {
    render(
      <MemoryRouter>
        <HoursPage />
      </MemoryRouter>
    );
    await waitFor(() => {
      expect(screen.getByTestId('grouped-list')).toBeInTheDocument();
    });
  });

  it('opens and closes the AddVolunteerHoursForm modal', async () => {
    render(
      <MemoryRouter>
        <HoursPage />
      </MemoryRouter>
    );
    // Open modal
    fireEvent.click(screen.getByRole('button'));
    await waitFor(() => {
      expect(screen.getByText('Submit')).toBeInTheDocument();
    });
    // Cancel closes modal
    fireEvent.click(screen.getByText('Cancel'));
    await waitFor(() => {
      expect(screen.queryByText('Submit')).not.toBeInTheDocument();
    });
  });

  it('shows ThankYouModal after submitting new hours', async () => {
    render(
      <MemoryRouter>
        <HoursPage />
      </MemoryRouter>
    );
    // Open modal
    fireEvent.click(screen.getByRole('button'));
    // Submit form
    fireEvent.click(screen.getByText('Submit'));
    await waitFor(() => {
      expect(screen.getByTestId('thank-you-modal')).toBeInTheDocument();
    });
    // Dismiss modal
    fireEvent.click(screen.getByText('Close'));
    await waitFor(() => {
      expect(screen.queryByTestId('thank-you-modal')).not.toBeInTheDocument();
    });
  });
});
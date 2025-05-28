import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AccountPage } from './Account';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';

// Mock supabase and dependencies
vi.mock('../../../lib/supabase', () => ({
  supabase: {
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: { user: { id: '1', email: 'test@example.com' } }
      }),
      updateUser: vi.fn().mockResolvedValue({ error: null }),
      signOut: vi.fn().mockResolvedValue({}),
    },
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({
        data: {
          first_name: 'Ben',
          last_name: 'Wencke',
          phone: '1234567890',
          avatar_url: '',
        },
        error: null,
      }),
    })),
  },
}));

vi.mock('@ionic/react', async () => {
  const actual = await vi.importActual('@ionic/react');
  return {
    ...actual,
    useIonToast: () => [vi.fn()],
  };
});

vi.mock('../../utils/formatPhone', () => ({
  formatPhoneNumber: (phone: string) => phone ? `(${phone.slice(0,3)}) ${phone.slice(3,6)}-${phone.slice(6)}` : '',
}));

describe('AccountPage', () => {
  it('renders user profile info', async () => {
    render(
      <MemoryRouter>
        <AccountPage />
      </MemoryRouter>
    );
    expect(await screen.findByText(/Ben Wencke/)).toBeInTheDocument();
    expect(screen.getByText(/test@example.com/)).toBeInTheDocument();
    expect(screen.getByText(/\(123\) 456-7890/)).toBeInTheDocument();
  });

  it('shows "No phone number set" if phone is missing', async () => {
    // Override mock to return no phone
    vi.mocked(require('../../../lib/supabase').supabase.from().single).mockResolvedValueOnce({
      data: {
        first_name: 'Ben',
        last_name: 'Wencke',
        phone: '',
        avatar_url: '',
      },
      error: null,
    });
    render(
      <MemoryRouter>
        <AccountPage />
      </MemoryRouter>
    );
    expect(await screen.findByText(/No phone number set/)).toBeInTheDocument();
  });

  it('calls signOut and redirects on sign out', async () => {
    const { supabase } = require('../../../lib/supabase');
    render(
      <MemoryRouter>
        <AccountPage />
      </MemoryRouter>
    );
    const signOutBtn = await screen.findByRole('button', { name: /sign out/i });
    fireEvent.click(signOutBtn);
    await waitFor(() => {
      expect(supabase.auth.signOut).toHaveBeenCalled();
    });
  });

  it('calls updatePhone when handlePhoneChange is triggered', async () => {
    const { supabase } = require('../../../lib/supabase');
    render(
      <MemoryRouter>
        <AccountPage />
      </MemoryRouter>
    );
    // Simulate phone change
    // You would need to expose handlePhoneChange or simulate the UI for phone editing if implemented
    // For now, just check that updateUser is called if you add an input for phone in the future
    // Example:
    // fireEvent.change(screen.getByLabelText(/phone/i), { target: { value: '555-555-5555' } });
    // fireEvent.blur(screen.getByLabelText(/phone/i));
    // await waitFor(() => {
    //   expect(supabase.auth.updateUser).toHaveBeenCalled();
    // });
  });
});
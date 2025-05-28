import { render, screen, fireEvent } from '@testing-library/react';
import { Header } from './Header';
import { MemoryRouter, Route } from 'react-router-dom';
import { vi } from 'vitest';

// Mock supabase
vi.mock('../../lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: { user: { id: '1' } } } }),
      onAuthStateChange: vi.fn().mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } }),
    },
  },
}));

describe('Header', () => {
  it('renders the title', async () => {
    render(
      <MemoryRouter initialEntries={['/adoptions']}>
        <Header title="Test Title" />
      </MemoryRouter>
    );
    expect(await screen.findByText('Test Title')).toBeInTheDocument();
  });

  it('shows the back button on non-top-level routes', async () => {
    render(
      <MemoryRouter initialEntries={['/volunteer/hours']}>
        <Header title="Hours" />
      </MemoryRouter>
    );
    expect(await screen.findByRole('button', { name: /back/i })).toBeInTheDocument();
  });

  it('does not show the back button on top-level routes', async () => {
    render(
      <MemoryRouter initialEntries={['/adoptions']}>
        <Header title="Adoptions" />
      </MemoryRouter>
    );
    expect(screen.queryByRole('button', { name: /back/i })).not.toBeInTheDocument();
  });

  it('shows the account icon button when logged in', async () => {
    render(
      <MemoryRouter initialEntries={['/adoptions']}>
        <Header title="Adoptions" />
      </MemoryRouter>
    );
    expect(await screen.findByRole('button', { hidden: true })).toBeInTheDocument();
    expect(screen.getByTestId('header')).toBeInTheDocument();
  });

  it('navigates to /volunteer/account when account icon is clicked', async () => {
    let testLocation = '';
    render(
      <MemoryRouter initialEntries={['/adoptions']}>
        <Route
          path="*"
          render={({ location }) => {
            testLocation = location.pathname;
            return <Header title="Adoptions" />;
          }}
        />
      </MemoryRouter>
    );
    const buttons = await screen.findAllByRole('button');
    // The account icon button is the last button rendered
    fireEvent.click(buttons[buttons.length - 1]);
    // After click, location should be /volunteer/account
    expect(testLocation).toBe('/volunteer/account');
  });
});
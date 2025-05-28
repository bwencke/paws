import React from 'react';
import { render, screen, waitFor, within } from '@testing-library/react';
import App from './App';
import { vi } from 'vitest';

// Mock dependencies
vi.mock('../lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
      onAuthStateChange: vi.fn().mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } }),
    },
  },
}));
vi.mock('@capacitor/status-bar', () => ({
  StatusBar: {
    setBackgroundColor: vi.fn(),
    setStyle: vi.fn(),
    setOverlaysWebView: vi.fn(),
  },
  Style: { Dark: 'DARK' },
}));

describe('App', () => {
  it('renders without crashing and redirects to /adoptions', async () => {
    render(<App />);
    // Wait for the auth check to complete
    await waitFor(() => {
      // The Adoptions tab label should be present
      const header = screen.getByTestId('header');
      expect(within(header).getByText(/Adoptions/i)).toBeInTheDocument();
    });
  });

  it('shows tab bar with correct tabs', async () => {
    render(<App />);
    await waitFor(() => {
      const tabBar = screen.getByTestId('tab-bar');
      expect(within(tabBar).getByText(/Adoptions/i)).toBeInTheDocument();
      expect(within(tabBar).getByText(/Events/i)).toBeInTheDocument();
      expect(within(tabBar).getByText(/Volunteer/i)).toBeInTheDocument();
    });
  });
});

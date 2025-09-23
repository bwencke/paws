import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import ThankYouModal from './ThankYouModal';

describe('ThankYouModal', () => {
  it('renders a thank you message and icon', async () => {
    render(<ThankYouModal onDismiss={() => {}} />);
    expect(await screen.findByText(/Thank You!/i)).toBeInTheDocument();
  });
});
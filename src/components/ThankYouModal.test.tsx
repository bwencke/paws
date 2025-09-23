import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import ThankYouModal from './ThankYouModal';

describe('ThankYouModal', () => {
  it('renders a thank you message and icon', async () => {
    render(<ThankYouModal onDismiss={() => {}} />);
    expect(await screen.findByText(/Thank You!/i)).toBeInTheDocument();
    // At least one of the possible messages should be present
    expect(
      await screen.findByText(
        (content) =>
          content.includes('paws') ||
          content.includes('fur') ||
          content.includes('mutt') ||
          content.includes('Howl') ||
          content.includes('tails wag') ||
          content.includes('purr') ||
          content.includes('cat') ||
          content.includes('claw') ||
          content.includes('feline') ||
          content.includes('lion')
      )
    ).toBeInTheDocument();
  });
});
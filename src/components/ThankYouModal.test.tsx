import { render, screen, fireEvent } from '@testing-library/react';
import ThankYouModal from './ThankYouModal';

describe('ThankYouModal', () => {
  it('renders a thank you message and icon', () => {
    render(<ThankYouModal onDismiss={() => {}} />);
    expect(screen.getByText(/Thank You!/i)).toBeInTheDocument();
    // At least one of the possible messages should be present
    expect(
      screen.getByText(
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

  it('calls onDismiss when Close button is clicked', () => {
    const onDismiss = vi.fn();
    render(<ThankYouModal onDismiss={onDismiss} />);
    fireEvent.click(screen.getByText(/Close/i));
    expect(onDismiss).toHaveBeenCalled();
  });
});
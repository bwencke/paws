import { render, screen, fireEvent } from '@testing-library/react';
import VolunteerHour from './VolunteerHour';

const mockEntry = {
  id: 1,
  hours: 3,
  date: '2024-06-01',
  type: { id: 2, name: 'Dog Walking' },
  location: { id: 5, name: 'Shelter A' },
};

describe('VolunteerHour', () => {
  it('renders entry details correctly', () => {
    render(<VolunteerHour entry={mockEntry} onEdit={() => {}} />);
    expect(screen.getByText(/Dog Walking at Shelter A/)).toBeInTheDocument();
    expect(screen.getByText(/June 01, 2024/)).toBeInTheDocument();
    expect(screen.getByText(/3/)).toBeInTheDocument();
    expect(screen.getByText(/hrs/)).toBeInTheDocument();
  });

  it('calls onEdit with entry when clicked', () => {
    const onEdit = vi.fn();
    render(<VolunteerHour entry={mockEntry} onEdit={onEdit} />);
    fireEvent.click(screen.getByRole('listitem'));
    expect(onEdit).toHaveBeenCalledWith(mockEntry);
  });

  it('shows "Invalid date" if date is missing', () => {
    const entry = { ...mockEntry, date: '' };
    render(<VolunteerHour entry={entry} onEdit={() => {}} />);
    expect(screen.getByText(/Invalid date/)).toBeInTheDocument();
  });
});
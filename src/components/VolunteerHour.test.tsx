import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import VolunteerHour from './VolunteerHour';

const mockEntry = {
  id: 1,
  hours: 3,
  date: '2024-06-01',
  type: 'Dog Walking',
  location: 'Shelter A',
  type_id: 2,
  location_id: 5,
  first_name: 'John',
  last_name: 'Doe',
  user_id: 'user1',
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
    fireEvent.click(screen.getByText(/Dog Walking at Shelter A/));
    expect(onEdit).toHaveBeenCalledWith(mockEntry);
  });

  it('shows "Invalid date" if date is missing', () => {
    const entry = { ...mockEntry, date: '' };
    render(<VolunteerHour entry={entry} onEdit={() => {}} />);
    expect(screen.getByText(/Invalid date/)).toBeInTheDocument();
  });
});
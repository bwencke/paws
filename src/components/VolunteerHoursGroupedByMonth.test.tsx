import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import VolunteerHoursGroupedByMonth from './VolunteerHoursGroupedByMonth';

const mockEntries = [
  {
    id: 1,
    hours: 2,
    date: '2024-06-01',
    type: 'Dog Walking',
    location: 'Shelter A',
    type_id: 1,
    location_id: 1,
    first_name: 'John',
    last_name: 'Doe',
    user_id: 'user1',
  },
  {
    id: 2,
    hours: 3,
    date: '2024-06-15',
    type: 'Cat Cuddling',
    location: 'Shelter B',
    type_id: 2,
    location_id: 2,
    first_name: 'Jane',
    last_name: 'Smith',
    user_id: 'user2',
  },
  {
    id: 3,
    hours: 1,
    date: '2024-05-20',
    type: 'Dog Walking',
    location: 'Shelter A',
    type_id: 1,
    location_id: 1,
    first_name: 'John',
    last_name: 'Doe',
    user_id: 'user1',
  },
];

describe('VolunteerHoursGroupedByMonth', () => {
  it('renders grouped months and entries', () => {
    render(<VolunteerHoursGroupedByMonth hourEntries={mockEntries} onEdit={() => {}} />);
    expect(screen.getByTestId('volunteer-hours-grouped-by-month-list')).toBeInTheDocument();
    expect(screen.getByText('June 2024')).toBeInTheDocument();
    expect(screen.getByText('May 2024')).toBeInTheDocument();
    // There should be two 'Dog Walking at Shelter A' entries
    expect(screen.getAllByText(/Dog Walking at Shelter A/)).toHaveLength(2);
    expect(screen.getByText(/Cat Cuddling at Shelter B/)).toBeInTheDocument();
  });

  it('calls onEdit when a VolunteerHour is clicked', () => {
    const onEdit = vi.fn();
    render(<VolunteerHoursGroupedByMonth hourEntries={mockEntries} onEdit={onEdit} />);
    // Find all IonItem elements and click the first non-header one
    const items = screen.getAllByText(/Dog Walking at Shelter A/);
    fireEvent.click(items[0]);
    expect(onEdit).toHaveBeenCalled();
  });

  it('renders nothing if hourEntries is empty', () => {
    render(<VolunteerHoursGroupedByMonth hourEntries={[]} onEdit={() => {}} />);
    expect(screen.getByTestId('volunteer-hours-grouped-by-month-list').textContent).toBe('');
  });
});
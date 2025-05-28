import { render, screen, fireEvent } from '@testing-library/react';
import VolunteerHoursGroupedByMonth from './VolunteerHoursGroupedByMonth';

const mockEntries = [
  {
    id: 1,
    hours: 2,
    date: '2024-06-01',
    type: { id: 1, name: 'Dog Walking' },
    location: { id: 1, name: 'Shelter A' },
  },
  {
    id: 2,
    hours: 3,
    date: '2024-06-15',
    type: { id: 2, name: 'Cat Cuddling' },
    location: { id: 2, name: 'Shelter B' },
  },
  {
    id: 3,
    hours: 1,
    date: '2024-05-20',
    type: { id: 1, name: 'Dog Walking' },
    location: { id: 1, name: 'Shelter A' },
  },
];

describe('VolunteerHoursGroupedByMonth', () => {
  it('renders grouped months and entries', () => {
    render(<VolunteerHoursGroupedByMonth hourEntries={mockEntries} onEdit={() => {}} />);
    expect(screen.getByTestId('volunteer-hours-grouped-by-month-list')).toBeInTheDocument();
    expect(screen.getByText('June 2024')).toBeInTheDocument();
    expect(screen.getByText('May 2024')).toBeInTheDocument();
    expect(screen.getByText(/Dog Walking at Shelter A/)).toBeInTheDocument();
    expect(screen.getByText(/Cat Cuddling at Shelter B/)).toBeInTheDocument();
  });

  it('calls onEdit when a VolunteerHour is clicked', () => {
    const onEdit = vi.fn();
    render(<VolunteerHoursGroupedByMonth hourEntries={mockEntries} onEdit={onEdit} />);
    // Find all VolunteerHour list items and click the first one
    const items = screen.getAllByRole('listitem');
    fireEvent.click(items[0]);
    expect(onEdit).toHaveBeenCalled();
  });

  it('renders nothing if hourEntries is empty', () => {
    render(<VolunteerHoursGroupedByMonth hourEntries={[]} onEdit={() => {}} />);
    expect(screen.getByTestId('volunteer-hours-grouped-by-month-list').textContent).toBe('');
  });
});
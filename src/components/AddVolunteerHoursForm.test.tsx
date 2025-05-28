import { render, screen, fireEvent } from '@testing-library/react';
import AddVolunteerHoursForm from './AddVolunteerHoursForm';

const eventTypes = [
  { id: 1, name: 'Dog Walking' },
  { id: 2, name: 'Cat Cuddling' },
];
const eventLocations = [
  { id: 1, name: 'Shelter A' },
  { id: 2, name: 'Shelter B' },
];

describe('AddVolunteerHoursForm', () => {
  it('renders form fields and buttons', () => {
    render(
      <AddVolunteerHoursForm
        eventTypes={eventTypes}
        eventLocations={eventLocations}
        onSubmit={() => {}}
        onCancel={() => {}}
      />
    );
    expect(screen.getByText(/Add Volunteer Hours/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Hours/i)).toBeInTheDocument();
    expect(screen.getByText(/Type/i)).toBeInTheDocument();
    expect(screen.getByText(/Location/i)).toBeInTheDocument();
    expect(screen.getByText(/Submit/i)).toBeInTheDocument();
    expect(screen.getByText(/Cancel/i)).toBeInTheDocument();
  });

  it('validates required fields and shows errors', () => {
    render(
      <AddVolunteerHoursForm
        eventTypes={eventTypes}
        eventLocations={eventLocations}
        onSubmit={() => {}}
        onCancel={() => {}}
      />
    );
    fireEvent.change(screen.getByLabelText(/Hours/i), { target: { value: '' } });
    fireEvent.click(screen.getByText(/Submit/i));
    expect(screen.getByText(/Hours must be greater than 0/i)).toBeInTheDocument();
    expect(screen.getByText(/Event type is required/i)).toBeInTheDocument();
    expect(screen.getByText(/Event location is required/i)).toBeInTheDocument();
  });

  it('calls onSubmit with form data when valid', () => {
    const onSubmit = vi.fn();
    render(
      <AddVolunteerHoursForm
        eventTypes={eventTypes}
        eventLocations={eventLocations}
        onSubmit={onSubmit}
        onCancel={() => {}}
      />
    );
    fireEvent.change(screen.getByLabelText(/Hours/i), { target: { value: '2' } });
    fireEvent.change(screen.getByLabelText(/Type/i), { target: { value: '1' } });
    fireEvent.change(screen.getByLabelText(/Location/i), { target: { value: '2' } });
    fireEvent.click(screen.getByText(/Submit/i));
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        hours: '2',
        typeId: '1',
        locationId: '2',
      })
    );
  });

  it('calls onCancel when Cancel button is clicked', () => {
    const onCancel = vi.fn();
    render(
      <AddVolunteerHoursForm
        eventTypes={eventTypes}
        eventLocations={eventLocations}
        onSubmit={() => {}}
        onCancel={onCancel}
      />
    );
    fireEvent.click(screen.getByText(/Cancel/i));
    expect(onCancel).toHaveBeenCalled();
  });

  it('renders with initialData for editing', () => {
    render(
      <AddVolunteerHoursForm
        eventTypes={eventTypes}
        eventLocations={eventLocations}
        onSubmit={() => {}}
        onCancel={() => {}}
        initialData={{
          date: '2024-06-01',
          hours: '3',
          typeId: '2',
          locationId: '1',
        }}
      />
    );
    expect(screen.getByDisplayValue('3')).toBeInTheDocument();
    expect(screen.getByText(/Edit Volunteer Hours/i)).toBeInTheDocument();
  });
});
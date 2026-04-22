import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AddVolunteerHoursForm from './AddVolunteerHoursForm';
import { vi } from 'vitest';

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
    expect(screen.getByPlaceholderText(/how many hours/i)).toBeInTheDocument();
    expect(screen.getByTestId('activity-select')).toBeInTheDocument();
    expect(screen.getByTestId('location-select')).toBeInTheDocument();
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
    fireEvent.change(screen.getByPlaceholderText(/how many hours/i), { target: { value: '' } });
    fireEvent.click(screen.getByText(/Submit/i));
    expect(screen.getByText((content) => content.replace(/\s+/g, ' ').includes('Hours must be greater than 0'))).toBeInTheDocument();
    expect(screen.getByText((content) => content.replace(/\s+/g, ' ').includes('Event type is required'))).toBeInTheDocument();
    expect(screen.getByText((content) => content.replace(/\s+/g, ' ').includes('Event location is required'))).toBeInTheDocument();
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

  it('renders with initialData for editing', async () => {
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

    expect(await screen.findByDisplayValue('3')).toBeInTheDocument();
    expect(screen.getByText(/Edit Volunteer Hours/i)).toBeInTheDocument();
  });

  it('shows Thank You modal after successful submit', async () => {
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
    fireEvent.change(screen.getByPlaceholderText(/how many hours/i), { target: { value: '2' } });
    fireEvent.click(screen.getByText(/Update/i));
    expect(await screen.findByText((content) => content.replace(/\s+/g, ' ').includes('Thank You'))).toBeInTheDocument();
  });

  it('shows Delete button and calls onDelete when editing', async () => {
    const onDelete = vi.fn();
    const user = userEvent.setup();
    render(
      <AddVolunteerHoursForm
        eventTypes={eventTypes}
        eventLocations={eventLocations}
        onSubmit={() => {}}
        onCancel={() => {}}
        onDelete={onDelete}
        initialData={{
          date: '2024-06-01',
          hours: '3',
          typeId: '2',
          locationId: '1',
        }}
      />
    );
    expect(screen.getByText(/Edit Volunteer Hours/i)).toBeInTheDocument();
    const deleteButton = screen.getByTestId('delete-button');
    expect(deleteButton).toBeInTheDocument();
    await user.click(deleteButton);
    expect(await screen.findByText(/Are you sure you want to delete/i)).toBeInTheDocument();
    const deleteConfirmButton = screen.getAllByRole('button', { name: /Delete/i }).find(
      el => el.textContent && el.textContent.includes('Delete')
    );
    if (deleteConfirmButton) {
      await user.click(deleteConfirmButton);
    } else {
      throw new Error('Delete confirmation button not found');
    }
    await waitFor(() => {
      expect(onDelete).toHaveBeenCalled();
    });
  });

  it('shows Update button when editing', () => {
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
    expect(screen.getByText(/Update/i)).toBeInTheDocument();
  });
});
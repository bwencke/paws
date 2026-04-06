import {
  IonContent,
  IonFab,
  IonFabButton,
  IonIcon,
  IonModal,
  IonToast,
} from '@ionic/react';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { add, time } from 'ionicons/icons';
import AddVolunteerHoursForm from './AddVolunteerHoursForm';
import { HourEntry } from '../types/volunteerTypes';

type EditingHourFormState = {
  id: number;
  date: string;
  hours: string;
  typeId: string;
  locationId: string;
};
import VolunteerHoursGroupedByMonth from './VolunteerHoursGroupedByMonth';
import VolunteerHoursGroupedByMonthSkeleton from './VolunteerHoursGroupedByMonthSkeleton';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

import LocationPieChart from './LocationPieChart';
import TypePieChart from './TypePieChart';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import { useVolunteerHours } from '../hooks/useVolunteerHours';
import VolunteerHoursPieCharts from './VolunteerHoursPieCharts';

Chart.register(ArcElement, Tooltip, Legend);

interface VolunteerHoursManagerProps {
  userId: string;
}

const VolunteerHoursManager: React.FC<VolunteerHoursManagerProps> = ({ userId }) => {
  const {
    hourEntries,
    isLoading,
    fetchHourEntries,
    createHourEntry,
    updateHourEntry,
    deleteHourEntry,
  } = useVolunteerHours(userId);
  const [showModal, setShowModal] = useState(false);
  const [editEntry, setEditEntry] = useState<EditingHourFormState | null>(null);
  const [eventTypes, setEventTypes] = useState<{ id: number; name: string }[]>([]);
  const [eventLocations, setEventLocations] = useState<{ id: number; name: string }[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (userId) {
      fetchHourEntries();
    }
  }, [userId, fetchHourEntries]);

  useEffect(() => {
    // Fetch event types and locations from Supabase
    const fetchEventTypes = async () => {
      const { data } = await supabase.from('event_types').select('id, name');
      setEventTypes(data || []);
    };

    const fetchEventLocations = async () => {
      const { data } = await supabase.from('event_locations').select('id, name');
      setEventLocations(data || []);
    };

    fetchEventTypes();
    fetchEventLocations();
  }, []);

  const handleSubmitForm = async (formData: {
    date: string;
    hours: string;
    typeId: string;
    locationId: string;
  }) => {
    if (!userId) return;

    if (editEntry) {
      const { error } = await updateHourEntry(Number(editEntry.id), formData);
      if (!error) {
        setEditEntry(null);
        setShowModal(false);
      }
    } else {
      const { error } = await createHourEntry(formData);
      if (!error) {
        setShowModal(false)
      }
    }
  };

  const handleEdit = (entry: HourEntry) => {
    setEditEntry({
      id: entry.id,
      date: new Date(entry.date).toISOString().split('T')[0],
      hours: entry.hours.toString(),
      typeId: entry.type_id.toString(),
      locationId: entry.location_id.toString(),
    });
    setShowModal(true);
  };

  const handleDeleteEntry = async () => {
    if (editEntry?.id) {
      const { error } = await deleteHourEntry(Number(editEntry.id));
      if (!error) {
        setShowModal(false);
        setEditEntry(null);
        setToastMessage('Entry deleted!');
      } else {
        setToastMessage('Failed to delete entry.');
      }
    }
  };

  // --- SUM HOURS ---
  const totalHours = hourEntries.reduce((sum, entry) => sum + (typeof entry.hours === 'number' ? entry.hours : parseFloat(entry.hours)), 0);

  if (isLoading) {
    return <VolunteerHoursGroupedByMonthSkeleton />;
  }
  
  const emptyState = (
    <div className="ion-padding" style={{ textAlign: 'center', marginTop: '3rem', color: 'var(--ion-color-medium)' }}>
      <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🐾</div>
      <p style={{ fontSize: '1.3rem', margin: 0 }}>
        Looks like you haven't logged any volunteer hours yet.
        <br />
        <br />
        <span style={{ fontSize: '1rem', color: 'var(--ion-color-medium)' }}>
          Use the <b>+</b> button below to log some hours!
        </span>
      </p>
    </div>
  )

  const volunteerHours = (
    <>
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <h1>
          <b>Your Volunteer Hours</b>
        </h1>
        <div style={{ fontSize: '1.1rem', color: 'var(--ion-color-medium)' }}>
          Total Hours: <b>{totalHours.toFixed(1)}</b>
        </div>
        <VolunteerHoursPieCharts hourEntries={hourEntries} />
      </div>
      <VolunteerHoursGroupedByMonth hourEntries={hourEntries} onEdit={handleEdit} />
    </>
  )

  return (
    <>
      {hourEntries.length > 0 ? volunteerHours : emptyState}
      <IonFab slot="fixed" vertical="bottom" horizontal="end" className="ion-padding">
        <IonFabButton
          onClick={() => {
            setEditEntry(null);
            setShowModal(true);
          }}
        >
          <IonIcon icon={add}></IonIcon>
        </IonFabButton>
      </IonFab>
      <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
        <IonContent className="ion-padding">
          <AddVolunteerHoursForm
            eventTypes={eventTypes}
            eventLocations={eventLocations}
            onSubmit={handleSubmitForm}
            onCancel={() => setShowModal(false)}
            onDelete={handleDeleteEntry}
            initialData={editEntry ?? undefined}
          />
        </IonContent>
      </IonModal>
      <IonToast
        isOpen={!!toastMessage}
        message={toastMessage || ''}
        duration={2000}
        onDidDismiss={() => setToastMessage(null)}
      />
    </>
  );
};

export default VolunteerHoursManager;
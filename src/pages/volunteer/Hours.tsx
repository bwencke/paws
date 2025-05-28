import {
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonModal,
  IonButton,
} from '@ionic/react';
import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase'; // Make sure this path is correct for your project
import { add } from 'ionicons/icons';
import { Header } from '../../components/Header';
import AddVolunteerHoursForm from '../../components/AddVolunteerHoursForm';
import { HourEntry } from '../../types/volunteerTypes';
import ThankYouModal from '../../components/ThankYouModal';
import VolunteerHour from '../../components/VolunteerHour';
import VolunteerHoursGroupedByMonth from '../../components/VolunteerHoursGroupedByMonth';

const HoursPage: React.FC = () => {
  const [hourEntries, setHourEntries] = useState<HourEntry[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editEntry, setEditEntry] = useState<HourEntry | null>(null); // State for the entry being edited
  const [eventTypes, setEventTypes] = useState<{ id: number; name: string }[]>([]);
  const [eventLocations, setEventLocations] = useState<{ id: number; name: string }[]>([]);
  const [showThankYou, setShowThankYou] = useState(false);

  useEffect(() => {
    // Get the user ID from the Supabase session
    const getUserId = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (data?.session?.user?.id) {
        setUserId(data.session.user.id);
      } else {
        setUserId(null);
      }
    };
    getUserId();
  }, []);

  useEffect(() => {
    refreshHours();
  }, [userId]);

  useEffect(() => {
    // Fetch event types and locations from Supabase
    const fetchEventTypes = async () => {
      const { data, error } = await supabase.from('event_types').select('id, name');
      setEventTypes(data || []);
    };

    const fetchEventLocations = async () => {
      const { data, error } = await supabase.from('event_locations').select('id, name');
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

    const { date, hours, typeId, locationId } = formData;

    if (editEntry) {
      // Update existing entry
      const { error } = await supabase
        .from('hours')
        .update({
          date,
          hours: parseFloat(hours),
          type: typeId,
          location: locationId,
        })
        .eq('id', editEntry.id)
        .select()

      if (!error) {
        setEditEntry(null); // Clear the edit state
        setShowModal(false); // Close the modal
        refreshHours(); // Refresh the list
      }
    } else {
      // Insert new entry
      const { error } = await supabase.from('hours').insert({
        user_id: userId,
        date,
        hours: parseFloat(hours),
        type: typeId,
        location: locationId,
      });

      if (!error) {
        setShowModal(false); // Close the modal
        setShowThankYou(true); // Show thank you modal
        refreshHours(); // Refresh the list
      }
    }
  };

  const refreshHours = async () => {
    if (!userId) return;
    const { data } = await supabase
      .from('hours')
      .select(`
        id,
        hours,
        date,
        type:event_types (
          id,
          name
        ),
        location:event_locations (
          id,
          name
        )
      `)
      .eq('user_id', userId)
      .order('date', { ascending: false });
    setHourEntries(data || []);
  };

  const handleEdit = (entry: HourEntry) => {
    setEditEntry({
      id: entry.id,
      date: new Date(entry.date).toISOString().split('T')[0], // Format date as YYYY-MM-DD
      hours: entry.hours.toString(), // Convert hours to string for the form
      typeId: entry.type.id.toString(), // Map type.id to typeId as a string
      locationId: entry.location.id.toString(), // Map location.id to locationId as a string
    });
    setShowModal(true); // Open the modal
  };

  return (
    <IonPage>
      <Header title="Hours" />
      <IonContent>
        <VolunteerHoursGroupedByMonth hourEntries={hourEntries} onEdit={handleEdit} />
        <IonFab slot="fixed" vertical="bottom" horizontal="end" className="ion-padding">
          <IonFabButton
            onClick={() => {
              setEditEntry(null); // Clear the edit state for a new entry
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
              initialData={editEntry} // Pass the entry to be edited
            />
          </IonContent>
        </IonModal>
        {showThankYou && <ThankYouModal
          onDismiss={() => setShowThankYou(false)}
        />}
      </IonContent>
    </IonPage>
  );
};

export default HoursPage;

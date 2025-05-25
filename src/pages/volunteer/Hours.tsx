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

// Define the type for an hour entry
type HourEntry = {
  id: number;
  hours: number;
  date: string;
  type: { id: number; name: string };
  location: { id: number; name: string };
};

const HoursPage: React.FC = () => {
  const [hourEntries, setHourEntries] = useState<HourEntry[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editEntry, setEditEntry] = useState<HourEntry | null>(null); // State for the entry being edited
  const [eventTypes, setEventTypes] = useState<{ id: number; name: string }[]>([]);
  const [eventLocations, setEventLocations] = useState<{ id: number; name: string }[]>([]);

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
    async function fetchHours() {
      if (!userId) return;
      let { data, error } = await supabase
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
        .order('date');
      setHourEntries(data || []);
    }
    fetchHours();
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
      .order('date');
    setHourEntries(data || []);
  };

  const handleEdit = (entry: HourEntry) => {
    setEditEntry({
      id: entry.id,
      date: new Date(new Date(entry.date) - new Date().getTimezoneOffset() * 60000).toISOString().split('T')[0], // Format date as YYYY-MM-DD
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
        <IonList>
          {hourEntries.map((entry, idx) => (
            <IonItem key={idx} onClick={() => handleEdit(entry)}>
              <IonLabel className="ion-text-wrap">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h2>
                      <b>
                        {entry.type?.name} at {entry.location?.name}
                      </b>
                    </h2>
                    <p>{new Date(entry.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                  <div style={{ fontSize: '1.5rem', textAlign: 'right' }}>
                    <span style={{ fontWeight: 'bold' }}>{entry.hours}</span> hrs
                  </div>
                </div>
              </IonLabel>
              {/* <IonButton slot="end" onClick={() => handleEdit(entry)}>
                Edit
              </IonButton> */}
            </IonItem>
          ))}
        </IonList>
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
      </IonContent>
    </IonPage>
  );
};

export default HoursPage;

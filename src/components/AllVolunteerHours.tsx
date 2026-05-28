import React, { useEffect } from 'react';
import { IonPage, IonContent, IonHeader, IonToolbar, IonTitle } from '@ionic/react';
import VolunteerHoursGroupedByMonth from './VolunteerHoursGroupedByMonth';
import { useVolunteerHours } from '../hooks/useVolunteerHours';
import VolunteerHoursPieCharts from './VolunteerHoursPieCharts';
import { Header } from './Header';

const AllVolunteerHours: React.FC = () => {
  const { hourEntries, isLoading, fetchAllHourEntries } = useVolunteerHours('');

  useEffect(() => {
    fetchAllHourEntries();
  }, [fetchAllHourEntries]);

  if (isLoading) {
    return (
      <IonContent className="ion-padding">
        <div style={{ textAlign: 'center', marginTop: '3rem', color: 'var(--ion-color-medium)' }}>
          Loading...
        </div>
      </IonContent>
    );
  }

  const totalHours = hourEntries.reduce((sum, entry) => sum + (typeof entry.hours === 'number' ? entry.hours : parseFloat(entry.hours)), 0);

  return (
  <IonContent>
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <h1>
          <b>All Volunteer Hours</b>
        </h1>
        {hourEntries.length > 0 && (
          <div style={{ fontSize: '1.1rem', color: 'var(--ion-color-medium)' }}>
            Total Hours: <b>{totalHours.toFixed(1)}</b>
          </div>
        )}
        {hourEntries.length > 0 && <VolunteerHoursPieCharts hourEntries={hourEntries} />}
      </div>
      <VolunteerHoursGroupedByMonth showUser={true} hourEntries={hourEntries} onEdit={() => {}} />
    </IonContent>
  );
};

export default AllVolunteerHours;

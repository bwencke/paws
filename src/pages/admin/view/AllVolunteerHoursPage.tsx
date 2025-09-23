import React, { useEffect } from 'react';
import { IonPage, IonContent, IonHeader, IonToolbar, IonTitle } from '@ionic/react';
import VolunteerHoursGroupedByMonth from '../../../components/VolunteerHoursGroupedByMonth';
import { useVolunteerHours } from '../../../hooks/useVolunteerHours';
import VolunteerHoursPieCharts from '../../../components/VolunteerHoursPieCharts';
import { Header } from '../../../components/Header';

const AllVolunteerHoursPage: React.FC = () => {
  const { hourEntries, isLoading, fetchAllHourEntries } = useVolunteerHours('');

  useEffect(() => {
    fetchAllHourEntries();
  }, [fetchAllHourEntries]);

  if (isLoading) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>All Volunteer Hours</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <div style={{ textAlign: 'center', marginTop: '3rem', color: 'var(--ion-color-medium)' }}>
            Loading...
          </div>
        </IonContent>
      </IonPage>
    );
  }

  const totalHours = hourEntries.reduce((sum, entry) => sum + (typeof entry.hours === 'number' ? entry.hours : parseFloat(entry.hours)), 0);

  return (
    <IonPage>
      <Header title="All Volunteer Hours" showBackButton={true} />
      <IonContent className="ion-padding">
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
    </IonPage>
  );
};

export default AllVolunteerHoursPage;

import { IonPage, IonContent } from '@ionic/react';
import { Header } from '../../components/Header';
import VolunteerHoursManager from '../../components/VolunteerHoursManager';
import { LoginPage } from '../../components/Login';
import { InviteGate } from '../../components/InviteGate';
import { useSupabaseSession } from '../../hooks/useSupabaseSession';

export default function VolunteerPage() {
  const { user, loading } = useSupabaseSession();
  const userId = user?.id ?? null;

  return (
    <IonPage>
      <Header title="P.A.W.S. Volunteer" />
      <IonContent className="ion-padding">
        {loading ? (
          <p className="ion-text-center ion-padding">Loading…</p>
        ) : userId && user ? (
          <InviteGate user={user}>
            <VolunteerHoursManager userId={userId} />
          </InviteGate>
        ) : (
          <LoginPage />
        )}
      </IonContent>
    </IonPage>
  );
}
import { IonPage, IonContent } from '@ionic/react';
import { Header } from '../../components/Header';
import VolunteerHoursManager from '../../components/VolunteerHoursManager';
import { LoginPage } from '../../components/Login';
import { useSupabaseUser } from '../../hooks/useSupabaseUser';

export default function VolunteerPage() {
  const userId = useSupabaseUser();

  return (
    <IonPage>
      <Header title="P.A.W.S. Volunteer" />
      <IonContent className="ion-padding">
        {
          userId
            ? <VolunteerHoursManager userId={userId} />
            : <LoginPage />
        }
      </IonContent>
    </IonPage>
  );
}
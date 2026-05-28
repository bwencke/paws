import { IonPage, IonContent } from '@ionic/react';
import { useState } from 'react';
import { Header } from '../../components/Header';
import { LoginPage } from '../../components/Login';
import { InviteGate } from '../../components/InviteGate';
import { useSupabaseSession } from '../../hooks/useSupabaseSession';
import { useSupabaseUserProfile } from '../../hooks/useSupabaseUserProfile';
import VolunteerHoursHome from '../../components/VolunteerHoursHome';

export default function VolunteerPage() {
  const { user, loading } = useSupabaseSession();
  const { profile, loading: profileLoading } = useSupabaseUserProfile();
  const userId = user?.id ?? null;
  const [selectedView, setSelectedView] = useState<'user' | 'all'>('user');
  const isAdmin = !!profile?.is_admin;

  return (
    <IonPage>
      <Header
        title="P.A.W.S. Volunteer"
        segmentValue={isAdmin ? selectedView : undefined}
        segmentOptions={isAdmin ? [
          { value: 'user', label: 'Your Hours' },
          { value: 'all', label: 'All Hours' },
        ] : undefined}
        onSegmentChange={isAdmin ? (value) => setSelectedView(value === 'all' ? 'all' : 'user') : undefined}
      />
      <IonContent className="ion-padding">
        {loading || profileLoading ? (
          <p className="ion-text-center ion-padding">Loading…</p>
        ) : userId && user ? (
          <InviteGate user={user}>
            <VolunteerHoursHome userId={userId} isAdmin={isAdmin} selectedView={selectedView} />
          </InviteGate>
        ) : (
          <LoginPage />
        )}
      </IonContent>
    </IonPage>
  );
}
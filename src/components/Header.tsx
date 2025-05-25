import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonBackButton,
} from '@ionic/react';
import { personCircleOutline } from 'ionicons/icons';
import { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null)
  const history = useHistory();
  const location = useLocation();
  const topLevelPaths = ['/adoptions', '/events', '/volunteer'];
  const showBackButton = !topLevelPaths.includes(location.pathname);

  useEffect(() => {
    // Check initial auth state
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session)
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <IonHeader style={{ "--background": '--ion-background-color-step-500' }}>
      <IonToolbar>
        <IonButtons slot="start">
          {showBackButton && (
            <IonBackButton defaultHref="/adoptions" />
          )}
        </IonButtons>
        <IonTitle>{title}</IonTitle>
        <IonButtons slot="end">
            {isLoggedIn && <IonButton onClick={() => {
            if (location.pathname !== '/volunteer/account') {
              history.push('/volunteer/account');
            }
            }}>
            <IonIcon 
              icon={personCircleOutline} 
              slot="icon-only"
              size="large"
            />
            </IonButton>}
        </IonButtons>
      </IonToolbar>
    </IonHeader>
  );
} 
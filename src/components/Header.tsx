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
import { useSupabaseUser } from '../hooks/useSupabaseUser'; // <-- import the hook

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  const user = useSupabaseUser(); // <-- use the hook

  return (
    <IonHeader style={{ "--background": '--ion-background-color-step-500' }} data-testid="header">
      <IonToolbar>
        <IonButtons slot="start">
          <IonBackButton />
        </IonButtons>
        <IonTitle>{title}</IonTitle>
        <IonButtons slot="end">
          {user && <IonButton routerLink="/account" fill="clear">
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
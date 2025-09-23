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
  showBackButton?: boolean;
}

export function Header({ title, showBackButton = true }: HeaderProps) {
  const user = useSupabaseUser(); // <-- use the hook

  return (
    <IonHeader style={{ "--background": '--ion-background-color-step-500' }} data-testid="header">
      <IonToolbar>
        <IonButtons slot="start">
          {showBackButton && <IonBackButton />}
        </IonButtons>
        <IonTitle>{title}</IonTitle>
        <IonButtons slot="end">
          {user && <IonButton data-testid="account-button" routerLink="/account" fill="clear">
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
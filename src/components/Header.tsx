import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonBackButton,
  IonSegment,
  IonSegmentButton,
  IonLabel,
} from '@ionic/react';
import { personCircleOutline, ribbonOutline } from 'ionicons/icons';
import { useSupabaseSession } from '../hooks/useSupabaseSession'; // <-- import the hook

type HeaderSegmentOption = {
  value: string;
  label: string;
};

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  segmentValue?: string;
  segmentOptions?: HeaderSegmentOption[];
  onSegmentChange?: (value: string) => void;
}

export function Header({
  title,
  showBackButton = true,
  segmentValue,
  segmentOptions,
  onSegmentChange,
}: HeaderProps) {
  const userId = useSupabaseSession().user?.id; // <-- use the hook

  return (
    <IonHeader style={{ "--background": '--ion-background-color-step-500' }} data-testid="header">
      <IonToolbar>
        <IonButtons slot="start">
          {showBackButton && <IonBackButton />}
        </IonButtons>
        <IonTitle>{title}</IonTitle>
        <IonButtons slot="end">
          {userId && (
            <>
              <IonButton data-testid="badges-button" routerLink="/badges" fill="clear">
                <IonIcon
                  icon={ribbonOutline}
                  slot="icon-only"
                  size="large"
                />
              </IonButton>
              <IonButton data-testid="account-button" routerLink="/account" fill="clear">
                <IonIcon
                  icon={personCircleOutline}
                  slot="icon-only"
                  size="large"
                />
              </IonButton>
            </>
          )}
        </IonButtons>
      </IonToolbar>
      {segmentValue && segmentOptions && segmentOptions.length > 0 && onSegmentChange && (
        <IonToolbar>
          <IonSegment value={segmentValue} onIonChange={(event) => onSegmentChange(String(event.detail.value ?? ''))}>
            {segmentOptions.map((option) => (
              <IonSegmentButton key={option.value} value={option.value}>
                <IonLabel>{option.label}</IonLabel>
              </IonSegmentButton>
            ))}
          </IonSegment>
        </IonToolbar>
      )}
    </IonHeader>
  );
}
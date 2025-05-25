import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonToast,
  useIonLoading,
  useIonRouter,
} from '@ionic/react';
import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Header } from '../components/Header';

export function ChangeEmailPage() {
  const [newEmail, setNewEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showLoading, hideLoading] = useIonLoading();
  const [showToast] = useIonToast();
  const router = useIonRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await showLoading();

    try {
      const { error } = await supabase.auth.updateUser({ 
        email: newEmail 
      });

      if (error) throw error;

      await showToast({ 
        message: 'Email update initiated. Please check your new email for verification.',
        duration: 5000
      });
      
      router.push('/account');
    } catch (error: any) {
      await showToast({ 
        message: error.message, 
        duration: 5000,
        color: 'danger'
      });
    } finally {
      await hideLoading();
    }
  };

  return (
    <IonPage>
      <Header title="Change Email" />
      <IonContent>
        <form onSubmit={handleSubmit}>
          <IonItem>
            <IonLabel position="stacked">New Email Address</IonLabel>
            <IonInput
              type="email"
              value={newEmail}
              onIonChange={e => setNewEmail(e.detail.value ?? '')}
              required
            />
          </IonItem>

          <div className="ion-padding">
            <IonButton expand="block" type="submit">
              Update Email
            </IonButton>
            <IonButton 
              expand="block" 
              fill="clear" 
              onClick={() => router.push('/account')}
            >
              Cancel
            </IonButton>
          </div>
        </form>
      </IonContent>
    </IonPage>
  );
} 
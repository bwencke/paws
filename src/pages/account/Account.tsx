import { useEffect, useState } from 'react';
import { IonPage, IonContent, IonButton, IonItem, IonLabel, IonInput, IonList, IonIcon } from '@ionic/react';
import { Header } from '../../components/Header';
import { supabase } from '../../../lib/supabase';
import { useIonToast } from '@ionic/react';
import { formatPhoneNumber } from '../../utils/formatPhone';
import { mailOutline, callOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { useSupabaseUser } from '../../hooks/useSupabaseUser';

export function AccountPage() {
  const userId = useSupabaseUser();
  const [profile, setProfile] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    avatar_url: '',
    email: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showToast] = useIonToast();
  const history = useHistory();

  const getProfile = async () => {
    setIsLoading(true);
    try {
      if (!userId) throw new Error('No user found');

      const { data, error } = await supabase
        .from('profiles')
        .select('first_name, last_name, email, phone, avatar_url')
        .eq('id', userId)
        .single();

      if (error) throw error;

      if (data) {
        setProfile({
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          email: data.email || '',
          phone: data.phone || '',
          avatar_url: data.avatar_url || ''
        });
      }
    } catch (error: any) {
      showToast({
        message: error.message,
        duration: 3000,
        color: 'danger'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updatePhone = async (newPhone: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        phone: newPhone
      });

      if (error) throw error;

      showToast({
        message: 'Phone number updated successfully!',
        duration: 3000,
        color: 'success'
      });
    } catch (error: any) {
      showToast({
        message: error.message,
        duration: 3000,
        color: 'danger'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneChange = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    updatePhone(cleaned);
  };

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await supabase.auth.signOut();
      history.replace('/volunteer');
    } catch (error: any) {
      showToast({
        message: error.message,
        duration: 3000,
        color: 'danger'
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      getProfile();
    }
  }, [userId]);

  return (
    <IonPage>
      <Header title="Account" />
      <IonContent className="ion-padding">
        <IonList>
          <IonItem lines="none">
            <h1>{profile.first_name} {profile.last_name}</h1>
          </IonItem>
          <IonItem>
            <p style={{ display: 'flex', alignItems: 'center' }}>
              <IonIcon icon={mailOutline} className="ion-margin-end" /> 
              {profile.email}
            </p>
          </IonItem>
          <IonItem lines="none">
            <p style={{ display: 'flex', alignItems: 'center' }}>
              <IonIcon icon={callOutline} className="ion-margin-end" />
              {formatPhoneNumber(profile.phone) || 'No phone number set'}
            </p>
          </IonItem>
        </IonList>

        <div className="ion-padding ion-text-center">
          <IonButton 
            color="danger" 
            expand="block"
            onClick={handleSignOut}
            disabled={isLoading}
          >
            Sign Out
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
}
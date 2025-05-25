import { useEffect, useState } from 'react';
import { IonPage, IonContent, IonButton, IonItem, IonLabel, IonInput, IonList, IonIcon } from '@ionic/react';
import { Header } from '../../components/Header';
import { supabase } from '../../../lib/supabase';
import { useIonToast } from '@ionic/react';
import { User } from '@supabase/supabase-js';
import { formatPhoneNumber } from '../../utils/formatPhone';
import { mailOutline, callOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';

export function AccountPage() {
  const [profile, setProfile] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    avatar_url: ''
  });
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showToast] = useIonToast();
  const history = useHistory();

  const getProfile = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('No user found');
      
      setUser(user);

      const { data, error } = await supabase
        .from('profiles')
        .select('first_name, last_name, phone, avatar_url')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      if (data) {
        setProfile({
          first_name: data.first_name || '',
          last_name: data.last_name || '',
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
      
      // Refresh user data
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
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
    // Strip non-digits for storage
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
    getProfile();
  }, []);

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
              {user?.email}
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
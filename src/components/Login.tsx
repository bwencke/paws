import { useState } from 'react';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonModal,
  IonTitle,
  IonToolbar,
  useIonToast,
  useIonLoading,
} from '@ionic/react';
import { supabase } from '../../lib/supabase';
import { useHistory } from 'react-router-dom';
import paws from '../assets/paws.png';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'login' | 'signup' | 'magiclink'>('login');
  const [showLoading, hideLoading] = useIonLoading();
  const [showToast] = useIonToast();
  const history = useHistory();

  // Modal state for create account
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [createPhone, setCreatePhone] = useState('');
  const [createEmail, setCreateEmail] = useState('');
  const [createPassword, setCreatePassword] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await showLoading();

    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        history.replace('/volunteer');
      } else if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
      }
    } catch (e: any) {
      await showToast({ message: e.message, duration: 5000 });
    } finally {
      await hideLoading();
    }
  };

  // Handle create account modal submit
  const handleCreateAccount = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await showLoading();
    try {
      if (!createEmail || !createPassword || !firstName || !lastName || !createPhone) {
        await showToast({ message: 'Please fill out all fields.', duration: 4000, color: 'danger' });
        return;
      }

      // Attempt to format phone number to E.164
      let formattedPhone = createPhone.trim();
      if (formattedPhone && !formattedPhone.startsWith('+')) {
        // Remove non-digit characters
        const digits = formattedPhone.replace(/\D/g, '');
        // Assume US if 10 digits and no country code
        if (digits.length === 10) {
          formattedPhone = `+1${digits}`;
        } else {
          formattedPhone = `+${digits}`;
        }
      }

      // Validate phone number format (optional)
      const phoneRegex = /^\+?[1-9]\d{1,14}$/; // E.164 format
      if (formattedPhone && !phoneRegex.test(formattedPhone)) {
        await showToast({ message: 'Please enter a valid phone number.', duration: 4000, color: 'danger' });
        return;
      }
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(createEmail)) {
        await showToast({ message: 'Please enter a valid email address.', duration: 4000, color: 'danger' });
        return;
      }
      // Validate password strength (optional)
      if (createPassword.length < 6) {
        await showToast({ message: 'Password must be at least 6 characters long.', duration: 4000, color: 'danger' });
        return;
      }

      // Create user with email, password, and phone
      const { data, error } = await supabase.auth.signUp({
        email: createEmail,
        password: createPassword,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            email: createEmail,
            phone: formattedPhone,
          }
        }
      });

      console.log('Supabase signUp result:', { data, error });

      if (error) throw error;
      setShowCreateModal(false);
      await showToast({ message: 'Account created!', duration: 5000, color: 'success' });
      // Optionally, you can auto-login or redirect here
      // If user is confirmed, redirect to /volunteer
      if (data.session) {
        history.replace('/volunteer');
      }
    } catch (e: any) {
      await showToast({ message: e.message, duration: 5000, color: 'danger' });
    } finally {
      await hideLoading();
    }
  };

  // When opening modal, copy email from login form if present
  const openCreateModal = () => {
    setCreateEmail(email);
    setShowCreateModal(true);
  };

  return (
    <>
      <div className="ion-padding ion-text-center">
        <img 
          src={paws} 
          alt="PAWS Logo" 
          style={{ maxWidth: '50%', marginTop: '20px', marginBottom: '20px' }}
        />
        <h1 style={{ margin: '0' }}>P.A.W.S.</h1>
        <p style={{ marginTop: '5px', color: 'var(--ion-color-medium)' }}>
          Partners for Animal Welfare Society
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <IonItem>
          <IonLabel position="stacked">Email</IonLabel>
          <IonInput
            value={email}
            name="email"
            onIonInput={(e) => setEmail(e.detail.value ?? '')}
            type="email"
            required
          ></IonInput>
        </IonItem>

        <IonItem>
          <IonLabel position="stacked">Password</IonLabel>
          <IonInput
            value={password}
            name="password"
            onIonInput={(e) => setPassword(e.detail.value ?? '')}
            type="password"
            required
            minlength={6}
          ></IonInput>
        </IonItem>

        <div className="ion-padding ">
          <IonButton expand="block" type="submit">Sign In</IonButton>
          <IonButton
            expand="block"
            type="button"
            fill="outline"
            onClick={openCreateModal}
            size='default'
          >
            Create Account
          </IonButton>
        </div>
      </form>

      <IonModal isOpen={showCreateModal} onDidDismiss={() => setShowCreateModal(false)}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Create Account</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <form
            onSubmit={handleCreateAccount}
            style={{ margin: '2rem auto', padding: 16 }}
          >
            {/* <h2 style={{ textAlign: 'center', marginBottom: 24 }}>Create Account</h2> */}
            <IonItem>
              <IonLabel position="stacked">First Name</IonLabel>
              <IonInput
                value={firstName}
                onIonInput={e => setFirstName(e.detail.value ?? '')}
                required
              />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Last Name</IonLabel>
              <IonInput
                value={lastName}
                onIonInput={e => setLastName(e.detail.value ?? '')}
                required
              />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Phone Number</IonLabel>
              <IonInput
                value={createPhone}
                onIonInput={e => setCreatePhone(e.detail.value ?? '')}
                type="tel"
              />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Email</IonLabel>
              <IonInput
                value={createEmail}
                onIonInput={e => setCreateEmail(e.detail.value ?? '')}
                type="email"
                required
              />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Password</IonLabel>
              <IonInput
                value={createPassword}
                onIonInput={e => setCreatePassword(e.detail.value ?? '')}
                type="password"
                required
                minlength={6}
              />
            </IonItem>
            <div className="ion-padding" style={{ marginTop: 16 }}>
              <IonButton expand="block" type="submit">
                Create Account
              </IonButton>
              <IonButton
                expand="block"
                fill="clear"
                type="button"
                onClick={() => setShowCreateModal(false)}
              >
                Cancel
              </IonButton>
            </div>
          </form>
        </IonContent>
      </IonModal>
    </>
  );
}

import { useState } from 'react';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonSegment,
  IonSegmentButton,
  IonTitle,
  IonToolbar,
  useIonToast,
  useIonLoading,
} from '@ionic/react';
import { supabase } from '../../../lib/supabase';
import { useHistory } from 'react-router-dom';
import paws from '../../assets/paws.png';
import { Header } from '../../components/Header';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'login' | 'signup' | 'magiclink'>('login');
  const [showLoading, hideLoading] = useIonLoading();
  const [showToast] = useIonToast();
  const history = useHistory();

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

  const handleSendMagicLink = async () => {
    await showLoading();

    try {
      const { error } = await supabase.auth.signInWithOtp({ email });
      if (error) throw error;
      await showToast({
        message: 'Magic link sent! Check your email to log in.',
        duration: 5000,
        position: 'bottom',
      });
    } catch (e: any) {
      await showToast({ message: e.message, duration: 5000 });
    } finally {
      await hideLoading();
    }
  };

  return (
    <IonPage>
      <Header title="Login" />
      <IonContent>
        <div className="ion-padding ion-text-center">
          <img 
            src={paws} 
            alt="PAWS Logo" 
            style={{ maxWidth: '200px', marginTop: '100px', marginBottom: '20px' }}
          />
          <h1 style={{ margin: '0' }}>P.A.W.S.</h1>
          <p style={{ marginTop: '5px', color: 'var(--ion-color-medium)' }}>
            Partners for Animal Welfare Society
          </p>
        </div>

        {/* <div className="ion-padding">
          <IonSegment value={mode} onIonChange={e => setMode(e.detail.value as 'login' | 'signup' | 'magiclink')}>
            <IonSegmentButton value="login">Login</IonSegmentButton>
            <IonSegmentButton value="signup">Sign Up</IonSegmentButton>
            <IonSegmentButton value="magiclink">Magic Link</IonSegmentButton>
          </IonSegment>
        </div> */}

        <IonList inset={true}>
          {mode === 'magiclink' ? (
            <>
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

              <div className="ion-padding">
                <IonButton expand="block" onClick={handleSendMagicLink}>
                  Send Magic Link
                </IonButton>
              </div>
            </>
          ) : (
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

              <div className="ion-padding">
                <IonButton expand="block" type="submit">
                  {mode === 'login' ? 'Login' : 'Sign Up'}
                </IonButton>
              </div>
            </form>
          )}
        </IonList>
      </IonContent>
    </IonPage>
  );
}

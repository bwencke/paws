import { useState } from 'react';
import {
  IonButton,
  IonContent,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  useIonToast,
  useIonLoading,
} from '@ionic/react';
import { supabase } from '../../lib/supabase';
import paws from '../assets/paws.png';

export function SignInWithPhone() {
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'signin' | 'verify'>('signin');
  const [showLoading, hideLoading] = useIonLoading();
  const [showToast] = useIonToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await showLoading();

    try {
      let formattedPhone = ("+1"+phone).trim();

      // Sign in user
      const { error } = await supabase.auth.signInWithOtp({
        phone: formattedPhone,
      });
      if (error) throw error;
      setStep('verify');
      await showToast({
        message: 'Verification code sent! Enter the code from your SMS.',
        duration: 5000,
        position: 'bottom',
      });
    } catch (e: any) {
      await showToast({ message: e.message, duration: 5000 });
    } finally {
      await hideLoading();
    }
  };

  const handleVerify = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await showLoading();
    try {
      let formattedPhone = ("+1"+phone).trim();
      const { error } = await supabase.auth.verifyOtp({
        phone: formattedPhone,
        token: code,
        type: 'sms',
      });
      if (error) throw error;
      await showToast({
        message: 'Phone verified! You are now signed in.',
        duration: 2000,
        position: 'bottom',
      });
    } catch (e: any) {
      await showToast({ message: e.message, duration: 5000 });
    } finally {
      await hideLoading();
    }
  };

  return (
    <>
      <div className="ion-padding ion-text-center">
        <img 
          src={paws} 
          alt="PAWS Logo" 
          style={{ maxWidth: '200px', marginTop: '100px', marginBottom: '20px' }}
        />
        <h1 style={{ margin: '0' }}>P.A.W.S.</h1>
      </div>
      <IonList inset={true}>
        {step === 'signin' ? (
          <form onSubmit={handleSubmit}>
            <IonItem>
              <IonLabel position="stacked">Phone Number</IonLabel>
              <IonInput
                value={phone}
                name="phone"
                onIonInput={(e) => setPhone(e.detail.value ?? '')}
                type="tel"
                required
                placeholder="3175555555"
              ></IonInput>
            </IonItem>
            <div className="ion-padding">
              <IonButton expand="block" type="submit">
                Sign In with Phone
              </IonButton>
            </div>
          </form>
        ) : (
          <form onSubmit={handleVerify}>
            <IonItem>
              <IonLabel position="stacked">Verification Code</IonLabel>
              <IonInput
                value={code}
                name="code"
                onIonInput={(e) => setCode(e.detail.value ?? '')}
                type="text"
                required
                placeholder="Enter the code from your SMS"
              ></IonInput>
            </IonItem>
            <div className="ion-padding">
              <IonButton expand="block" type="submit">
                Verify Code
              </IonButton>
            </div>
          </form>
        )}
      </IonList>
    </>
  );
}

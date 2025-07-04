import { useState, FormEvent } from 'react';
import {
  IonButton,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  useIonToast,
  useIonLoading,
} from '@ionic/react';
import { supabase } from '../../lib/supabase';

type OtpMode = 'email' | 'phone' | null;

export const SignIn: React.FC = () => {
  const [identifier, setIdentifier] = useState<string>(''); // email or phone
  const [password, setPassword] = useState<string>('');
  const [otp, setOtp] = useState<string>('');
  const [step, setStep] = useState<'input' | 'verify'>('input');
  const [otpMode, setOtpMode] = useState<OtpMode>(null);
  const [showLoading, hideLoading] = useIonLoading();
  const [showToast] = useIonToast();

  // Helper to check if identifier is email or phone
  const isEmail = (value: string) => /\S+@\S+\.\S+/.test(value);
  const isPhone = (value: string) => /^\+?\d{10,15}$/.test(value);

  // Email/password or phone/password sign in
  const handlePasswordSignIn = async (e: FormEvent) => {
    e.preventDefault();
    await showLoading();
    try {
      if (isEmail(identifier)) {
        const { error } = await supabase.auth.signInWithPassword({ email: identifier, password });
        if (error) throw error;
      } else if (isPhone(identifier)) {
        const { error } = await supabase.auth.signInWithPassword({ phone: identifier, password });
        if (error) throw error;
      } else {
        throw new Error('Please enter a valid email or phone number.');
      }
      await showToast({ message: 'Signed in!', duration: 3000, color: 'success' });
    } catch (e: any) {
      await showToast({ message: e.message, duration: 4000, color: 'danger' });
    } finally {
      await hideLoading();
    }
  };

  // OTP request
  const handleOtpRequest = async () => {
    await showLoading();
    try {
      if (isEmail(identifier)) {
        const { error } = await supabase.auth.signInWithOtp({ email: identifier });
        if (error) throw error;
        setOtpMode('email');
      } else if (isPhone(identifier)) {
        const phone = identifier.startsWith('+') ? identifier : `+${identifier}`;
        const { error } = await supabase.auth.signInWithOtp({ phone });
        if (error) throw error;
        setOtpMode('phone');
      } else {
        throw new Error('Please enter a valid email or phone number.');
      }
      setStep('verify');
      await showToast({ message: 'Check your email or phone for the code!', duration: 4000, color: 'success' });
    } catch (e: any) {
      await showToast({ message: e.message, duration: 4000, color: 'danger' });
    } finally {
      await hideLoading();
    }
  };

  // OTP verification
  const handleOtpVerify = async (e: FormEvent) => {
    e.preventDefault();
    await showLoading();
    try {
      if (otpMode === 'email') {
        const { error } = await supabase.auth.verifyOtp({
          email: identifier,
          token: otp,
          type: 'email',
        });
        if (error) throw error;
      } else if (otpMode === 'phone') {
        const { error } = await supabase.auth.verifyOtp({
          phone: identifier,
          token: otp,
          type: 'sms',
        });
        if (error) throw error;
      }
      await showToast({ message: 'Signed in!', duration: 3000, color: 'success' });
      setStep('input');
      setOtp('');
      setOtpMode(null);
    } catch (e: any) {
      await showToast({ message: e.message, duration: 4000, color: 'danger' });
    } finally {
      await hideLoading();
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '2rem auto' }}>
      <IonList>
        {step === 'input' && (
          <form onSubmit={handlePasswordSignIn}>
            <IonItem>
              <IonLabel position="stacked">Email or Phone</IonLabel>
              <IonInput
                value={identifier}
                onIonInput={e => setIdentifier((e.target as HTMLInputElement).value ?? '')}
                type="text"
                required
                placeholder="you@email.com or +15555555555"
              />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Password</IonLabel>
              <IonInput
                value={password}
                onIonInput={e => setPassword((e.target as HTMLInputElement).value ?? '')}
                type="password"
                required
                placeholder="Password"
              />
            </IonItem>
            <div className="ion-padding" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <IonButton expand="block" type="submit">Sign In</IonButton>
              <IonButton
                expand="block"
                fill="outline"
                type="button"
                onClick={handleOtpRequest}
              >
                Sign In with One-Time Code
              </IonButton>
            </div>
          </form>
        )}
        {step === 'verify' && (
          <form onSubmit={handleOtpVerify}>
            <IonItem>
              <IonLabel position="stacked">Verification Code</IonLabel>
              <IonInput
                value={otp}
                onIonInput={e => setOtp((e.target as HTMLInputElement).value ?? '')}
                type="text"
                required
                placeholder="Enter the code"
              />
            </IonItem>
            <div className="ion-padding" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <IonButton expand="block" type="submit">Verify Code</IonButton>
              <IonButton
                expand="block"
                fill="clear"
                type="button"
                onClick={() => { setStep('input'); setOtp(''); setOtpMode(null); }}
              >
                Back
              </IonButton>
            </div>
          </form>
        )}
      </IonList>
    </div>
  );
}
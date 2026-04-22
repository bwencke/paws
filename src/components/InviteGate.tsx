import { useCallback, useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import {
  IonButton,
  IonContent,
  IonInput,
  IonItem,
  IonLabel,
  useIonLoading,
  useIonToast,
} from '@ionic/react';
import { supabase } from '../../lib/supabase';

type Props = {
  user: User;
  children: React.ReactNode;
};

export function InviteGate({ user, children }: Props) {
  const [code, setCode] = useState('');
  const [inviteStatus, setInviteStatus] = useState<'checking' | 'required' | 'granted'>('checking');
  const [showLoading, hideLoading] = useIonLoading();
  const [showToast] = useIonToast();

  const refreshInviteRequirement = useCallback(async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('invite_code_id')
      .eq('id', user.id)
      .single();

    if (error) throw error;

    const missingInviteCode = !data?.invite_code_id;
    setInviteStatus(missingInviteCode ? 'required' : 'granted');
    return missingInviteCode;
  }, [user.id]);

  useEffect(() => {
    let isMounted = true;

    const run = async () => {
      setInviteStatus('checking');
      try {
        const missingInviteCode = await refreshInviteRequirement();
        if (!isMounted) return;
        if (missingInviteCode) {
          void showToast({
            message: 'Enter your invite code to continue.',
            duration: 4000,
            color: 'warning',
          });
        }
      } catch (error: unknown) {
        if (!isMounted) return;
        setInviteStatus('required');
        const message =
          error instanceof Error ? error.message : 'Could not verify profile access.';
        void showToast({
          message,
          duration: 5000,
          color: 'danger',
        });
      }
    };

    void run();

    return () => {
      isMounted = false;
    };
  }, [refreshInviteRequirement, showToast]);

  const block = inviteStatus !== 'granted';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = code.trim();
    if (!trimmed) {
      void showToast({
        message: 'Please enter your invite code.',
        duration: 4000,
        color: 'danger',
      });
      return;
    }
    await showLoading();
    try {
      const { data: isSuccess, error } = await supabase.rpc('apply_invite_code', {
        submitted_code: trimmed,
      });
      if (error) throw error;
      if (!isSuccess) {
        await showToast({
          message:
            'Sign up could not be completed. Please check that your invite code is valid, then try again.',
          duration: 6000,
          color: 'danger',
        });
        return;
      }
      const missingInviteCode = await refreshInviteRequirement();
      if (missingInviteCode) {
        await showToast({
          message:
            'Sign up could not be completed. Please check that your invite code is valid, then try again.',
          duration: 6000,
          color: 'danger',
        });
        return;
      }
      await showToast({ message: 'Welcome!', duration: 3000, color: 'success' });
    } catch (err: unknown) {
      if (import.meta.env.DEV && err instanceof Error) console.warn(err.message);
      await showToast({
        message:
          'Sign up could not be completed. Please check that your invite code is valid, then try again.',
        duration: 6000,
        color: 'danger',
      });
    } finally {
      await hideLoading();
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  if (!block) return <>{children}</>;

  return (
    <IonContent className="ion-padding">
      <h2>Invite code required</h2>
      <p style={{ marginBottom: 16 }}>
        Enter your invite code to finish creating your volunteer account.
      </p>
      {inviteStatus === 'checking' ? (
        <p>Checking your account...</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <IonItem>
            <IonLabel position="stacked">Invite Code</IonLabel>
            <IonInput
              value={code}
              onIonInput={(e) => setCode(e.detail.value ?? '')}
              required
            />
          </IonItem>
          <div className="ion-padding" style={{ marginTop: 16 }}>
            <IonButton expand="block" type="submit">
              Continue
            </IonButton>
            <IonButton
              expand="block"
              fill="clear"
              type="button"
              onClick={handleSignOut}
            >
              Sign out
            </IonButton>
          </div>
        </form>
      )}
    </IonContent>
  );
}

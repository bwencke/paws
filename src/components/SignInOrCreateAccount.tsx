import React from 'react';
import { IonButton } from '@ionic/react';
import paws from '../assets/paws.png';

const SignInOrCreateAccount: React.FC = () => (
  <div>
    <div className="ion-padding ion-text-center">
      <img 
        src={paws} 
        alt="PAWS Logo" 
        style={{ maxWidth: '50%', marginTop: '50px', marginBottom: '20px' }}
      />
      <h1 style={{ margin: '0' }}>P.A.W.S.</h1>
      <p style={{ marginTop: '5px', color: 'var(--ion-color-medium)' }}>
        Partners for Animal Welfare Society
      </p>
    </div>
    <div>
      <IonButton expand="block" routerLink="/volunteer/login">
        Sign In
      </IonButton>
      <IonButton
        routerLink="/volunteer/signin_with_phone"
        expand="block"
        color="secondary"
        style={{ marginTop: '8px' }}
      >
        Sign In with Phone
      </IonButton>
    </div>
  </div>
);

export default SignInOrCreateAccount;
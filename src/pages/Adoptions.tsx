import { IonContent, IonPage } from '@ionic/react';
import { Header } from '../components/Header';

export function AdoptionsPage() {
  return (
    <IonPage>
      <Header title="Adoptions" />
      <IonContent>
        <div style={{ width: '100%', height: '100%' }}>
          <iframe
            src="https://new.shelterluv.com/embed/8458?embedded=1&iframeId=shelterluv_wrap_1733756571&columns=1#https%3A%2F%2Fwww-pawshancock-org.filesusr.com%2Fhtml%2Fabf8a0_3476f11610ec23d5bd0e97a8a942f257.html"
            title="Adoptions"
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              overflow: 'hidden'
            }}
          />
        </div>
      </IonContent>
    </IonPage>
  );
} 
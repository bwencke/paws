import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { Header } from '../components/Header';

const url = "https://calendar.google.com/calendar/embed?height=600&wkst=1&bgcolor=%23ffffff&ctz=America%2FNew_York&src=NzV2OWdzZTAzNWo5MW5idWJjNHBnOW9tYjRAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ&color=%23D50000"

const EventsPage: React.FC = () => {
  return (
    <IonPage>
      <Header title="Events" />
      <IonContent fullscreen>
        <div style={{ width: '100%', height: '100%' }}>
          <iframe
            src={url}
            title="Events"
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
};

export default EventsPage;

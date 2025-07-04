import React from 'react';
import { IonPage, IonContent, IonList, IonItem, IonLabel, IonIcon, IonListHeader } from '@ionic/react';
import { chevronForwardOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';

import { Header } from '../../components/Header';

const AdminPage: React.FC = () => {
  const history = useHistory();

  return (
    <IonPage>
      <Header title='Admin' />
      <IonContent fullscreen>
        <IonList>
          <IonListHeader>
            <IonLabel>Actions</IonLabel>
          </IonListHeader>
          <IonItem button onClick={() => history.push('/admin/manage-users')}>
            <IonLabel>Manage Users</IonLabel>
            <IonIcon aria-hidden="true" icon={chevronForwardOutline} slot="end"></IonIcon>
          </IonItem>
          <IonItem>
            <IonLabel>Manage Activities</IonLabel>
            <IonIcon aria-hidden="true" icon={chevronForwardOutline} slot="end"></IonIcon>
          </IonItem>
          <IonItem>
            <IonLabel>Manage Locations</IonLabel>
            <IonIcon aria-hidden="true" icon={chevronForwardOutline} slot="end"></IonIcon>
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default AdminPage;
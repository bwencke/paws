import React, { useEffect } from 'react';
import {
  IonPage,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonListHeader,
  IonSkeletonText,
  IonFab,
  IonFabButton,
  IonIcon,
  IonAlert
} from '@ionic/react';
import { Header } from '../../../components/Header';
import { useLocations } from '../../../hooks/useLocations';
import { pencil, trash, add } from 'ionicons/icons';

const ManageLocationsPage: React.FC = () => {
  const {
    locations,
    loading,
    fetchLocations,
    createLocation,
    updateLocation,
    deleteLocation,
  } = useLocations();

  const [showAddAlert, setShowAddAlert] = React.useState(false);
  const [newLocationName, setNewLocationName] = React.useState('');
  const [editLocation, setEditLocation] = React.useState<{ id: number; name: string } | null>(null);
  const [showEditAlert, setShowEditAlert] = React.useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = React.useState(false);
  const [deleteLocationObj, setDeleteLocationObj] = React.useState<{ id: number; name: string } | null>(null);

  const loadingSkeleton = (
    <>
      {[...Array(3)].map((_, idx) => (
        <IonItem key={idx}>
          <IonLabel>
            <IonSkeletonText animated style={{ width: '60%' }} />
          </IonLabel>
        </IonItem>
      ))}
    </>
  );

  useEffect(() => {
    fetchLocations();
  }, [fetchLocations]);

  return (
    <IonPage>
      <Header title="Manage Locations" showBackButton={true} />
      <IonContent fullscreen>
        <IonList>
          <IonListHeader>
            <IonLabel>Locations</IonLabel>
          </IonListHeader>
          {loading ? (
            loadingSkeleton
          ) : locations.length === 0 ? (
            <IonItem><IonLabel>No locations found.</IonLabel></IonItem>
          ) : (
            locations.map((location) => (
              <IonItem key={location.id}>
                <IonLabel>{location.name}</IonLabel>
                <IonIcon
                  icon={pencil}
                  slot="end"
                  style={{ cursor: 'pointer', marginLeft: 12 }}
                  onClick={() => { setEditLocation(location); setShowEditAlert(true); }}
                  title="Edit"
                />
                <IonIcon
                  icon={trash}
                  slot="end"
                  color="danger"
                  style={{ cursor: 'pointer', marginLeft: 12 }}
                  onClick={() => { setDeleteLocationObj(location); setShowDeleteAlert(true); }}
                  title="Delete"
                />
              </IonItem>
            ))
          )}
        </IonList>
        <IonFab slot="fixed" vertical="bottom" horizontal="end" className="ion-padding">
          <IonFabButton onClick={() => setShowAddAlert(true)}>
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>
        <IonAlert
          isOpen={showAddAlert}
          onDidDismiss={() => setShowAddAlert(false)}
          header="Add Location"
          inputs={[
            {
              name: 'name',
              type: 'text',
              placeholder: 'Location name',
              value: newLocationName,
            },
          ]}
          buttons={[
            {
              text: 'Cancel',
              role: 'cancel',
              handler: () => setNewLocationName(''),
            },
            {
              text: 'Add',
              handler: async (data) => {
                if (data.name && data.name.trim()) {
                  await createLocation(data.name.trim());
                  setNewLocationName('');
                }
              },
            },
          ]}
        />
        <IonAlert
          isOpen={showEditAlert}
          onDidDismiss={() => { setShowEditAlert(false); setEditLocation(null); }}
          header="Edit Location"
          inputs={editLocation ? [
            {
              name: 'name',
              type: 'text',
              placeholder: 'Location name',
              value: editLocation.name,
            },
          ] : []}
          buttons={[
            {
              text: 'Cancel',
              role: 'cancel',
              handler: () => setEditLocation(null),
            },
            {
              text: 'Update',
              handler: async (data) => {
                if (editLocation && data.name && data.name.trim()) {
                  await updateLocation(editLocation.id, data.name.trim());
                  setEditLocation(null);
                }
              },
            },
          ]}
        />
        <IonAlert
          isOpen={showDeleteAlert}
          onDidDismiss={() => { setShowDeleteAlert(false); setDeleteLocationObj(null); }}
          header="Delete Location"
          message={deleteLocationObj ? `Are you sure you want to delete "${deleteLocationObj.name}"? This action cannot be undone.` : ''}
          buttons={[
            {
              text: 'Cancel',
              role: 'cancel',
              handler: () => setDeleteLocationObj(null),
            },
            {
              text: 'Delete',
              role: 'destructive',
              handler: async () => {
                if (deleteLocationObj) {
                  await deleteLocation(deleteLocationObj.id);
                  setDeleteLocationObj(null);
                }
              },
            },
          ]}
        />
      </IonContent>
    </IonPage>
  );
};

export default ManageLocationsPage;

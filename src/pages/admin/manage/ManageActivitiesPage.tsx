import React, { useEffect } from 'react';
import { IonPage, IonContent, IonList, IonItem, IonLabel, IonHeader, IonToolbar, IonTitle, IonListHeader, IonSkeletonText, IonFab, IonFabButton, IonIcon, IonAlert } from '@ionic/react';
import { Header } from '../../../components/Header';
import { useEventTypes } from '../../../hooks/useEventTypes';
import { pencil, trash, add } from 'ionicons/icons';

const ManageActivitiesPage: React.FC = () => {
  const {
    eventTypes,
    loading,
    fetchEventTypes,
    createEventType,
    updateEventType,
    deleteEventType,
  } = useEventTypes();

  const [showAddAlert, setShowAddAlert] = React.useState(false);
  const [newTypeName, setNewTypeName] = React.useState('');
  const [editType, setEditType] = React.useState<{ id: number; name: string } | null>(null);
  const [showEditAlert, setShowEditAlert] = React.useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = React.useState(false);
  const [deleteType, setDeleteType] = React.useState<{ id: number; name: string } | null>(null);

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
    fetchEventTypes();
  }, [fetchEventTypes]);

  return (
    <IonPage>
      <Header title="Manage Activities" showBackButton={true} />
      <IonContent fullscreen>
        <IonList>
          <IonListHeader>
            <IonLabel>Event Types</IonLabel>
          </IonListHeader>
          {loading  ? (
            loadingSkeleton
          ) : eventTypes.length === 0 ? (
            <IonItem><IonLabel>No event types found.</IonLabel></IonItem>
          ) : (
            eventTypes.map((type) => (
              <IonItem key={type.id}>
                <IonLabel>{type.name}</IonLabel>
                <IonIcon
                  icon={pencil}
                  slot="end"
                  style={{ cursor: 'pointer', marginLeft: 12 }}
                  onClick={() => { setEditType(type); setShowEditAlert(true); }}
                  title="Edit"
                />
                <IonIcon
                  icon={trash}
                  slot="end"
                  color="danger"
                  style={{ cursor: 'pointer', marginLeft: 12 }}
                  onClick={() => { setDeleteType(type); setShowDeleteAlert(true); }}
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
          header="Add Event Type"
          inputs={[
            {
              name: 'name',
              type: 'text',
              placeholder: 'Event type name',
              value: newTypeName,
            },
          ]}
          buttons={[
            {
              text: 'Cancel',
              role: 'cancel',
              handler: () => setNewTypeName(''),
            },
            {
              text: 'Add',
              handler: async (data) => {
                if (data.name && data.name.trim()) {
                  await createEventType(data.name.trim());
                  setNewTypeName('');
                }
              },
            },
          ]}
        />
        <IonAlert
          isOpen={showEditAlert}
          onDidDismiss={() => { setShowEditAlert(false); setEditType(null); }}
          header="Edit Event Type"
          inputs={editType ? [
            {
              name: 'name',
              type: 'text',
              placeholder: 'Event type name',
              value: editType.name,
            },
          ] : []}
          buttons={[
            {
              text: 'Cancel',
              role: 'cancel',
              handler: () => setEditType(null),
            },
            {
              text: 'Update',
              handler: async (data) => {
                if (editType && data.name && data.name.trim()) {
                  await updateEventType(editType.id, data.name.trim());
                  setEditType(null);
                }
              },
            },
          ]}
        />
        <IonAlert
          isOpen={showDeleteAlert}
          onDidDismiss={() => { setShowDeleteAlert(false); setDeleteType(null); }}
          header="Delete Event Type"
          message={deleteType ? `Are you sure you want to delete "${deleteType.name}"? This action cannot be undone.` : ''}
          buttons={[
            {
              text: 'Cancel',
              role: 'cancel',
              handler: () => setDeleteType(null),
            },
            {
              text: 'Delete',
              role: 'destructive',
              handler: async () => {
                if (deleteType) {
                  await deleteEventType(deleteType.id);
                  setDeleteType(null);
                }
              },
            },
          ]}
        />
      </IonContent>
    </IonPage>
  );
};

export default ManageActivitiesPage;

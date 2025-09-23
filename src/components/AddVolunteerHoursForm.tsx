import React, { useState } from 'react';
import {
  IonItem,
  IonLabel,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonDatetime,
  IonButton,
  IonContent,
  IonPage,
  IonList,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonAlert,
  IonButtons,
  IonIcon,
} from '@ionic/react';
import { trash } from 'ionicons/icons';
import ThankYouModal from './ThankYouModal';

interface AddVolunteerHoursFormProps {
  eventTypes: { id: number; name: string }[];
  eventLocations: { id: number; name: string }[];
  onSubmit: (formData: {
    date: string;
    hours: string;
    typeId: string;
    locationId: string;
  }) => void;
  onCancel: () => void;
  onDelete?: () => void; // Add this prop for delete
  initialData?: {
    date: string;
    hours: string;
    typeId: string;
    locationId: string;
  }; // Optional prop for editing
}

const AddVolunteerHoursForm: React.FC<AddVolunteerHoursFormProps> = ({
  eventTypes,
  eventLocations,
  onSubmit,
  onCancel,
  onDelete, // Add this prop
  initialData, // Receive initial data for editing
}) => {
  const [formData, setFormData] = useState({
    date:
      initialData?.date ||
      new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 10), // YYYY-MM-DD
    hours: initialData?.hours || '',
    typeId: initialData?.typeId || '',
    locationId: initialData?.locationId || '',
  });

  const [errors, setErrors] = useState({
    date: '',
    hours: '',
    typeId: '',
    locationId: '',
  });

  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);

  const validateForm = () => {
    const newErrors = {
      date: formData.date ? '' : 'Date is required.',
      hours: formData.hours && parseFloat(formData.hours) > 0 ? '' : 'Hours must be greater than 0.',
      typeId: formData.typeId ? '' : 'Event type is required.',
      locationId: formData.locationId ? '' : 'Event location is required.',
    };
    setErrors(newErrors);
    return Object.values(newErrors).every((error) => error === '');
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    setErrors({ ...errors, [field]: '' }); // Clear the error for the field being updated
  };

  const handleSubmit = () => {
    if (validateForm()) {
      setShowThankYou(true);
    }
  };

  const closeThankYou = () => {
    onSubmit(formData);
    setShowThankYou(false);
  };

  return (
    <IonPage>
      <IonContent>
        <IonHeader>
          <IonToolbar>
            <IonTitle>{initialData ? 'Edit Volunteer Hours' : 'Add Volunteer Hours'}</IonTitle>
            {initialData && onDelete && (
              <IonButtons slot="end">
                <IonButton color="danger" data-testid="delete-button" onClick={() => setShowDeleteAlert(true)}>
                  <IonIcon icon={trash} />
                </IonButton>
              </IonButtons>
            )}
          </IonToolbar>
        </IonHeader>
        <IonList inset={true}>
          <IonItem>
            <IonDatetime
              presentation="date"
              value={formData.date}
              onIonChange={(e) => {
                const selectedDate = e.detail.value?.split('T')[0];
                handleInputChange('date', selectedDate || '');
              }}
            />
            {errors.date && <p style={{ color: 'red', fontSize: '12px' }}>{errors.date}</p>}
          </IonItem>
          <IonItem>
            <IonLabel>
              <IonInput
                label="Hours"
                labelPlacement="stacked"
                placeholder="Enter how many hours you volunteered"
                type="number"
                value={formData.hours}
                onIonChange={(e) => handleInputChange('hours', e.detail.value!)}
              />
              {errors.hours && <p style={{ color: 'red', fontSize: '12px' }}>{errors.hours}</p>}
            </IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel>
              <IonSelect
                data-testid="activity-select"
                label="Activity"
                labelPlacement="stacked"
                placeholder="Choose the activity you participated in"
                interfaceOptions={{
                  header: 'Select Activity',
                  subHeader: 'Choose the activity you participated in',
                }}
                value={formData.typeId} // Ensure this matches the `value` of IonSelectOption
                onIonChange={(e) => handleInputChange('typeId', e.detail.value!)}
              >
                {eventTypes.map((type) => (
                  <IonSelectOption key={type.id} value={type.id.toString()}> {/* Ensure value is a string */}
                    {type.name}
                  </IonSelectOption>
                ))}
              </IonSelect>
              {errors.typeId && <p style={{ color: 'red', fontSize: '12px' }}>{errors.typeId}</p>}
            </IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel>
              <IonSelect
                data-testid="location-select"
                label="Location"
                labelPlacement="stacked"
                placeholder="Choose the location of the event"
                interfaceOptions={{
                  header: 'Select Event Location',
                  subHeader: 'Choose the location of the event',
                }}
                value={formData.locationId} // Ensure this matches the `value` of IonSelectOption
                onIonChange={(e) => handleInputChange('locationId', e.detail.value!)}
              >
                {eventLocations.map((location) => (
                  <IonSelectOption key={location.id} value={location.id.toString()}> {/* Ensure value is a string */}
                    {location.name}
                  </IonSelectOption>
                ))}
              </IonSelect>
              {errors.locationId && <p style={{ color: 'red', fontSize: '12px' }}>{errors.locationId}</p>}
            </IonLabel>
          </IonItem>
          <IonButton
            expand="block"
            onClick={handleSubmit}
            style={{ marginTop: '20px' }}
          >
            {initialData ? 'Update' : 'Submit'}
          </IonButton>
          <IonButton
            expand="block"
            fill="clear"
            onClick={onCancel}
            style={{ marginTop: '10px' }}
          >
            Cancel
          </IonButton>
        </IonList>
        {initialData && onDelete && (
          <IonAlert
            isOpen={showDeleteAlert}
            header="Delete Entry"
            message="Are you sure you want to delete this entry? This action cannot be undone."
            buttons={[
              {
                text: 'Cancel',
                role: 'cancel',
                handler: () => setShowDeleteAlert(false),
              },
              {
                text: 'Delete',
                role: 'destructive',
                handler: () => {
                  setShowDeleteAlert(false);
                  onDelete();
                },
              },
            ]}
            onDidDismiss={() => setShowDeleteAlert(false)}
          />
        )}
      </IonContent>
      {showThankYou && (
        <ThankYouModal onDismiss={closeThankYou} />
      )}
    </IonPage>
  );
};

export default AddVolunteerHoursForm;
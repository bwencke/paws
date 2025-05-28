import React, { useState } from 'react';
import {
  IonItem,
  IonLabel,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonDatetime,
  IonButton,
  IonModal,
  IonContent,
  IonPage,
  IonList,
  IonHeader,
  IonToolbar,
  IonTitle,
} from '@ionic/react';
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
      onSubmit(formData);
    }
  };

  return (
    <IonPage>
      <IonContent>
        <IonHeader>
          <IonToolbar>
            <IonTitle>{initialData ? 'Edit Volunteer Hours' : 'Add Volunteer Hours'}</IonTitle>
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
                label="Type"
                labelPlacement="stacked"
                placeholder="Choose the type of event you participated in"
                interfaceOptions={{
                  header: 'Select Event Type',
                  subHeader: 'Choose the type of event you participated in',
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
            color="light"
            onClick={onCancel}
            style={{ marginTop: '10px' }}
          >
            Cancel
          </IonButton>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default AddVolunteerHoursForm;
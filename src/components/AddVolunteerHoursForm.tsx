import React, { useRef, useState } from 'react';
import {
  IonItem,
  IonLabel,
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
  IonModal,
  IonPicker,
  IonPickerColumn,
  IonPickerColumnOption,
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
  const minuteStepOptions = [0, 15, 30, 45];
  const getHourLabel = (value: number) => `${value} ${value === 1 ? 'Hour' : 'Hours'}`;
  const getMinuteLabel = (value: number) => `${value} Minutes`;

  const getDurationPartsFromHours = (hoursValue: string) => {
    const parsed = Number.parseFloat(hoursValue);
    if (Number.isNaN(parsed) || parsed <= 0) {
      return { hours: 0, minutes: 0 };
    }

    const totalMinutes = Math.round(parsed * 60);
    const hours = Math.min(23, Math.floor(totalMinutes / 60));
    const rawMinutes = totalMinutes % 60;
    const minutes = minuteStepOptions.reduce((closest, option) =>
      Math.abs(option - rawMinutes) < Math.abs(closest - rawMinutes) ? option : closest
    , minuteStepOptions[0]);

    return { hours, minutes };
  };

  const getHoursFromDurationParts = (hours: number, minutes: number) => {
    const totalHours = hours + minutes / 60;
    return totalHours.toString();
  };

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
  const [showHoursPicker, setShowHoursPicker] = useState(false);
  const [pickerHours, setPickerHours] = useState(0);
  const [pickerMinutes, setPickerMinutes] = useState(0);
  const hoursPickerModal = useRef<HTMLIonModalElement>(null);
  const selectedDuration = getDurationPartsFromHours(formData.hours);
  const hoursDisplayValue = `${selectedDuration.hours}h ${selectedDuration.minutes.toString().padStart(2, '0')}m`;

  const openHoursPicker = () => {
    setPickerHours(selectedDuration.hours);
    setPickerMinutes(selectedDuration.minutes);
    setShowHoursPicker(true);
  };

  const confirmHoursPicker = () => {
    hoursPickerModal.current?.dismiss(
      { hours: pickerHours, minutes: pickerMinutes },
      'confirm'
    );
  };

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
                const raw = e.detail.value;
                const valueStr = Array.isArray(raw) ? raw[0] : raw;
                const selectedDate = valueStr?.split('T')[0];
                handleInputChange('date', selectedDate || '');
              }}
            />
            {errors.date && <p style={{ color: 'red', fontSize: '12px' }}>{errors.date}</p>}
          </IonItem>
          <IonItem>
            <div style={{ width: '100%' }}>
              <IonLabel style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 400 }}>
                Duration
              </IonLabel>
              <IonButton
                size="small"
                expand="block"
                fill="clear"
                onClick={openHoursPicker}
                style={{
                  '--background': 'var(--ion-item-background, var(--ion-background-color, #fff))',
                  '--color': 'var(--ion-text-color)',
                  minHeight: '44px',
                  fontSize: '1.125rem',
                  textTransform: 'none',
                  width: '100%',
                  textAlign: 'left',
                } as React.CSSProperties}
              >
                {hoursDisplayValue}
              </IonButton>
              {errors.hours && <p style={{ color: 'red', fontSize: '12px' }}>{errors.hours}</p>}
            </div>
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
      <IonModal
        ref={hoursPickerModal}
        isOpen={showHoursPicker}
        initialBreakpoint={0.45}
        breakpoints={[0, 0.45]}
        onDidDismiss={(event) => {
          if (event.detail.role === 'confirm') {
            const selectedHours = Number(event.detail.data?.hours ?? pickerHours);
            const selectedMinutes = Number(event.detail.data?.minutes ?? pickerMinutes);
            handleInputChange('hours', getHoursFromDurationParts(selectedHours, selectedMinutes));
          }
          setShowHoursPicker(false);
        }}
      >
        <IonHeader>
          <IonToolbar>
            <IonTitle>Select Duration</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => hoursPickerModal.current?.dismiss(null, 'cancel')}>Cancel</IonButton>
              <IonButton onClick={confirmHoursPicker}>Confirm</IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonPicker>
            <IonPickerColumn
              value={pickerHours}
              onIonChange={(event: any) => setPickerHours(Number(event.detail.value ?? 0))}
            >
              {Array.from({ length: 24 }, (_, index) => (
                <IonPickerColumnOption key={index} value={index}>
                  {getHourLabel(index)}
                </IonPickerColumnOption>
              ))}
            </IonPickerColumn>
            <IonPickerColumn
              value={pickerMinutes}
              onIonChange={(event: any) => setPickerMinutes(Number(event.detail.value ?? 0))}
            >
              {minuteStepOptions.map((minutes) => (
                <IonPickerColumnOption key={minutes} value={minutes}>
                  {getMinuteLabel(minutes)}
                </IonPickerColumnOption>
              ))}
            </IonPickerColumn>
          </IonPicker>
        </IonContent>
      </IonModal>
    </IonPage>
  );
};

export default AddVolunteerHoursForm;
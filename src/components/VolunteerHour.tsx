import React from 'react';
import { IonItem, IonLabel } from '@ionic/react';
import { HourEntry } from '../types/volunteerTypes';

interface VolunteerHourProps {
  entry: HourEntry;
  onEdit: (entry: HourEntry) => void;
}

const VolunteerHour: React.FC<VolunteerHourProps> = ({ entry, onEdit }) => (
  <IonItem key={entry.id} onClick={() => onEdit(entry)}>
    <IonLabel className="ion-text-wrap">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2>
            <b>
              {entry.type?.name} at {entry.location?.name}
            </b>
          </h2>
          <p>
            {entry.date
              ? (() => {
                  const [year, month, day] = entry.date.split('-');
                  const dateObj = new Date(Number(year), Number(month) - 1, Number(day));
                  const monthName = dateObj.toLocaleString('en-US', { month: 'long' });
                  return `${monthName} ${day}, ${year}`;
                })()
              : 'Invalid date'}
          </p>
        </div>
        <div style={{ fontSize: '1.5rem', textAlign: 'right' }}>
          <span style={{ fontWeight: 'bold' }}>{entry.hours}</span> hrs
        </div>
      </div>
    </IonLabel>
  </IonItem>
);

export default VolunteerHour;
import React from 'react';
import { IonList, IonItem, IonLabel } from '@ionic/react';
import VolunteerHour from './VolunteerHour';
import { HourEntry } from '../types/volunteerTypes';

interface VolunteerHoursGroupedByMonthProps {
  hourEntries: HourEntry[];
  onEdit: (entry: HourEntry) => void;
}

const VolunteerHoursGroupedByMonth: React.FC<VolunteerHoursGroupedByMonthProps> = ({
  hourEntries,
  onEdit,
}) => {
  const groupedByMonth = hourEntries.reduce<Record<string, HourEntry[]>>((acc, entry) => {
    const [year, month] = entry.date.split('-');
    const dateObj = new Date(Number(year), Number(month) - 1);
    const monthYear = dateObj.toLocaleString('en-US', { month: 'long', year: 'numeric' });
    if (!acc[monthYear]) acc[monthYear] = [];
    acc[monthYear].push(entry);
    return acc;
  }, {});

  return (
    <IonList data-testid="volunteer-hours-grouped-by-month-list">
      {Object.entries(groupedByMonth).map(([monthYear, entries]) => (
        <div key={monthYear}>
          <IonItem lines="full" className="ion-text-center">
            <IonLabel>
              <h1 style={{ fontWeight: 'bold' }}>{monthYear}</h1>
            </IonLabel>
          </IonItem>
          {entries.map((entry) => (
            <VolunteerHour key={entry.id} entry={entry} onEdit={onEdit} />
          ))}
        </div>
      ))}
    </IonList>
  );
};

export default VolunteerHoursGroupedByMonth;
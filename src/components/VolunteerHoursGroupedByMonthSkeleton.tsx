import React from 'react';
import { IonList, IonItem, IonSkeletonText, IonThumbnail, IonLabel } from '@ionic/react';

const fakeHeader = (
  <IonItem lines="full">
    <IonSkeletonText animated={true} style={{ width: '50%', margin: '0 auto' }}></IonSkeletonText>
  </IonItem>
)

const fakeItem = (
  <IonItem lines="full">
    <IonLabel>
      <p><IonSkeletonText animated={true}></IonSkeletonText></p>
      <p><IonSkeletonText animated={true}></IonSkeletonText></p>
    </IonLabel>
    <IonThumbnail slot="end">
      <IonSkeletonText animated={true}></IonSkeletonText>
    </IonThumbnail>
  </IonItem>
)

const VolunteerHoursGroupedByMonthSkeleton = () => {
  return (
    <IonList data-testid="volunteer-hours-grouped-by-month-list" style={{ width: '100%' }}>
      {fakeHeader}
      {fakeItem}
      {fakeItem}
      {fakeItem}
      {fakeItem}
      {fakeHeader}
      {fakeItem}
      {fakeItem}
      {fakeItem}
      {fakeItem}
    </IonList>
  );
};

export default VolunteerHoursGroupedByMonthSkeleton;
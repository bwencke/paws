import { IonItem, IonLabel } from '@ionic/react';
import { Badge } from '../types/badgeTypes';
import { BadgeItem } from './BadgeItem';

interface BadgeCategorySectionProps {
  category: string;
  badges: Badge[];
}

const categoryMap = {
  'event': 'Events',
  'role': 'Roles',
  'time_milestone': 'Milestones',
  'timing': 'Timing'
}

export function BadgeCategorySection({ category, badges }: BadgeCategorySectionProps) {
  return (
    <section style={{ marginBottom: 24 }}>
      <IonItem lines="full" className="ion-text-center">
        <IonLabel>
          <h1 style={{ fontWeight: 'bold' }}>{categoryMap[category]}</h1>
        </IonLabel>
      </IonItem>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
          gap: 16,
          padding: '16px 0',
        }}
      >
        {badges.map((badge) => (
          <BadgeItem key={badge.name} badge={badge} />
        ))}
      </div>
    </section>
  );
}

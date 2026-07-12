import { useEffect, useMemo } from 'react';
import { IonPage, IonContent } from '@ionic/react';
import { Header } from '../../components/Header';
import { BadgeCategorySection } from '../../components/BadgeCategorySection';
import { useBadges } from '../../hooks/useBadges';
import { Badge } from '../../types/badgeTypes';

function groupBadgesByCategory(badges: Badge[]): Record<string, Badge[]> {
  return badges.reduce<Record<string, Badge[]>>((acc, badge) => {
    if (!acc[badge.category]) {
      acc[badge.category] = [];
    }
    acc[badge.category].push(badge);
    return acc;
  }, {});
}

export function BadgesPage() {
  const { badges, loading, fetchBadges } = useBadges();

  useEffect(() => {
    void fetchBadges();
  }, [fetchBadges]);

  const groupedBadges = useMemo(() => {
    const grouped = groupBadgesByCategory(badges);
    return Object.entries(grouped)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([category, categoryBadges]) => [
        category,
        [...categoryBadges].sort((a, b) => a.trigger_value - b.trigger_value),
      ] as const);
  }, [badges]);

  return (
    <IonPage>
      <Header title="Badges" />
      <IonContent className="ion-padding">
        {loading ? (
          <p className="ion-text-center ion-padding">Loading…</p>
        ) : groupedBadges.length === 0 ? (
          <p className="ion-text-center ion-padding">No badges available</p>
        ) : (
          groupedBadges.map(([category, categoryBadges]) => (
            <BadgeCategorySection
              key={category}
              category={category}
              badges={categoryBadges}
            />
          ))
        )}
      </IonContent>
    </IonPage>
  );
}

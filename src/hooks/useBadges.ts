import { useState, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import { Badge } from '../types/badgeTypes';

export function useBadges() {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBadges = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('badges')
      .select('name, description, category, icon, trigger_value');
    if (!error && data) {
      setBadges(data);
    }
    setLoading(false);
  }, []);

  return {
    badges,
    loading,
    fetchBadges,
  };
}

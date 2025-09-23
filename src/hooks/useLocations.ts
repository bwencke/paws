import { useState, useCallback } from 'react';
import { supabase } from '../../lib/supabase';

export interface Location {
  id: number;
  name: string;
}

export function useLocations() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLocations = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from('event_locations').select('id, name');
    if (!error && data) {
      setLocations(data);
    }
    setLoading(false);
  }, []);

  const createLocation = useCallback(
    async (name: string) => {
      const { error } = await supabase.from('event_locations').insert({ name });
      if (!error) await fetchLocations();
      return { error };
    },
    [fetchLocations]
  );

  const updateLocation = useCallback(
    async (id: number, name: string) => {
      const { error } = await supabase.from('event_locations').update({ name }).eq('id', id);
      if (!error) await fetchLocations();
      return { error };
    },
    [fetchLocations]
  );

  const deleteLocation = useCallback(
    async (id: number) => {
      const { error } = await supabase.from('event_locations').delete().eq('id', id);
      if (!error) await fetchLocations();
      return { error };
    },
    [fetchLocations]
  );

  return {
    locations,
    loading,
    fetchLocations,
    createLocation,
    updateLocation,
    deleteLocation,
    setLocations, // in case you need to set manually
  };
}

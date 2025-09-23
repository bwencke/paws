import { useState, useCallback } from 'react';
import { supabase } from '../../lib/supabase';

export interface EventType {
  id: number;
  name: string;
}

export function useEventTypes() {
  const [eventTypes, setEventTypes] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEventTypes = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from('event_types').select('id, name');
    if (!error && data) {
      setEventTypes(data);
    }
    setLoading(false);
  }, []);

  const createEventType = useCallback(
    async (name: string) => {
      const { error } = await supabase.from('event_types').insert({ name });
      if (!error) await fetchEventTypes();
      return { error };
    },
    [fetchEventTypes]
  );

  const updateEventType = useCallback(
    async (id: number, name: string) => {
      const { error } = await supabase.from('event_types').update({ name }).eq('id', id);
      if (!error) await fetchEventTypes();
      return { error };
    },
    [fetchEventTypes]
  );

  const deleteEventType = useCallback(
    async (id: number) => {
      const { error } = await supabase.from('event_types').delete().eq('id', id);
      if (!error) await fetchEventTypes();
      return { error };
    },
    [fetchEventTypes]
  );

  return {
    eventTypes,
    loading,
    fetchEventTypes,
    createEventType,
    updateEventType,
    deleteEventType,
    setEventTypes, // in case you need to set manually
  };
}

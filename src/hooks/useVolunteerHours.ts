import { useState, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import { HourEntry } from '../types/volunteerTypes';

export function useVolunteerHours(userId: string) {
  const [hourEntries, setHourEntries] = useState<HourEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchHourEntries = useCallback(async () => {
    if (!userId) return;
    setIsLoading(true);
    const { data } = await supabase
      .from('hours')
      .select(`
        id,
        hours,
        date,
        type:event_types (
          id,
          name
        ),
        location:event_locations (
          id,
          name
        )
      `)
      .eq('user_id', userId)
      .order('date', { ascending: false });
    setHourEntries(data || []);
    setIsLoading(false);
  }, [userId]);

  const createHourEntry = useCallback(async (formData: {
    date: string;
    hours: string;
    typeId: string;
    locationId: string;
  }) => {
    if (!userId) return { error: 'No userId' };
    const { date, hours, typeId, locationId } = formData;
    const { error } = await supabase.from('hours').insert({
      user_id: userId,
      date,
      hours: parseFloat(hours),
      type: typeId,
      location: locationId,
    });
    if (!error) await fetchHourEntries();
    return { error };
  }, [userId, fetchHourEntries]);

  const updateHourEntry = useCallback(async (id: number, formData: {
    date: string;
    hours: string;
    typeId: string;
    locationId: string;
  }) => {
    const { date, hours, typeId, locationId } = formData;
    const { error } = await supabase
      .from('hours')
      .update({
        date,
        hours: parseFloat(hours),
        type: typeId,
        location: locationId,
      })
      .eq('id', id)
      .select();
    if (!error) await fetchHourEntries();
    return { error };
  }, [fetchHourEntries]);

  const deleteHourEntry = useCallback(async (id: number) => {
    const { error } = await supabase
      .from('hours')
      .delete()
      .eq('id', id);
    if (!error) await fetchHourEntries();
    return { error };
  }, [fetchHourEntries]);

  return {
    hourEntries,
    isLoading,
    fetchHourEntries,
    createHourEntry,
    updateHourEntry,
    deleteHourEntry,
    setHourEntries, // in case you need to set manually
  };
}
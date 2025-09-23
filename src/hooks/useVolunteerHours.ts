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
      .from('hours_with_details')
      .select(`
        id,
        hours,
        date,
        type_id,
        type,
        location_id,
        location,
        user_id,
        first_name,
        last_name,
        email
      `)
      .eq('user_id', userId)
      .order('date', { ascending: false });
    setHourEntries(data || []);
    setIsLoading(false);
  }, [userId]);

  const fetchAllHourEntries = useCallback(async () => {
    setIsLoading(true);
    const { data } = await supabase
      .from('hours_with_details')
      .select(`
        id,
        hours,
        date,
        type_id,
        type,
        location_id,
        location,
        user_id,
        first_name,
        last_name,
        email
      `)
      .order('date', { ascending: false });
    setHourEntries(data || []);
    setIsLoading(false);
  }, []);

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
    fetchAllHourEntries,
    createHourEntry,
    updateHourEntry,
    deleteHourEntry,
    setHourEntries, // in case you need to set manually
  };
}
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import useAuth from '../stores/useAuth';
import { BotsStats, DEFAULT_STATS } from '../utils/types/bot';
import { calculateStats } from '../utils/stats';

export const useBotsStats = () => {
  const { empresaUid } = useAuth();
  const [stats, setStats] = useState<BotsStats>(DEFAULT_STATS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!empresaUid) {
      setStats(DEFAULT_STATS);
      setLoading(false);
      return;
    }

    const fetchAndUpdateStats = async () => {
      try {
        const { data, error } = await supabase
          .from('conex-bots')
          .select('bot_status, bot_ativo')
          .eq('bot_titular', empresaUid)
          .eq('bot_ativo', true);

        if (error) throw error;
        setStats(calculateStats(data));
      } catch (err) {
        console.error('Error fetching bot stats:', err);
        setStats(DEFAULT_STATS);
      } finally {
        setLoading(false);
      }
    };

    fetchAndUpdateStats();

    const channel = supabase.channel('custom-stats-channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conex-bots',
          filter: `bot_titular=eq.${empresaUid}`
        },
        async () => {
          // Refetch all data when any change occurs
          await fetchAndUpdateStats();
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [empresaUid]);

  return { stats, loading };
};
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import useAuth from '../stores/useAuth';

interface BotData {
  uid: string;
  bot_nome: string;
  bot_status: string;
  bot_ligado: boolean;
  bot_perfil: string | null;
  bot_numero: string | null;
  bot_ativo: boolean;
}

export const useBots = () => {
  const { empresaUid } = useAuth();
  const [bots, setBots] = useState<BotData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!empresaUid) {
      setLoading(false);
      return;
    }

    const fetchBotsData = async () => {
      try {
        const { data, error } = await supabase
          .from('conex-bots')
          .select('uid, bot_nome, bot_status, bot_ligado, bot_perfil, bot_numero, bot_ativo')
          .eq('bot_titular', empresaUid)
          .eq('bot_ativo', true);

        if (error) throw error;
        setBots(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchBotsData();

    const channel = supabase.channel('custom-bots-channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conex-bots',
          filter: `bot_titular=eq.${empresaUid}`
        },
        async (payload) => {
          // Refetch all data when any change occurs
          await fetchBotsData();
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [empresaUid]);

  return { bots, loading, error };
};
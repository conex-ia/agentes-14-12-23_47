import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import useAuth from '../stores/useAuth';

interface TrainingData {
  uid: string;
  titular: string;
  created_at: string;
  origem: string;
  resumo: string;
  fase: string;
  tipo: string;
  ativa: boolean;
}

export const useTrainingData = () => {
  const { empresaUid } = useAuth();
  const [trainings, setTrainings] = useState<TrainingData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!empresaUid) {
      setLoading(false);
      return;
    }

    const fetchTrainings = async () => {
      try {
        const { data, error } = await supabase
          .from('conex-treinamentos')
          .select('*')
          .eq('titular', empresaUid)
          .eq('ativa', true)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setTrainings(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchTrainings();

    // Set up realtime subscription
    const channel = supabase
      .channel('custom-training-channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conex-treinamentos',
          filter: `titular=eq.${empresaUid}`
        },
        async () => {
          // Refetch all data when any change occurs
          await fetchTrainings();
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [empresaUid]);

  return { trainings, loading, error };
};
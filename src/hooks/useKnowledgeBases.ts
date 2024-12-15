import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import useAuth from '../stores/useAuth';

export interface KnowledgeBase {
  uid: string;
  created_at: string;
  nome: string;
  treinamentos_qtd: number;
  treinamentos?: string[];
  ativa: boolean;
}

export const useKnowledgeBases = () => {
  const { empresaUid } = useAuth();
  const [bases, setBases] = useState<KnowledgeBase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!empresaUid) {
      setLoading(false);
      return;
    }

    const fetchBases = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from('conex-bases_t')
          .select('uid, created_at, nome, treinamentos_qtd, treinamentos, ativa')
          .eq('titular', empresaUid)
          .eq('ativa', true)
          .order('created_at', { ascending: false });

        if (fetchError) throw fetchError;
        setBases(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching knowledge bases:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBases();

    const channel = supabase
      .channel('custom-bases-channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conex-bases_t',
          filter: `titular=eq.${empresaUid}`,
        },
        () => {
          fetchBases();
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [empresaUid]);

  return { bases, loading, error };
};
import { useState, useEffect } from 'react';
import { fetchKnowledgeBases } from '../services/knowledgeBase.service';
import useAuth from '../stores/useAuth';
import { APP_CONFIG } from '../config/constants';
import { createErrorMessage } from '../utils/errors';

export interface KnowledgeBaseOption {
  value: string;
  label: string;
}

export function useKnowledgeBaseSelect() {
  const { empresaUid } = useAuth();
  const [options, setOptions] = useState<KnowledgeBaseOption[]>([
    APP_CONFIG.DEFAULT_SELECT_OPTION
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadKnowledgeBases() {
      if (!empresaUid) {
        setLoading(false);
        return;
      }

      try {
        const bases = await fetchKnowledgeBases(empresaUid);
        setOptions([
          APP_CONFIG.DEFAULT_SELECT_OPTION,
          ...bases.map(base => ({
            value: base.uid,
            label: base.nome
          }))
        ]);
      } catch (err) {
        setError(createErrorMessage('carregar bases de conhecimento'));
      } finally {
        setLoading(false);
      }
    }

    loadKnowledgeBases();
  }, [empresaUid]);

  return { options, loading, error };
}
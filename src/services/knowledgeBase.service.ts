import { supabase } from '../lib/supabase';
import type { KnowledgeBase } from '../types/knowledgeBase';
import { handleApiResponse } from './api';

export async function fetchKnowledgeBases(empresaUid: string): Promise<KnowledgeBase[]> {
  return handleApiResponse(
    supabase
      .from('conex-bases_t')
      .select('uid, nome, created_at, ativa')
      .eq('titular', empresaUid)
      .eq('ativa', true)
      .order('created_at', { ascending: false }),
    'buscar bases de conhecimento'
  );
}
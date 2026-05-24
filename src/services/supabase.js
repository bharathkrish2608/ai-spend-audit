import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export async function saveAudit(auditData) {
  const { data, error } = await supabase
    .from('audits')
    .insert([auditData])
    .select('id')
    .single();
  if (error) throw error;
  return data.id;
}

export async function getAudit(id) {
  const { data, error } = await supabase
    .from('audits')
    .select('*')
    .eq('id', id)
    .single();
  if (error && error.code !== 'PGRST116') throw error;
  return data || null;
}

export async function updateAuditLead(id, email, companyName, role) {
  const { error } = await supabase
    .from('audits')
    .update({ email, company_name: companyName, role })
    .eq('id', id);
  if (error) throw error;
}
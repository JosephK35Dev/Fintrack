import { supabase } from '../supabase'

export type WorkMonitor = {
  id: string
  user_id?: string | null
  name: string
  description: string | null
  interval_minutes: number
  last_review_at: string | null
  next_due_at: string | null
  review_started_at: string | null
  review_count: number
  paused: boolean
  paused_at: string | null
  created_at: string
}
export type WorkTask = {
  id: string
  user_id?: string | null
  title: string
  description: string | null
  priority: 'alta' | 'media' | 'baja'
  due_at: string | null
  created_at: string
  completed_at: string | null
  deleted_at: string | null
}
export type WorkActivity = { id: string; title: string; detail: string; at: string; kind: 'review' | 'task' }

export async function getWorkData() {
  const [monitors, tasks, reviews] = await Promise.all([
    supabase.from('work_monitors').select('*').order('created_at', { ascending: false }),
    supabase.from('work_tasks').select('*').order('created_at', { ascending: false }),
    supabase.from('work_monitor_reviews').select('*').order('completed_at', { ascending: false }).limit(12),
  ])
  if (monitors.error) throw monitors.error
  if (tasks.error) throw tasks.error
  if (reviews.error) throw reviews.error
  const activity: WorkActivity[] = [
    ...(reviews.data ?? []).map(r => ({ id: r.id, title: r.monitor_name, detail: `Revision · ${r.interval_minutes} min${r.started_at ? ` · inicio ${new Intl.DateTimeFormat('es-CO', { dateStyle: 'short', timeStyle: 'short', timeZone: 'America/Bogota' }).format(new Date(r.started_at))}` : ''}`, at: r.completed_at, kind: 'review' as const })),
    ...(tasks.data ?? []).filter(t => t.completed_at).map(t => ({ id: t.id, title: t.title, detail: `Tarea completada · prioridad ${t.priority} · creada ${new Intl.DateTimeFormat('es-CO', { dateStyle: 'short', timeZone: 'America/Bogota' }).format(new Date(t.created_at))}`, at: t.completed_at!, kind: 'task' as const })),
  ].sort((a, b) => Date.parse(b.at) - Date.parse(a.at)).slice(0, 8)
  return { monitors: (monitors.data ?? []) as WorkMonitor[], tasks: (tasks.data ?? []) as WorkTask[], activity }
}

export async function saveWorkMonitor(input: Pick<WorkMonitor, 'name' | 'description' | 'interval_minutes'>, id?: string) {
  const query = id
    ? supabase.from('work_monitors').update(input).eq('id', id)
    : supabase.from('work_monitors').insert(input)
  const { data, error } = await query.select().single()
  if (error) throw error
  return data as WorkMonitor
}
export async function deleteWorkMonitor(id: string) {
  const { error } = await supabase.from('work_monitors').delete().eq('id', id)
  if (error) throw error
}
export async function setWorkMonitorPaused(id: string, paused: boolean) {
  const { data, error } = await supabase.rpc('set_work_monitor_paused', { p_id: id, p_paused: paused })
  if (error) throw error
  return data as WorkMonitor
}
export async function startWorkReview(id: string) {
  const { data, error } = await supabase.from('work_monitors').update({ review_started_at: new Date().toISOString() }).eq('id', id).select().single()
  if (error) throw error
  return data as WorkMonitor
}
export async function completeWorkReview(id: string) {
  const { error } = await supabase.rpc('complete_work_monitor', { p_id: id })
  if (error) throw error
}
export async function saveWorkTask(input: Pick<WorkTask, 'title' | 'description' | 'priority' | 'due_at'>, id?: string) {
  const query = id
    ? supabase.from('work_tasks').update(input).eq('id', id)
    : supabase.from('work_tasks').insert(input)
  const { data, error } = await query.select().single()
  if (error) throw error
  return data as WorkTask
}
export async function completeWorkTask(id: string, completed: boolean) {
  const { data, error } = await supabase.from('work_tasks').update({ completed_at: completed ? new Date().toISOString() : null }).eq('id', id).select().single()
  if (error) throw error
  return data as WorkTask
}
export async function deleteWorkTask(id: string) {
  const { error } = await supabase.from('work_tasks').update({ deleted_at: new Date().toISOString() }).eq('id', id)
  if (error) throw error
}

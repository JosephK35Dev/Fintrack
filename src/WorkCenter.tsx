import { useEffect, useState } from 'react'
import { AlertTriangle, Bell, BellRing, CalendarDays, Check, CheckSquare, Clock3, Pencil, Pause, Play, Plus, RefreshCw, Trash2 } from 'lucide-react'
import { WorkActivity, WorkMonitor, WorkTask, completeWorkReview, completeWorkTask, deleteWorkMonitor, deleteWorkTask, getWorkData, saveWorkMonitor, saveWorkTask, setWorkMonitorPaused, startWorkReview } from './services/trabajo'
import './styles/screens.css'

type Props = { visible?: boolean }
type TaskPriority = WorkTask['priority']
const inputClass = 'w-full min-h-[42px] rounded-xl border border-white/[0.09] bg-white/[0.035] px-3.5 py-2.5 text-sm text-ink outline-none transition focus:border-brand/50 focus:ring-4 focus:ring-brand/[0.09]'
const localDate = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
const formatDateTime = (value: string | null) => value ? new Intl.DateTimeFormat('es-CO', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value)) : '—'

export function CentroTrabajo({ visible = true }: Props) {
  const [monitors, setMonitors] = useState<WorkMonitor[]>([])
  const [tasks, setTasks] = useState<WorkTask[]>([])
  const [activity, setActivity] = useState<WorkActivity[]>([])
  const [now, setNow] = useState(Date.now())
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [monitorModal, setMonitorModal] = useState(false)
  const [taskModal, setTaskModal] = useState(false)
  const [editingMonitor, setEditingMonitor] = useState<WorkMonitor | null>(null)
  const [editingTask, setEditingTask] = useState<WorkTask | null>(null)
  const [monitorName, setMonitorName] = useState('')
  const [monitorDescription, setMonitorDescription] = useState('')
  const [monitorInterval, setMonitorInterval] = useState('30')
  const [taskTitle, setTaskTitle] = useState('')
  const [taskDescription, setTaskDescription] = useState('')
  const [taskPriority, setTaskPriority] = useState<TaskPriority>('media')
  const [taskDue, setTaskDue] = useState('')
  const [permission, setPermission] = useState<NotificationPermission | 'unsupported'>(() => typeof Notification === 'undefined' ? 'unsupported' : Notification.permission)

  const refresh = async () => {
    try {
      const data = await getWorkData()
      setMonitors(data.monitors)
      setTasks(data.tasks)
      setActivity(data.activity)
      setError('')
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No se pudo cargar el Centro de trabajo.')
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => { void refresh() }, [])
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  const dueMonitors = monitors.filter(m => !m.paused && m.next_due_at && Date.parse(m.next_due_at) <= now)
  const dueKey = dueMonitors.map(m => `${m.id}:${m.next_due_at}`).join('|')
  useEffect(() => {
    if (!dueMonitors.length) return
    const message = `${dueMonitors.length === 1 ? 'Requiere atencion' : 'Requieren atencion'}: ${dueMonitors.map(m => m.name).join(', ')}`
    setNotice(message)
    if (typeof Notification === 'undefined' || Notification.permission !== 'granted') return
    for (const monitor of dueMonitors) {
      const key = `work-notified:${monitor.id}:${monitor.next_due_at}`
      if (sessionStorage.getItem(key)) continue
      const notification = new Notification(`Revision pendiente: ${monitor.name}`, { body: 'El monitoreo llego a su hora de revision.', tag: key })
      notification.onclick = () => { window.focus(); notification.close() }
      sessionStorage.setItem(key, '1')
    }
  }, [dueKey, permission])

  const run = async (action: () => Promise<unknown>, success?: string) => {
    setSaving(true)
    setError('')
    try {
      await action()
      await refresh()
      if (success) setNotice(success)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No se pudo guardar el cambio.')
    } finally {
      setSaving(false)
    }
  }
  const requestNotifications = async () => {
    if (typeof Notification === 'undefined') { setPermission('unsupported'); return }
    setPermission(await Notification.requestPermission())
  }
  const openMonitor = (monitor?: WorkMonitor) => {
    setEditingMonitor(monitor ?? null)
    setMonitorName(monitor?.name ?? '')
    setMonitorDescription(monitor?.description ?? '')
    setMonitorInterval(String(monitor?.interval_minutes ?? 30))
    setMonitorModal(true)
  }
  const submitMonitor = async () => {
    const interval = Number(monitorInterval)
    if (!monitorName.trim() || !Number.isInteger(interval) || interval < 1 || interval > 10080) return
    await run(() => saveWorkMonitor({ name: monitorName.trim(), description: monitorDescription.trim() || null, interval_minutes: interval }, editingMonitor?.id), 'Monitoreo guardado.')
    setMonitorModal(false)
  }
  const openTask = (task?: WorkTask) => {
    setEditingTask(task ?? null)
    setTaskTitle(task?.title ?? '')
    setTaskDescription(task?.description ?? '')
    setTaskPriority(task?.priority ?? 'media')
    setTaskDue(task?.due_at ?? '')
    setTaskModal(true)
  }
  const submitTask = async () => {
    if (!taskTitle.trim()) return
    await run(() => saveWorkTask({ title: taskTitle.trim(), description: taskDescription.trim() || null, priority: taskPriority, due_at: taskDue || null }, editingTask?.id), 'Tarea guardada.')
    setTaskModal(false)
  }
  const countdown = (due: string, pausedAt: string | null) => {
    const ref = pausedAt ? Date.parse(pausedAt) : now
    const total = Math.max(0, Math.floor((Date.parse(due) - ref) / 1000))
    const days = Math.floor(total / 86400)
    const hours = Math.floor(total % 86400 / 3600)
    const minutes = Math.floor(total % 3600 / 60)
    const seconds = total % 60
    return `${days ? `${days}d ` : ''}${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  }
  const status = (monitor: WorkMonitor) => {
    if (monitor.paused) return 'Pausada'
    if (!monitor.next_due_at) return 'En espera'
    const remaining = Date.parse(monitor.next_due_at) - now
    if (remaining <= 0) return 'Vencida'
    if (remaining <= monitor.interval_minutes * 60000 * .15) return 'Proxima'
    return 'Activa'
  }
  const today = localDate(new Date())
  const completedToday = tasks.filter(task => task.completed_at && localDate(new Date(task.completed_at)) === today).length
  const pending = tasks.filter(task => !task.deleted_at && !task.completed_at).slice().sort((a, b) => ({ alta: 0, media: 1, baja: 2 }[a.priority] - { alta: 0, media: 1, baja: 2 }[b.priority]))
  const activeCount = monitors.filter(m => !m.paused && m.next_due_at).length

  const field = (label: string, child: React.ReactNode) => <label className="ui-work-field">{label}{child}</label>

  return <div className={`ui-screen app-view app-view--trabajo${visible ? '' : ' hidden'}`}>
    <header className="ui-head"><div><h1 className="ui-title">Centro de trabajo</h1><p className="ui-sub">Tu jornada, organizada</p></div><div className="ui-btns"><button type="button" className="ui-ghost" onClick={requestNotifications} disabled={permission === 'granted' || permission === 'unsupported'}><Bell size={16}/>{permission === 'granted' ? 'Notificaciones activas' : permission === 'denied' ? 'Permiso bloqueado' : permission === 'unsupported' ? 'No disponible' : 'Activar notificaciones'}</button></div></header>
    {error && <div className="ui-work-alert" role="alert"><AlertTriangle size={18}/><span>{error}</span><button type="button" onClick={() => void refresh()} className="ui-ib" aria-label="Reintentar"><RefreshCw size={16}/></button></div>}
    {notice && <div className={`ui-work-alert${dueMonitors.length ? ' is-due' : ''}`} role="status"><BellRing size={18}/><span>{notice}</span></div>}
    <section className="ui-sum" aria-label="Resumen de trabajo"><article className="ui-card"><small>Monitoreos activos</small><b>{activeCount}</b></article><article className="ui-card"><small>Pendientes actuales</small><b>{pending.length}</b></article><article className="ui-card"><small>Tareas completadas hoy</small><b>{completedToday}</b></article></section>
    {loading ? <div className="ui-card ui-work-empty">Cargando...</div> : <>
      <div className="ui-work-grid">
        <section><div className="ui-work-heading"><div><h2>Monitoreos recurrentes</h2><p>Revisiones que se repiten durante tu jornada.</p></div><button type="button" className="ui-cta ui-sm" onClick={() => openMonitor()}><Plus size={16}/> Nuevo</button></div>
          {!monitors.length ? <div className="ui-card ui-work-empty"><span className="ui-ic ui-g"><Clock3 size={20}/></span><strong>Aun no hay monitoreos configurados</strong><p>Agrega una revision y define cada cuanto debes repetirla.</p></div> : <div className="ui-work-list">{monitors.map(monitor => {
            const state = status(monitor)
            const overdue = state === 'Vencida'
            const ref = monitor.paused && monitor.paused_at ? Date.parse(monitor.paused_at) : now
            const progress = monitor.next_due_at && monitor.last_review_at ? Math.max(0, Math.min(100, 100 - (Date.parse(monitor.next_due_at) - ref) / (monitor.interval_minutes * 60000) * 100)) : 0
            return <article className={`ui-card ui-monitor${overdue ? ' is-overdue' : ''}`} key={monitor.id}>
              <div className="ui-monitor-top"><div className="ui-monitor-copy"><strong>{monitor.name}</strong>{monitor.description && <p>{monitor.description}</p>}</div><span className={`ui-status status-${state.toLowerCase()}`}>{state}</span></div>
              {monitor.next_due_at ? <><div className="ui-monitor-timer"><b>{overdue ? '00:00:00' : countdown(monitor.next_due_at, monitor.paused_at)}</b><small>{overdue ? 'Hora de revisar' : 'Tiempo restante'}</small></div><div className="ui-progress"><i style={{ width: `${progress}%` }}/></div><div className="ui-monitor-dates"><span>Ultima: {formatDateTime(monitor.last_review_at)}</span><span>Proxima: {formatDateTime(monitor.next_due_at)}</span></div></> : <div className="ui-monitor-wait">Realiza la primera revision y pulsa Termine para iniciar el temporizador.</div>}
              <div className="ui-monitor-actions"><small className="ui-review-count">{monitor.review_count} {monitor.review_count === 1 ? 'revision' : 'revisiones'}</small><button type="button" className="ui-cta ui-sm" disabled={saving} onClick={() => void run(() => completeWorkReview(monitor.id), 'Revision registrada. Nuevo temporizador iniciado.')}><Check size={16}/> Termine</button>{!monitor.review_started_at && <button type="button" className="ui-ghost ui-sm" disabled={saving} onClick={() => void run(() => startWorkReview(monitor.id), 'Inicio de revision registrado.')}>Iniciar</button>}<button type="button" className="ui-ib" title={monitor.paused ? 'Reanudar' : 'Pausar'} aria-label={monitor.paused ? 'Reanudar monitoreo' : 'Pausar monitoreo'} onClick={() => void run(() => setWorkMonitorPaused(monitor.id, !monitor.paused))}>{monitor.paused ? <Play size={16}/> : <Pause size={16}/>}</button><button type="button" className="ui-ib" aria-label="Editar monitoreo" title="Editar" onClick={() => openMonitor(monitor)}><Pencil size={16}/></button><button type="button" className="ui-ib ui-d" aria-label="Eliminar monitoreo" title="Eliminar" onClick={() => { if (window.confirm(`Eliminar el monitoreo ${monitor.name}? Se conservara el historial.`)) void run(() => deleteWorkMonitor(monitor.id)) }}><Trash2 size={16}/></button></div>
            </article>
          })}</div>}
        </section>
        <section><div className="ui-work-heading"><div><h2>Pendientes unicos</h2><p>Tareas por completar, ordenadas por prioridad.</p></div><button type="button" className="ui-cta ui-sm" onClick={() => openTask()}><Plus size={16}/> Nueva tarea</button></div>
          {!pending.length ? <div className="ui-card ui-work-empty"><span className="ui-ic ui-b"><CheckSquare size={20}/></span><strong>Todo al dia</strong><p>No tienes tareas pendientes.</p></div> : <div className="ui-work-list">{pending.map(task => <article className="ui-card ui-work-task" key={task.id}><button type="button" className="ui-ck" aria-label="Marcar como completada" onClick={() => void run(() => completeWorkTask(task.id, true), 'Tarea completada.')}><Check size={14}/></button><div className="ui-task-info"><strong>{task.title}</strong>{task.description && <p>{task.description}</p>}{task.due_at && <small><CalendarDays size={13}/> Limite: {task.due_at}</small>}</div><span className={`ui-pr ui-pr-${task.priority}`}>{task.priority}</span><button type="button" className="ui-ib" aria-label="Editar tarea" onClick={() => openTask(task)}><Pencil size={15}/></button><button type="button" className="ui-ib ui-d" aria-label="Eliminar tarea" onClick={() => { if (window.confirm(`Eliminar ${task.title}?`)) void run(() => deleteWorkTask(task.id)) }}><Trash2 size={15}/></button></article>)}</div>}
        </section>
      </div>
      <section className="ui-work-recent"><div className="ui-work-heading"><div><h2>Actividad reciente</h2><p>Revisiones y tareas completadas.</p></div></div>{!activity.length ? <div className="ui-card ui-work-empty">Todavia no hay actividad reciente.</div> : <div className="ui-card">{activity.map(item => <div className="ui-work-recent-row" key={`${item.kind}:${item.id}`}><span className="ui-ic ui-g">{item.kind === 'review' ? <Clock3 size={17}/> : <Check size={17}/>}</span><div><strong>{item.title}</strong><small>{item.detail} · {formatDateTime(item.at)}</small></div></div>)}</div>}</section>
    </>}
    {monitorModal && <div className="ui-work-backdrop" onClick={() => setMonitorModal(false)}><section className="ui-work-modal" role="dialog" aria-modal="true" aria-labelledby="monitor-dialog-title" onClick={e => e.stopPropagation()}><h2 id="monitor-dialog-title">{editingMonitor ? 'Editar monitoreo' : 'Nuevo monitoreo'}</h2>{field('Nombre', <input autoFocus className={inputClass} value={monitorName} onChange={e => setMonitorName(e.target.value)} placeholder="Ej. Revisar Faxes"/>)}{field('Descripcion opcional', <textarea className={`${inputClass} min-h-[80px]`} value={monitorDescription} onChange={e => setMonitorDescription(e.target.value)}/>)}{field('Intervalo en minutos', <input type="number" min="1" max="10080" className={inputClass} value={monitorInterval} onChange={e => setMonitorInterval(e.target.value)}/>)}<div className="ui-work-modal-actions"><button className="ui-ghost" onClick={() => setMonitorModal(false)}>Cancelar</button><button className="ui-cta" disabled={saving || !monitorName.trim() || !Number.isInteger(Number(monitorInterval)) || Number(monitorInterval) < 1 || Number(monitorInterval) > 10080} onClick={() => void submitMonitor()}><Check size={16}/> Guardar</button></div></section></div>}
    {taskModal && <div className="ui-work-backdrop" onClick={() => setTaskModal(false)}><section className="ui-work-modal" role="dialog" aria-modal="true" aria-labelledby="task-dialog-title" onClick={e => e.stopPropagation()}><h2 id="task-dialog-title">{editingTask ? 'Editar tarea' : 'Nueva tarea'}</h2>{field('Titulo', <input autoFocus className={inputClass} value={taskTitle} onChange={e => setTaskTitle(e.target.value)} placeholder="Ej. Enviar correo al supervisor"/>)}{field('Descripcion opcional', <textarea className={`${inputClass} min-h-[80px]`} value={taskDescription} onChange={e => setTaskDescription(e.target.value)}/>)}<div className="ui-work-form-grid">{field('Prioridad', <select className={inputClass} value={taskPriority} onChange={e => setTaskPriority(e.target.value as TaskPriority)}><option value="alta">Alta</option><option value="media">Media</option><option value="baja">Baja</option></select>)}{field('Fecha limite', <input type="date" className={inputClass} value={taskDue} onChange={e => setTaskDue(e.target.value)}/>)}</div><div className="ui-work-modal-actions"><button className="ui-ghost" onClick={() => setTaskModal(false)}>Cancelar</button><button className="ui-cta" disabled={saving || !taskTitle.trim()} onClick={() => void submitTask()}><Check size={16}/> Guardar</button></div></section></div>}
  </div>
}

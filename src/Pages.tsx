import { ReactNode, useEffect, useRef, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  AlertTriangle,
  Inbox,
  ArrowLeftRight,
  Check,
  Eye,
  EyeOff,
  CheckCircle2,
  Circle,
  Info,
  Pencil,
  Plus,
  Search,
  Target,
  Trash2,
  X,
  CheckSquare,
  ArrowDownLeft,
  ArrowUpRight,
  ChevronRight,
  Flame,
  Bike,
  Fuel,
  Gauge,
  Wrench,
  CalendarDays,
  CircleDollarSign,
  Droplets,
  Tag,
} from 'lucide-react'
import {
  AlertOptions,
  Cartera,
  Meta,
  Mov,
  Store,
  Tarea,
  Habito,
  MotoInfo,
  MantenimientoMoto,
  GastoMoto,
  Tipo,
  Transferencia,
  daysAgo,
  money,
  sum,
  uid,
} from './lib'
import {
  createCartera,
  updateCartera,
  deleteCartera,
} from './services/carteras'
import {
  createCategoria,
  updateCategoria,
  deleteCategoria,
} from './services/categorias'
import {
  createMovimiento,
  updateMovimiento,
  deleteMovimiento,
} from './services/movimientos'
import {
  getTransferencias,
  createTransferencia,
  deleteTransferencia,
} from './services/transferencias'

import {
  getMetas,
  createMeta,
  updateMeta,
  deleteMeta,
} from './services/metas'
import {
  getTareas,
  createTarea,
  updateTarea,
  deleteTarea,
} from './services/tareas'
import {
  createHabito,
  updateHabito,
  deleteHabito,
  marcarHabito,
  desmarcarHabito,
} from './services/habitos'
import { saveMoto, uploadMotoImage, updateMotoImage } from './services/moto'
import { useDashboardData } from './hooks/useDashboardData'
import './styles/dashboard-desktop.css'
import './styles/dashboard-mobile.css'
import './styles/screens.css'
import {
  createMantenimientoMoto,
  updateMantenimientoMoto,
  deleteMantenimientoMoto,
} from './services/mantenimientosMoto'
import {
  createGastoMoto,
  updateGastoMoto,
  deleteGastoMoto,
} from './services/gastosMoto'
import { DashboardMobile } from './dashboard/DashboardMobile'
export { DashboardMobile }

const COLORS = [
  '#70d6a5',
  '#ff7b7b',
  '#7bb6ff',
  '#ffd27b',
  '#c39bff',
  '#ff9f6b',
  '#5ee0e0',
  '#8b9691',
]

const inp = `
  w-full min-h-[42px] rounded-xl
  border border-white/[0.09]
  bg-white/[0.035]
  px-3.5 py-2.5
  text-sm text-ink
  outline-none
  transition-all duration-200
  placeholder:text-mute/50
  hover:border-white/[0.15]
  focus:border-brand/50
  focus:bg-white/[0.05]
  focus:ring-4
  focus:ring-brand/[0.09]
  disabled:cursor-not-allowed disabled:opacity-50
`

const btn = `
  inline-flex items-center gap-2 whitespace-nowrap
  min-h-[42px] rounded-xl
  bg-brand
  px-4 py-2.5
  text-sm font-semibold text-bg
  shadow-[0_1px_0_rgba(255,255,255,0.25)_inset,0_8px_24px_-8px_rgba(112,214,165,0.45)]
  transition-all duration-200
  hover:bg-[#82e0b3]
  hover:shadow-[0_1px_0_rgba(255,255,255,0.3)_inset,0_10px_28px_-8px_rgba(112,214,165,0.55)]
  active:scale-[0.98]
  disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none disabled:hover:bg-brand
`

const btnGhost = `
  inline-flex items-center justify-center gap-2 whitespace-nowrap
  min-h-[42px] rounded-xl
  border border-white/[0.09]
  bg-white/[0.03]
  px-4 py-2.5
  text-sm font-medium text-mute
  transition-all duration-200
  hover:border-white/[0.16] hover:bg-white/[0.06] hover:text-ink
  active:scale-[0.98]
`

const tip = {
  contentStyle: {
    background: 'rgba(16, 21, 24, 0.95)',
    border: '1px solid rgba(255,255,255,0.09)',
    borderRadius: 12,
    color: '#f4f6f5',
    fontSize: 12,
    padding: '8px 12px',
    boxShadow: '0 12px 40px rgba(0,0,0,0.45)',
    backdropFilter: 'blur(14px)',
  },
  labelStyle: { color: '#8f9a95', marginBottom: 4, fontSize: 11 },
  itemStyle: { color: '#f4f6f5', padding: 0 },
  formatter: (v: unknown) => money(Number(v)),
}

const Card = ({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) => (
  <div
    className={`
      relative overflow-hidden
      rounded-2xl
      border border-white/[0.075]
      bg-[linear-gradient(145deg,rgba(255,255,255,0.035),transparent_44%),rgba(16,21,24,0.76)]
      p-5
      shadow-[0_1px_0_rgba(255,255,255,0.045)_inset,0_18px_45px_-28px_rgba(0,0,0,0.9)]
      backdrop-blur-xl
      transition-all duration-300
      hover:-translate-y-0.5 hover:border-brand/20 hover:shadow-[0_22px_55px_-30px_rgba(112,214,165,0.18)]
      ${className}
    `}
  >
    {children}
  </div>
)

const Title = ({
  children,
  right,
}: {
  children: ReactNode
  right?: ReactNode
}) => (
  <div className="app-page-heading mb-6 flex flex-wrap items-center justify-between gap-3">
    <h2 className="min-w-0 text-2xl font-semibold tracking-tight md:text-[28px]">
      {children}
    </h2>
    {right}
  </div>
)

const Empty = ({ t, icon }: { t: string; icon?: ReactNode }) => (
  <div className="flex flex-col items-center gap-3 py-10 text-center">
    <span className="grid h-11 w-11 place-items-center rounded-2xl border border-white/[0.07] bg-white/[0.03] text-mute/70">
      {icon ?? <Inbox size={20} strokeWidth={1.6} />}
    </span>
    <p className="max-w-xs text-sm leading-relaxed text-mute">{t}</p>
  </div>
)

const IconBtn = ({
  onClick,
  children,
  label,
}: {
  onClick: () => void
  children: ReactNode
  label?: string
}) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={label}
    title={label}
    className="
      grid h-9 w-9 place-items-center
      rounded-lg
      text-mute
      transition-all duration-200
      hover:bg-white/[0.07]
      hover:text-ink
      active:scale-95
    "
  >
    {children}
  </button>
)

function Modal({
  title,
  onClose,
  children,
  position = 'bottom',
}: {
  title: string
  onClose: () => void
  children: ReactNode
  position?: 'bottom' | 'center' | 'raised' | 'lower' | 'top'
}) {
  const centered = position !== 'bottom'
  const verticalPosition = position === 'top'
    ? 'items-start px-4 pt-[calc(6rem+env(safe-area-inset-top))] pb-4 md:items-center md:p-4'
    : position === 'lower'
      ? 'items-center px-4 pt-[calc(20rem+env(safe-area-inset-top))] pb-4 md:items-center md:p-4'
      : centered
        ? `items-center px-4 pt-4 ${position === 'raised' ? 'pb-12' : 'pb-4'} md:items-center md:p-4`
        : 'items-end p-0 pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] md:items-center md:p-4'

  return (
    <div
      className={`
        animate-fade
        fixed inset-0 z-50
        flex justify-center
        ${verticalPosition}
        bg-black/70
        backdrop-blur-sm
      `}
      onClick={onClose}
    >
      <div
        className={`
          animate-modal-enter
          max-h-[92dvh] w-full max-w-md
          overflow-y-auto
          ${centered ? 'rounded-2xl' : 'rounded-t-3xl'} border border-white/[0.09]
          bg-surface/95
          p-5 ${centered ? 'pb-5' : 'pb-[calc(1.5rem+env(safe-area-inset-bottom))]'}
          shadow-[0_24px_90px_rgba(0,0,0,0.55)]
          backdrop-blur-2xl
          md:rounded-2xl md:pb-5
        `}
        onClick={e => e.stopPropagation()}
      >
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-white/[0.12] sm:hidden" />
        <div className="mb-5 flex items-center justify-between gap-3">
          <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
          <IconBtn onClick={onClose} label="Cerrar">
            <X size={18} />
          </IconBtn>
        </div>
        {children}
      </div>
    </div>
  )
}

export function AlertModal({
  alert,
  onClose,
}: {
  alert: AlertOptions
  onClose: () => void
}) {
  const variant = alert.variant ?? 'info'

  const styles = {
    info: {
      icon: <Info size={22} />,
      iconClass: 'bg-brand/[0.08] text-brand',
      buttonClass: btn,
    },
    warning: {
      icon: <AlertTriangle size={22} />,
      iconClass: 'bg-[#ffd27b]/[0.08] text-[#ffd27b]',
      buttonClass: `
        inline-flex min-h-[42px] items-center justify-center gap-2
        rounded-xl
        bg-[#ffd27b]
        px-4 py-2.5
        text-sm font-semibold text-bg
        transition-all duration-200
        hover:bg-[#ffda91]
        active:scale-[0.98]
      `,
    },
    danger: {
      icon: <Trash2 size={21} />,
      iconClass: 'bg-neg/[0.08] text-neg',
      buttonClass: `
        inline-flex min-h-[42px] items-center justify-center gap-2
        rounded-xl
        bg-neg
        px-4 py-2.5
        text-sm font-semibold text-bg
        transition-all duration-200
        hover:bg-[#ff8b8b]
        active:scale-[0.98]
      `,
    },
  }[variant]

  const confirm = () => {
    alert.onConfirm?.()
    onClose()
  }

  return (
    <div
      className="
        animate-fade
        fixed inset-0 z-[60]
        grid place-items-center
        bg-black/75 p-4
        backdrop-blur-sm
      "
      onClick={onClose}
    >
      <div
        className="
          animate-pop
          w-full max-w-sm
          overflow-hidden
          rounded-2xl
          border border-white/[0.08]
          bg-[#111619]/95
          p-5
          shadow-[0_20px_80px_rgba(0,0,0,0.5)]
          backdrop-blur-2xl
        "
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-start gap-3">
          <div
            className={`
              grid h-10 w-10
              shrink-0
              place-items-center
              rounded-xl
              ${styles.iconClass}
            `}
          >
            {styles.icon}
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-semibold tracking-tight">
              {alert.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-mute">
              {alert.message}
            </p>
          </div>

          <IconBtn onClick={onClose}>
            <X size={18} />
          </IconBtn>
        </div>

        <div className="mt-6 flex gap-2">
          {alert.onConfirm ? (
            <>
              <button className={`${btnGhost} flex-1`} onClick={onClose}>
                {alert.cancelText ?? 'Cancelar'}
              </button>
              <button
                className={`${styles.buttonClass} flex-1`}
                onClick={confirm}
              >
                {alert.confirmText ?? 'Confirmar'}
              </button>
            </>
          ) : (
            <button
              className={`${styles.buttonClass} w-full`}
              onClick={onClose}
            >
              {alert.confirmText ?? 'Entendido'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

const Field = ({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) => (
  <label className="block text-xs text-mute">
    <span className="mb-1.5 block font-medium tracking-wide">{label}</span>
    {children}
  </label>
)

const byCat = (ms: Mov[]) => {
  const o: Record<string, number> = {}

  ms
    .filter(m => m.tipo === 'gasto')
    .forEach(m => (o[m.cat] = (o[m.cat] || 0) + m.monto))

  return Object.entries(o)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
}

function CatChart({
  ms,
  data: sharedData,
}: {
  ms: Mov[]
  data?: { name: string; value: number }[]
}) {
  const data = sharedData ?? byCat(ms)

  if (!data.length) {
    return <Empty t="Aún no hay gastos para graficar." />
  }

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row">
      <div className="h-48 w-48 shrink-0">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              innerRadius={50}
              outerRadius={85}
              paddingAngle={2}
              cornerRadius={4}
              stroke="none"
            >
              {data.map((_, i) => (
                <Cell
                  key={i}
                  fill={COLORS[i % COLORS.length]}
                />
              ))}
            </Pie>

            <Tooltip {...tip} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <ul className="w-full space-y-2 text-sm">
        {data.map((d, i) => (
          <li
            key={d.name}
            className="
              flex items-center justify-between
              rounded-lg px-2 py-1.5
              transition-colors
              hover:bg-white/[0.025]
            "
          >
            <span className="flex items-center gap-2">
              <i
                className="h-2.5 w-2.5 rounded-full"
                style={{
                  background: COLORS[i % COLORS.length],
                  boxShadow: `0 0 8px ${COLORS[i % COLORS.length]}55`,
                }}
              />

              {d.name}
            </span>

            <span className="text-mute">{money(d.value)}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function MovRow({
  m,
  s,
  actions,
}: {
  m: Mov
  s: Store
  actions?: boolean
}) {
  const w = s.carts.find(c => c.id === m.cartera)

  return (
    <div
      className="
      group
      flex items-center gap-3
      rounded-xl
      border border-transparent
      px-3 py-3
      transition-all duration-200
      hover:border-white/[0.045]
      hover:bg-white/[0.025]
      "
    >
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{m.desc}</p>

        <p className="truncate text-xs text-mute">
          {m.fecha} · {m.cat} · {w?.nombre ?? 'Sin cartera'}
        </p>
      </div>

      <span
        className={`
          rounded-lg
          px-2.5 py-1
          text-sm font-semibold
          ${m.tipo === 'ingreso'
            ? 'bg-brand/[0.07] text-brand'
            : 'bg-neg/[0.07] text-neg'
          }
          `}
      >
        {m.tipo === 'ingreso' ? '+' : '-'}
        {money(m.monto)}
      </span>

      {actions && (
        <div className="flex opacity-70 transition-opacity group-hover:opacity-100">
          <IconBtn onClick={() => s.openMov(m)}>
            <Pencil size={16} />
          </IconBtn>

          <IconBtn
            onClick={() =>
              s.showAlert({
                title: 'Eliminar movimiento',
                message:
                  '¿Estás seguro de que quieres eliminar este movimiento? Esta acción no se puede deshacer.',
                variant: 'danger',
                confirmText: 'Eliminar',
                onConfirm: async () => {
                  try {
                    await deleteMovimiento(m.id)

                    s.setMovs(
                      s.movs.filter(
                        x => x.id !== m.id
                      )
                    )
                  } catch (error) {
                    console.error(
                      'Error eliminando movimiento:',
                      error
                    )

                    s.showAlert({
                      title: 'Error',
                      message:
                        'No se pudo eliminar el movimiento de Supabase.',
                      variant: 'danger',
                      confirmText: 'Entendido',
                    })
                  }
                },
              })
            }
          >
            <Trash2 size={16} />
          </IconBtn>
        </div>
      )}
    </div>
  )
}

const sorted = (ms: Mov[]) =>
  [...ms].sort((a, b) => b.fecha.localeCompare(a.fecha))

export function Dashboard({ s, onNavigate }: { s: Store; onNavigate?: (page: 'habitos' | 'tareas' | 'moto' | 'movs') => void }) {
  const [hide, setHide] = useState(false)
  const [hovered, setHovered] = useState<number | null>(null)
  const [categoryHover, setCategoryHover] = useState<string | null>(null)
  const { saludo, fechaActual, total, ingresosMes, gastosMes, balanceMes, pendientes, habitosDeHoy, completadosHoy, completadosProgramados, progresoHabitos, rachaActual, formatFecha, movimientosRecientes, categorias, balanceHistory } = useDashboardData(s)
  const mask = (n: number) => hide ? '$ ••••••' : money(n)
  const values = balanceHistory.map(p => p.value)
  const min = Math.min(...values), max = Math.max(...values)
  const points = balanceHistory.map((p, i) => ({ x: i / Math.max(values.length - 1, 1) * 600, y: 130 - (p.value - min) / (max - min || 1) * 110 }))
  const line = points.map((p, i) => `${i ? 'L' : 'M'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ')
  const totalMes = ingresosMes + gastosMes
  const pctIngresos = totalMes ? Math.round(ingresosMes / totalMes * 100) : 0
  const colores = ['#70d6a5', '#3fa37a', '#9fe8c4', '#2f7d5c', '#56615b', '#ffd27b', '#7bb6ff']
  const sumaCategorias = categorias.reduce((a, c) => a + c.value, 0)
  const circ = 2 * Math.PI * 56
  let off = 0
  const segmentos = categorias.map((c, i) => { const len = sumaCategorias ? c.value / sumaCategorias * circ : 0; const seg = { ...c, color: colores[i % colores.length], len, off }; off += len; return seg })

  return <div className="dk-dashboard"><div className="dk-wrap">
    <header className="dk-head dk-in" style={{ '--i': 1 } as React.CSSProperties}><div><p>{fechaActual}</p><h1>{saludo}, Joseph</h1></div><button className="dk-cta" onClick={() => s.openMov()}><Plus size={16} />Nuevo movimiento</button></header>
    <section className="dk-grid dk-hero">
      <div className="dk-card dk-balance dk-in" style={{ '--i': 2 } as React.CSSProperties}>
        <div className="dk-top"><div><h2>Balance total</h2><p className="dk-sub">Carteras incluidas en tu balance</p></div><button className="dk-eye" aria-label={hide ? 'Mostrar montos' : 'Ocultar montos'} aria-pressed={hide} onClick={() => setHide(v => !v)}>{hide ? <EyeOff size={18} /> : <Eye size={18} />}</button></div>
        <div className={`dk-big${hide ? ' dk-hid' : ''}`}>{mask(total)}</div><span className={`dk-pill${balanceMes < 0 ? ' dk-n' : ''}`}>Balance del mes <b>{mask(balanceMes)}</b></span>
        <div className="dk-chart" onPointerMove={e => { const r = e.currentTarget.getBoundingClientRect(); setHovered(Math.round(Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)) * Math.max(points.length - 1, 0))) }} onPointerLeave={() => setHovered(null)}>
          <svg viewBox="0 0 600 140" preserveAspectRatio="none" aria-label="Evolución del balance en los últimos 30 días"><defs><linearGradient id="dk-chart-gradient" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#70d6a5" stopOpacity=".28" /><stop offset="1" stopColor="#70d6a5" stopOpacity="0" /></linearGradient></defs><path className="dk-area" d={`${line} L600 140 L0 140Z`} fill="url(#dk-chart-gradient)" /><path className="dk-line" d={line} pathLength="1" vectorEffect="non-scaling-stroke" />{hovered !== null && points[hovered] && <><line className="dk-guide" x1={points[hovered].x} x2={points[hovered].x} y1="0" y2="140" /><circle className="dk-dot" cx={points[hovered].x} cy={points[hovered].y} r="4" /></>}</svg>
          {hovered !== null && <div className="dk-tt" style={{ left: `${hovered / Math.max(points.length - 1, 1) * 100}%` }}>{formatFecha(balanceHistory[hovered]?.date)}, {mask(balanceHistory[hovered]?.value ?? 0)}</div>}
        </div>
      </div>
      <div className="dk-card dk-flow dk-in" style={{ '--i': 3 } as React.CSSProperties}><div><h2>Este mes</h2><p className="dk-sub">Cómo se reparte tu dinero</p></div><div className="dk-stat"><span className="dk-ic dk-g"><ArrowDownLeft size={19} /></span><div><span>Ingresos</span><b>{mask(ingresosMes)}</b></div></div><div className="dk-stat"><span className="dk-ic dk-r"><ArrowUpRight size={19} /></span><div><span>Gastos</span><b>{mask(gastosMes)}</b></div></div><div><div className="dk-split"><i style={{ width: `${pctIngresos}%` }} /></div><div className="dk-splitl"><span>{pctIngresos}% ingresos</span><span>{100 - pctIngresos}% gastos</span></div></div></div>
    </section>
    <section className="dk-wallets">{s.carts.length ? s.carts.map((c, i) => <div key={c.id} className="dk-card dk-w dk-in" style={{ '--i': 4 + i * .4 } as React.CSSProperties}><div className="dk-r"><span>{c.nombre}</span><i className={`dk-d${c.incluirEnTotal ? '' : ' dk-off'}`} /></div><b>{mask(s.saldo(c.id))}</b><small>{c.incluirEnTotal ? 'Incluida en el balance' : 'Fuera del balance'}</small></div>) : <div className="dk-card">Todavía no tienes carteras.</div>}</section>
    <section className="dk-grid dk-two">
      <div className="dk-card dk-in" style={{ '--i': 5 } as React.CSSProperties}><div className="dk-card-head"><div><h2>Hábitos de hoy</h2><p className="dk-sub">Marca cada uno al completarlo</p></div><span className="dk-ic dk-y"><Flame size={19} /></span></div><div className="dk-ringrow"><div className="dk-ring"><svg viewBox="0 0 104 104"><circle className="dk-bg" cx="52" cy="52" r="46" /><circle className="dk-fg" cx="52" cy="52" r="46" strokeDasharray="289" strokeDashoffset={289 * (1 - progresoHabitos / 100)} /></svg><div>{completadosProgramados}/{habitosDeHoy.length}</div></div><div className="dk-list">{habitosDeHoy.length ? habitosDeHoy.map(h => <button key={h.id} className={`dk-item${completadosHoy.has(h.id) ? ' dk-done' : ''}`} onClick={() => onNavigate?.('habitos')}><span className="dk-chk"><Check size={12} /></span><span className="dk-t">{h.nombre}</span></button>) : <p className="dk-sub">No hay hábitos programados para hoy.</p>}</div></div><p className="dk-streak"><Flame size={14} />Racha más alta: <b>{rachaActual} {rachaActual === 1 ? 'día' : 'días'}</b></p></div>
      <div className="dk-card dk-in" style={{ '--i': 6 } as React.CSSProperties}><div className="dk-card-head"><div><h2>Tareas pendientes</h2><p className="dk-sub">{pendientes.length ? `${pendientes.length} pendientes` : 'Todo al día'}</p></div><span className="dk-ic dk-g"><CheckSquare size={19} /></span></div><div className="dk-list" style={{ marginTop: 14 }}>{pendientes.length ? pendientes.slice(0, 4).map(t => <button key={t.id} className="dk-item" onClick={() => onNavigate?.('tareas')}><span className="dk-chk"><Circle size={12} /></span><span className="dk-t">{t.titulo}</span>{t.prioridad !== 'baja' && <span className={`dk-tag dk-${t.prioridad}`}>{t.prioridad}</span>}</button>) : <p className="dk-sub">No tienes tareas pendientes.</p>}</div></div>
    </section>
    <section className="dk-grid dk-bottom"><div className="dk-card dk-in" style={{ '--i': 7 } as React.CSSProperties}><h2>Movimientos recientes</h2><p className="dk-sub">Tus últimos registros</p><div style={{ marginTop: 8 }}>{movimientosRecientes.length ? movimientosRecientes.map(m => { const c = s.carts.find(x => x.id === m.cartera); const ing = m.tipo === 'ingreso'; return <div key={m.id} className="dk-mv"><span className={`dk-ic ${ing ? 'dk-g' : 'dk-r'}`}>{ing ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}</span><div className="dk-m"><p>{m.desc}</p><span>{formatFecha(m.fecha)}, {m.cat}{c ? `, ${c.nombre}` : ''}</span></div><span className={`dk-amt ${ing ? 'dk-p' : 'dk-n'}`}>{ing ? '+' : '−'}{mask(m.monto)}</span></div> }) : <p className="dk-sub">Sin movimientos todavía. Registra el primero.</p>}</div></div>
      <div className="dk-card dk-in" style={{ '--i': 8 } as React.CSSProperties}><h2>Gastos por categoría</h2><p className="dk-sub">Distribución de tus gastos</p>{segmentos.length ? <div className="dk-donut"><svg viewBox="0 0 150 150" className={categoryHover ? 'dk-f' : ''} onPointerLeave={() => setCategoryHover(null)}><circle cx="75" cy="75" r="56" stroke="var(--dk-raise)" strokeWidth="16" fill="none" />{segmentos.map(x => <circle key={x.name} className={categoryHover === x.name ? 'dk-hl' : ''} onPointerEnter={() => setCategoryHover(x.name)} cx="75" cy="75" r="56" stroke={x.color} strokeWidth="16" fill="none" strokeDasharray={`${Math.max(0, x.len - 3)} ${circ}`} strokeDashoffset={-x.off} />)}</svg><div className="dk-leg">{segmentos.slice(0, 6).map(x => <div key={x.name} onPointerEnter={() => setCategoryHover(x.name)} onPointerLeave={() => setCategoryHover(null)}><i style={{ background: x.color }} />{x.name}<em>{Math.round(x.value / sumaCategorias * 100)}%</em></div>)}</div></div> : <p className="dk-sub">Aún no hay gastos para mostrar.</p>}</div></section>
    <section className="dk-card dk-in" style={{ '--i': 9 } as React.CSSProperties}><div className="dk-moto"><div className="dk-mimg">{s.moto?.imagenUrl ? <img src={s.moto.imagenUrl} alt={s.moto.nombre} /> : <Bike size={42} />}</div><div className="dk-info"><h3>{s.moto?.nombre ?? 'Mi moto'}</h3><p className="dk-sub">{s.moto ? `${s.moto.marca}, ${s.moto.anio}` : 'Datos de tu motocicleta'}</p>{s.moto ? <div className="dk-facts"><span><b>{s.moto.kilometrajeActual.toLocaleString('es-CO')} km</b> recorridos</span><span>Último cambio de aceite <b>{formatFecha(s.moto.fechaUltimoCambioAceite)}</b></span></div> : <div className="dk-facts">Aún no hay información registrada.</div>}</div><button className="dk-ghost" onClick={() => onNavigate?.('moto')}>Ver moto <ChevronRight size={15} /></button></div></section>
  </div></div>
}


const etiquetaDia = (fecha: string) => {
  const f = fecha.slice(0, 10)
  if (f === daysAgo(0)) return 'Hoy'
  if (f === daysAgo(1)) return 'Ayer'
  const [y, m, d] = f.split('-').map(Number)
  return new Intl.DateTimeFormat('es-CO', {
    day: 'numeric',
    month: 'short',
    year: y !== new Date().getFullYear() ? 'numeric' : undefined,
  }).format(new Date(y, m - 1, d))
}

// ───────────────────────────────── MovModal ─────────────────────────────────

export function MovModal({
  s,
  mov,
  onSave,
  onClose,
}: {
  s: Store
  mov?: Mov
  onSave: (m: Mov) => void
  onClose: () => void
}) {
  const [f, setF] = useState<Mov>(
    mov ?? {
      id: uid(),
      desc: '',
      tipo: 'gasto',
      monto: 0,
      fecha: daysAgo(0),
      cat: s.cats[0] ?? '',
      cartera: undefined,
    }
  )

  const up = (p: Partial<Mov>) => setF({ ...f, ...p })

  const ok = f.desc.trim() && f.monto > 0 && f.fecha

  return (
    <Modal
      title={mov && s.movs.some(x => x.id === mov.id) ? 'Editar movimiento' : 'Nuevo movimiento'}
      onClose={onClose}
    >
      <div className="space-y-4">
        <div
          className={`ui-seg ${f.tipo === 'ingreso' ? 'ui-seg-in' : ''}`}
          role="group"
          aria-label="Tipo de movimiento"
        >
          <i />
          {(['gasto', 'ingreso'] as Tipo[]).map(t => (
            <button
              key={t}
              type="button"
              className={f.tipo === t ? 'ui-on' : ''}
              aria-pressed={f.tipo === t}
              onClick={() => up({ tipo: t })}
            >
              {t === 'gasto' ? 'Gasto' : 'Ingreso'}
            </button>
          ))}
        </div>

        <label className="ui-amount-wrap">
          <span className="ui-cur">$</span>
          <input
            className="ui-amount"
            type="number"
            inputMode="numeric"
            min={0}
            placeholder="0"
            aria-label="Monto"
            value={f.monto || ''}
            onChange={e => up({ monto: Number(e.target.value) })}
          />
        </label>

        <Field label="Descripción">
          <input
            className={inp}
            value={f.desc}
            onChange={e => up({ desc: e.target.value })}
          />
        </Field>

        <div className="ui-form-2col">
          <Field label="Fecha">
            <input
              className={inp}
              type="date"
              value={f.fecha}
              onChange={e => up({ fecha: e.target.value })}
            />
          </Field>

          <Field label="Cartera (opcional)">
            <select
              className={inp}
              value={f.cartera ?? ''}
              onChange={e => up({ cartera: e.target.value || undefined })}
            >
              <option value="">Sin cartera</option>
              {s.carts.map(c => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <Field label="Categoría">
          <select
            className={inp}
            value={f.cat}
            onChange={e => up({ cat: e.target.value })}
          >
            {!s.cats.includes(f.cat) && f.cat && <option>{f.cat}</option>}
            {s.cats.map(c => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </Field>

        <button
          disabled={!ok}
          className={`${btn} w-full justify-center`}
          onClick={() => onSave({ ...f, desc: f.desc.trim() })}
        >
          Guardar
        </button>
      </div>
    </Modal>
  )
}

// ──────────────────────────────── Movimientos ────────────────────────────────

export function Movimientos({ s }: { s: Store }) {
  const [q, setQ] = useState('')
  const [tipo, setTipo] = useState('')
  const [cat, setCat] = useState('')
  const [cart, setCart] = useState('')
  const [modoFecha, setModoFecha] = useState<'ninguno' | 'dia' | 'rango'>('ninguno')
  const [fechaDesde, setFechaDesde] = useState('')
  const [fechaHasta, setFechaHasta] = useState('')
  const [abierto, setAbierto] = useState<string | null>(null)

  const list = sorted(s.movs).filter(
    m =>
      m.desc.toLowerCase().includes(q.toLowerCase()) &&
      (!tipo || m.tipo === tipo) &&
      (!cat || m.cat === cat) &&
      (!cart ||
        (cart === 'none'
          ? !m.cartera
          : m.cartera === cart)) &&
      (modoFecha === 'ninguno' ||
        (modoFecha === 'dia'
          ? !!fechaDesde && m.fecha.slice(0, 10) === fechaDesde
          : (!fechaDesde || m.fecha.slice(0, 10) >= fechaDesde) &&
          (!fechaHasta || m.fecha.slice(0, 10) <= fechaHasta) &&
          (!!fechaDesde || !!fechaHasta)))
  )

  const ingresosFiltrados = sum(list, 'ingreso')
  const gastosFiltrados = sum(list, 'gasto')
  const balanceFiltrado = ingresosFiltrados - gastosFiltrados
  const filtrado = list.length !== s.movs.length

  const cambiarModoFecha = (nuevoModo: typeof modoFecha) => {
    setModoFecha(nuevoModo)
    if (nuevoModo === 'ninguno') {
      setFechaDesde('')
      setFechaHasta('')
    }
  }

  const eliminar = (m: Mov) =>
    s.showAlert({
      title: 'Eliminar movimiento',
      message:
        '¿Estás seguro de que quieres eliminar este movimiento? Esta acción no se puede deshacer.',
      variant: 'danger',
      confirmText: 'Eliminar',
      onConfirm: async () => {
        try {
          await deleteMovimiento(m.id)
          s.setMovs(s.movs.filter(x => x.id !== m.id))
        } catch (error) {
          console.error('Error eliminando movimiento:', error)
          s.showAlert({
            title: 'Error',
            message: 'No se pudo eliminar el movimiento de Supabase.',
            variant: 'danger',
            confirmText: 'Entendido',
          })
        }
      },
    })

  // list ya viene ordenada por fecha descendente: los días quedan contiguos.
  const grupos: { fecha: string; items: Mov[] }[] = []
  list.forEach(m => {
    const f = m.fecha.slice(0, 10)
    const ultimo = grupos[grupos.length - 1]
    if (ultimo && ultimo.fecha === f) ultimo.items.push(m)
    else grupos.push({ fecha: f, items: [m] })
  })

  return (
    <div className="ui-screen app-view app-view--movimientos">
      <header className="ui-head">
        <div>
          <h1 className="ui-title">Movimientos</h1>
          <p className="ui-sub">
            {list.length} {list.length === 1 ? 'movimiento' : 'movimientos'}
          </p>
        </div>
        <button className="ui-cta" onClick={() => s.openMov()}>
          <Plus size={17} /> Nuevo
        </button>
      </header>

      <div className="ui-sum" aria-live="polite">
        <div className="ui-card">
          <small>Ingresos{filtrado ? ' filtrados' : ''}</small>
          <b style={{ color: 'var(--ui-brand)' }}>{money(ingresosFiltrados)}</b>
        </div>
        <div className="ui-card">
          <small>Egresos{filtrado ? ' filtrados' : ''}</small>
          <b style={{ color: 'var(--ui-neg)' }}>{money(gastosFiltrados)}</b>
        </div>
        <div className="ui-card">
          <small>Balance{filtrado ? ' filtrado' : ''}</small>
          <b style={{ color: balanceFiltrado >= 0 ? 'var(--ui-brand)' : 'var(--ui-neg)' }}>
            {money(balanceFiltrado)}
          </b>
        </div>
      </div>

      <div className="ui-tools">
        <label className="ui-srch">
          <Search size={18} />
          <input
            className="ui-in"
            placeholder="Buscar movimiento"
            aria-label="Buscar movimiento"
            value={q}
            onChange={e => setQ(e.target.value)}
          />
        </label>

        <div className="ui-chips" role="group" aria-label="Filtrar por tipo">
          {([['', 'Todos'], ['ingreso', 'Ingresos'], ['gasto', 'Gastos']] as const).map(([v, l]) => (
            <button
              key={v}
              type="button"
              className={`ui-chip ${tipo === v ? 'ui-on' : ''}`}
              onClick={() => setTipo(v)}
            >
              {l}
            </button>
          ))}
        </div>

        <div className="ui-chips" role="group" aria-label="Filtrar por categoría">
          <button
            type="button"
            className={`ui-chip ${cat === '' ? 'ui-on' : ''}`}
            onClick={() => setCat('')}
          >
            Todas las categorías
          </button>
          {s.cats.map(c => (
            <button
              key={c}
              type="button"
              className={`ui-chip ${cat === c ? 'ui-on' : ''}`}
              onClick={() => setCat(c)}
            >
              {c}
            </button>
          ))}
        </div>

        <select
          className="ui-in ui-select"
          aria-label="Filtrar por cartera"
          value={cart}
          onChange={e => setCart(e.target.value)}
        >
          <option value="">Todas las carteras</option>
          <option value="none">Sin cartera</option>
          {s.carts.map(c => (
            <option key={c.id} value={c.id}>
              {c.nombre}
            </option>
          ))}
        </select>

        <div className="ui-chips" role="group" aria-label="Filtrar por fecha">
          {([['ninguno', 'Todas las fechas'], ['dia', 'Un día'], ['rango', 'Rango de fechas']] as const).map(([v, l]) => (
            <button
              key={v}
              type="button"
              className={`ui-chip ${modoFecha === v ? 'ui-on' : ''}`}
              onClick={() => cambiarModoFecha(v)}
            >
              {l}
            </button>
          ))}
        </div>

        {modoFecha === 'dia' && (
          <input
            className="ui-in"
            type="date"
            aria-label="Día de los movimientos"
            value={fechaDesde}
            onChange={e => setFechaDesde(e.target.value)}
          />
        )}

        {modoFecha === 'rango' && (
          <div className="ui-dates">
            <label>
              <span>Desde</span>
              <input
                className="ui-in"
                type="date"
                aria-label="Fecha inicial del rango"
                value={fechaDesde}
                onChange={e => setFechaDesde(e.target.value)}
              />
            </label>
            <label>
              <span>Hasta</span>
              <input
                className="ui-in"
                type="date"
                aria-label="Fecha final del rango"
                value={fechaHasta}
                onChange={e => setFechaHasta(e.target.value)}
              />
            </label>
          </div>
        )}
      </div>

      {list.length ? (
        grupos.map(g => {
          const neto = g.items.reduce(
            (a, m) => a + (m.tipo === 'ingreso' ? m.monto : -m.monto),
            0
          )
          return (
            <section key={g.fecha}>
              <div className="ui-dayh">
                <span>{etiquetaDia(g.fecha)}</span>
                <span>{money(neto)}</span>
              </div>

              {g.items.map(m => {
                const ing = m.tipo === 'ingreso'
                const cartera = s.carts.find(c => c.id === m.cartera)
                const open = abierto === m.id
                return (
                  <div key={m.id} className="ui-row">
                    <button
                      type="button"
                      className="ui-rowbtn"
                      aria-expanded={open}
                      onClick={() => setAbierto(open ? null : m.id)}
                    >
                      <span className={`ui-ic ${ing ? 'ui-g' : 'ui-r'}`}>
                        {ing ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
                      </span>
                      <span className="ui-m">
                        <span className="ui-t">{m.desc}</span>
                        <small>
                          <span className="ui-tag">{m.cat}</span>
                          {cartera?.nombre ?? 'Sin cartera'}
                        </small>
                      </span>
                      <span className={`ui-amt ${ing ? 'ui-p' : 'ui-n'}`}>
                        {ing ? '+' : '−'}
                        {money(m.monto)}
                      </span>
                    </button>

                    {open && (
                      <div className="ui-acts">
                        <button
                          type="button"
                          className="ui-ib"
                          aria-label="Editar movimiento"
                          title="Editar"
                          onClick={() => s.openMov(m)}
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          type="button"
                          className="ui-ib ui-d"
                          aria-label="Eliminar movimiento"
                          title="Eliminar"
                          onClick={() => eliminar(m)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                )
              })}
            </section>
          )
        })
      ) : (
        <div className="ui-card">
          <div className="ui-empty">
            <span className="ui-ic ui-y">
              <Inbox size={20} />
            </span>
            No hay movimientos con esos filtros.
          </div>
        </div>
      )}
    </div>
  )
}
export function TransferModal({
  s,
  onSave,
  onClose,
}: {
  s: Store
  onSave: (t: Transferencia) => void
  onClose: () => void
}) {
  const [f, setF] = useState<Transferencia>({
    id: uid(),
    desde: s.carts[0]?.id ?? '',
    hacia: s.carts[1]?.id ?? s.carts[0]?.id ?? '',
    monto: 0,
    fecha: daysAgo(0),
  })

  const up = (p: Partial<Transferencia>) =>
    setF({ ...f, ...p })

  const ok =
    f.desde &&
    f.hacia &&
    f.desde !== f.hacia &&
    f.monto > 0 &&
    f.fecha

  return (
    <Modal
      title="Nueva transferencia"
      onClose={onClose}
    >
      <div className="space-y-3">

        <Field label="Desde">
          <select
            className={inp}
            value={f.desde}
            onChange={e =>
              up({ desde: e.target.value })
            }
          >
            {s.carts.map(c => (
              <option
                key={c.id}
                value={c.id}
              >
                {c.nombre}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Hacia">
          <select
            className={inp}
            value={f.hacia}
            onChange={e =>
              up({ hacia: e.target.value })
            }
          >
            {s.carts.map(c => (
              <option
                key={c.id}
                value={c.id}
              >
                {c.nombre}
              </option>
            ))}
          </select>
        </Field>

        {f.desde === f.hacia && (
          <p className="text-xs text-neg">
            La cartera de origen y destino deben ser diferentes.
          </p>
        )}

        <div className="ui-form-2col">
          <Field label="Monto">
            <input
              className={inp}
              type="number"
              min={0}
              value={f.monto || ''}
              onChange={e =>
                up({
                  monto: Number(e.target.value),
                })
              }
            />
          </Field>

          <Field label="Fecha">
            <input
              className={inp}
              type="date"
              value={f.fecha}
              onChange={e =>
                up({
                  fecha: e.target.value,
                })
              }
            />
          </Field>
        </div>

        <div className="
          rounded-xl
          border border-white/[0.05]
          bg-white/[0.02]
          p-3
        ">
          <p className="text-xs text-mute">
            Esta operación moverá dinero entre
            carteras sin registrarlo como ingreso
            ni gasto.
          </p>
        </div>

        <button
          disabled={!ok}
          className={`
            ${btn}
            w-full
            justify-center
            disabled:cursor-not-allowed
            disabled:opacity-40
            disabled:shadow-none
          `}
          onClick={() =>
            onSave({
              ...f,
              id: uid(),
            })
          }
        >
          Transferir
        </button>
      </div>
    </Modal>
  )
}

// ───────────────────────────────── Carteras ─────────────────────────────────

export function Carteras({ s }: { s: Store }) {
  const [edit, setEdit] = useState<Cartera | null>(null)
  const [transferOpen, setTransferOpen] = useState(false)

  const isNew =
    edit && !s.carts.some(c => c.id === edit.id)

  const total = s.carts
    .filter(c => c.incluirEnTotal)
    .reduce((a, c) => a + s.saldo(c.id), 0)

  const save = async () => {
    if (!edit || !edit.nombre.trim()) return

    try {
      if (isNew) {
        const nueva = await createCartera({
          nombre: edit.nombre.trim(),
          saldoInicial: edit.saldoInicial,
          incluirEnTotal: edit.incluirEnTotal,
        })

        s.setCarts([...s.carts, nueva])
      } else {
        const actualizada = await updateCartera(edit)

        s.setCarts(
          s.carts.map(c =>
            c.id === actualizada.id ? actualizada : c
          )
        )
      }

      setEdit(null)
    } catch (error) {
      console.error('Error guardando cartera:', error)

      s.showAlert({
        title: 'Error',
        message: 'No se pudo guardar la cartera en Supabase.',
        variant: 'danger',
        confirmText: 'Entendido',
      })
    }
  }

  const remove = (c: Cartera) => {
    s.showAlert({
      title: 'Eliminar cartera',
      message:
        `¿Estás seguro de que quieres eliminar "${c.nombre}"? ` +
        'Sus movimientos quedarán sin cartera y las transferencias relacionadas serán eliminadas.',
      variant: 'danger',
      confirmText: 'Eliminar',
      onConfirm: async () => {
        try {
          await deleteCartera(c.id)

          s.setMovs(
            s.movs.map(m =>
              m.cartera === c.id ? { ...m, cartera: undefined } : m
            )
          )

          try {
            await deleteTransferencia(c.id)

            s.setTransfers(
              s.transfers.filter(t => t.id !== c.id)
            )
          } catch (error) {
            console.error('Error eliminando transferencia:', error)

            s.showAlert({
              title: 'Error',
              message: 'No se pudo eliminar la transferencia de Supabase.',
              variant: 'danger',
              confirmText: 'Entendido',
            })
          }

          s.setCarts(s.carts.filter(x => x.id !== c.id))
        } catch (error) {
          console.error('Error eliminando cartera:', error)

          s.showAlert({
            title: 'Error',
            message: 'No se pudo eliminar la cartera de Supabase.',
            variant: 'danger',
            confirmText: 'Entendido',
          })
        }
      },
    })
  }

  const saveTransfer = async (t: Transferencia) => {
    const saldoOrigen = s.saldo(t.desde)

    if (t.monto > saldoOrigen) {
      const cartera = s.carts.find(c => c.id === t.desde)

      s.showAlert({
        title: 'Saldo insuficiente',
        message:
          `No puedes transferir ${money(t.monto)}. ` +
          `La cartera "${cartera?.nombre ?? 'de origen'}" ` +
          `solo tiene ${money(saldoOrigen)} disponible.`,
        variant: 'warning',
        confirmText: 'Entendido',
      })

      return
    }
    try {
      const nueva = await createTransferencia(t)

      s.setTransfers([nueva, ...s.transfers])

      setTransferOpen(false)
    } catch (error) {
      console.error('Error creando transferencia:', error)

      s.showAlert({
        title: 'Error',
        message: 'No se pudo guardar la transferencia en Supabase.',
        variant: 'danger',
        confirmText: 'Entendido',
      })
    }
  }

  const toggleIncluir = async (c: Cartera) => {
    const actualizada = { ...c, incluirEnTotal: !c.incluirEnTotal }

    try {
      const resultado = await updateCartera(actualizada)

      s.setCarts(
        s.carts.map(x => (x.id === resultado.id ? resultado : x))
      )
    } catch (error) {
      console.error('Error actualizando balance:', error)

      s.showAlert({
        title: 'Error',
        message: 'No se pudo actualizar la cartera.',
        variant: 'danger',
        confirmText: 'Entendido',
      })
    }
  }

  const eliminarTransferencia = (t: Transferencia) => {
    s.showAlert({
      title: 'Eliminar transferencia',
      message:
        '¿Estás seguro de que quieres eliminar esta transferencia? El saldo de las carteras se actualizará.',
      variant: 'danger',
      confirmText: 'Eliminar',
      onConfirm: async () => {
        try {
          await deleteTransferencia(t.id)

          s.setTransfers(s.transfers.filter(x => x.id !== t.id))
        } catch (error) {
          console.error('Error eliminando transferencia:', error)

          s.showAlert({
            title: 'Error',
            message: 'No se pudo eliminar la transferencia de Supabase.',
            variant: 'danger',
            confirmText: 'Entendido',
          })
        }
      },
    })
  }

  return (
    <div className="ui-screen app-view app-view--carteras">
      <header className="ui-head">
        <div>
          <h1 className="ui-title">Carteras</h1>
          <p className="ui-sub">Tu dinero, repartido en un vistazo</p>
        </div>
        <div className="ui-btns">
          <button className="ui-ghost" onClick={() => setTransferOpen(true)}>
            <ArrowLeftRight size={16} /> Transferir
          </button>
          <button
            className="ui-cta"
            onClick={() =>
              setEdit({
                id: '',
                nombre: '',
                saldoInicial: 0,
                incluirEnTotal: true,
              })
            }
          >
            <Plus size={17} /> Nueva
          </button>
        </div>
      </header>

      <div className="ui-card ui-tot">
        <div>
          <p className="ui-sub" style={{ margin: 0 }}>Total en tu balance</p>
          <b>{money(total)}</b>
        </div>
        <span className="ui-ic ui-g" style={{ width: 46, height: 46 }}>
          <Target size={20} />
        </span>
      </div>

      {s.carts.length ? (
        <div className="ui-grid">
          {s.carts.map(c => (
            <div key={c.id} className="ui-card ui-w">
              <div className="ui-top">
                <h3>{c.nombre}</h3>
                <div style={{ display: 'flex' }}>
                  <button
                    type="button"
                    className="ui-ib"
                    aria-label={`Editar ${c.nombre}`}
                    onClick={() => setEdit(c)}
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    type="button"
                    className="ui-ib ui-d"
                    aria-label={`Eliminar ${c.nombre}`}
                    onClick={() => remove(c)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <b>{money(s.saldo(c.id))}</b>
              <small>Saldo actual</small>

              <div className="ui-sw">
                <span>{c.incluirEnTotal ? 'Incluida en el balance' : 'Fuera del balance'}</span>
                <button
                  type="button"
                  role="switch"
                  className="ui-tg"
                  aria-checked={c.incluirEnTotal}
                  aria-label={`Incluir ${c.nombre} en el balance total`}
                  onClick={() => toggleIncluir(c)}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="ui-card">
          <div className="ui-empty">
            <span className="ui-ic ui-y"><Inbox size={20} /></span>
            Todavía no tienes carteras.
          </div>
        </div>
      )}

      <h2 className="ui-sec">Últimas transferencias</h2>
      <div className="ui-card" style={{ padding: '6px 16px' }}>
        {s.transfers.length ? (
          s.transfers
            .slice()
            .sort((a, b) => b.fecha.localeCompare(a.fecha))
            .slice(0, 8)
            .map(t => {
              const desde = s.carts.find(c => c.id === t.desde)
              const hacia = s.carts.find(c => c.id === t.hacia)

              return (
                <div key={t.id} className="ui-tr">
                  <span className="ui-ic ui-g">
                    <ArrowLeftRight size={16} />
                  </span>
                  <div className="ui-m">
                    <p>
                      {desde?.nombre ?? 'Cartera eliminada'}
                      <span style={{ color: 'var(--ui-mute)' }}>→</span>
                      {hacia?.nombre ?? 'Cartera eliminada'}
                    </p>
                    <small>{t.fecha}</small>
                  </div>
                  <span className="ui-amt">{money(t.monto)}</span>
                  <button
                    type="button"
                    className="ui-ib ui-d"
                    aria-label="Eliminar transferencia"
                    onClick={() => eliminarTransferencia(t)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )
            })
        ) : (
          <div className="ui-empty">Aún no hay transferencias.</div>
        )}
      </div>

      {edit && (
        <Modal
          title={isNew ? 'Nueva cartera' : 'Editar cartera'}
          onClose={() => setEdit(null)}
          position="top"
        >
          <div className="space-y-3">
            <Field label="Nombre">
              <input
                className={inp}
                value={edit.nombre}
                onChange={e =>
                  setEdit({ ...edit, nombre: e.target.value })
                }
              />
            </Field>

            <Field label="Saldo inicial (antes de los movimientos)">
              <input
                className={inp}
                type="number"
                value={edit.saldoInicial}
                onChange={e =>
                  setEdit({ ...edit, saldoInicial: Number(e.target.value) })
                }
              />
            </Field>

            <label className="flex items-center gap-2 text-sm text-mute">
              <input
                type="checkbox"
                className="accent-[#70d6a5]"
                checked={edit.incluirEnTotal}
                onChange={e =>
                  setEdit({ ...edit, incluirEnTotal: e.target.checked })
                }
              />

              Incluir en balance total
            </label>

            <button
              className={`${btn} w-full justify-center`}
              onClick={save}
            >
              Guardar
            </button>
          </div>
        </Modal>
      )}

      {transferOpen && (
        <TransferModal
          s={s}
          onSave={saveTransfer}
          onClose={() => setTransferOpen(false)}
        />
      )}
    </div>
  )
}

const PERIODS = [
  ['mes', 'Este mes'],
  ['30', 'Últimos 30 días'],
  ['anio', 'Este año'],
  ['todo', 'Todo'],
]


export function Metas({ s }: { s: Store }) {
  const [edit, setEdit] = useState<Meta | null>(null)

  const isNew =
    edit &&
    !s.metas.some(m => m.id === edit.id)

  const save = async () => {
    if (
      !edit ||
      !edit.nombre.trim() ||
      edit.objetivo <= 0 ||
      edit.aporteManual < 0
    ) {
      return
    }

    try {
      if (isNew) {
        const nueva = await createMeta({
          nombre: edit.nombre.trim(),
          objetivo: edit.objetivo,
          aporteManual: edit.aporteManual,
          carteras: edit.carteras,
        })

        s.setMetas([...s.metas, nueva])
      } else {
        const actualizada = await updateMeta(edit)

        s.setMetas(
          s.metas.map(m =>
            m.id === actualizada.id ? actualizada : m
          )
        )
      }

      setEdit(null)
    } catch (error) {
      console.error('Error guardando meta:', error)

      s.showAlert({
        title: 'Error',
        message: 'No se pudo guardar la meta en Supabase.',
        variant: 'danger',
        confirmText: 'Entendido',
      })
    }
  }

  const remove = (meta: Meta) => {
    s.showAlert({
      title: 'Eliminar meta',
      message:
        `¿Estás seguro de que quieres eliminar la meta "${meta.nombre}"? Esta acción no se puede deshacer.`,
      variant: 'danger',
      confirmText: 'Eliminar',
      onConfirm: async () => {
        try {
          await deleteMeta(meta.id)

          s.setMetas(s.metas.filter(m => m.id !== meta.id))
        } catch (error) {
          console.error('Error eliminando meta:', error)

          s.showAlert({
            title: 'Error',
            message: 'No se pudo eliminar la meta de Supabase.',
            variant: 'danger',
            confirmText: 'Entendido',
          })
        }
      },
    })
  }

  const getSaved = (meta: Meta) => {
    const saldoCarteras = meta.carteras.reduce(
      (total, carteraId) => total + s.saldo(carteraId),
      0
    )

    return Math.max(0, meta.aporteManual + saldoCarteras)
  }

  const getCarterasNombres = (meta: Meta) => {
    return meta.carteras
      .map(id => s.carts.find(c => c.id === id)?.nombre)
      .filter(Boolean)
  }

  const toggleCartera = (carteraId: string) => {
    if (!edit) return

    const seleccionada = edit.carteras.includes(carteraId)

    setEdit({
      ...edit,
      carteras: seleccionada
        ? edit.carteras.filter(id => id !== carteraId)
        : [...edit.carteras, carteraId],
    })
  }

  const RING = 2 * Math.PI * 34

  return (
    <div className="ui-screen app-view app-view--metas">
      <header className="ui-head">
        <div>
          <h1 className="ui-title">Metas</h1>
          <p className="ui-sub">Lo que estás construyendo, paso a paso</p>
        </div>
        <button
          className="ui-cta"
          onClick={() =>
            setEdit({
              id: uid(),
              nombre: '',
              objetivo: 0,
              aporteManual: 0,
              carteras: [],
            })
          }
        >
          <Plus size={17} /> Nueva meta
        </button>
      </header>

      {!s.metas.length ? (
        <div className="ui-card">
          <div className="ui-empty">
            <span className="ui-ic ui-g" style={{ width: 56, height: 56, borderRadius: 18 }}>
              <Target size={24} />
            </span>
            <b style={{ color: 'var(--ui-ink)', fontFamily: 'var(--ui-display)', fontSize: 17 }}>
              Aún no tienes metas
            </b>
            Crea una meta para empezar a seguir tus ahorros y acercarte a tus objetivos.
          </div>
        </div>
      ) : (
        <div className="ui-grid">
          {s.metas.map(meta => {
            const saved = getSaved(meta)
            const percent =
              meta.objetivo > 0
                ? Math.min(100, (saved / meta.objetivo) * 100)
                : 0
            const nombresCarteras = getCarterasNombres(meta)
            const reached = saved >= meta.objetivo
            const desdeCarteras = meta.carteras.reduce(
              (total, id) => total + s.saldo(id),
              0
            )

            return (
              <div
                key={meta.id}
                className="ui-card"
                style={reached ? { background: 'linear-gradient(150deg,#12231a,var(--ui-surface) 70%)' } : undefined}
              >
                <div className="ui-mt">
                  <div
                    className="ui-ring"
                    style={{ '--c': RING, '--o': RING * (1 - percent / 100) } as React.CSSProperties}
                  >
                    <svg viewBox="0 0 84 84" aria-hidden="true">
                      <circle className="ui-ring-bg" cx="42" cy="42" r="34" />
                      <circle className="ui-ring-fg" cx="42" cy="42" r="34" strokeDasharray={RING} />
                    </svg>
                    <div>{Math.round(percent)}%</div>
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 6 }}>
                      <h3>{meta.nombre}</h3>
                      <div style={{ display: 'flex', margin: '-6px -8px 0 0' }}>
                        <button
                          type="button"
                          className="ui-ib"
                          aria-label={`Editar ${meta.nombre}`}
                          onClick={() => setEdit(meta)}
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          type="button"
                          className="ui-ib ui-d"
                          aria-label={`Eliminar ${meta.nombre}`}
                          onClick={() => remove(meta)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <p className="ui-big">{money(saved)}</p>
                    <small style={{ color: 'var(--ui-mute)', fontSize: 12 }}>
                      de {money(meta.objetivo)}
                    </small>
                  </div>
                </div>

                <div className="ui-two">
                  <div>
                    <small>Aportes manuales</small>
                    <b>{money(meta.aporteManual)}</b>
                  </div>
                  <div>
                    <small>Desde carteras</small>
                    <b>{money(desdeCarteras)}</b>
                  </div>
                </div>

                {nombresCarteras.length > 0 && (
                  <div className="ui-wl">
                    {nombresCarteras.map(nombre => (
                      <span key={nombre}>{nombre}</span>
                    ))}
                  </div>
                )}

                {reached ? (
                  <span className="ui-pill">
                    <Check size={14} /> Meta alcanzada
                  </span>
                ) : (
                  <p className="ui-left">
                    Faltan <b>{money(Math.max(0, meta.objetivo - saved))}</b>
                  </p>
                )}
              </div>
            )
          })}
        </div>
      )}

      {edit && (
        <Modal
          title={isNew ? 'Nueva meta' : 'Editar meta'}
          onClose={() => setEdit(null)}
          position="lower"
        >
          <div className="space-y-3">
            <Field label="Nombre">
              <input
                className={inp}
                placeholder="Ej. Moto"
                value={edit.nombre}
                onChange={e =>
                  setEdit({ ...edit, nombre: e.target.value })
                }
              />
            </Field>

            <Field label="Valor objetivo">
              <input
                className={inp}
                type="number"
                min={0}
                value={edit.objetivo || ''}
                onChange={e =>
                  setEdit({ ...edit, objetivo: Number(e.target.value) })
                }
              />
            </Field>

            <Field label="Aportes manuales">
              <input
                className={inp}
                type="number"
                min={0}
                value={edit.aporteManual || ''}
                onChange={e =>
                  setEdit({ ...edit, aporteManual: Number(e.target.value) })
                }
              />

              <p className="mt-1.5 text-[11px] text-mute">
                Dinero que quieres contar para
                esta meta sin modificar ninguna
                cartera.
              </p>
            </Field>

            <Field label="Carteras vinculadas">
              <div
                className="
                  max-h-52
                  space-y-1.5
                  overflow-y-auto
                  rounded-xl
                  border border-white/[0.06]
                  bg-white/[0.018]
                  p-2
                "
              >
                {s.carts.length ? (
                  s.carts.map(c => {
                    const checked = edit.carteras.includes(c.id)

                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => toggleCartera(c.id)}
                        className={`
                          flex w-full
                          items-center
                          justify-between
                          gap-3
                          rounded-lg
                          px-3 py-2.5
                          text-left
                          transition-all duration-200
                          ${checked
                            ? 'border border-brand/[0.10] bg-brand/[0.07] text-ink'
                            : 'border border-transparent bg-transparent text-mute hover:bg-white/[0.035] hover:text-ink'
                          }
                        `}
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">
                            {c.nombre}
                          </p>

                          <p className="mt-0.5 text-[11px] text-mute">
                            {money(s.saldo(c.id))}
                          </p>
                        </div>

                        <span
                          className={`
                            grid h-5 w-5
                            shrink-0
                            place-items-center
                            rounded-md
                            border
                            transition-all duration-200
                            ${checked
                              ? 'border-brand bg-brand text-bg'
                              : 'border-white/[0.10] bg-white/[0.025]'
                            }
                          `}
                        >
                          {checked && <Check size={13} />}
                        </span>
                      </button>
                    )
                  })
                ) : (
                  <p className="px-2 py-3 text-xs text-mute">
                    No tienes carteras creadas.
                  </p>
                )}
              </div>

              <p className="mt-1.5 text-[11px] text-mute">
                Puedes seleccionar una o varias
                carteras. Sus saldos se sumarán
                automáticamente a la meta.
              </p>
            </Field>

            <div
              className="
                rounded-xl
                border border-brand/[0.08]
                bg-brand/[0.035]
                p-3.5
              "
            >
              <p className="text-xs text-mute">
                La meta tendrá actualmente
              </p>

              <p className="mt-1 text-lg font-semibold text-brand">
                {money(
                  edit.aporteManual +
                  edit.carteras.reduce(
                    (total, carteraId) => total + s.saldo(carteraId),
                    0
                  )
                )}
              </p>

              <p className="mt-1 text-[11px] text-mute">
                {edit.carteras.length
                  ? `${edit.carteras.length} ${edit.carteras.length === 1
                    ? 'cartera seleccionada'
                    : 'carteras seleccionadas'
                  }`
                  : 'Sin carteras vinculadas'}
              </p>
            </div>

            <button
              className={`${btn} w-full justify-center`}
              onClick={save}
            >
              Guardar
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}


export function Analisis({ s }: { s: Store }) {
  const [p, setP] = useState('mes')

  const now = daysAgo(0)

  const from =
    p === 'mes'
      ? now.slice(0, 7) + '-01'
      : p === '30'
        ? daysAgo(30)
        : p === 'anio'
          ? now.slice(0, 4) + '-01-01'
          : '0000'

  const ms = s.movs.filter(
    m => m.fecha >= from && m.fecha <= now
  )

  const grp =
    p === 'anio' || p === 'todo'
      ? 7
      : 10

  const ev: Record<
    string,
    {
      k: string
      Ingresos: number
      Gastos: number
    }
  > = {}

  ms.forEach(m => {
    const k = m.fecha.slice(0, grp)

    ev[k] ??= {
      k,
      Ingresos: 0,
      Gastos: 0,
    }

    ev[k][
      m.tipo === 'ingreso'
        ? 'Ingresos'
        : 'Gastos'
    ] += m.monto
  })

  const data = Object.values(ev).sort(
    (a, b) => a.k.localeCompare(b.k)
  )

  const i = sum(ms, 'ingreso')
  const g = sum(ms, 'gasto')

  const stats = [
    ['Ingresos', money(i), 'text-brand'],
    ['Gastos', money(g), 'text-neg'],
    [
      'Balance',
      money(i - g),
      i - g >= 0
        ? 'text-brand'
        : 'text-neg',
    ],
    ['Movimientos', String(ms.length), 'text-ink'],
  ]

  return (
    <div className="ui-screen app-view app-view--analisis">
      <header className="ui-head">
        <div>
          <h1 className="ui-title">Análisis</h1>
          <p className="ui-sub">
            {PERIODS.find(([v]) => v === p)?.[1]}
          </p>
        </div>
      </header>

      <div className="ui-chips ui-per" role="group" aria-label="Período">
        {PERIODS.map(([v, l]) => (
          <button
            key={v}
            type="button"
            className={`ui-chip ${p === v ? 'ui-on' : ''}`}
            onClick={() => setP(v)}
          >
            {l}
          </button>
        ))}
      </div>

      <div className="ui-stats" aria-live="polite">
        {stats.map(([l, v, c], index) => (
          <div key={l} className={`ui-card ${index === 2 ? 'ui-main' : ''}`}>
            <small>{l}</small>
            <b className={c}>{v}</b>
          </div>
        ))}
      </div>

      <div className="ui-card ui-panel">
        <div className="ui-ph">
          <div>
            <h3>Gastos por categoría</h3>
            <p className="ui-sub">Distribución en el período seleccionado</p>
          </div>
          <span className="ui-ic ui-r">
            <Target size={18} />
          </span>
        </div>

        <CatChart ms={ms} />
      </div>

      <div className="ui-card ui-panel">
        <div className="ui-ph">
          <div>
            <h3>Ingresos y gastos</h3>
            <p className="ui-sub">Comparación a lo largo del período</p>
          </div>

          <div className="ui-key">
            <span><i style={{ background: 'var(--ui-brand)' }} />Ingresos</span>
            <span><i style={{ background: 'var(--ui-neg)' }} />Gastos</span>
          </div>
        </div>

        {data.length ? (
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={data}>
                <CartesianGrid
                  stroke="#ffffff0d"
                  strokeDasharray="3 6"
                  vertical={false}
                />

                <XAxis
                  dataKey="k"
                  stroke="#8b9691"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />

                <YAxis
                  stroke="#8b9691"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={v =>
                    `${v / 1000}k`
                  }
                />

                <Tooltip
                  {...tip}
                  cursor={{
                    fill: '#ffffff08',
                  }}
                />

                <Bar
                  dataKey="Ingresos"
                  fill="#70d6a5"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={28}
                />

                <Bar
                  dataKey="Gastos"
                  fill="#ff7b7b"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={28}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="ui-empty">
            <span className="ui-ic ui-y"><Inbox size={20} /></span>
            No hay movimientos en este período.
          </div>
        )}
      </div>
    </div>
  )
}


export function Config({ s }: { s: Store }) {
  const [n, setN] = useState('')
  const [editing, setEditing] = useState<string | null>(null)
  const [editName, setEditName] = useState('')

  const add = async () => {
    const v = n.trim()

    if (!v) return

    if (s.cats.includes(v)) {
      s.showAlert({
        title: 'Categoría existente',
        message:
          'Ya existe una categoría con ese nombre.',
        variant: 'warning',
        confirmText: 'Entendido',
      })

      return
    }

    try {
      const nueva = await createCategoria(v)

      s.setCats([
        ...s.cats,
        nueva,
      ])

      setN('')
    } catch (error) {
      console.error(
        'Error creando categoría:',
        error
      )

      s.showAlert({
        title: 'Error',
        message:
          'No se pudo crear la categoría en Supabase.',
        variant: 'danger',
        confirmText: 'Entendido',
      })
    }
  }

  const startEdit = (c: string) => {
    setEditing(c)
    setEditName(c)
  }

  const cancelEdit = () => {
    setEditing(null)
    setEditName('')
  }

  const saveEdit = async () => {
    if (!editing) return

    const v = editName.trim()

    if (!v || v === editing) {
      cancelEdit()
      return
    }

    if (s.cats.includes(v)) {
      s.showAlert({
        title: 'Categoría existente',
        message:
          'Ya existe una categoría con ese nombre. Elige un nombre diferente.',
        variant: 'warning',
        confirmText: 'Entendido',
      })

      return
    }

    try {
      const actualizada =
        await updateCategoria(
          editing,
          v
        )

      // Actualizar categoría
      s.setCats(
        s.cats.map(x =>
          x === editing
            ? actualizada
            : x
        )
      )

      // Actualizar movimientos que usan esa categoría
      s.setMovs(
        s.movs.map(m =>
          m.cat === editing
            ? {
              ...m,
              cat: actualizada,
            }
            : m
        )
      )

      cancelEdit()
    } catch (error) {
      console.error(
        'Error actualizando categoría:',
        error
      )

      s.showAlert({
        title: 'Error',
        message:
          'No se pudo actualizar la categoría en Supabase.',
        variant: 'danger',
        confirmText: 'Entendido',
      })
    }
  }

  const reset = () => {
    s.showAlert({
      title: 'Función no disponible',
      message:
        'El restablecimiento de datos todavía debe adaptarse a Supabase. Tus datos actuales no serán modificados.',
      variant: 'warning',
      confirmText: 'Entendido',
    })
  }

  return (
    <div className="app-view app-view--config space-y-6">
      <Title>Configuración</Title>

      <Card>
        <h3 className="mb-3 font-semibold">
          Categorías
        </h3>

        <div className="mb-4 flex gap-2">
          <input
            className={inp}
            placeholder="Nueva categoría"
            value={n}
            onChange={e =>
              setN(e.target.value)
            }
            onKeyDown={e =>
              e.key === 'Enter' && add()
            }
          />

          <button
            className={btn}
            onClick={add}
          >
            <Plus size={16} />
          </button>
        </div>

        <ul>
          {s.cats.map(c => (
            <li
              key={c}
              className="
                group
                flex items-center justify-between
                rounded-xl px-2 py-2
                transition-colors
                hover:bg-white/[0.025]
              "
            >
              {editing === c ? (
                <div className="flex flex-1 items-center gap-2">
                  <input
                    autoFocus
                    className={inp}
                    value={editName}
                    onChange={e =>
                      setEditName(e.target.value)
                    }
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        saveEdit()
                      }

                      if (e.key === 'Escape') {
                        cancelEdit()
                      }
                    }}
                  />

                  <IconBtn onClick={saveEdit}>
                    <Check size={15} />
                  </IconBtn>

                  <IconBtn onClick={cancelEdit}>
                    <X size={15} />
                  </IconBtn>
                </div>
              ) : (
                <>
                  <span className="text-sm">
                    {c}

                    <span className="ml-2 text-xs text-mute">
                      {s.movs.filter(
                        m => m.cat === c
                      ).length}{' '}
                      mov.
                    </span>
                  </span>

                  <div className="flex opacity-70 transition-opacity group-hover:opacity-100">
                    <IconBtn
                      onClick={() =>
                        startEdit(c)
                      }
                    >
                      <Pencil size={15} />
                    </IconBtn>

                    <IconBtn
                      onClick={() =>
                        s.showAlert({
                          title: 'Eliminar categoría',
                          message:
                            `¿Eliminar la categoría "${c}"? Los movimientos existentes conservarán sus registros, pero ya no aparecerá como categoría disponible.`,
                          variant: 'danger',
                          confirmText: 'Eliminar',
                          onConfirm: async () => {
                            try {
                              await deleteCategoria(c)

                              s.setCats(
                                s.cats.filter(
                                  x => x !== c
                                )
                              )
                            } catch (error) {
                              console.error(
                                'Error eliminando categoría:',
                                error
                              )

                              s.showAlert({
                                title: 'Error',
                                message:
                                  'No se pudo eliminar la categoría de Supabase.',
                                variant: 'danger',
                                confirmText: 'Entendido',
                              })
                            }
                          },
                        })
                      }
                    >
                      <Trash2 size={15} />
                    </IconBtn>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      </Card>

      <Card>
        <h3 className="mb-2 font-semibold">
          Información
        </h3>

        <p className="text-sm leading-relaxed text-mute">
          Finanzas guarda tus datos en Supabase.
          Moneda: COP. Los saldos de las carteras se
          calculan a partir de su saldo inicial y sus
          movimientos.
        </p>

        <button
          className="
            mt-4 rounded-xl
            border border-neg/30
            px-4 py-2
            text-sm text-neg
            transition-all duration-200
            hover:border-neg/50
            hover:bg-neg/[0.06]
          "
          onClick={reset}
        >
          Restablecer datos de ejemplo
        </button>
      </Card>
    </div>
  )


}


export function Tareas({ s }: { s: Store }) {
  const [titulo, setTitulo] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [fecha, setFecha] = useState('')
  const [prioridad, setPrioridad] =
    useState<Tarea['prioridad']>('media')

  const [showForm, setShowForm] = useState(false)

  const pendientes = s.tareas.filter(
    tarea => !tarea.completada
  )

  const completadas = s.tareas.filter(
    tarea => tarea.completada
  )

  const guardar = async () => {
    if (!titulo.trim()) {
      s.showAlert({
        title: 'Falta el título',
        message: 'Escribe un título para la tarea.',
        variant: 'warning',
        confirmText: 'Entendido',
      })
      return
    }

    try {
      const nueva = await createTarea({
        titulo,
        descripcion,
        fecha: fecha || undefined,
        completada: false,
        prioridad,
      })

      s.setTareas([
        nueva,
        ...s.tareas,
      ])

      setTitulo('')
      setDescripcion('')
      setFecha('')
      setPrioridad('media')
      setShowForm(false)
    } catch (error) {
      console.error('ERROR GUARDANDO TAREA:', error)

      s.showAlert({
        title: 'Error',
        message:
          error instanceof Error
            ? error.message
            : 'No se pudo guardar la tarea en Supabase.',
        variant: 'danger',
        confirmText: 'Entendido',
      })
    }
  }

  const cambiarEstado = async (tarea: Tarea) => {
    try {
      const actualizada = await updateTarea({
        ...tarea,
        completada: !tarea.completada,
      })

      s.setTareas(
        s.tareas.map(t =>
          t.id === actualizada.id
            ? actualizada
            : t
        )
      )
    } catch (error) {
      console.error('ERROR ACTUALIZANDO TAREA:', error)

      s.showAlert({
        title: 'Error',
        message:
          error instanceof Error
            ? error.message
            : 'No se pudo actualizar la tarea.',
        variant: 'danger',
        confirmText: 'Entendido',
      })
    }
  }

  const eliminar = (tarea: Tarea) => {
    s.showAlert({
      title: 'Eliminar tarea',
      message: `¿Seguro que quieres eliminar "${tarea.titulo}"?`,
      variant: 'warning',
      confirmText: 'Eliminar',
      cancelText: 'Cancelar',
      onConfirm: async () => {
        try {
          await deleteTarea(tarea.id)

          s.setTareas(
            s.tareas.filter(t =>
              t.id !== tarea.id
            )
          )
        } catch (error) {
          console.error(
            'ERROR ELIMINANDO TAREA:',
            error
          )

          s.showAlert({
            title: 'Error',
            message:
              error instanceof Error
                ? error.message
                : 'No se pudo eliminar la tarea.',
            variant: 'danger',
            confirmText: 'Entendido',
          })
        }
      },
    })
  }

  // Solo presentación: clases de las etiquetas de prioridad
  const prioridadStyle = {
    baja: 'ui-pr-baja',
    media: 'ui-pr-media',
    alta: 'ui-pr-alta',
  }

  const prioridadLabel = {
    baja: 'Baja',
    media: 'Media',
    alta: 'Alta',
  }

  const formatearFecha = (fecha: string) => {
    const [year, month, day] =
      fecha.split('-')

    if (!year || !month || !day) {
      return fecha
    }

    return `${day}/${month}/${year}`
  }

  const fila = (tarea: Tarea) => {
    const hecha = tarea.completada

    return (
      <div key={tarea.id} className={`ui-task${hecha ? ' ui-done' : ''}`}>
        <button
          type="button"
          className="ui-ck"
          onClick={() => cambiarEstado(tarea)}
          title={hecha ? 'Marcar como pendiente' : 'Marcar como completada'}
          aria-label={hecha ? 'Marcar como pendiente' : 'Marcar como completada'}
        >
          <Check size={14} strokeWidth={3.4} />
        </button>

        <div className="ui-tb">
          <div className="ui-tt">
            <p>{tarea.titulo}</p>
            {!hecha && (
              <span className={`ui-pr ${prioridadStyle[tarea.prioridad]}`}>
                {prioridadLabel[tarea.prioridad]}
              </span>
            )}
          </div>

          {!hecha && tarea.descripcion && (
            <p className="ui-desc">{tarea.descripcion}</p>
          )}

          {tarea.fecha && (
            <div className="ui-date">
              <CalendarDays size={14} />
              {formatearFecha(tarea.fecha)}
            </div>
          )}
        </div>

        <button
          type="button"
          className="ui-ib ui-d"
          onClick={() => eliminar(tarea)}
          title="Eliminar tarea"
          aria-label="Eliminar tarea"
        >
          <Trash2 size={17} />
        </button>
      </div>
    )
  }

  return (
    <div className="ui-screen app-view app-view--tareas">
      <header className="ui-head">
        <div>
          <h1 className="ui-title">Tareas</h1>
          <p className="ui-sub">Organiza tus pendientes</p>
        </div>
        <button className="ui-cta" onClick={() => setShowForm(true)}>
          <Plus size={17} /> Nueva tarea
        </button>
      </header>

      <div className="ui-ts">
        <div className="ui-card">
          <span className="ui-ic ui-g"><Circle size={17} /></span>
          <b>{pendientes.length}</b>
          <small>Pendientes</small>
        </div>
        <div className="ui-card">
          <span className="ui-ic ui-g"><CheckCircle2 size={17} /></span>
          <b>{completadas.length}</b>
          <small>Completadas</small>
        </div>
        <div className="ui-card">
          <span className="ui-ic ui-mu"><CheckSquare size={17} /></span>
          <b>{s.tareas.length}</b>
          <small>Total</small>
        </div>
      </div>

      <h2 className="ui-sec" style={{ marginBottom: 2 }}>Pendientes</h2>
      <p className="ui-sub" style={{ marginTop: 0 }}>
        {pendientes.length === 0
          ? 'No tienes tareas pendientes'
          : `${pendientes.length} ${pendientes.length === 1
            ? 'tarea pendiente'
            : 'tareas pendientes'
          }`}
      </p>

      {pendientes.length === 0 ? (
        <div className="ui-card" style={{ marginTop: 10 }}>
          <div className="ui-empty">
            <span className="ui-ic ui-y"><Inbox size={20} /></span>
            No tienes tareas pendientes.
          </div>
        </div>
      ) : (
        pendientes.map(fila)
      )}

      {completadas.length > 0 && (
        <>
          <h2 className="ui-sec" style={{ marginBottom: 2 }}>Completadas</h2>
          <p className="ui-sub" style={{ marginTop: 0 }}>
            {completadas.length}{' '}
            {completadas.length === 1
              ? 'tarea completada'
              : 'tareas completadas'}
          </p>
          {completadas.map(fila)}
        </>
      )}

      {showForm && (
        <Modal title="Nueva tarea" onClose={() => setShowForm(false)} position="raised">
          <div className="space-y-4">
            <Field label="Título">
              <input
                value={titulo}
                onChange={e => setTitulo(e.target.value)}
                placeholder="Ej. Estudiar para el examen"
                className={inp}
                autoFocus
              />
            </Field>

            <Field label="Descripción">
              <textarea
                value={descripcion}
                onChange={e => setDescripcion(e.target.value)}
                placeholder="Agrega una descripción opcional..."
                className={`${inp} min-h-[84px] resize-none`}
              />
            </Field>

            <Field label="Fecha">
              <input
                type="date"
                value={fecha}
                onChange={e => setFecha(e.target.value)}
                className={inp}
              />
            </Field>

            <div>
              <span className="mb-1.5 block text-xs font-medium tracking-wide text-mute">
                Prioridad
              </span>
              <div className="ui-pseg" role="group" aria-label="Prioridad">
                {(['baja', 'media', 'alta'] as Tarea['prioridad'][]).map(pr => (
                  <button
                    key={pr}
                    type="button"
                    className={prioridad === pr ? 'ui-on' : ''}
                    aria-pressed={prioridad === pr}
                    onClick={() => setPrioridad(pr)}
                  >
                    {prioridadLabel[pr]}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                className={`${btnGhost} flex-1`}
                onClick={() => setShowForm(false)}
              >
                Cancelar
              </button>
              <button
                type="button"
                className={`${btn} flex-1 justify-center`}
                onClick={guardar}
              >
                <Check size={17} /> Guardar tarea
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

export function Habitos({ s }: { s: Store }) {
  const diasSemana = [
    { id: 1, label: 'Lun', nombre: 'Lunes' },
    { id: 2, label: 'Mar', nombre: 'Martes' },
    { id: 3, label: 'Mié', nombre: 'Miércoles' },
    { id: 4, label: 'Jue', nombre: 'Jueves' },
    { id: 5, label: 'Vie', nombre: 'Viernes' },
    { id: 6, label: 'Sáb', nombre: 'Sábado' },
    { id: 7, label: 'Dom', nombre: 'Domingo' },
  ]
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Habito | null>(null)
  const [nombre, setNombre] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [diasSeleccionados, setDiasSeleccionados] = useState<number[]>([1, 2, 3, 4, 5, 6, 7])
  const [saving, setSaving] = useState(false)

  const fechaHoy = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const ahora = new Date()
  const hoy = fechaHoy(ahora)
  const activos = s.habitos.filter(habito => habito.activo)
  const diaHoy = ((ahora.getDay() + 6) % 7) + 1
  const diasDe = (habito: Habito) => habito.diasSemana ?? [1, 2, 3, 4, 5, 6, 7]
  const programadosHoy = activos.filter(habito => diasDe(habito).includes(diaHoy))
  const noProgramadosHoy = activos.filter(habito => !diasDe(habito).includes(diaHoy))
  const idsProgramadosHoy = new Set(programadosHoy.map(habito => habito.id))
  const completadosHoy = new Set(
    s.registrosHabitos
      .filter(registro => registro.fecha === hoy && idsProgramadosHoy.has(registro.habito_id))
      .map(registro => registro.habito_id)
  )

  const fechaClave = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const rachaActual = (habitoId: string) => {
    const habito = activos.find(item => item.id === habitoId)
    if (!habito) return 0

    const dias = diasDe(habito)
    if (dias.length === 0) return 0

    const fechas = new Set(
      s.registrosHabitos
        .filter(registro => registro.habito_id === habitoId)
        .map(registro => registro.fecha)
    )

    const cursor = new Date(ahora)
    if (dias.includes(diaHoy) && !fechas.has(fechaClave(cursor))) {
      cursor.setDate(cursor.getDate() - 1)
    }

    let racha = 0
    while (true) {
      const dia = ((cursor.getDay() + 6) % 7) + 1
      if (dias.includes(dia)) {
        if (!fechas.has(fechaClave(cursor))) break
        racha += 1
      }
      cursor.setDate(cursor.getDate() - 1)
    }
    return racha
  }

  const abrirNuevo = () => {
    setEditing(null)
    setNombre('')
    setDescripcion('')
    setDiasSeleccionados([1, 2, 3, 4, 5, 6, 7])
    setShowForm(true)
  }

  const abrirEdicion = (habito: Habito) => {
    setEditing(habito)
    setNombre(habito.nombre)
    setDescripcion(habito.descripcion ?? '')
    setDiasSeleccionados([...diasDe(habito)])
    setShowForm(true)
  }

  const cerrarFormulario = () => {
    setShowForm(false)
    setEditing(null)
  }

  const guardar = async () => {
    if (!nombre.trim()) {
      s.showAlert({
        title: 'Falta el nombre',
        message: 'Escribe un nombre para el hábito.',
        variant: 'warning',
        confirmText: 'Entendido',
      })
      return
    }

    if (diasSeleccionados.length === 0) {
      s.showAlert({
        title: 'Selecciona al menos un día',
        message: 'El hábito debe tener programado al menos un día de la semana.',
        variant: 'warning',
        confirmText: 'Entendido',
      })
      return
    }

    setSaving(true)
    try {
      if (editing) {
        const actualizado = await updateHabito({
          id: editing.id,
          nombre,
          descripcion,
          diasSemana: [...diasSeleccionados].sort((a, b) => a - b),
        })
        s.setHabitos(s.habitos.map(h => h.id === actualizado.id ? actualizado : h))
      } else {
        const nuevo = await createHabito({
          nombre,
          descripcion,
          diasSemana: [...diasSeleccionados].sort((a, b) => a - b),
        })
        s.setHabitos([...s.habitos, nuevo])
      }
      cerrarFormulario()
    } catch (error) {
      console.error('ERROR GUARDANDO HÁBITO:', error)
      s.showAlert({
        title: 'Error',
        message: error instanceof Error ? error.message : 'No se pudo guardar el hábito.',
        variant: 'danger',
        confirmText: 'Entendido',
      })
    } finally {
      setSaving(false)
    }
  }

  const cambiarCompletado = async (habitoId: string) => {
    try {
      if (completadosHoy.has(habitoId)) {
        await desmarcarHabito(habitoId, hoy)
        s.setRegistrosHabitos(s.registrosHabitos.filter(registro =>
          !(registro.habito_id === habitoId && registro.fecha === hoy)
        ))
      } else {
        const registro = await marcarHabito(habitoId, hoy)
        s.setRegistrosHabitos([
          ...s.registrosHabitos.filter(r => !(r.habito_id === habitoId && r.fecha === hoy)),
          registro,
        ])
      }
    } catch (error) {
      console.error('ERROR ACTUALIZANDO HÁBITO:', error)
      s.showAlert({
        title: 'Error',
        message: error instanceof Error ? error.message : 'No se pudo actualizar el hábito.',
        variant: 'danger',
        confirmText: 'Entendido',
      })
    }
  }

  const confirmarEliminacion = (habito: Habito) => {
    s.showAlert({
      title: 'Eliminar hábito',
      message: `¿Seguro que quieres eliminar "${habito.nombre}" y sus registros?`,
      variant: 'warning',
      confirmText: 'Eliminar',
      cancelText: 'Cancelar',
      onConfirm: async () => {
        try {
          await deleteHabito(habito.id)
          s.setHabitos(s.habitos.filter(h => h.id !== habito.id))
          s.setRegistrosHabitos(s.registrosHabitos.filter(r => r.habito_id !== habito.id))
        } catch (error) {
          console.error('ERROR ELIMINANDO HÁBITO:', error)
          s.showAlert({
            title: 'Error',
            message: error instanceof Error ? error.message : 'No se pudo eliminar el hábito.',
            variant: 'danger',
            confirmText: 'Entendido',
          })
        }
      },
    })
  }

  const progresoHoy = programadosHoy.length
    ? Math.round((completadosHoy.size / programadosHoy.length) * 100)
    : 0
  const rachaDestacada = activos.reduce(
    (maxima, habito) => Math.max(maxima, rachaActual(habito.id)),
    0
  )

  return (
    <section className="app-view app-view--habitos space-y-6 md:space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-brand/75">
            Productividad
          </p>
          <h1 className="app-heading-text mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
            Hábitos
          </h1>
          <p className="mt-1 text-sm text-mute">
            Pequeñas acciones, progreso constante.
          </p>
        </div>
        <button onClick={abrirNuevo} className={btn + ' w-full justify-center sm:w-auto'}>
          <Plus size={17} /> Nuevo hábito
        </button>
      </header>

      <Card className="relative isolate overflow-hidden !p-5 sm:!p-6">
        <div className="pointer-events-none absolute -right-16 -top-20 -z-10 h-56 w-56 rounded-full bg-brand/[0.12] blur-3xl" />
        <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-sm text-mute">Tu progreso de hoy</p>
                <p className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
                  <span className="text-brand">{completadosHoy.size}</span>
                  <span className="text-mute/70"> / {programadosHoy.length}</span>
                </p>
              </div>
              <span className="rounded-full border border-brand/15 bg-brand/[0.07] px-3 py-1.5 text-sm font-medium text-brand">
                {progresoHoy}% completado
              </span>
            </div>
            <div
              className="mt-5 h-2 overflow-hidden rounded-full bg-white/[0.06]"
              role="progressbar"
              aria-label="Progreso de hábitos de hoy"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={progresoHoy}
            >
              <div
                className="h-full rounded-full bg-brand transition-[width] duration-500 ease-out"
                style={{ width: String(progresoHoy) + '%' }}
              />
            </div>
            <p className="mt-2 text-xs text-mute">
              {programadosHoy.length === 0
                ? 'No hay hábitos programados para hoy.'
                : String(programadosHoy.length) + (programadosHoy.length === 1 ? ' hábito programado para hoy' : ' hábitos programados para hoy')}
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-white/[0.06] bg-black/[0.12] p-4 lg:min-w-52 lg:flex-col lg:items-start">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#ffd27b]/[0.09] text-[#ffd27b]">
              <Flame size={21} />
            </div>
            <div>
              <p className="text-xs text-mute">Racha actual más alta</p>
              <p className="mt-0.5 text-xl font-semibold tracking-tight">
                {rachaDestacada} <span className="text-sm font-normal text-mute">{rachaDestacada === 1 ? 'día' : 'días'}</span>
              </p>
            </div>
          </div>
        </div>
      </Card>

      <section className="space-y-3">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">Hábitos de hoy</h2>
            <p className="mt-1 text-xs text-mute">Marca cada hábito cuando lo completes.</p>
          </div>
          <span className="rounded-full border border-white/[0.06] bg-white/[0.025] px-2.5 py-1 text-xs text-mute">
            {programadosHoy.length} {programadosHoy.length === 1 ? 'programado' : 'programados'}
          </span>
        </div>

        {programadosHoy.length === 0 ? (
          <Card className="!border-dashed !bg-white/[0.015] !p-7 sm:!p-9">
            <div className="mx-auto flex max-w-sm flex-col items-center text-center">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-brand/[0.08] text-brand">
                <CheckCircle2 size={23} />
              </div>
              <p className="mt-4 font-medium text-ink">
                {activos.length === 0 ? 'Empieza con tu primer hábito' : 'Hoy tienes un día más ligero'}
              </p>
              <p className="mt-1 text-sm text-mute">
                {activos.length === 0
                  ? 'Crea un hábito para comenzar a registrar tu progreso.'
                  : 'No hay hábitos programados para hoy.'}
              </p>
            </div>
          </Card>
        ) : (
          <div className="space-y-3">
            {programadosHoy.map(habito => {
              const completado = completadosHoy.has(habito.id)
              const racha = rachaActual(habito.id)
              return (
                <Card
                  key={habito.id}
                  className={completado
                    ? '!border-brand/20 !bg-brand/[0.035] !p-4 sm:!p-5'
                    : '!p-4 hover:-translate-y-0.5 hover:bg-white/[0.035] sm:!p-5'}
                >
                  <div className="flex items-start gap-3 sm:gap-4">
                    <button
                      onClick={() => cambiarCompletado(habito.id)}
                      className={completado
                        ? 'mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-brand/30 bg-brand/15 text-brand transition-all duration-200 active:scale-95'
                        : 'mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-white/[0.08] bg-white/[0.025] text-mute transition-all duration-200 hover:border-brand/30 hover:text-brand active:scale-95'}
                      title={completado ? 'Desmarcar hoy' : 'Marcar como completado hoy'}
                      aria-label={completado ? 'Desmarcar ' + habito.nombre : 'Completar ' + habito.nombre}
                    >
                      {completado ? <CheckCircle2 size={21} /> : <Circle size={21} />}
                    </button>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className={completado
                              ? 'break-words font-semibold tracking-tight text-brand'
                              : 'break-words font-semibold tracking-tight text-ink'}>
                              {habito.nombre}
                            </h3>
                            {completado && (
                              <span className="rounded-full bg-brand/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-brand">
                                Completado
                              </span>
                            )}
                          </div>
                          {habito.descripcion && (
                            <p className="mt-1 text-sm leading-relaxed text-mute">{habito.descripcion}</p>
                          )}
                        </div>

                        <div className="flex shrink-0 items-center gap-1">
                          <button
                            onClick={() => abrirEdicion(habito)}
                            className="rounded-lg p-2 text-mute transition-colors hover:bg-white/[0.05] hover:text-ink"
                            title="Editar hábito"
                            aria-label={'Editar ' + habito.nombre}
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => confirmarEliminacion(habito)}
                            className="rounded-lg p-2 text-mute transition-colors hover:bg-neg/[0.08] hover:text-neg"
                            title="Eliminar hábito"
                            aria-label={'Eliminar ' + habito.nombre}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 rounded-lg border border-[#ffd27b]/10 bg-[#ffd27b]/[0.05] px-2.5 py-1.5 text-xs font-medium text-[#ffd27b]">
                          <Flame size={14} />
                          {racha} {racha === 1 ? 'día' : 'días'} de racha
                        </span>
                        <div className="flex flex-wrap gap-1.5" aria-label="Días programados">
                          {diasSemana.filter(dia => diasDe(habito).includes(dia.id)).map(dia => (
                            <span
                              key={dia.id}
                              title={dia.nombre}
                              className="rounded-md border border-white/[0.06] bg-white/[0.025] px-2 py-1 text-[10px] font-medium text-mute"
                            >
                              {dia.label}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </section>

      {noProgramadosHoy.length > 0 && (
        <section className="space-y-3">
          <div>
            <h2 className="text-base font-semibold tracking-tight text-ink/90">No programados hoy</h2>
            <p className="mt-1 text-xs text-mute">No cuentan como pendientes ni afectan tu progreso de hoy.</p>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {noProgramadosHoy.map(habito => (
              <Card key={habito.id} className="!bg-white/[0.015] !p-3.5 opacity-90 hover:opacity-100 sm:!p-4">
                <div className="flex items-center gap-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/[0.035] text-mute/70">
                    <Circle size={17} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-ink/85">{habito.nombre}</p>
                    <p className="mt-1 truncate text-[11px] text-mute/80">
                      {diasSemana.filter(dia => diasDe(habito).includes(dia.id)).map(dia => dia.nombre).join(', ')}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-0.5">
                    <button
                      onClick={() => abrirEdicion(habito)}
                      className="rounded-lg p-2 text-mute/70 transition-colors hover:bg-white/[0.05] hover:text-ink"
                      title="Editar hábito"
                      aria-label={'Editar ' + habito.nombre}
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => confirmarEliminacion(habito)}
                      className="rounded-lg p-2 text-mute/70 transition-colors hover:bg-neg/[0.08] hover:text-neg"
                      title="Eliminar hábito"
                      aria-label={'Eliminar ' + habito.nombre}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      {showForm && (
        <Modal title={editing ? 'Editar hábito' : 'Nuevo hábito'} onClose={cerrarFormulario}>
          <div className="space-y-5">
            <p className="-mt-2 text-sm text-mute">
              {editing ? 'Ajusta los detalles y la rutina semanal.' : 'Define el hábito y los días en que quieres practicarlo.'}
            </p>

            <div className="space-y-4">
              <Field label="Nombre">
                <input
                  value={nombre}
                  onChange={e => setNombre(e.target.value)}
                  className={inp}
                  placeholder="Ej. Leer 10 minutos"
                  autoFocus
                />
              </Field>
              <Field label="Descripción (opcional)">
                <textarea
                  value={descripcion}
                  onChange={e => setDescripcion(e.target.value)}
                  className={inp + ' min-h-[88px] resize-none'}
                  placeholder="Añade un detalle que te ayude a recordar tu intención"
                />
              </Field>
            </div>

            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-3.5 sm:p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-ink">Días programados</p>
                  <p className="mt-0.5 text-xs text-mute">Elige uno o varios días de la semana.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setDiasSeleccionados([1, 2, 3, 4, 5, 6, 7])}
                  className={diasSeleccionados.length === 7
                    ? 'shrink-0 rounded-full bg-brand/15 px-3 py-1.5 text-xs font-medium text-brand transition-colors'
                    : 'shrink-0 rounded-full border border-white/[0.07] bg-white/[0.025] px-3 py-1.5 text-xs font-medium text-mute transition-colors hover:text-ink'}
                >
                  Todos los días
                </button>
              </div>
              <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
                {diasSemana.map(dia => {
                  const seleccionado = diasSeleccionados.includes(dia.id)
                  return (
                    <button
                      key={dia.id}
                      type="button"
                      aria-pressed={seleccionado}
                      aria-label={dia.nombre}
                      onClick={() => setDiasSeleccionados(actual =>
                        seleccionado
                          ? actual.filter(id => id !== dia.id)
                          : [...actual, dia.id].sort((a, b) => a - b)
                      )}
                      className={seleccionado
                        ? 'min-h-10 rounded-xl border border-brand/30 bg-brand/[0.11] text-[11px] font-semibold text-brand shadow-[inset_0_0_0_1px_rgba(112,214,165,0.04)] transition-all duration-150 active:scale-95 sm:text-xs'
                        : 'min-h-10 rounded-xl border border-white/[0.07] bg-white/[0.02] text-[11px] font-semibold text-mute transition-all duration-150 hover:border-white/[0.13] hover:text-ink active:scale-95 sm:text-xs'}
                    >
                      <span className="sm:hidden">{dia.label}</span>
                      <span className="hidden sm:inline">{dia.nombre.slice(0, 3)}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="flex flex-col-reverse gap-2 border-t border-white/[0.06] pt-4 sm:flex-row sm:justify-end">
              <button
                onClick={cerrarFormulario}
                className="rounded-xl px-4 py-2.5 text-sm text-mute transition-colors hover:bg-white/[0.04] hover:text-ink"
              >
                Cancelar
              </button>
              <button onClick={guardar} className={btn + ' justify-center'} disabled={saving}>
                <Check size={17} /> {saving ? 'Guardando…' : editing ? 'Guardar cambios' : 'Crear hábito'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </section>
  )
}

function FilaMoto({
  icono,
  tono,
  titulo,
  detalle,
  monto,
  montoColor,
  nota,
  children,
}: {
  icono: ReactNode
  tono: string
  titulo: string
  detalle: ReactNode
  monto: string
  montoColor?: string
  nota?: string
  children: ReactNode
}) {
  const [abierta, setAbierta] = useState(false)
 
  return (
    <div className="ui-row">
      <button
        type="button"
        className="ui-rowbtn"
        aria-expanded={abierta}
        onClick={() => setAbierta(v => !v)}
      >
        <span className={`ui-ic ${tono}`}>{icono}</span>
        <span className="ui-m">
          <span className="ui-t">{titulo}</span>
          <small>{detalle}</small>
        </span>
        <span className="ui-amt" style={montoColor ? { color: montoColor } : undefined}>
          {monto}
        </span>
      </button>
 
      {abierta && (
        <>
          {nota && <p className="ui-note">{nota}</p>}
          <div className="ui-acts">{children}</div>
        </>
      )}
    </div>
  )
}

export function MotoPage({ s }: { s: Store }) {
  const categoriasGasto = ['Combustible', 'Mantenimiento', 'Repuestos', 'Accesorios', 'Lavado', 'Otros']
  const tiposSugeridos = [
    'Cambio de aceite',
    'Llantas',
    'Kit de arrastre',
    'Frenos',
    'Bujía',
    'Limpieza / mantenimiento',
    'Reparación',
    'Repuesto',
    'Otro',
  ]
  const [editandoMoto, setEditandoMoto] = useState(false)
  const [motoForm, setMotoForm] = useState({
    nombre: 'Pulsar NS160 FI',
    marca: 'Bajaj',
    modelo: 'NS160 FI',
    anio: '2023',
    kilometrajeActual: '0',
    imagenUrl: '',
    ultimoCambioAceite: '',
    fechaUltimoCambioAceite: '',
    notas: '',
  })
  const [mantenimientoFormOpen, setMantenimientoFormOpen] = useState(false)
  const [mantenimientoEditando, setMantenimientoEditando] = useState<MantenimientoMoto | null>(null)
  const [mantenimientoForm, setMantenimientoForm] = useState({
    tipo: '',
    fecha: new Date().toLocaleDateString('sv'),
    kilometraje: String(s.moto?.kilometrajeActual ?? 0),
    costo: '0',
    notas: '',
  })
  const [gastoFormOpen, setGastoFormOpen] = useState(false)
  const [gastoEditando, setGastoEditando] = useState<GastoMoto | null>(null)
  const [gastoForm, setGastoForm] = useState({
    categoria: 'Combustible',
    descripcion: '',
    valor: '',
    fecha: new Date().toLocaleDateString('sv'),
  })
  const [guardando, setGuardando] = useState(false)
  const [imagenSeleccionada, setImagenSeleccionada] = useState<File | null>(null)
  const [previewImagen, setPreviewImagen] = useState<string | null>(null)
  const [subiendoImagen, setSubiendoImagen] = useState(false)
  const [errorImagen, setErrorImagen] = useState('')
  const inputImagenRef = useRef<HTMLInputElement>(null)

  const formatFecha = (fecha?: string) => {
    if (!fecha) return 'Sin registrar'
    const [year, month, day] = fecha.slice(0, 10).split('-')
    if (!year || !month || !day) return fecha
    return new Date(Number(year), Number(month) - 1, Number(day))
      .toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' })
  }
  const formatKm = (km: number) => Number(km || 0).toLocaleString('es-CO') + ' km'
  const setMotoField = (field: keyof typeof motoForm, value: string) =>
    setMotoForm(current => ({ ...current, [field]: value }))
  const setMantenimientoField = (field: keyof typeof mantenimientoForm, value: string) =>
    setMantenimientoForm(current => ({ ...current, [field]: value }))
  const setGastoField = (field: keyof typeof gastoForm, value: string) =>
    setGastoForm(current => ({ ...current, [field]: value }))

  const abrirEdicionMoto = () => {
    if (previewImagen) URL.revokeObjectURL(previewImagen)
    setImagenSeleccionada(null)
    setPreviewImagen(null)
    setErrorImagen('')
    setMotoForm({
      nombre: s.moto?.nombre ?? 'Pulsar NS160 FI',
      marca: s.moto?.marca ?? 'Bajaj',
      modelo: s.moto?.modelo ?? 'NS160 FI',
      anio: String(s.moto?.anio ?? 2023),
      kilometrajeActual: String(s.moto?.kilometrajeActual ?? 0),
      imagenUrl: s.moto?.imagenUrl ?? '',
      ultimoCambioAceite: s.moto?.ultimoCambioAceite == null ? '' : String(s.moto.ultimoCambioAceite),
      fechaUltimoCambioAceite: s.moto?.fechaUltimoCambioAceite ?? '',
      notas: s.moto?.notas ?? '',
    })
    setEditandoMoto(true)
  }

  const seleccionarImagen = (file?: File) => {
    if (!file) return
    const tiposPermitidos = ['image/jpeg', 'image/png', 'image/webp']
    if (!tiposPermitidos.includes(file.type)) {
      setErrorImagen('Selecciona una imagen JPG, PNG o WEBP.')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      setErrorImagen('La imagen no puede superar los 10 MB.')
      return
    }
    if (previewImagen) URL.revokeObjectURL(previewImagen)
    setImagenSeleccionada(file)
    setPreviewImagen(URL.createObjectURL(file))
    setErrorImagen('')
  }

  const cerrarEdicionMoto = () => {
    if (previewImagen) URL.revokeObjectURL(previewImagen)
    setImagenSeleccionada(null)
    setPreviewImagen(null)
    setErrorImagen('')
    setEditandoMoto(false)
  }

  const subirImagenMoto = async () => {
    if (!imagenSeleccionada) return
    setSubiendoImagen(true)
    let imagenSubida = false
    try {
      const url = await uploadMotoImage(imagenSeleccionada)
      imagenSubida = true
      const moto = await updateMotoImage(url)
      s.setMoto(moto)
      setMotoField('imagenUrl', url)
      if (previewImagen) URL.revokeObjectURL(previewImagen)
      setImagenSeleccionada(null)
      setPreviewImagen(null)
      setErrorImagen('')
    } catch (error) {
      console.error('ERROR SUBIENDO IMAGEN DE MOTO:', error)
      setErrorImagen(imagenSubida
        ? 'La imagen se subió, pero no se pudo guardar su URL en la moto. Inténtalo de nuevo.'
        : `No se pudo subir la imagen: ${error instanceof Error ? error.message : 'revisa la conexión y las políticas de Storage.'}`)
    } finally {
      setSubiendoImagen(false)
    }
  }

  const guardarMotoInfo = async () => {
    if (!motoForm.nombre.trim() || !motoForm.marca.trim() || !motoForm.modelo.trim()) {
      s.showAlert({ title: 'Faltan datos', message: 'Completa el nombre, la marca y el modelo.', variant: 'warning' })
      return
    }
    setGuardando(true)
    try {
      const moto = await saveMoto({
        id: 1,
        nombre: motoForm.nombre,
        marca: motoForm.marca,
        modelo: motoForm.modelo,
        anio: Number(motoForm.anio) || 2023,
        kilometrajeActual: Number(motoForm.kilometrajeActual) || 0,
        imagenUrl: motoForm.imagenUrl,
        ultimoCambioAceite: motoForm.ultimoCambioAceite ? Number(motoForm.ultimoCambioAceite) : undefined,
        fechaUltimoCambioAceite: motoForm.fechaUltimoCambioAceite || undefined,
        notas: motoForm.notas,
      })
      s.setMoto(moto)
      setEditandoMoto(false)
    } catch (error) {
      console.error('ERROR GUARDANDO LA MOTO:', error)
      s.showAlert({ title: 'Error', message: error instanceof Error ? error.message : 'No se pudo guardar la información de la moto.', variant: 'danger' })
    } finally {
      setGuardando(false)
    }
  }

  const abrirNuevoMantenimiento = () => {
    setMantenimientoEditando(null)
    setMantenimientoForm({
      tipo: '',
      fecha: new Date().toLocaleDateString('sv'),
      kilometraje: String(s.moto?.kilometrajeActual ?? 0),
      costo: '0',
      notas: '',
    })
    setMantenimientoFormOpen(true)
  }
  const abrirEdicionMantenimiento = (registro: MantenimientoMoto) => {
    setMantenimientoEditando(registro)
    setMantenimientoForm({
      tipo: registro.tipo,
      fecha: registro.fecha,
      kilometraje: String(registro.kilometraje),
      costo: String(registro.costo),
      notas: registro.notas ?? '',
    })
    setMantenimientoFormOpen(true)
  }
  const guardarMantenimiento = async () => {
    if (!mantenimientoForm.tipo.trim() || !mantenimientoForm.fecha) {
      s.showAlert({ title: 'Faltan datos', message: 'Indica el tipo y la fecha del mantenimiento.', variant: 'warning' })
      return
    }
    setGuardando(true)
    try {
      const values = {
        tipo: mantenimientoForm.tipo,
        fecha: mantenimientoForm.fecha,
        kilometraje: Number(mantenimientoForm.kilometraje) || 0,
        costo: Number(mantenimientoForm.costo) || 0,
        notas: mantenimientoForm.notas,
      }
      const actualizado = mantenimientoEditando
        ? await updateMantenimientoMoto({ ...values, id: mantenimientoEditando.id, created_at: mantenimientoEditando.created_at })
        : await createMantenimientoMoto(values)
      s.setMantenimientosMoto(
        [...s.mantenimientosMoto.filter(item => item.id !== actualizado.id), actualizado]
          .sort((a, b) => b.fecha.localeCompare(a.fecha))
      )
      setMantenimientoFormOpen(false)
    } catch (error) {
      console.error('ERROR GUARDANDO MANTENIMIENTO:', error)
      s.showAlert({ title: 'Error', message: error instanceof Error ? error.message : 'No se pudo guardar el mantenimiento.', variant: 'danger' })
    } finally {
      setGuardando(false)
    }
  }
  const confirmarEliminarMantenimiento = (registro: MantenimientoMoto) => {
    s.showAlert({
      title: 'Eliminar mantenimiento',
      message: '¿Quieres eliminar el registro de "' + registro.tipo + '"?',
      variant: 'warning',
      confirmText: 'Eliminar',
      cancelText: 'Cancelar',
      onConfirm: async () => {
        try {
          await deleteMantenimientoMoto(registro.id)
          s.setMantenimientosMoto(s.mantenimientosMoto.filter(item => item.id !== registro.id))
        } catch (error) {
          console.error('ERROR ELIMINANDO MANTENIMIENTO:', error)
          s.showAlert({ title: 'Error', message: error instanceof Error ? error.message : 'No se pudo eliminar el mantenimiento.', variant: 'danger' })
        }
      },
    })
  }

  const abrirNuevoGasto = () => {
    setGastoEditando(null)
    setGastoForm({ categoria: 'Combustible', descripcion: '', valor: '', fecha: new Date().toLocaleDateString('sv') })
    setGastoFormOpen(true)
  }
  const abrirEdicionGasto = (gasto: GastoMoto) => {
    setGastoEditando(gasto)
    setGastoForm({ categoria: gasto.categoria, descripcion: gasto.descripcion, valor: String(gasto.valor), fecha: gasto.fecha })
    setGastoFormOpen(true)
  }
  const guardarGasto = async () => {
    if (!gastoForm.descripcion.trim() || !gastoForm.fecha || Number(gastoForm.valor) <= 0) {
      s.showAlert({ title: 'Revisa los datos', message: 'Completa la descripción, la fecha y un valor mayor que cero.', variant: 'warning' })
      return
    }
    setGuardando(true)
    try {
      const values = {
        categoria: gastoForm.categoria,
        descripcion: gastoForm.descripcion,
        valor: Number(gastoForm.valor),
        fecha: gastoForm.fecha,
      }
      const actualizado = gastoEditando
        ? await updateGastoMoto({ ...values, id: gastoEditando.id, created_at: gastoEditando.created_at })
        : await createGastoMoto(values)
      s.setGastosMoto(
        [...s.gastosMoto.filter(item => item.id !== actualizado.id), actualizado]
          .sort((a, b) => b.fecha.localeCompare(a.fecha))
      )
      setGastoFormOpen(false)
    } catch (error) {
      console.error('ERROR GUARDANDO GASTO DE MOTO:', error)
      s.showAlert({ title: 'Error', message: error instanceof Error ? error.message : 'No se pudo guardar el gasto.', variant: 'danger' })
    } finally {
      setGuardando(false)
    }
  }
  const confirmarEliminarGasto = (gasto: GastoMoto) => {
    s.showAlert({
      title: 'Eliminar gasto',
      message: '¿Quieres eliminar "' + gasto.descripcion + '"?',
      variant: 'warning',
      confirmText: 'Eliminar',
      cancelText: 'Cancelar',
      onConfirm: async () => {
        try {
          await deleteGastoMoto(gasto.id)
          s.setGastosMoto(s.gastosMoto.filter(item => item.id !== gasto.id))
        } catch (error) {
          console.error('ERROR ELIMINANDO GASTO DE MOTO:', error)
          s.showAlert({ title: 'Error', message: error instanceof Error ? error.message : 'No se pudo eliminar el gasto.', variant: 'danger' })
        }
      },
    })
  }

  const totalGastos = s.gastosMoto.reduce((total, gasto) => total + gasto.valor, 0)
  const gastosPorCategoria = Object.entries(
    s.gastosMoto.reduce<Record<string, number>>((totales, gasto) => {
      totales[gasto.categoria] = (totales[gasto.categoria] ?? 0) + gasto.valor
      return totales
    }, {})
  ).sort((a, b) => b[1] - a[1])
  const gastoMaximoCategoria = Math.max(1, ...gastosPorCategoria.map(([, valor]) => valor))
  const motoNombre = s.moto?.nombre ?? 'Pulsar NS160 FI'
  const motoAnio = s.moto?.anio ?? 2023

  const campo = (label: string, input: ReactNode) => (
    <Field label={label}>{input}</Field>
  )

  return (
    <section className="ui-screen app-view app-view--motopage">
      <div className="ui-mo-top">
        <div className="ui-card ui-cover">
          {s.moto?.imagenUrl ? (
            <img src={s.moto.imagenUrl} alt={motoNombre} className="ui-cimg" />
          ) : (
            <Bike size={56} strokeWidth={1.1} className="ui-cph" />
          )}
 
          <button type="button" className="ui-cedit" onClick={abrirEdicionMoto}>
            <Pencil size={15} /> Editar moto
          </button>
 
          <div className="ui-ctxt">
            <h1>{motoNombre}</h1>
            <p>{s.moto?.marca ?? 'Bajaj'} · {s.moto?.modelo ?? 'NS160 FI'} · {motoAnio}</p>
            <div className="ui-km">
              <Gauge size={16} />
              {formatKm(s.moto?.kilometrajeActual ?? 0)}
            </div>
          </div>
        </div>
 
        <div className="ui-facts">
          <div className="ui-card ui-fact">
            <span className="ui-ic ui-g"><Gauge size={19} /></span>
            <div>
              <small>Kilometraje actual</small>
              <b>{formatKm(s.moto?.kilometrajeActual ?? 0)}</b>
            </div>
          </div>
          <div className="ui-card ui-fact">
            <span className="ui-ic ui-b"><Droplets size={19} /></span>
            <div>
              <small>Último cambio de aceite</small>
              <b>{s.moto?.ultimoCambioAceite == null ? 'Sin registrar' : formatKm(s.moto.ultimoCambioAceite)}</b>
            </div>
          </div>
          <div className="ui-card ui-fact">
            <span className="ui-ic ui-y"><CalendarDays size={19} /></span>
            <div>
              <small>Fecha del cambio</small>
              <b>{formatFecha(s.moto?.fechaUltimoCambioAceite)}</b>
            </div>
          </div>
        </div>
      </div>
 
      <div className="ui-mo-cols">
        <section>
          <div className="ui-mh">
            <div>
              <h2>Mantenimientos</h2>
              <p>Servicios y reparaciones realizados.</p>
            </div>
            <button
              type="button"
              className="ui-cta ui-sm"
              aria-label="Registrar mantenimiento"
              onClick={abrirNuevoMantenimiento}
            >
              <Plus size={16} /> Registrar
            </button>
          </div>
 
          {s.mantenimientosMoto.length === 0 ? (
            <div className="ui-card">
              <div className="ui-empty">
                <span className="ui-ic ui-y"><Wrench size={20} /></span>
                Aún no hay mantenimientos registrados.
              </div>
            </div>
          ) : (
            s.mantenimientosMoto.map(registro => (
              <FilaMoto
                key={registro.id}
                icono={<Wrench size={18} />}
                tono="ui-g"
                titulo={registro.tipo}
                detalle={<>{formatFecha(registro.fecha)}<span className="ui-tag">{formatKm(registro.kilometraje)}</span></>}
                monto={money(registro.costo)}
                montoColor="var(--ui-brand)"
                nota={registro.notas}
              >
                <button type="button" className="ui-ib" aria-label="Editar mantenimiento" title="Editar" onClick={() => abrirEdicionMantenimiento(registro)}>
                  <Pencil size={16} />
                </button>
                <button type="button" className="ui-ib ui-d" aria-label="Eliminar mantenimiento" title="Eliminar" onClick={() => confirmarEliminarMantenimiento(registro)}>
                  <Trash2 size={16} />
                </button>
              </FilaMoto>
            ))
          )}
        </section>
 
        <section>
          <div className="ui-mh">
            <div>
              <h2>Gastos de la moto</h2>
              <p>Registro de costos asociados.</p>
            </div>
            <button
              type="button"
              className="ui-cta ui-sm"
              aria-label="Agregar gasto"
              onClick={abrirNuevoGasto}
            >
              <Plus size={16} /> Agregar
            </button>
          </div>
 
          <div className="ui-card ui-gtot">
            <small>Total de gastos registrados</small>
            <b>{money(totalGastos)}</b>
            <small>{s.gastosMoto.length} {s.gastosMoto.length === 1 ? 'registro' : 'registros'}</small>
          </div>
 
          <div className="ui-card ui-gcats">
            <h3><Tag size={17} /> Gastos por categoría</h3>
            {gastosPorCategoria.length === 0 ? (
              <p className="ui-sub" style={{ margin: 0 }}>Las categorías aparecerán al registrar gastos.</p>
            ) : (
              gastosPorCategoria.map(([categoria, valor]) => (
                <div key={categoria} className="ui-cr">
                  <div>
                    <span>{categoria}</span>
                    <span>{money(valor)}</span>
                  </div>
                  <div className="ui-trk">
                    <i style={{ width: String((valor / gastoMaximoCategoria) * 100) + '%' }} />
                  </div>
                </div>
              ))
            )}
          </div>
 
          <h3 className="ui-sub2"><CircleDollarSign size={18} /> Gastos recientes</h3>
 
          {s.gastosMoto.length === 0 ? (
            <div className="ui-card">
              <div className="ui-empty">
                <span className="ui-ic ui-y"><CircleDollarSign size={20} /></span>
                Aún no hay gastos registrados.
              </div>
            </div>
          ) : (
            s.gastosMoto.slice(0, 10).map(gasto => (
              <FilaMoto
                key={gasto.id}
                icono={gasto.categoria === 'Combustible' ? <Fuel size={18} /> : <CircleDollarSign size={18} />}
                tono="ui-o"
                titulo={gasto.descripcion}
                detalle={<>{formatFecha(gasto.fecha)}<span className="ui-tag">{gasto.categoria}</span></>}
                monto={money(gasto.valor)}
              >
                <button type="button" className="ui-ib" aria-label="Editar gasto" title="Editar" onClick={() => abrirEdicionGasto(gasto)}>
                  <Pencil size={16} />
                </button>
                <button type="button" className="ui-ib ui-d" aria-label="Eliminar gasto" title="Eliminar" onClick={() => confirmarEliminarGasto(gasto)}>
                  <Trash2 size={16} />
                </button>
              </FilaMoto>
            ))
          )}
        </section>
      </div>

      {editandoMoto && (
        <Modal title="Información de la moto" onClose={cerrarEdicionMoto}>
          <div className="max-h-[72vh] space-y-4 overflow-y-auto pr-1">
            <div className="grid gap-3 sm:grid-cols-2">
              {campo('Nombre', <input value={motoForm.nombre} onChange={e => setMotoField('nombre', e.target.value)} className={inp} />)}
              {campo('Marca', <input value={motoForm.marca} onChange={e => setMotoField('marca', e.target.value)} className={inp} />)}
              {campo('Modelo', <input value={motoForm.modelo} onChange={e => setMotoField('modelo', e.target.value)} className={inp} />)}
              {campo('Año', <input type="number" min="1900" max="2100" value={motoForm.anio} onChange={e => setMotoField('anio', e.target.value)} className={inp} />)}
              {campo('Kilometraje actual', <input type="number" min="0" value={motoForm.kilometrajeActual} onChange={e => setMotoField('kilometrajeActual', e.target.value)} className={inp} />)}
              {campo('Último cambio de aceite (km)', <input type="number" min="0" value={motoForm.ultimoCambioAceite} onChange={e => setMotoField('ultimoCambioAceite', e.target.value)} className={inp} />)}
              {campo('Fecha del último cambio de aceite', <input type="date" value={motoForm.fechaUltimoCambioAceite} onChange={e => setMotoField('fechaUltimoCambioAceite', e.target.value)} className={inp} />)}
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-ink">Imagen de la moto</p>
                <p className="mt-1 text-xs text-mute">Vista 16:9 · se recomienda una imagen de 1600 × 900 px. No se recorta.</p>
              </div>
              <div className="relative aspect-video overflow-hidden rounded-2xl border border-white/[0.08] bg-[#101719]">
                {previewImagen || motoForm.imagenUrl ? (
                  <img src={previewImagen ?? motoForm.imagenUrl} alt="Vista previa de la moto" className="h-full w-full object-contain" />
                ) : (
                  <div className="grid h-full place-items-center text-brand/60"><Bike size={42} strokeWidth={1.3} /></div>
                )}
              </div>
              <input
                ref={inputImagenRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
                className="sr-only"
                onChange={e => { seleccionarImagen(e.target.files?.[0]); e.target.value = '' }}
              />
              <div className="flex flex-wrap items-center gap-2">
                <button type="button" onClick={() => inputImagenRef.current?.click()} disabled={subiendoImagen} className="rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2 text-sm text-ink transition hover:bg-white/[0.08] disabled:opacity-50">
                  Cambiar imagen
                </button>
                {imagenSeleccionada && <>
                  <span className="max-w-full truncate text-xs text-mute">{imagenSeleccionada.name}</span>
                  <button type="button" onClick={subirImagenMoto} disabled={subiendoImagen} className={btn}>
                    {subiendoImagen ? 'Subiendo…' : 'Subir imagen'}
                  </button>
                </>}
              </div>
              <p className="text-xs text-mute">JPG, PNG o WEBP · Máximo 10 MB.</p>
              {errorImagen && <p role="alert" className="text-sm text-red-300">{errorImagen}</p>}
            </div>
            {campo('Notas', <textarea value={motoForm.notas} onChange={e => setMotoField('notas', e.target.value)} className={inp + ' min-h-[80px] resize-y'} />)}
            <div className="flex justify-end gap-2 border-t border-white/[0.06] pt-4">
              <button onClick={cerrarEdicionMoto} className="rounded-xl px-4 py-2.5 text-sm text-mute hover:bg-white/[0.04] hover:text-ink">Cancelar</button>
              <button onClick={guardarMotoInfo} disabled={guardando || subiendoImagen} className={btn}><Check size={16} /> {guardando ? 'Guardando…' : 'Guardar'}</button>
            </div>
          </div>
        </Modal>
      )}

      {mantenimientoFormOpen && (
        <Modal title={mantenimientoEditando ? 'Editar mantenimiento' : 'Registrar mantenimiento'} onClose={() => setMantenimientoFormOpen(false)}>
          <div className="max-h-[72vh] space-y-4 overflow-y-auto pr-1">
            {campo('Tipo', <input list="tipos-mantenimiento-moto" value={mantenimientoForm.tipo} onChange={e => setMantenimientoField('tipo', e.target.value)} className={inp} placeholder="Ej. Cambio de aceite" autoFocus />)}
            <datalist id="tipos-mantenimiento-moto">{tiposSugeridos.map(tipo => <option key={tipo} value={tipo} />)}</datalist>
            <div className="grid gap-3 sm:grid-cols-2">
              {campo('Fecha', <input type="date" value={mantenimientoForm.fecha} onChange={e => setMantenimientoField('fecha', e.target.value)} className={inp} />)}
              {campo('Kilometraje', <input type="number" min="0" value={mantenimientoForm.kilometraje} onChange={e => setMantenimientoField('kilometraje', e.target.value)} className={inp} />)}
              {campo('Costo', <input type="number" min="0" step="100" value={mantenimientoForm.costo} onChange={e => setMantenimientoField('costo', e.target.value)} className={inp} />)}
            </div>
            {campo('Notas (opcional)', <textarea value={mantenimientoForm.notas} onChange={e => setMantenimientoField('notas', e.target.value)} className={inp + ' min-h-[80px] resize-y'} />)}
            <div className="flex justify-end gap-2 border-t border-white/[0.06] pt-4">
              <button onClick={() => setMantenimientoFormOpen(false)} className="rounded-xl px-4 py-2.5 text-sm text-mute hover:bg-white/[0.04] hover:text-ink">Cancelar</button>
              <button onClick={guardarMantenimiento} disabled={guardando} className={btn}><Check size={16} /> {guardando ? 'Guardando…' : 'Guardar'}</button>
            </div>
          </div>
        </Modal>
      )}

      {gastoFormOpen && (
        <Modal title={gastoEditando ? 'Editar gasto' : 'Agregar gasto'} onClose={() => setGastoFormOpen(false)}>
          <div className="space-y-4">
            {campo('Categoría', (
              <select value={gastoForm.categoria} onChange={e => setGastoField('categoria', e.target.value)} className={inp}>
                {categoriasGasto.map(categoria => <option key={categoria} value={categoria}>{categoria}</option>)}
              </select>
            ))}
            {campo('Descripción', <input value={gastoForm.descripcion} onChange={e => setGastoField('descripcion', e.target.value)} className={inp} placeholder="Ej. Tanqueo en estación" autoFocus />)}
            <div className="grid gap-3 sm:grid-cols-2">
              {campo('Valor', <input type="number" min="1" step="100" value={gastoForm.valor} onChange={e => setGastoField('valor', e.target.value)} className={inp} />)}
              {campo('Fecha', <input type="date" value={gastoForm.fecha} onChange={e => setGastoField('fecha', e.target.value)} className={inp} />)}
            </div>
            <div className="flex justify-end gap-2 border-t border-white/[0.06] pt-4">
              <button onClick={() => setGastoFormOpen(false)} className="rounded-xl px-4 py-2.5 text-sm text-mute hover:bg-white/[0.04] hover:text-ink">Cancelar</button>
              <button onClick={guardarGasto} disabled={guardando} className={btn}><Check size={16} /> {guardando ? 'Guardando…' : 'Guardar'}</button>
            </div>
          </div>
        </Modal>
      )}
    </section>
  )
}

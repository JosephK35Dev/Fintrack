import { ReactNode, useRef, useState } from 'react'
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
  w-full rounded-xl
  border border-white/[0.07]
  bg-white/[0.025]
  px-3 py-2.5
  text-sm text-ink
  outline-none
  backdrop-blur-md
  transition-all duration-200
  placeholder:text-mute/50
  hover:border-white/[0.11]
  focus:border-brand/40
  focus:bg-white/[0.035]
  focus:ring-2
  focus:ring-brand/[0.06]
`

const btn = `
  inline-flex items-center gap-2
  rounded-xl
  bg-brand
  px-4 py-2.5
  text-sm font-medium text-bg
  shadow-[0_0_20px_rgba(112,214,165,0.10)]
  transition-all duration-200
  hover:bg-[#7be0ad]
  hover:shadow-[0_0_24px_rgba(112,214,165,0.16)]
  active:scale-[0.98]
`

const tip = {
  contentStyle: {
    background: 'rgba(17, 22, 25, 0.92)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 14,
    color: '#f4f6f5',
    backdropFilter: 'blur(14px)',
  },
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
      border border-white/[0.065]
      bg-white/[0.025]
      p-5
      shadow-[0_8px_30px_rgba(0,0,0,0.12)]
      backdrop-blur-xl
      transition-all duration-200
      hover:border-white/[0.09]
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
  <div className="mb-5 flex items-center justify-between gap-3">
    <h2 className="text-xl font-semibold tracking-tight">{children}</h2>
    {right}
  </div>
)

const Empty = ({ t }: { t: string }) => (
  <p className="py-8 text-center text-sm text-mute">{t}</p>
)

const IconBtn = ({
  onClick,
  children,
}: {
  onClick: () => void
  children: ReactNode
}) => (
  <button
    onClick={onClick}
    className="
      rounded-lg p-2
      text-mute
      transition-all duration-200
      hover:bg-white/[0.05]
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
}: {
  title: string
  onClose: () => void
  children: ReactNode
}) {
  return (
    <div
      className="
        fixed inset-0 z-50
        grid place-items-center
        bg-black/70
        p-4
        backdrop-blur-sm
      "
      onClick={onClose}
    >
      <div
        className="
          w-full max-w-md
          overflow-hidden
          rounded-2xl
          border border-white/[0.08]
          bg-[#111619]/95
          p-5
          shadow-[0_20px_80px_rgba(0,0,0,0.45)]
          backdrop-blur-2xl
        "
        onClick={e => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-lg font-semibold tracking-tight">{title}</h3>

          <IconBtn onClick={onClose}>
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
        inline-flex items-center justify-center gap-2
        rounded-xl
        bg-[#ffd27b]
        px-4 py-2.5
        text-sm font-medium text-bg
        transition-all duration-200
        hover:bg-[#ffda91]
        active:scale-[0.98]
      `,
    },
    danger: {
      icon: <Trash2 size={21} />,
      iconClass: 'bg-neg/[0.08] text-neg',
      buttonClass: `
        inline-flex items-center justify-center gap-2
        rounded-xl
        bg-neg
        px-4 py-2.5
        text-sm font-medium text-bg
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
        fixed inset-0 z-[60]
        grid place-items-center
        bg-black/70
        p-4
        backdrop-blur-sm
      "
      onClick={onClose}
    >
      <div
        className="
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
              <button
                className="
                  flex-1
                  rounded-xl
                  border border-white/[0.07]
                  bg-white/[0.025]
                  px-4 py-2.5
                  text-sm font-medium
                  text-mute
                  transition-all duration-200
                  hover:bg-white/[0.05]
                  hover:text-ink
                "
                onClick={onClose}
              >
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
    <span className="mb-1.5 block">{label}</span>
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

function CatChart({ ms }: { ms: Mov[] }) {
  const data = byCat(ms)

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

export function Dashboard({
  s,
  onNavigate,
}: {
  s: Store
  onNavigate?: (page: 'habitos' | 'tareas' | 'moto') => void
}) {
  const [hide, setHide] = useState(false)
  const now = new Date()
  const inicioMes = new Date(now.getFullYear(), now.getMonth(), 1)
  const inicioMesSiguiente = new Date(now.getFullYear(), now.getMonth() + 1, 1)
  const movimientosMes = s.movs.filter(m => {
    const fecha = new Date(m.fecha)
    return fecha >= inicioMes && fecha < inicioMesSiguiente
  })
  const ingresosMes = sum(movimientosMes, 'ingreso')
  const gastosMes = sum(movimientosMes, 'gasto')
  const balanceMes = ingresosMes - gastosMes
  const total = s.carts
    .filter(c => c.incluirEnTotal)
    .reduce((a, c) => a + s.saldo(c.id), 0)
  const prioridad = { alta: 0, media: 1, baja: 2 }
  const pendientes = [...s.tareas.filter(t => !t.completada)].sort((a, b) => {
    const porPrioridad = prioridad[a.prioridad] - prioridad[b.prioridad]
    if (porPrioridad) return porPrioridad
    if (a.fecha && b.fecha) return a.fecha.localeCompare(b.fecha)
    if (a.fecha) return -1
    if (b.fecha) return 1
    return b.created_at.localeCompare(a.created_at)
  })
  const mask = (n: number) => (hide ? '$ ••••••' : money(n))
  const fechaActual = new Intl.DateTimeFormat('es-CO', {
    weekday: 'long', day: 'numeric', month: 'long',
  }).format(now)
  const saludo = now.getHours() < 12
    ? 'Buenos días'
    : now.getHours() < 19 ? 'Buenas tardes' : 'Buenas noches'
  const fechaHoy = [now.getFullYear(), String(now.getMonth() + 1).padStart(2, '0'), String(now.getDate()).padStart(2, '0')].join('-')
  const diaHoy = ((now.getDay() + 6) % 7) + 1
  const habitosActivos = s.habitos.filter(h => h.activo)
  const habitosDeHoy = habitosActivos.filter(h => (h.diasSemana ?? [1, 2, 3, 4, 5, 6, 7]).includes(diaHoy))
  const completadosHoy = new Set(
    s.registrosHabitos.filter(r => r.fecha === fechaHoy).map(r => r.habito_id)
  )
  const completadosProgramados = habitosDeHoy.filter(h => completadosHoy.has(h.id)).length
  const progresoHabitos = habitosDeHoy.length
    ? Math.round(completadosProgramados / habitosDeHoy.length * 100)
    : 0
  const rachaDe = (habitoId: string) => {
    const habito = habitosActivos.find(h => h.id === habitoId)
    if (!habito) return 0
    const dias = habito.diasSemana ?? [1, 2, 3, 4, 5, 6, 7]
    const registros = new Set(s.registrosHabitos.filter(r => r.habito_id === habitoId).map(r => r.fecha))
    const cursor = new Date(now)
    if (dias.includes(diaHoy) && !registros.has(fechaHoy)) cursor.setDate(cursor.getDate() - 1)
    let racha = 0
    while (true) {
      const dia = ((cursor.getDay() + 6) % 7) + 1
      if (dias.includes(dia)) {
        const fecha = [cursor.getFullYear(), String(cursor.getMonth() + 1).padStart(2, '0'), String(cursor.getDate()).padStart(2, '0')].join('-')
        if (!registros.has(fecha)) break
        racha += 1
      }
      cursor.setDate(cursor.getDate() - 1)
    }
    return racha
  }
  const rachaActual = habitosActivos.reduce((max, habito) => Math.max(max, rachaDe(habito.id)), 0)
  const formatFecha = (fecha?: string) => {
    if (!fecha) return 'Sin registrar'
    const [year, month, day] = fecha.slice(0, 10).split('-').map(Number)
    return new Intl.DateTimeFormat('es-CO', { day: 'numeric', month: 'short', year: 'numeric' })
      .format(new Date(year, month - 1, day))
  }

  return (
    <div className="space-y-6 md:space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-brand/75">{fechaActual}</p>
          <h1 className="mt-1.5 text-2xl font-semibold tracking-tight md:text-[28px]">{saludo}, Joseph</h1>
          <p className="mt-1 text-sm text-mute">Tu panorama financiero y personal, de un vistazo.</p>
        </div>
        <button className={`${btn} w-full justify-center sm:w-auto`} onClick={() => s.openMov()}>
          <Plus size={16} /> Nuevo movimiento
        </button>
      </header>

      <Card className="relative isolate !overflow-hidden !border-brand/[0.16] !bg-[#101915] !p-5 shadow-[0_24px_80px_rgba(36,120,78,0.18)] sm:!p-7">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(118deg,#101714_0%,#16231c_50%,#101916_100%)]" />
        <div className="pointer-events-none absolute -right-16 -top-28 -z-10 h-80 w-80 rounded-full bg-[#70d6a5]/[0.22] blur-[90px]" />
        <div className="pointer-events-none absolute -bottom-36 left-[28%] -z-10 h-72 w-72 rounded-full bg-emerald-400/[0.12] blur-[100px]" />
        <div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.08] [background-image:linear-gradient(135deg,transparent_0%,rgba(255,255,255,0.18)_50%,transparent_100%)]" />
        <div className="relative">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.17em] text-brand/90">Balance total</p>
              <p className="mt-1 text-xs text-white/55">Carteras incluidas en tu balance</p>
            </div>
            <IconBtn onClick={() => setHide(value => !value)}>
              {hide ? <EyeOff size={17} /> : <Eye size={17} />}
            </IconBtn>
          </div>
          <p className="mt-5 break-words text-[clamp(2.25rem,7vw,3.75rem)] font-semibold leading-none tracking-[-0.045em] text-white">{mask(total)}</p>
          <div className="mt-5 inline-flex flex-wrap items-center gap-x-2 gap-y-1 rounded-full border border-white/[0.09] bg-black/[0.16] px-3 py-1.5 text-xs">
            <span className="text-white/55">Balance del mes</span>
            <span className={`font-semibold ${balanceMes >= 0 ? 'text-brand' : 'text-neg'}`}>{mask(balanceMes)}</span>
          </div>
        </div>
      </Card>

      <section className="grid gap-3 sm:grid-cols-2">
        <Card className="!p-4 sm:!p-5">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand/[0.09] text-brand"><ArrowDownLeft size={19} /></span>
            <div className="min-w-0"><p className="text-xs text-mute">Ingresos este mes</p><p className="mt-1 break-words text-xl font-semibold tracking-tight text-brand">{mask(ingresosMes)}</p></div>
          </div>
        </Card>
        <Card className="!p-4 sm:!p-5">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-neg/[0.09] text-neg"><ArrowUpRight size={19} /></span>
            <div className="min-w-0"><p className="text-xs text-mute">Gastos este mes</p><p className="mt-1 break-words text-xl font-semibold tracking-tight text-neg">{mask(gastosMes)}</p></div>
          </div>
        </Card>
      </section>

      <section>
        <div className="mb-3 flex items-end justify-between gap-3">
          <div><h2 className="text-lg font-semibold tracking-tight">Carteras</h2><p className="mt-1 text-xs text-mute">Saldos y participación en tu balance</p></div>
          <span className="text-xs text-mute">{s.carts.length} {s.carts.length === 1 ? 'cartera' : 'carteras'}</span>
        </div>
        {s.carts.length ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {s.carts.map(c => (
              <Card key={c.id} className="!p-4 transition-transform duration-200 hover:-translate-y-0.5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0"><p className="truncate text-sm font-medium">{c.nombre}</p><p className="mt-1 text-[11px] text-mute">{c.incluirEnTotal ? 'Incluida en el balance' : 'Fuera del balance total'}</p></div>
                  <span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${c.incluirEnTotal ? 'bg-brand' : 'bg-white/20'}`} />
                </div>
                <p className="mt-4 break-words text-lg font-semibold tracking-tight">{mask(s.saldo(c.id))}</p>
              </Card>
            ))}
          </div>
        ) : <Card><Empty t="Todavía no tienes carteras." /></Card>}
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="!p-5 sm:!p-6">
          <div className="flex items-start justify-between gap-3">
            <div><p className="text-xs font-medium uppercase tracking-[0.13em] text-brand/75">Rutina</p><h2 className="mt-1 text-lg font-semibold">Hábitos de hoy</h2></div>
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#ffd27b]/[0.09] text-[#ffd27b]"><Flame size={19} /></span>
          </div>
          <div className="mt-5 flex items-end justify-between gap-3">
            <p className="text-2xl font-semibold tracking-tight"><span className="text-brand">{completadosProgramados}</span><span className="text-mute"> / {habitosDeHoy.length}</span></p>
            <span className="text-sm font-medium text-mute">{progresoHabitos}%</span>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/[0.06]" role="progressbar" aria-label="Progreso de hábitos de hoy" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progresoHabitos}>
            <div className="h-full rounded-full bg-brand transition-[width] duration-500" style={{ width: `${progresoHabitos}%` }} />
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs">
            {habitosDeHoy.length ? <span className="inline-flex items-center gap-1.5 text-mute"><Flame size={14} className="text-[#ffd27b]" /> Racha más alta: <strong className="font-semibold text-ink">{rachaActual} {rachaActual === 1 ? 'día' : 'días'}</strong></span> : <span className="text-mute">No hay hábitos programados para hoy.</span>}
            <button type="button" onClick={() => onNavigate?.('habitos')} className="inline-flex items-center gap-1 font-medium text-brand transition hover:text-white">Ver hábitos <ChevronRight size={15} /></button>
          </div>
        </Card>

        <Card className="!p-5 sm:!p-6">
          <div className="flex items-start justify-between gap-3">
            <div><p className="text-xs font-medium uppercase tracking-[0.13em] text-brand/75">Organización</p><h2 className="mt-1 text-lg font-semibold">Tareas pendientes</h2></div>
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand/[0.08] text-brand"><CheckSquare size={19} /></span>
          </div>
          <p className="mt-4 text-2xl font-semibold tracking-tight">{pendientes.length}<span className="ml-2 text-sm font-normal text-mute">pendientes</span></p>
          {pendientes.length ? (
            <div className="mt-3 space-y-1.5">
              {pendientes.slice(0, 3).map(t => <div key={t.id} className="flex items-center gap-2.5 rounded-xl border border-white/[0.045] bg-white/[0.02] px-3 py-2.5"><span className={`h-1.5 w-1.5 shrink-0 rounded-full ${t.prioridad === 'alta' ? 'bg-neg' : t.prioridad === 'media' ? 'bg-[#ffd27b]' : 'bg-brand/70'}`} /><span className="min-w-0 flex-1 truncate text-sm">{t.titulo}</span>{t.fecha && <span className="shrink-0 text-[10px] text-mute">{formatFecha(t.fecha)}</span>}</div>)}
            </div>
          ) : <p className="mt-3 rounded-xl border border-white/[0.045] bg-white/[0.02] px-3 py-3 text-sm text-mute">No tienes tareas pendientes.</p>}
          <div className="mt-3 flex justify-end"><button type="button" onClick={() => onNavigate?.('tareas')} className="inline-flex items-center gap-1 text-xs font-medium text-brand transition hover:text-white">Ver tareas <ChevronRight size={15} /></button></div>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <Card className="!p-5 sm:!p-6">
          <div className="mb-3"><h2 className="text-lg font-semibold tracking-tight">Movimientos recientes</h2><p className="mt-1 text-xs text-mute">Tus últimos registros</p></div>
          {s.movs.length ? <div className="divide-y divide-white/[0.045]">
            {sorted(s.movs).slice(0, 5).map(m => {
              const cartera = s.carts.find(c => c.id === m.cartera)
              const ingreso = m.tipo === 'ingreso'
              return <div key={m.id} className="flex min-w-0 items-center gap-3 py-3 first:pt-1 last:pb-1">
                <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${ingreso ? 'bg-brand/[0.08] text-brand' : 'bg-neg/[0.08] text-neg'}`}>{ingreso ? <ArrowDownLeft size={17} /> : <ArrowUpRight size={17} />}</span>
                <div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{m.desc}</p><p className="mt-0.5 truncate text-[11px] text-mute">{m.fecha} · {m.cat}{cartera ? ` · ${cartera.nombre}` : ''}</p></div>
                <span className={`shrink-0 text-right text-sm font-semibold ${ingreso ? 'text-brand' : 'text-neg'}`}>{ingreso ? '+' : '−'}{money(m.monto)}</span>
              </div>
            })}
          </div> : <Empty t="Sin movimientos todavía. Registra el primero." />}
        </Card>
        <Card className="!p-5 sm:!p-6">
          <div className="mb-3"><h2 className="text-lg font-semibold tracking-tight">Gastos por categoría</h2><p className="mt-1 text-xs text-mute">Distribución de tus gastos registrados</p></div>
          {s.movs.some(m => m.tipo === 'gasto') ? <CatChart ms={s.movs} /> : <Empty t="Aún no hay gastos para mostrar." />}
        </Card>
      </div>

      <section>
        <div className="mb-3"><p className="text-xs font-medium uppercase tracking-[0.13em] text-brand/75">Movilidad</p><h2 className="mt-1 text-lg font-semibold">Mi moto</h2></div>
        <Card className="!p-4 sm:!p-5">
          {s.moto ? <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border border-white/[0.06] bg-[#101719] sm:w-48 sm:shrink-0">
              {s.moto.imagenUrl ? <img src={s.moto.imagenUrl} alt={s.moto.nombre} className="h-full w-full object-contain" /> : <div className="grid h-full place-items-center text-brand/55"><Bike size={32} strokeWidth={1.3} /></div>}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1"><h3 className="text-base font-semibold">{s.moto.nombre}</h3><span className="text-xs text-mute">{s.moto.anio}</span></div>
              <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-xs">
                <span className="inline-flex items-center gap-1.5 text-mute"><Gauge size={14} className="text-brand" /> {s.moto.kilometrajeActual.toLocaleString('es-CO')} km</span>
                <span className="text-mute">Último cambio de aceite: <strong className="font-medium text-ink">{formatFecha(s.moto.fechaUltimoCambioAceite)}</strong></span>
              </div>
            </div>
            <button type="button" onClick={() => onNavigate?.('moto')} className="inline-flex min-h-10 items-center justify-center gap-1 rounded-xl border border-white/[0.08] px-3 py-2 text-sm font-medium text-ink transition hover:border-brand/25 hover:text-brand sm:shrink-0">Ver moto <ChevronRight size={15} /></button>
          </div> : <div className="flex items-center gap-3 py-1 text-sm text-mute"><Bike size={20} className="text-brand/70" /> No hay información de la moto disponible.</div>}
        </Card>
      </section>
    </div>
  )
}
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

  const up = (p: Partial<Mov>) =>
    setF({ ...f, ...p })

  const ok = f.desc.trim() && f.monto > 0 && f.fecha

  return (
    <Modal
      title={mov ? 'Editar movimiento' : 'Nuevo movimiento'}
      onClose={onClose}
    >
      <div className="space-y-3">

        <div className="grid grid-cols-2 gap-2">
          {(['gasto', 'ingreso'] as Tipo[]).map(t => (
            <button
              key={t}
              onClick={() => up({ tipo: t })}
              className={`
                rounded-xl
                border
                py-2.5
                text-sm
                capitalize
                transition-all duration-200
                ${f.tipo === t
                  ? t === 'gasto'
                    ? 'border-neg/20 bg-neg text-bg shadow-[0_0_18px_rgba(255,123,123,0.12)]'
                    : 'border-brand/20 bg-brand text-bg shadow-[0_0_18px_rgba(112,214,165,0.12)]'
                  : 'border-white/[0.05] bg-white/[0.025] text-mute hover:bg-white/[0.05] hover:text-ink'
                }
              `}
            >
              {t}
            </button>
          ))}
        </div>

        <Field label="Descripción">
          <input
            className={inp}
            value={f.desc}
            onChange={e => up({ desc: e.target.value })}
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Monto">
            <input
              className={inp}
              type="number"
              min={0}
              value={f.monto || ''}
              onChange={e =>
                up({ monto: Number(e.target.value) })
              }
            />
          </Field>

          <Field label="Fecha">
            <input
              className={inp}
              type="date"
              value={f.fecha}
              onChange={e =>
                up({ fecha: e.target.value })
              }
            />
          </Field>
        </div>

        <Field label="Categoría">
          <select
            className={inp}
            value={f.cat}
            onChange={e =>
              up({ cat: e.target.value })
            }
          >
            {!s.cats.includes(f.cat) && f.cat && (
              <option>{f.cat}</option>
            )}

            {s.cats.map(c => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </Field>

        <Field label="Cartera (opcional)">
          <select
            className={inp}
            value={f.cartera ?? ''}
            onChange={e =>
              up({
                cartera: e.target.value || undefined,
              })
            }
          >
            <option value="">Sin cartera</option>

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
              desc: f.desc.trim(),
            })
          }
        >
          Guardar
        </button>
      </div>
    </Modal>
  )
}

export function Movimientos({ s }: { s: Store }) {
  const [q, setQ] = useState('')
  const [tipo, setTipo] = useState('')
  const [cat, setCat] = useState('')
  const [cart, setCart] = useState('')

  const list = sorted(s.movs).filter(
    m =>
      m.desc.toLowerCase().includes(q.toLowerCase()) &&
      (!tipo || m.tipo === tipo) &&
      (!cat || m.cat === cat) &&
      (!cart ||
        (cart === 'none'
          ? !m.cartera
          : m.cartera === cart))
  )

  return (
    <div>
      <Title
        right={
          <button
            className={btn}
            onClick={() => s.openMov()}
          >
            <Plus size={16} />
            Nuevo
          </button>
        }
      >
        Movimientos
      </Title>

      <div
        className="
    mb-4
    grid grid-cols-2 gap-2 md:grid-cols-4
    rounded-2xl
    border border-white/[0.06]
    bg-white/[0.018]
    p-2
    shadow-[0_8px_30px_rgba(0,0,0,0.10)]
    backdrop-blur-xl
  "
      >
        <div className="relative col-span-2 md:col-span-1">
          <Search
            size={16}
            className="absolute left-3 top-3 text-mute"
          />

          <input
            className={`${inp} pl-9`}
            placeholder="Buscar…"
            value={q}
            onChange={e => setQ(e.target.value)}
          />
        </div>

        <select
          className={inp}
          value={tipo}
          onChange={e => setTipo(e.target.value)}
        >
          <option value="">Todos los tipos</option>
          <option value="ingreso">Ingresos</option>
          <option value="gasto">Gastos</option>
        </select>

        <select
          className={inp}
          value={cat}
          onChange={e => setCat(e.target.value)}
        >
          <option value="">Todas las categorías</option>

          {s.cats.map(c => (
            <option key={c}>{c}</option>
          ))}
        </select>

        <select
          className={inp}
          value={cart}
          onChange={e => setCart(e.target.value)}
        >
          <option value="">Todas las carteras</option>
          <option value="none">Sin cartera</option>

          {s.carts.map(c => (
            <option
              key={c.id}
              value={c.id}
            >
              {c.nombre}
            </option>
          ))}
        </select>
      </div>

      <Card className=" !p-2 bg-gradient-to-br from-white/[0.035] via-white/[0.02] to-transparent ">
        {list.length ? (
          list.map(m => (
            <MovRow
              key={m.id}
              m={m}
              s={s}
              actions
            />
          ))
        ) : (
          <Empty t="No hay movimientos con esos filtros." />
        )}
      </Card>
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

        <div className="grid grid-cols-2 gap-3">
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

export function Carteras({ s }: { s: Store }) {
  const [edit, setEdit] = useState<Cartera | null>(null)
  const [transferOpen, setTransferOpen] = useState(false)

  const isNew =
    edit && !s.carts.some(c => c.id === edit.id)

  const save = async () => {
    if (!edit || !edit.nombre.trim()) return

    try {
      if (isNew) {
        const nueva = await createCartera({
          nombre: edit.nombre.trim(),
          saldoInicial: edit.saldoInicial,
          incluirEnTotal: edit.incluirEnTotal,
        })

        s.setCarts([
          ...s.carts,
          nueva,
        ])
      } else {
        const actualizada = await updateCartera(edit)

        s.setCarts(
          s.carts.map(c =>
            c.id === actualizada.id
              ? actualizada
              : c
          )
        )
      }

      setEdit(null)
    } catch (error) {
      console.error('Error guardando cartera:', error)

      s.showAlert({
        title: 'Error',
        message:
          'No se pudo guardar la cartera en Supabase.',
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
              m.cartera === c.id
                ? { ...m, cartera: undefined }
                : m
            )
          )

          try {
            await deleteTransferencia(c.id)

            s.setTransfers(
              s.transfers.filter(
                t => t.id !== c.id
              )
            )
          } catch (error) {
            console.error(
              'Error eliminando transferencia:',
              error
            )

            s.showAlert({
              title: 'Error',
              message:
                'No se pudo eliminar la transferencia de Supabase.',
              variant: 'danger',
              confirmText: 'Entendido',
            })
          }

          s.setCarts(
            s.carts.filter(
              x => x.id !== c.id
            )
          )
        } catch (error) {
          console.error(
            'Error eliminando cartera:',
            error
          )

          s.showAlert({
            title: 'Error',
            message:
              'No se pudo eliminar la cartera de Supabase.',
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
      const cartera = s.carts.find(
        c => c.id === t.desde
      )

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
      const nueva =
        await createTransferencia(t)

      s.setTransfers([
        nueva,
        ...s.transfers,
      ])

      setTransferOpen(false)
    } catch (error) {
      console.error(
        'Error creando transferencia:',
        error
      )

      s.showAlert({
        title: 'Error',
        message:
          'No se pudo guardar la transferencia en Supabase.',
        variant: 'danger',
        confirmText: 'Entendido',
      })
    }
  }

  return (
    <div>
      <Title
        right={
          <div className="flex gap-2">
            <button
              className="
                inline-flex items-center gap-2
                rounded-xl
                border border-white/[0.07]
                bg-white/[0.025]
                px-4 py-2.5
                text-sm font-medium
                text-mute
                shadow-[0_8px_20px_rgba(0,0,0,0.08)]
                backdrop-blur-md
                transition-all duration-200
                hover:border-white/[0.11]
                hover:bg-white/[0.05]
                hover:text-ink
                active:scale-[0.98]
              "
              onClick={() =>
                setTransferOpen(true)
              }
            >
              <ArrowLeftRight size={16} />
              Transferir
            </button>

            <button
              className={btn}
              onClick={() =>
                setEdit({
                  id: '',
                  nombre: '',
                  saldoInicial: 0,
                  incluirEnTotal: true,
                })
              }
            >
              <Plus size={16} />
              Nueva
            </button>
          </div>
        }
      >
        Carteras
      </Title>

      <div className="grid gap-4 sm:grid-cols-2">
        {s.carts.map(c => (
          <Card
            key={c.id}
            className="
              group
              bg-gradient-to-br
              from-brand/[0.035]
              via-white/[0.02]
              to-transparent
              hover:-translate-y-0.5
              hover:border-white/[0.11]
              hover:shadow-[0_14px_40px_rgba(0,0,0,0.18)]
            "
          >
            {/* Ambient glow */}
            <div
              className="
                pointer-events-none
                absolute -right-12 -top-12
                h-32 w-32
                rounded-full
                bg-brand/[0.06]
                blur-3xl
                transition-all duration-300
                group-hover:bg-brand/[0.10]
              "
            />

            <div className="relative">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-medium uppercase tracking-[0.08em] text-mute">
                    {c.nombre}
                  </p>

                  <p className="mt-2 text-2xl font-semibold tracking-tight text-ink">
                    {money(s.saldo(c.id))}
                  </p>

                  <p className="mt-1 text-xs text-mute">
                    Saldo actual
                  </p>
                </div>

                <div className="flex opacity-60 transition-opacity duration-200 group-hover:opacity-100">
                  <IconBtn onClick={() => setEdit(c)}>
                    <Pencil size={16} />
                  </IconBtn>

                  <IconBtn onClick={() => remove(c)}>
                    <Trash2 size={16} />
                  </IconBtn>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between gap-3">
                <span
                  className={`
                    inline-flex items-center
                    rounded-lg
                    px-2.5 py-1
                    text-[11px] font-medium
                    ${c.incluirEnTotal
                      ? 'bg-brand/[0.08] text-brand'
                      : 'bg-white/[0.04] text-mute'
                    }
                  `}
                >
                  {c.incluirEnTotal
                    ? 'Incluida en total'
                    : 'Fuera del total'}
                </span>

                <label
                  className="
                    flex cursor-pointer
                    items-center gap-2
                    text-xs text-mute
                  "
                  title="Incluir en balance total"
                >
                  <span>Balance</span>

                  <input
                    type="checkbox"
                    className="h-4 w-4 cursor-pointer accent-[#70d6a5]"
                    checked={c.incluirEnTotal}
                    onChange={async e => {
                      const actualizada = {
                        ...c,
                        incluirEnTotal: e.target.checked,
                      }

                      try {
                        const resultado =
                          await updateCartera(actualizada)

                        s.setCarts(
                          s.carts.map(x =>
                            x.id === resultado.id
                              ? resultado
                              : x
                          )
                        )
                      } catch (error) {
                        console.error(
                          'Error actualizando balance:',
                          error
                        )

                        s.showAlert({
                          title: 'Error',
                          message:
                            'No se pudo actualizar la cartera.',
                          variant: 'danger',
                          confirmText: 'Entendido',
                        })
                      }
                    }}
                  />
                </label>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card
        className="
          mt-6
          bg-gradient-to-br
          from-white/[0.035]
          via-white/[0.02]
          to-transparent
        "
      >
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h3 className="font-semibold tracking-tight">
              Últimas transferencias
            </h3>

            <p className="mt-1 text-xs text-mute">
              Movimientos entre tus propias carteras
            </p>
          </div>

          <div
            className="
              grid h-9 w-9
              shrink-0
              place-items-center
              rounded-xl
              bg-brand/[0.07]
              text-brand
            "
          >
            <ArrowLeftRight size={16} />
          </div>
        </div>

        {s.transfers.length ? (
          <div className="space-y-1">
            {s.transfers
              .slice()
              .sort((a, b) =>
                b.fecha.localeCompare(a.fecha)
              )
              .slice(0, 8)
              .map(t => {
                const desde = s.carts.find(
                  c => c.id === t.desde
                )

                const hacia = s.carts.find(
                  c => c.id === t.hacia
                )

                return (
                  <div
                    key={t.id}
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
                    <div
                      className="
                        grid h-9 w-9
                        shrink-0
                        place-items-center
                        rounded-xl
                        bg-brand/[0.08]
                        text-brand
                        transition-all duration-200
                        group-hover:bg-brand/[0.11]
                      "
                    >
                      <ArrowLeftRight size={16} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {desde?.nombre ?? 'Cartera eliminada'}

                        <span className="mx-2 text-mute">
                          →
                        </span>

                        {hacia?.nombre ?? 'Cartera eliminada'}
                      </p>

                      <p className="mt-0.5 text-xs text-mute">
                        {t.fecha}
                      </p>
                    </div>

                    <span className="
                      rounded-lg
                      bg-white/[0.035]
                      px-2.5 py-1
                      text-sm font-semibold
                    ">
                      {money(t.monto)}
                    </span>

                    <div className="opacity-60 transition-opacity group-hover:opacity-100">
                      <IconBtn
                        onClick={() => {
                          s.showAlert({
                            title: 'Eliminar transferencia',
                            message:
                              '¿Estás seguro de que quieres eliminar esta transferencia? El saldo de las carteras se actualizará.',
                            variant: 'danger',
                            confirmText: 'Eliminar',
                            onConfirm: async () => {
                              try {
                                await deleteTransferencia(t.id)

                                s.setTransfers(
                                  s.transfers.filter(
                                    x => x.id !== t.id
                                  )
                                )
                              } catch (error) {
                                console.error(
                                  'Error eliminando transferencia:',
                                  error
                                )

                                s.showAlert({
                                  title: 'Error',
                                  message:
                                    'No se pudo eliminar la transferencia de Supabase.',
                                  variant: 'danger',
                                  confirmText: 'Entendido',
                                })
                              }
                            },
                          })
                        }}
                      >
                        <Trash2 size={15} />
                      </IconBtn>
                    </div>
                  </div>
                )
              })}
          </div>
        ) : (
          <Empty t="Aún no hay transferencias." />
        )}
      </Card>

      {edit && (
        <Modal
          title={
            isNew
              ? 'Nueva cartera'
              : 'Editar cartera'
          }
          onClose={() => setEdit(null)}
        >
          <div className="space-y-3">
            <Field label="Nombre">
              <input
                className={inp}
                value={edit.nombre}
                onChange={e =>
                  setEdit({
                    ...edit,
                    nombre: e.target.value,
                  })
                }
              />
            </Field>

            <Field label="Saldo inicial (antes de los movimientos)">
              <input
                className={inp}
                type="number"
                value={edit.saldoInicial}
                onChange={e =>
                  setEdit({
                    ...edit,
                    saldoInicial:
                      Number(e.target.value),
                  })
                }
              />
            </Field>

            <label className="flex items-center gap-2 text-sm text-mute">
              <input
                type="checkbox"
                className="accent-[#70d6a5]"
                checked={edit.incluirEnTotal}
                onChange={e =>
                  setEdit({
                    ...edit,
                    incluirEnTotal:
                      e.target.checked,
                  })
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
          onClose={() =>
            setTransferOpen(false)
          }
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

        s.setMetas([
          ...s.metas,
          nueva,
        ])
      } else {
        const actualizada = await updateMeta(edit)

        s.setMetas(
          s.metas.map(m =>
            m.id === actualizada.id
              ? actualizada
              : m
          )
        )
      }

      setEdit(null)
    } catch (error) {
      console.error(
        'Error guardando meta:',
        error
      )

      s.showAlert({
        title: 'Error',
        message:
          'No se pudo guardar la meta en Supabase.',
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

          s.setMetas(
            s.metas.filter(
              m => m.id !== meta.id
            )
          )
        } catch (error) {
          console.error(
            'Error eliminando meta:',
            error
          )

          s.showAlert({
            title: 'Error',
            message:
              'No se pudo eliminar la meta de Supabase.',
            variant: 'danger',
            confirmText: 'Entendido',
          })
        }
      },
    })
  }

  const getSaved = (meta: Meta) => {
    const saldoCarteras = meta.carteras.reduce(
      (total, carteraId) =>
        total + s.saldo(carteraId),
      0
    )

    return Math.max(
      0,
      meta.aporteManual + saldoCarteras
    )
  }

  const getCarterasNombres = (meta: Meta) => {
    return meta.carteras
      .map(id =>
        s.carts.find(c => c.id === id)?.nombre
      )
      .filter(Boolean)
  }

  const toggleCartera = (carteraId: string) => {
    if (!edit) return

    const seleccionada =
      edit.carteras.includes(carteraId)

    setEdit({
      ...edit,
      carteras: seleccionada
        ? edit.carteras.filter(
          id => id !== carteraId
        )
        : [
          ...edit.carteras,
          carteraId,
        ],
    })
  }

  return (
    <div>
      <Title
        right={
          <button
            className={btn}
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
            <Plus size={16} />
            Nueva meta
          </button>
        }
      >
        Metas
      </Title>

      {!s.metas.length ? (
        <Card
          className="
            bg-gradient-to-br
            from-brand/[0.035]
            via-white/[0.02]
            to-transparent
          "
        >
          <div className="relative py-10 text-center">
            <div
              className="
                pointer-events-none
                absolute left-1/2 top-1/2
                h-32 w-32
                -translate-x-1/2 -translate-y-1/2
                rounded-full
                bg-brand/[0.05]
                blur-3xl
              "
            />

            <div
              className="
                relative
                mx-auto mb-4
                grid h-14 w-14
                place-items-center
                rounded-2xl
                border border-brand/[0.10]
                bg-brand/[0.08]
                text-brand
                shadow-[0_0_25px_rgba(112,214,165,0.08)]
              "
            >
              <Target size={24} />
            </div>

            <h3 className="font-semibold tracking-tight">
              Aún no tienes metas
            </h3>

            <p className="mx-auto mt-1.5 max-w-sm text-sm leading-relaxed text-mute">
              Crea una meta para empezar a
              seguir tus ahorros y acercarte
              a tus objetivos.
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {s.metas.map(meta => {
            const saved = getSaved(meta)

            const percent =
              meta.objetivo > 0
                ? Math.min(
                  100,
                  (saved / meta.objetivo) * 100
                )
                : 0

            const nombresCarteras =
              getCarterasNombres(meta)

            const reached =
              saved >= meta.objetivo

            return (
              <Card
                key={meta.id}
                className={`
                  group
                  bg-gradient-to-br
                  ${reached
                    ? 'from-brand/[0.055]'
                    : 'from-white/[0.035]'
                  }
                  via-white/[0.02]
                  to-transparent
                  hover:-translate-y-0.5
                  hover:border-white/[0.11]
                  hover:shadow-[0_14px_40px_rgba(0,0,0,0.18)]
                `}
              >
                <div
                  className={`
                    pointer-events-none
                    absolute -right-12 -top-12
                    h-32 w-32
                    rounded-full
                    blur-3xl
                    transition-all duration-300
                    ${reached
                      ? 'bg-brand/[0.10] group-hover:bg-brand/[0.14]'
                      : 'bg-brand/[0.045] group-hover:bg-brand/[0.075]'
                    }
                  `}
                />

                <div className="relative">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2.5">
                        <span
                          className="
                            grid h-9 w-9
                            shrink-0
                            place-items-center
                            rounded-xl
                            border border-brand/[0.08]
                            bg-brand/[0.08]
                            text-brand
                            transition-all duration-200
                            group-hover:bg-brand/[0.11]
                          "
                        >
                          <Target size={17} />
                        </span>

                        <div className="min-w-0">
                          <h3 className="truncate font-semibold tracking-tight">
                            {meta.nombre}
                          </h3>

                          <p className="mt-0.5 text-[11px] text-mute">
                            {nombresCarteras.length
                              ? `${nombresCarteras.length} ${nombresCarteras.length === 1
                                ? 'cartera vinculada'
                                : 'carteras vinculadas'
                              }`
                              : 'Ahorro independiente'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div
                      className="
                        flex
                        opacity-60
                        transition-opacity duration-200
                        group-hover:opacity-100
                      "
                    >
                      <IconBtn
                        onClick={() =>
                          setEdit(meta)
                        }
                      >
                        <Pencil size={16} />
                      </IconBtn>

                      <IconBtn
                        onClick={() =>
                          remove(meta)
                        }
                      >
                        <Trash2 size={16} />
                      </IconBtn>
                    </div>
                  </div>

                  <div className="mt-6">
                    <div className="flex items-end justify-between gap-3">
                      <div>
                        <p className="text-2xl font-semibold tracking-tight text-brand">
                          {money(saved)}
                        </p>

                        <p className="mt-1 text-xs text-mute">
                          de {money(meta.objetivo)}
                        </p>
                      </div>

                      <div
                        className={`
                          rounded-lg
                          px-2.5 py-1
                          text-sm font-semibold
                          ${reached
                            ? 'bg-brand/[0.09] text-brand'
                            : 'bg-white/[0.04] text-mute'
                          }
                        `}
                      >
                        {percent.toFixed(1)}%
                      </div>
                    </div>

                    <div
                      className="
                        mt-4
                        h-2.5
                        overflow-hidden
                        rounded-full
                        border border-white/[0.03]
                        bg-white/[0.055]
                      "
                    >
                      <div
                        className="
                          h-full
                          rounded-full
                          bg-brand
                          shadow-[0_0_14px_rgba(112,214,165,0.24)]
                          transition-all duration-500
                        "
                        style={{
                          width: `${percent}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-2">
                    <div
                      className="
                        rounded-xl
                        border border-white/[0.045]
                        bg-white/[0.022]
                        p-3
                        transition-colors duration-200
                        group-hover:border-white/[0.06]
                      "
                    >
                      <p className="text-[11px] text-mute">
                        Aportes manuales
                      </p>

                      <p className="mt-1 text-sm font-semibold">
                        {money(meta.aporteManual)}
                      </p>
                    </div>

                    <div
                      className="
                        rounded-xl
                        border border-white/[0.045]
                        bg-white/[0.022]
                        p-3
                        transition-colors duration-200
                        group-hover:border-white/[0.06]
                      "
                    >
                      <p className="text-[11px] text-mute">
                        Desde carteras
                      </p>

                      <p className="mt-1 text-sm font-semibold">
                        {money(
                          meta.carteras.reduce(
                            (total, id) =>
                              total + s.saldo(id),
                            0
                          )
                        )}
                      </p>
                    </div>
                  </div>

                  {nombresCarteras.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {nombresCarteras.map(nombre => (
                        <span
                          key={nombre}
                          className="
                            rounded-lg
                            border border-brand/[0.08]
                            bg-brand/[0.045]
                            px-2 py-1
                            text-[11px]
                            text-brand/80
                          "
                        >
                          {nombre}
                        </span>
                      ))}
                    </div>
                  )}

                  {nombresCarteras.length > 0 && (
                    <p className="mt-3 text-xs leading-relaxed text-mute">
                      La meta incluye automáticamente
                      el saldo actual de las carteras
                      seleccionadas.
                    </p>
                  )}

                  {reached && (
                    <div
                      className="
                        mt-4
                        flex items-center gap-2
                        rounded-xl
                        border border-brand/[0.15]
                        bg-brand/[0.06]
                        px-3 py-2.5
                        text-xs font-medium
                        text-brand
                        shadow-[0_0_18px_rgba(112,214,165,0.04)]
                      "
                    >
                      <Check size={14} />
                      Meta alcanzada
                    </div>
                  )}
                </div>
              </Card>
            )
          })}
        </div>
      )}

      {edit && (
        <Modal
          title={
            isNew
              ? 'Nueva meta'
              : 'Editar meta'
          }
          onClose={() =>
            setEdit(null)
          }
        >
          <div className="space-y-3">
            <Field label="Nombre">
              <input
                className={inp}
                placeholder="Ej. Moto"
                value={edit.nombre}
                onChange={e =>
                  setEdit({
                    ...edit,
                    nombre: e.target.value,
                  })
                }
              />
            </Field>

            <Field label="Valor objetivo">
              <input
                className={inp}
                type="number"
                min={0}
                value={
                  edit.objetivo || ''
                }
                onChange={e =>
                  setEdit({
                    ...edit,
                    objetivo:
                      Number(e.target.value),
                  })
                }
              />
            </Field>

            <Field label="Aportes manuales">
              <input
                className={inp}
                type="number"
                min={0}
                value={
                  edit.aporteManual || ''
                }
                onChange={e =>
                  setEdit({
                    ...edit,
                    aporteManual:
                      Number(e.target.value),
                  })
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
                    const checked =
                      edit.carteras.includes(c.id)

                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() =>
                          toggleCartera(c.id)
                        }
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
                          {checked && (
                            <Check size={13} />
                          )}
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
                    (total, carteraId) =>
                      total +
                      s.saldo(carteraId),
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
    <div className="space-y-6">
      <Title
        right={
          <div
            className="
              rounded-xl
              border border-white/[0.06]
              bg-white/[0.018]
              p-1
              shadow-[0_8px_24px_rgba(0,0,0,0.10)]
              backdrop-blur-xl
            "
          >
            <select
              className="
                !w-auto
                rounded-lg
                border-0
                bg-transparent
                px-3 py-1.5
                text-sm
                text-ink
                outline-none
                focus:ring-0
              "
              value={p}
              onChange={e => setP(e.target.value)}
            >
              {PERIODS.map(([v, l]) => (
                <option
                  key={v}
                  value={v}
                >
                  {l}
                </option>
              ))}
            </select>
          </div>
        }
      >
        Análisis
      </Title>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {stats.map(([l, v, c], index) => (
          <Card
            key={l}
            className={`
              !p-4
              bg-gradient-to-br
              ${index === 0
                ? 'from-brand/[0.045] via-white/[0.02] to-transparent'
                : index === 1
                  ? 'from-neg/[0.04] via-white/[0.02] to-transparent'
                  : 'from-white/[0.035] via-white/[0.02] to-transparent'
              }
              hover:-translate-y-0.5
              hover:shadow-[0_12px_32px_rgba(0,0,0,0.14)]
            `}
          >
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-medium text-mute">
                {l}
              </p>

              <span
                className={`
                  h-1.5 w-1.5
                  rounded-full
                  ${l === 'Ingresos'
                    ? 'bg-brand shadow-[0_0_8px_rgba(112,214,165,0.35)]'
                    : l === 'Gastos'
                      ? 'bg-neg shadow-[0_0_8px_rgba(255,123,123,0.30)]'
                      : 'bg-white/[0.30]'
                  }
                `}
              />
            </div>

            <p
              className={`mt-2 text-xl font-semibold tracking-tight ${c}`}
            >
              {v}
            </p>
          </Card>
        ))}
      </div>

      <Card
        className="
          bg-gradient-to-br
          from-white/[0.035]
          via-white/[0.02]
          to-transparent
        "
      >
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h3 className="font-semibold tracking-tight">
              Gastos por categoría
            </h3>

            <p className="mt-1 text-xs text-mute">
              Distribución de tus gastos en el período seleccionado
            </p>
          </div>

          <div
            className="
              grid h-9 w-9
              shrink-0
              place-items-center
              rounded-xl
              bg-neg/[0.07]
              text-neg
            "
          >
            <Target size={16} />
          </div>
        </div>

        <CatChart ms={ms} />
      </Card>

      <Card
        className="
          bg-gradient-to-br
          from-white/[0.035]
          via-white/[0.02]
          to-transparent
        "
      >
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h3 className="font-semibold tracking-tight">
              Evolución de ingresos y gastos
            </h3>

            <p className="mt-1 text-xs text-mute">
              Comparación de tus movimientos a lo largo del período
            </p>
          </div>

          <div
            className="
              hidden
              items-center gap-3
              text-[11px] text-mute
              sm:flex
            "
          >
            <span className="flex items-center gap-1.5">
              <i className="h-2 w-2 rounded-full bg-brand" />
              Ingresos
            </span>

            <span className="flex items-center gap-1.5">
              <i className="h-2 w-2 rounded-full bg-neg" />
              Gastos
            </span>
          </div>
        </div>

        {data.length ? (
          <div
            className="
              rounded-xl
              border border-white/[0.035]
              bg-white/[0.012]
              p-2
            "
          >
            <div className="h-64">
              <ResponsiveContainer>
                <BarChart data={data}>
                  <CartesianGrid
                    stroke="#ffffff10"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="k"
                    stroke="#8b9691"
                    fontSize={12}
                  />

                  <YAxis
                    stroke="#8b9691"
                    fontSize={12}
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
                    radius={[4, 4, 0, 0]}
                  />

                  <Bar
                    dataKey="Gastos"
                    fill="#ff7b7b"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <Empty t="No hay movimientos en este período." />
        )}
      </Card>
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
    <div className="space-y-6">
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

  const prioridadStyle = {
    baja: 'bg-[#7bb6ff]/[0.08] text-[#7bb6ff]',
    media: 'bg-[#ffd27b]/[0.08] text-[#ffd27b]',
    alta: 'bg-neg/[0.08] text-neg',
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

  return (
    <section className="space-y-6">

      <Title>
        <div>
          <h1 className="text-2xl font-semibold">
            Tareas
          </h1>

          <p className="mt-1 text-sm text-mute">
            Organiza tus pendientes
          </p>
        </div>
      </Title>

      {/* Resumen */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-mute">
                Pendientes
              </p>

              <p className="mt-1 text-2xl font-semibold">
                {pendientes.length}
              </p>
            </div>

            <div className="
              flex h-10 w-10
              items-center justify-center
              rounded-xl
              bg-brand/[0.08]
              text-brand
            ">
              <Circle size={20} />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-mute">
                Completadas
              </p>

              <p className="mt-1 text-2xl font-semibold">
                {completadas.length}
              </p>
            </div>

            <div className="
              flex h-10 w-10
              items-center justify-center
              rounded-xl
              bg-brand/[0.08]
              text-brand
            ">
              <CheckCircle2 size={20} />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-mute">
                Total
              </p>

              <p className="mt-1 text-2xl font-semibold">
                {s.tareas.length}
              </p>
            </div>

            <div className="
              flex h-10 w-10
              items-center justify-center
              rounded-xl
              bg-white/[0.05]
              text-mute
            ">
              <CheckSquare size={20} />
            </div>
          </div>
        </Card>

      </div>

      {/* Botón nueva tarea */}
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className={btn}
        >
          <Plus size={18} />
          Nueva tarea
        </button>
      )}

      {/* Formulario */}
      {showForm && (
        <Card>
          <div className="space-y-5">

            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold">
                  Nueva tarea
                </h2>

                <p className="mt-1 text-sm text-mute">
                  Agrega los detalles de tu pendiente.
                </p>
              </div>

              <button
                onClick={() => setShowForm(false)}
                className="text-mute hover:text-ink"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">

              <Field label="Título">
                <input
                  value={titulo}
                  onChange={e =>
                    setTitulo(e.target.value)
                  }
                  placeholder="Ej. Estudiar para el examen"
                  className={inp}
                  autoFocus
                />
              </Field>

              <Field label="Descripción">
                <textarea
                  value={descripcion}
                  onChange={e =>
                    setDescripcion(e.target.value)
                  }
                  placeholder="Agrega una descripción opcional..."
                  className={`${inp} min-h-[100px] resize-none`}
                />
              </Field>

              <div className="
                grid grid-cols-1
                gap-4
                sm:grid-cols-2
              ">

                <Field label="Fecha">
                  <input
                    type="date"
                    value={fecha}
                    onChange={e =>
                      setFecha(e.target.value)
                    }
                    className={inp}
                  />
                </Field>

                <Field label="Prioridad">
                  <select
                    value={prioridad}
                    onChange={e =>
                      setPrioridad(
                        e.target.value as Tarea['prioridad']
                      )
                    }
                    className={inp}
                  >
                    <option value="baja">
                      Baja
                    </option>

                    <option value="media">
                      Media
                    </option>

                    <option value="alta">
                      Alta
                    </option>
                  </select>
                </Field>

              </div>

            </div>

            <div className="
              flex justify-end
              gap-2
              border-t border-white/[0.06]
              pt-4
            ">
              <button
                onClick={() => setShowForm(false)}
                className="
                  rounded-xl
                  px-4 py-2.5
                  text-sm
                  text-mute
                  transition
                  hover:bg-white/[0.04]
                  hover:text-ink
                "
              >
                Cancelar
              </button>

              <button
                onClick={guardar}
                className={btn}
              >
                <Check size={17} />
                Guardar tarea
              </button>
            </div>

          </div>
        </Card>
      )}

      {/* Pendientes */}
      <div className="space-y-3">

        <div className="
          flex items-center
          justify-between
        ">
          <div>
            <h2 className="font-semibold">
              Pendientes
            </h2>

            <p className="mt-1 text-sm text-mute">
              {pendientes.length === 0
                ? 'No tienes tareas pendientes'
                : `${pendientes.length} ${pendientes.length === 1
                  ? 'tarea pendiente'
                  : 'tareas pendientes'
                }`
              }
            </p>
          </div>
        </div>

        {pendientes.length === 0 ? (
          <Empty t="No tienes tareas pendientes." />
        ) : (
          <div className="space-y-3">

            {pendientes.map(tarea => (
              <Card key={tarea.id}>

                <div className="
                  flex
                  items-start
                  gap-3
                ">

                  <button
                    onClick={() =>
                      cambiarEstado(tarea)
                    }
                    className="
                      mt-0.5
                      shrink-0
                      text-mute
                      transition
                      hover:text-brand
                    "
                    title="Marcar como completada"
                  >
                    <Circle size={22} />
                  </button>

                  <div className="min-w-0 flex-1">

                    <div className="
                      flex
                      flex-wrap
                      items-start
                      justify-between
                      gap-2
                    ">

                      <p className="
                        font-medium
                        text-ink
                        break-words
                      ">
                        {tarea.titulo}
                      </p>

                      <span className={`
                        rounded-full
                        px-2.5 py-1
                        text-xs
                        font-medium
                        ${prioridadStyle[tarea.prioridad]}
                      `}>
                        {prioridadLabel[tarea.prioridad]}
                      </span>

                    </div>

                    {tarea.descripcion && (
                      <p className="
                        mt-1.5
                        text-sm
                        leading-relaxed
                        text-mute
                      ">
                        {tarea.descripcion}
                      </p>
                    )}

                    {tarea.fecha && (
                      <div className="
                        mt-3
                        flex
                        items-center
                        gap-2
                        text-xs
                        text-mute
                      ">
                        <span>
                          📅
                        </span>

                        <span>
                          {formatearFecha(tarea.fecha)}
                        </span>
                      </div>
                    )}

                  </div>

                  <button
                    onClick={() =>
                      eliminar(tarea)
                    }
                    className="
                      shrink-0
                      rounded-lg
                      p-1.5
                      text-mute
                      transition
                      hover:bg-neg/[0.08]
                      hover:text-neg
                    "
                    title="Eliminar tarea"
                  >
                    <Trash2 size={18} />
                  </button>

                </div>

              </Card>
            ))}

          </div>
        )}

      </div>

      {/* Completadas */}
      {completadas.length > 0 && (
        <div className="space-y-3">

          <div>
            <h2 className="font-semibold">
              Completadas
            </h2>

            <p className="mt-1 text-sm text-mute">
              {completadas.length} {
                completadas.length === 1
                  ? 'tarea completada'
                  : 'tareas completadas'
              }
            </p>
          </div>

          <div className="space-y-3">

            {completadas.map(tarea => (
              <Card key={tarea.id}>

                <div className="
                  flex
                  items-center
                  gap-3
                ">

                  <button
                    onClick={() =>
                      cambiarEstado(tarea)
                    }
                    className="
                      shrink-0
                      text-brand
                      transition
                      hover:opacity-70
                    "
                    title="Marcar como pendiente"
                  >
                    <CheckCircle2 size={22} />
                  </button>

                  <div className="min-w-0 flex-1">

                    <p className="
                      text-sm
                      text-mute
                      line-through
                      break-words
                    ">
                      {tarea.titulo}
                    </p>

                    {tarea.fecha && (
                      <p className="
                        mt-1
                        text-xs
                        text-mute/60
                      ">
                        {formatearFecha(tarea.fecha)}
                      </p>
                    )}

                  </div>

                  <button
                    onClick={() =>
                      eliminar(tarea)
                    }
                    className="
                      shrink-0
                      rounded-lg
                      p-1.5
                      text-mute
                      transition
                      hover:bg-neg/[0.08]
                      hover:text-neg
                    "
                    title="Eliminar tarea"
                  >
                    <Trash2 size={18} />
                  </button>

                </div>

              </Card>
            ))}

          </div>

        </div>
      )}

    </section>
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
    <section className="space-y-6 md:space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-brand/75">
            Productividad
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
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
    <section className="space-y-6 md:space-y-8">
      <Card className="relative isolate overflow-hidden !p-0">
        <div className="relative aspect-video max-h-[520px] overflow-hidden bg-[#101719]">
          {s.moto?.imagenUrl ? (
            <img src={s.moto.imagenUrl} alt={motoNombre} className="absolute inset-0 h-full w-full bg-[#101719] object-contain" />
          ) : (
            <div className="absolute inset-0 grid place-items-center bg-[radial-gradient(circle_at_70%_30%,rgba(112,214,165,0.15),transparent_40%),linear-gradient(135deg,#151f20,#0a0d0f)]">
              <div className="grid h-24 w-24 place-items-center rounded-3xl border border-white/[0.08] bg-black/20 text-brand/70 backdrop-blur">
                <Bike size={54} strokeWidth={1.2} />
              </div>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#080b0c]/95 via-[#080b0c]/20 to-black/20" />
          <div className="absolute right-4 top-4 sm:right-6 sm:top-6">
            <button onClick={abrirEdicionMoto} className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-black/35 px-3 py-2 text-sm text-white/90 backdrop-blur-md transition hover:bg-black/55">
              <Pencil size={15} /> <span className="hidden sm:inline">Editar moto</span><span className="sm:hidden">Editar</span>
            </button>
          </div>
          <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">Mi moto</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white drop-shadow sm:text-5xl">
              {motoNombre}
            </h1>
            <p className="mt-1 text-sm text-white/75">{s.moto?.marca ?? 'Bajaj'} · {s.moto?.modelo ?? 'NS160 FI'} · {motoAnio}</p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm font-medium text-white/90 backdrop-blur-md">
              <Gauge size={17} className="text-brand" />
              {formatKm(s.moto?.kilometrajeActual ?? 0)}
            </div>
          </div>
        </div>
      </Card>

      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="!p-4 sm:!p-5">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand/[0.08] text-brand"><Gauge size={19} /></span>
            <div><p className="text-xs text-mute">Kilometraje actual</p><p className="mt-1 font-semibold">{formatKm(s.moto?.kilometrajeActual ?? 0)}</p></div>
          </div>
        </Card>
        <Card className="!p-4 sm:!p-5">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#7bb6ff]/[0.08] text-[#7bb6ff]"><Droplets size={19} /></span>
            <div><p className="text-xs text-mute">Último cambio de aceite</p><p className="mt-1 font-semibold">{s.moto?.ultimoCambioAceite == null ? 'Sin registrar' : formatKm(s.moto.ultimoCambioAceite)}</p></div>
          </div>
        </Card>
        <Card className="!p-4 sm:!p-5">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#ffd27b]/[0.08] text-[#ffd27b]"><CalendarDays size={19} /></span>
            <div><p className="text-xs text-mute">Fecha del cambio</p><p className="mt-1 font-semibold">{formatFecha(s.moto?.fechaUltimoCambioAceite)}</p></div>
          </div>
        </Card>
      </div>

      <section className="space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-brand/75">Historial</p>
            <h2 className="mt-1 text-xl font-semibold tracking-tight">Mantenimientos</h2>
            <p className="mt-1 text-sm text-mute">Servicios y reparaciones realizados.</p>
          </div>
          <button onClick={abrirNuevoMantenimiento} className={btn + ' w-full justify-center sm:w-auto'}>
            <Plus size={17} /> Registrar mantenimiento
          </button>
        </div>

        {s.mantenimientosMoto.length === 0 ? (
          <Card><Empty t="Aún no hay mantenimientos registrados." /></Card>
        ) : (
          <div className="space-y-3">
            {s.mantenimientosMoto.map(registro => (
              <Card key={registro.id} className="!p-4 sm:!p-5">
                <div className="flex items-start gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand/[0.08] text-brand"><Wrench size={18} /></span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold">{registro.tipo}</h3>
                        <p className="mt-1 text-xs text-mute">{formatFecha(registro.fecha)}</p>
                      </div>
                      <p className="font-semibold text-brand">{money(registro.costo)}</p>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-mute">
                      <span className="inline-flex items-center gap-1.5"><Gauge size={14} /> {formatKm(registro.kilometraje)}</span>
                    </div>
                    {registro.notas && <p className="mt-3 border-t border-white/[0.05] pt-3 text-sm leading-relaxed text-mute">{registro.notas}</p>}
                  </div>
                  <div className="flex shrink-0 items-center gap-0.5">
                    <button onClick={() => abrirEdicionMantenimiento(registro)} aria-label="Editar mantenimiento" title="Editar" className="rounded-lg p-2 text-mute transition hover:bg-white/[0.05] hover:text-ink"><Pencil size={15} /></button>
                    <button onClick={() => confirmarEliminarMantenimiento(registro)} aria-label="Eliminar mantenimiento" title="Eliminar" className="rounded-lg p-2 text-mute transition hover:bg-neg/[0.08] hover:text-neg"><Trash2 size={15} /></button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-brand/75">Gastos</p>
            <h2 className="mt-1 text-xl font-semibold tracking-tight">Gastos de la moto</h2>
            <p className="mt-1 text-sm text-mute">Registro de costos asociados.</p>
          </div>
          <button onClick={abrirNuevoGasto} className={btn + ' w-full justify-center sm:w-auto'}>
            <Plus size={17} /> Agregar gasto
          </button>
        </div>

        <div className="grid gap-3 lg:grid-cols-[0.8fr_1.2fr]">
          <Card className="relative isolate overflow-hidden !p-5 sm:!p-6">
            <div className="pointer-events-none absolute -right-12 -top-16 -z-10 h-40 w-40 rounded-full bg-brand/[0.08] blur-3xl" />
            <p className="text-sm text-mute">Total de gastos registrados</p>
            <p className="mt-3 break-words text-3xl font-semibold tracking-tight text-brand">{money(totalGastos)}</p>
            <p className="mt-2 text-xs text-mute">{s.gastosMoto.length} {s.gastosMoto.length === 1 ? 'registro' : 'registros'}</p>
          </Card>
          <Card className="!p-5 sm:!p-6">
            <div className="mb-4 flex items-center gap-2">
              <Tag size={17} className="text-brand" />
              <h3 className="font-semibold">Gastos por categoría</h3>
            </div>
            {gastosPorCategoria.length === 0 ? (
              <p className="text-sm text-mute">Las categorías aparecerán al registrar gastos.</p>
            ) : (
              <div className="space-y-3">
                {gastosPorCategoria.map(([categoria, valor]) => (
                  <div key={categoria}>
                    <div className="mb-1 flex items-center justify-between gap-3 text-xs">
                      <span className="truncate text-mute">{categoria}</span>
                      <span className="shrink-0 text-ink/90">{money(valor)}</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.05]">
                      <div className="h-full rounded-full bg-brand/75" style={{ width: String((valor / gastoMaximoCategoria) * 100) + '%' }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        <div className="flex items-center gap-2 pt-2">
          <CircleDollarSign size={18} className="text-brand" />
          <h3 className="font-semibold">Gastos recientes</h3>
        </div>
        {s.gastosMoto.length === 0 ? (
          <Card><Empty t="Aún no hay gastos registrados." /></Card>
        ) : (
          <div className="space-y-2">
            {s.gastosMoto.slice(0, 10).map(gasto => (
              <Card key={gasto.id} className="!p-3.5 sm:!p-4">
                <div className="flex items-center gap-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/[0.035] text-mute"><Fuel size={17} /></span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate text-sm font-medium">{gasto.descripcion}</p>
                      <span className="rounded-full border border-white/[0.06] bg-white/[0.025] px-2 py-0.5 text-[10px] text-mute">{gasto.categoria}</span>
                    </div>
                    <p className="mt-1 text-xs text-mute">{formatFecha(gasto.fecha)}</p>
                  </div>
                  <p className="shrink-0 text-sm font-semibold">{money(gasto.valor)}</p>
                  <div className="flex shrink-0 items-center gap-0.5">
                    <button onClick={() => abrirEdicionGasto(gasto)} aria-label="Editar gasto" title="Editar" className="rounded-lg p-2 text-mute transition hover:bg-white/[0.05] hover:text-ink"><Pencil size={15} /></button>
                    <button onClick={() => confirmarEliminarGasto(gasto)} aria-label="Eliminar gasto" title="Eliminar" className="rounded-lg p-2 text-mute transition hover:bg-neg/[0.08] hover:text-neg"><Trash2 size={15} /></button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

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

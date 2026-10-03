import { ReactNode, useState } from 'react'
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
} from 'lucide-react'
import {
  AlertOptions,
  Cartera,
  Meta,
  Mov,
  Store,
  Tarea,
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

export function Dashboard({ s }: { s: Store }) {
  const [hide, setHide] = useState(false)

  const now = new Date()
  const hora = now.getHours()

  const saludo =
    hora < 12
      ? 'Buenos días'
      : hora < 19
        ? 'Buenas tardes'
        : 'Buenas noches'

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

  const pendientes = s.tareas.filter(t => !t.completada)
  const completadas = s.tareas.filter(t => t.completada)

  const mask = (n: number) => (hide ? '$ ••••••' : money(n))

  const fechaActual = new Intl.DateTimeFormat('es-CO', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(now)

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Encabezado */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-brand/75">
            {fechaActual}
          </p>

          <h1 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
            {saludo}, Joseph
          </h1>

          <p className="mt-1 text-sm text-mute">
            Tu espacio financiero, de un vistazo.
          </p>
        </div>

        <button
          className={`${btn} w-full justify-center sm:w-auto`}
          onClick={() => s.openMov()}
        >
          <Plus size={16} />
          Nuevo movimiento
        </button>
      </header>

      {/* Balance principal */}
      
      <Card className="relative isolate overflow-hidden !p-5 sm:!p-7" >
        
        <div className="pointer-events-none absolute -right-20 -top-24 -z-10 h-64 w-64 rounded-full bg-brand/[0.12] blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 left-1/3 -z-10 h-56 w-56 rounded-full bg-emerald-300/[0.05] blur-3xl" />
        


        <div className="relative">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm text-mute">Balance total</p>
              <p className="mt-1 text-xs text-mute/70">
                Carteras incluidas en tu balance
              </p>
            </div>

            <IconBtn onClick={() => setHide(value => !value)}>
              {hide ? <EyeOff size={16} /> : <Eye size={16} />}
            </IconBtn>
          </div>

          <p className="mt-5 break-words text-4xl font-semibold tracking-tight text-brand sm:text-5xl">
            {mask(total)}
          </p>

          <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/[0.06] bg-black/[0.12] p-4">
              <p className="text-xs text-mute">Ingresos este mes</p>
              <p className="mt-2 text-lg font-semibold tracking-tight text-brand">
                {mask(ingresosMes)}
              </p>
            </div>

            <div className="rounded-2xl border border-white/[0.06] bg-black/[0.12] p-4">
              <p className="text-xs text-mute">Gastos este mes</p>
              <p className="mt-2 text-lg font-semibold tracking-tight text-neg">
                {mask(gastosMes)}
              </p>
            </div>

            <div className="rounded-2xl border border-white/[0.06] bg-black/[0.12] p-4">
              <p className="text-xs text-mute">Balance del mes</p>
              <p
                className={`mt-2 text-lg font-semibold tracking-tight ${balanceMes >= 0 ? 'text-brand' : 'text-neg'
                  }`}
              >
                {mask(balanceMes)}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Carteras */}
      <section>
        <div className="mb-3 flex items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">Carteras</h2>
            <p className="mt-1 text-xs text-mute">
              {s.carts.length} {s.carts.length === 1 ? 'cartera' : 'carteras'}
            </p>
          </div>
        </div>

        {s.carts.length ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {s.carts.map(c => (
              <Card
                key={c.id}
                className="!p-4 transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/[0.035]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{c.nombre}</p>
                    <p className="mt-1 text-xs text-mute">
                      {c.incluirEnTotal
                        ? 'Incluida en el balance'
                        : 'Fuera del balance total'}
                    </p>
                  </div>

                  <span
                    className={`mt-1 h-2 w-2 shrink-0 rounded-full ${c.incluirEnTotal ? 'bg-brand' : 'bg-white/20'
                      }`}
                  />
                </div>

                <p className="mt-5 break-words text-lg font-semibold tracking-tight">
                  {mask(s.saldo(c.id))}
                </p>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <Empty t="Todavía no tienes carteras." />
          </Card>
        )}
      </section>

      {/* Tareas */}
      <Card className="!p-5 sm:!p-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">Tareas</h2>
            <p className="mt-1 text-xs text-mute">
              Un vistazo rápido a tus pendientes
            </p>
          </div>

          <CheckSquare size={19} className="text-brand" />
        </div>

        <div className="mb-4 grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-3">
            <p className="text-xs text-mute">Pendientes</p>
            <p className="mt-1 text-xl font-semibold">{pendientes.length}</p>
          </div>

          <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-3">
            <p className="text-xs text-mute">Completadas</p>
            <p className="mt-1 text-xl font-semibold text-brand">
              {completadas.length}
            </p>
          </div>
        </div>

        {pendientes.length ? (
          <div className="space-y-2">
            {pendientes.slice(0, 4).map(t => (
              <div
                key={t.id}
                className="flex items-center gap-3 rounded-xl border border-white/[0.05] bg-white/[0.02] px-3 py-3"
              >
                <span className="h-2 w-2 shrink-0 rounded-full bg-brand/80" />
                <p className="min-w-0 flex-1 truncate text-sm">{t.titulo}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="rounded-xl border border-white/[0.05] bg-white/[0.02] px-3 py-4 text-sm text-mute">
            No tienes tareas pendientes.
          </p>
        )}
      </Card>

      {/* Actividad reciente y categorías */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="!p-5 sm:!p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold tracking-tight">
                Actividad reciente
              </h2>
              <p className="mt-1 text-xs text-mute">
                Tus últimos movimientos registrados
              </p>
            </div>
          </div>

          {s.movs.length ? (
            <div className="space-y-1">
              {sorted(s.movs)
                .slice(0, 5)
                .map(m => (
                  <MovRow key={m.id} m={m} s={s} />
                ))}
            </div>
          ) : (
            <Empty t="Sin movimientos todavía. Registra el primero." />
          )}
        </Card>

        <Card className="!p-5 sm:!p-6">
          <div className="mb-4">
            <h2 className="text-lg font-semibold tracking-tight">
              Gastos por categoría
            </h2>
            <p className="mt-1 text-xs text-mute">
              Distribución de tus gastos registrados
            </p>
          </div>

          {s.movs.some(m => m.tipo === 'gasto') ? (
            <CatChart ms={s.movs} />
          ) : (
            <Empty t="Aún no hay gastos para mostrar." />
          )}
        </Card>
      </div>
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

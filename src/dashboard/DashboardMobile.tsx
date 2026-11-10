import { Fragment, useEffect, useRef, useState } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'
import {
  ArrowDownLeft,
  ArrowLeftRight,
  ArrowUpRight,
  Bike,
  Check,
  ChevronRight,
  Eye,
  EyeOff,
  Flame,
} from 'lucide-react'
import { Store, Tarea, daysAgo, money, uid } from '../lib'
import { useDashboardData } from '../hooks/useDashboardData'
import { marcarHabito, desmarcarHabito } from '../services/habitos'
import { updateTarea } from '../services/tareas'
import './dashboard-mobile.css'

const COLORS = ['#70d6a5', '#3fa37a', '#9fe8c4', '#2f7d5c', '#56615b', '#a8b3ad', '#1f5a42', '#c9f2de']
const PRIORIDAD_COLOR = { alta: '#ff7b7b', media: '#ffd27b', baja: '#70d6a5' }
const W = 400
const H = 92

type Page = 'habitos' | 'tareas' | 'moto' | 'movs'

function useCountUp(target: number, ms = 1300) {
  const [value, setValue] = useState(0)
  const from = useRef(0)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      from.current = target
      setValue(target)
      return
    }
    const start = from.current
    const t0 = performance.now()
    let raf = 0
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / ms)
      const v = start + (target - start) * (1 - Math.pow(1 - p, 4))
      from.current = v
      setValue(v)
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, ms])

  return value
}

export function DashboardMobile({
  s,
  onNavigate,
}: {
  s: Store
  onNavigate?: (page: Page) => void
}) {
  const d = useDashboardData(s)
  const [hide, setHide] = useState(false)
  const [mini, setMini] = useState(false)
  const [scrub, setScrub] = useState<number | null>(null)
  const [railIdx, setRailIdx] = useState(0)
  const [hl, setHl] = useState<number | null>(null)
  const [ready, setReady] = useState(false)
  const [hechas, setHechas] = useState<Set<string>>(new Set())

  const bigRef = useRef<HTMLDivElement>(null)
  const sparkRef = useRef<HTMLDivElement>(null)

  const animado = useCountUp(d.total)
  const mask = (n: number) => (hide ? '$ ••••••' : money(n))

  useEffect(() => {
    const el = bigRef.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setMini(!e.isIntersecting), {
      rootMargin: '-70px 0px 0px 0px',
    })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 80)
    return () => clearTimeout(t)
  }, [])

  // ── Gráfica de 30 días ──
  const valores = d.serie.map(p => p.valor)
  const min = Math.min(...valores)
  const max = Math.max(...valores)
  const rango = max - min || 1
  const X = (i: number) => (i / (d.serie.length - 1)) * W
  const Y = (v: number) => H - 10 - ((v - min) / rango) * (H - 26)
  const linea = d.serie
    .map((p, i) => `${i ? 'L' : 'M'}${X(i).toFixed(1)} ${Y(p.valor).toFixed(1)}`)
    .join(' ')
  const area = `${linea} L${W} ${H} L0 ${H}Z`

  const mover = (e: ReactPointerEvent<HTMLDivElement>) => {
    const r = sparkRef.current?.getBoundingClientRect()
    if (!r) return
    const x = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width))
    setScrub(Math.round(x * (d.serie.length - 1)))
  }
  const puntoScrub = scrub !== null ? d.serie[scrub] : null
  const etiquetaScrub = puntoScrub
    ? (() => {
        const [y, m, dd] = puntoScrub.fecha.split('-').map(Number)
        return `${new Intl.DateTimeFormat('es-CO', { day: 'numeric', month: 'short' }).format(
          new Date(y, m - 1, dd)
        )}, ${mask(puntoScrub.valor)}`
      })()
    : ''

  // ── Hábitos ──
  const cambiarHabito = async (habitoId: string) => {
    try {
      if (d.completadosHoy.has(habitoId)) {
        await desmarcarHabito(habitoId, d.fechaHoy)
        s.setRegistrosHabitos(
          s.registrosHabitos.filter(r => !(r.habito_id === habitoId && r.fecha === d.fechaHoy))
        )
      } else {
        const registro = await marcarHabito(habitoId, d.fechaHoy)
        s.setRegistrosHabitos([
          ...s.registrosHabitos.filter(r => !(r.habito_id === habitoId && r.fecha === d.fechaHoy)),
          registro,
        ])
      }
      navigator.vibrate?.(8)
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

  // ── Tareas ──
  const cambiarTarea = async (tarea: Tarea) => {
    try {
      const actualizada = await updateTarea({ ...tarea, completada: !tarea.completada })
      setHechas(prev => new Set(prev).add(tarea.id))
      s.setTareas(s.tareas.map(t => (t.id === actualizada.id ? actualizada : t)))
      navigator.vibrate?.(8)
    } catch (error) {
      console.error('ERROR ACTUALIZANDO TAREA:', error)
      s.showAlert({
        title: 'Error',
        message: error instanceof Error ? error.message : 'No se pudo actualizar la tarea.',
        variant: 'danger',
        confirmText: 'Entendido',
      })
    }
  }
  const listaTareas = s.tareas
    .filter(t => !t.completada || hechas.has(t.id))
    .sort(d.compararTareas)
    .slice(0, 4)

  // ── Movimientos y categorías ──
  const totalGastos = d.categorias.reduce((a, c) => a + c.value, 0)
  const anillo = 2 * Math.PI * 27

  const abrirIngreso = () =>
    s.openMov({
      id: uid(),
      desc: '',
      tipo: 'ingreso',
      monto: 0,
      fecha: daysAgo(0),
      cat: s.cats[0] ?? '',
      cartera: undefined,
    })

  return (
    <div className="mb-dashboard">
      <div className={`mb-mini ${mini ? 'mb-show' : ''}`} aria-hidden={!mini}>
        <div>
          <small>Balance</small>
          <span>{mask(d.total)}</span>
        </div>
      </div>

      <div className="mb-app">
        <div className="mb-glow" />

        <header className="mb-top">
          <div>
            <p>{d.fechaActual}</p>
            <h1>{d.saludo}, Joseph</h1>
          </div>
          <button
            className="mb-round"
            onClick={() => setHide(v => !v)}
            aria-label={hide ? 'Mostrar montos' : 'Ocultar montos'}
            aria-pressed={hide}
          >
            {hide ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </header>

        <div className="mb-hero">
          <p className="mb-lbl">Balance total</p>
          <div ref={bigRef} className={`mb-big ${hide ? 'mb-hid' : ''}`}>
            {mask(animado)}
          </div>
          <br />
          <span className={`mb-pill ${d.balanceMes < 0 ? 'mb-neg' : ''}`}>
            Este mes <b>{d.balanceMes < 0 ? '' : '+'}{mask(d.balanceMes)}</b>
          </span>

          <div
            ref={sparkRef}
            className={`mb-spark ${scrub !== null ? 'mb-touch' : ''}`}
            onPointerDown={mover}
            onPointerMove={e => scrub !== null && mover(e)}
            onPointerUp={() => setScrub(null)}
            onPointerLeave={() => setScrub(null)}
            onPointerCancel={() => setScrub(null)}
          >
            <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" role="img" aria-label="Balance de los últimos 30 días">
              <defs>
                <linearGradient id="mb-g" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0" stopColor="#70d6a5" stopOpacity=".3" />
                  <stop offset="1" stopColor="#70d6a5" stopOpacity="0" />
                </linearGradient>
                <clipPath id="mb-clip">
                  <rect className="mb-reveal" x="0" y="0" width={W} height={H} />
                </clipPath>
              </defs>
              <g clipPath="url(#mb-clip)">
                <path d={area} fill="url(#mb-g)" />
                <path className="mb-ln" d={linea} vectorEffect="non-scaling-stroke" />
              </g>
              {scrub !== null && (
                <line className="mb-cur" x1={X(scrub)} x2={X(scrub)} y1="0" y2={H} vectorEffect="non-scaling-stroke" />
              )}
            </svg>
            <div className="mb-stip" style={{ left: `${scrub !== null ? (scrub / (d.serie.length - 1)) * 100 : 0}%` }}>
              {etiquetaScrub}
            </div>
          </div>
        </div>

        <div className="mb-qa">
          <button onClick={abrirIngreso}>
            <span className="mb-ic mb-g"><ArrowDownLeft size={19} /></span>Ingreso
          </button>
          <button onClick={() => s.openMov()}>
            <span className="mb-ic mb-r"><ArrowUpRight size={19} /></span>Gasto
          </button>
          <button onClick={() => s.openTransfer()}>
            <span className="mb-ic mb-y"><ArrowLeftRight size={19} /></span>Transferir
          </button>
        </div>

        <section className="mb-section">
          <div className="mb-sec">
            <h2>Carteras</h2>
            <span>{s.carts.length} {s.carts.length === 1 ? 'cartera' : 'carteras'}</span>
          </div>
          {s.carts.length ? (
            <>
              <div
                className="mb-rail"
                onScroll={e => {
                  const r = e.currentTarget
                  setRailIdx(Math.round(r.scrollLeft / (r.scrollWidth / s.carts.length)))
                }}
              >
                {s.carts.map(c => (
                  <div className="mb-w" key={c.id}>
                    <div className="mb-w-top">
                      <span>{c.nombre}</span>
                      <i className={`mb-d ${c.incluirEnTotal ? '' : 'mb-off'}`} />
                    </div>
                    <div>
                      <b>{mask(s.saldo(c.id))}</b>
                      <small>{c.incluirEnTotal ? 'En tu balance' : 'Fuera del balance'}</small>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mb-dots">
                {s.carts.map((c, i) => (
                  <i key={c.id} className={i === railIdx ? 'mb-on' : ''} />
                ))}
              </div>
            </>
          ) : (
            <div className="mb-empty">Todavía no tienes carteras.</div>
          )}
        </section>

        <section className="mb-section">
          <div className="mb-sec">
            <h2>Hoy</h2>
            <button onClick={() => onNavigate?.('habitos')}>Ver hábitos</button>
          </div>
          <div className="mb-today">
            <div className="mb-trow">
              <div className="mb-ring">
                <svg viewBox="0 0 64 64">
                  <circle className="mb-bgc" cx="32" cy="32" r="27" />
                  <circle
                    className="mb-fg"
                    cx="32"
                    cy="32"
                    r="27"
                    strokeDasharray={anillo}
                    strokeDashoffset={anillo * (1 - d.progresoHabitos / 100)}
                  />
                </svg>
                <div>{d.completadosProgramados}/{d.habitosDeHoy.length}</div>
              </div>
              <div>
                <h3>Hábitos de hoy</h3>
                <p>
                  <Flame size={13} />
                  Racha más alta: {d.rachaActual} {d.rachaActual === 1 ? 'día' : 'días'}
                </p>
              </div>
            </div>

            {d.habitosDeHoy.length ? (
              <div className="mb-chips">
                {d.habitosDeHoy.map(h => {
                  const hecho = d.completadosHoy.has(h.id)
                  return (
                    <button
                      key={h.id}
                      className={`mb-chip ${hecho ? 'mb-done' : ''}`}
                      onClick={() => cambiarHabito(h.id)}
                      aria-pressed={hecho}
                    >
                      <span className="mb-k"><Check size={13} strokeWidth={3.5} /></span>
                      <span>{h.nombre}</span>
                    </button>
                  )
                })}
              </div>
            ) : (
              <div className="mb-empty">No hay hábitos programados para hoy.</div>
            )}

            <div className="mb-tkh">
              <span>
                {d.pendientes.length
                  ? `${d.pendientes.length} ${d.pendientes.length === 1 ? 'tarea pendiente' : 'tareas pendientes'}`
                  : 'No tienes tareas pendientes'}
              </span>
              <button onClick={() => onNavigate?.('tareas')}>Ver tareas</button>
            </div>
            {listaTareas.map(t => (
              <button
                key={t.id}
                className={`mb-tk ${t.completada ? 'mb-done' : ''}`}
                onClick={() => cambiarTarea(t)}
                aria-pressed={t.completada}
              >
                <span className="mb-k"><Check size={12} strokeWidth={3.5} /></span>
                <span className="mb-t">{t.titulo}</span>
                {t.fecha && <span className="mb-tf">{d.formatFecha(t.fecha)}</span>}
                <i className="mb-pr" style={{ background: PRIORIDAD_COLOR[t.prioridad] }} />
              </button>
            ))}
          </div>
        </section>

        <section className="mb-section">
          <div className="mb-sec">
            <h2>Recientes</h2>
            <button onClick={() => onNavigate?.('movs')}>Ver todos</button>
          </div>
          {d.recientes.length ? (
            d.recientes.map((m, i) => {
              const ingreso = m.tipo === 'ingreso'
              const cartera = s.carts.find(c => c.id === m.cartera)
              const dia = d.etiquetaDia(m.fecha)
              const nuevoDia = i === 0 || dia !== d.etiquetaDia(d.recientes[i - 1].fecha)
              return (
                <Fragment key={m.id}>
                  {nuevoDia && <p className="mb-day">{dia}</p>}
                  <div className="mb-mv" style={{ animationDelay: `${i * 50}ms` }}>
                    <span className={`mb-ic ${ingreso ? 'mb-g' : 'mb-r'}`}>
                      {ingreso ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
                    </span>
                    <div className="mb-m">
                      <p>{m.desc}</p>
                      <small>{m.cat}{cartera ? `, ${cartera.nombre}` : ''}</small>
                    </div>
                    <span className={`mb-amt ${ingreso ? 'mb-p' : 'mb-n'}`}>
                      {ingreso ? '+' : '−'}{mask(m.monto)}
                    </span>
                  </div>
                </Fragment>
              )
            })
          ) : (
            <div className="mb-empty">Sin movimientos todavía. Registra el primero.</div>
          )}
        </section>

        <section className="mb-section">
          <div className="mb-sec"><h2>Gastos por categoría</h2></div>
          {d.categorias.length ? (
            <div className={`mb-cats ${hl !== null ? 'mb-f' : ''}`}>
              <div className="mb-bar">
                {d.categorias.map((c, i) => (
                  <i
                    key={c.name}
                    className={hl === i ? 'mb-hl' : ''}
                    style={{ background: COLORS[i % COLORS.length], width: ready ? `${(c.value / totalGastos) * 100}%` : 0 }}
                  />
                ))}
              </div>
              <div className="mb-cl">
                {d.categorias.map((c, i) => (
                  <button
                    key={c.name}
                    className={`mb-cr ${hl === i ? 'mb-hl' : ''}`}
                    onPointerDown={() => setHl(i)}
                    onPointerUp={() => setHl(null)}
                    onPointerLeave={() => setHl(null)}
                    onPointerCancel={() => setHl(null)}
                  >
                    <i style={{ background: COLORS[i % COLORS.length] }} />
                    <span>{c.name}</span>
                    <em>{mask(c.value)}</em>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="mb-empty">Aún no hay gastos para mostrar.</div>
          )}
        </section>

        <section className="mb-section">
          <div className="mb-sec"><h2>Mi moto</h2></div>
          {s.moto ? (
            <button className="mb-moto" onClick={() => onNavigate?.('moto')}>
              <div className="mb-moto-im">
                {s.moto.imagenUrl ? <img src={s.moto.imagenUrl} alt={s.moto.nombre} /> : <Bike size={30} strokeWidth={1.3} />}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h3>{s.moto.nombre}</h3>
                <p>
                  {s.moto.kilometrajeActual.toLocaleString('es-CO')} km, aceite el{' '}
                  {d.formatFecha(s.moto.fechaUltimoCambioAceite)}
                </p>
              </div>
              <ChevronRight size={18} color="#8a948f" />
            </button>
          ) : (
            <div className="mb-empty">No hay información de la moto disponible.</div>
          )}
        </section>
      </div>
    </div>
  )
}
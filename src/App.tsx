import { useEffect, useState } from 'react'
import { supabase } from './supabase'
import {
  LayoutDashboard,
  ArrowLeftRight,
  Wallet,
  Target,
  PieChart,
  Settings,
  Bike,
  CheckSquare,
  Brain,
} from 'lucide-react'

import {
  AlertOptions,
  Mov,
  Store,
  signed,
  Tarea,
  Transferencia,
  Meta,
} from './lib'

import {
  Analisis,
  AlertModal,
  Carteras,
  Config,
  Dashboard,
  Tareas,
  Metas,
  MovModal,
  Movimientos,
} from './Pages'

import { getCarteras } from './services/carteras'

import { getCategorias } from './services/categorias'

import {
  getMovimientos,
  createMovimiento,
  updateMovimiento,
} from './services/movimientos'

import { getTransferencias } from './services/transferencias'

import { getMetas } from './services/metas'

import { getTareas } from './services/tareas'

const NAV = {
  finanzas: [
    {
      id: 'movs',
      label: 'Movimientos',
      icon: ArrowLeftRight,
    },
    {
      id: 'carts',
      label: 'Carteras',
      icon: Wallet,
    },
    {
      id: 'metas',
      label: 'Metas',
      icon: Target,
    },
    {
      id: 'analisis',
      label: 'Análisis',
      icon: PieChart,
    },
  ],

  productividad: [
    {
      id: 'tareas',
      label: 'Tareas',
      icon: CheckSquare,
    },
    {
      id: 'habitos',
      label: 'Hábitos',
      icon: Brain,
    },
  ],

  personal: [
    {
      id: 'moto',
      label: 'Moto',
      icon: Bike,
    },
  ],
} as const

export default function App() {

  const [showMore, setShowMore] =
    useState(false)

  const [showFinance, setShowFinance] =
    useState(false)

  const [page, setPage] =
    useState<string>('dash')

  // ─────────────────────────────────────
  // MOVIMIENTOS
  // ─────────────────────────────────────

  const [movs, setMovs] =
    useState<Mov[]>([])

  useEffect(() => {
    const loadMovimientos = async () => {
      try {
        const data =
          await getMovimientos()

        setMovs(data)
      } catch (error) {
        console.error(
          'ERROR CARGANDO MOVIMIENTOS:',
          error
        )

        setAlert({
          title: 'Error',
          message:
            'No se pudieron cargar los movimientos desde Supabase.',
          variant: 'danger',
          confirmText: 'Entendido',
        })
      }
    }

    loadMovimientos()
  }, [])

  // ─────────────────────────────────────
  // CARTERAS
  // ─────────────────────────────────────

  const [carts, setCarts] =
    useState<Store['carts']>([])

  useEffect(() => {
    const loadCarteras = async () => {
      try {
        const data =
          await getCarteras()

        setCarts(data)
      } catch (error) {
        console.error(
          'Error cargando carteras:',
          error
        )
      }
    }

    loadCarteras()
  }, [])

  // ─────────────────────────────────────
  // CATEGORÍAS
  // ─────────────────────────────────────

  const [cats, setCats] =
    useState<string[]>([])

  useEffect(() => {
    const loadCategorias = async () => {
      try {
        const data =
          await getCategorias()

        setCats(data)
      } catch (error) {
        console.error(
          'ERROR CARGANDO CATEGORÍAS:',
          error
        )
      }
    }

    loadCategorias()
  }, [])

  // ─────────────────────────────────────
  // METAS
  // ─────────────────────────────────────

  const [metas, setMetas] =
    useState<Meta[]>([])

  useEffect(() => {
    const loadMetas = async () => {
      try {
        const data =
          await getMetas()

        setMetas(data)
      } catch (error) {
        console.error(
          'ERROR CARGANDO METAS:',
          error
        )

        setAlert({
          title: 'Error',
          message:
            'No se pudieron cargar las metas desde Supabase.',
          variant: 'danger',
          confirmText: 'Entendido',
        })
      }
    }

    loadMetas()
  }, [])

  // ─────────────────────────────────────
  // TRANSFERENCIAS
  // ─────────────────────────────────────

  const [transfers, setTransfers] =
    useState<Transferencia[]>([])

  useEffect(() => {
    const loadTransferencias = async () => {
      try {
        const data =
          await getTransferencias()

        setTransfers(data)
      } catch (error) {
        console.error(
          'ERROR CARGANDO TRANSFERENCIAS:',
          error
        )

        setAlert({
          title: 'Error',
          message:
            'No se pudieron cargar las transferencias desde Supabase.',
          variant: 'danger',
          confirmText: 'Entendido',
        })
      }
    }

    loadTransferencias()
  }, [])


  // ─────────────────────────────────────
  // ALERTAS Y MODALES
  // ─────────────────────────────────────

  const [alert, setAlert] =
    useState<AlertOptions | null>(null)

  const [modal, setModal] =
    useState<{ mov?: Mov } | null>(null)


  // ─────────────────────────────────────
  // TAREAS
  // ─────────────────────────────────────

  const [tareas, setTareas] =
    useState<Tarea[]>([])

  useEffect(() => {
    const loadTareas = async () => {
      try {
        const data =
          await getTareas()

        setTareas(data)
      } catch (error) {
        console.error(
          'ERROR CARGANDO TAREAS:',
          error
        )

        setAlert({
          title: 'Error',
          message:
            'No se pudieron cargar las tareas desde Supabase.',
          variant: 'danger',
          confirmText: 'Entendido',
        })
      }
    }

    loadTareas()
  }, [])

  // ─────────────────────────────────────
  // SALDO DE CARTERA
  // ─────────────────────────────────────

  const saldo = (id: string) =>
    (carts.find(
      c => c.id === id
    )?.saldoInicial ?? 0) +

    movs
      .filter(
        m => m.cartera === id
      )
      .reduce(
        (a, m) => a + signed(m),
        0
      ) +

    transfers.reduce((a, t) => {
      if (t.desde === id) {
        return a - t.monto
      }

      if (t.hacia === id) {
        return a + t.monto
      }

      return a
    }, 0)

  // ─────────────────────────────────────
  // STORE GLOBAL
  // ─────────────────────────────────────

  const s: Store = {
    movs,
    setMovs,

    carts,
    setCarts,

    cats,
    setCats,

    metas,
    setMetas,

    tareas,
    setTareas,

    transfers,
    setTransfers,

    saldo,

    openMov: mov =>
      setModal({ mov }),

    showAlert: options =>
      setAlert(options),


  }

  // ─────────────────────────────────────
  // GUARDAR MOVIMIENTO
  // ─────────────────────────────────────

  const save = async (m: Mov) => {
    try {
      const categoria =
        await supabase
          .from('categorias')
          .select('id, nombre')
          .eq('nombre', m.cat)
          .single()

      if (categoria.error) {
        throw categoria.error
      }

      const categoriaId =
        categoria.data?.id ?? null

      const exists =
        movs.some(
          x => x.id === m.id
        )

      if (exists) {
        const actualizado =
          await updateMovimiento(
            m,
            categoriaId
          )

        setMovs(
          movs.map(x =>
            x.id === actualizado.id
              ? actualizado
              : x
          )
        )
      } else {
        const nuevo =
          await createMovimiento(
            m,
            categoriaId
          )

        setMovs([
          nuevo,
          ...movs,
        ])
      }

      setModal(null)
    } catch (error) {
      console.error(
        'Error guardando movimiento:',
        error
      )

      setAlert({
        title: 'Error',
        message:
          'No se pudo guardar el movimiento en Supabase.',
        variant: 'danger',
        confirmText: 'Entendido',
      })
    }
  }

  return (
    <div className="min-h-screen bg-bg text-ink md:pl-60">

      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-brand/[0.035] blur-3xl" />

        <div className="absolute right-0 top-20 h-80 w-80 rounded-full bg-indigo-400/[0.025] blur-3xl" />
      </div>

      {/* Sidebar */}
      <aside className="
  hidden
  fixed inset-y-0 left-0
  w-60
  flex-col
  border-r border-white/[0.05]
  bg-[#0d1214]/80
  p-4
  backdrop-blur-2xl
  md:flex
">

        {/* Logo */}
        <div className="mb-8 flex items-center gap-2 px-2 text-lg font-semibold">
          <span className="
      grid h-8 w-8
      place-items-center
      rounded-xl
      bg-brand
      text-bg
      shadow-[0_0_20px_rgba(112,214,165,0.15)]
    ">
            <Wallet size={23} />
          </span>

          FinTrack
        </div>

        <div className="flex flex-1 flex-col">

          {/* Inicio */}
          <button
            onClick={() => setPage('dash')}
            className={`
        mb-6
        flex w-full items-center gap-3
        rounded-xl px-3 py-2.5
        transition-colors
        ${page === 'dash'
                ? 'bg-brand/10 text-brand'
                : 'text-mute hover:bg-hover hover:text-ink'
              }
      `}
          >
            <LayoutDashboard size={19} />
            <span>Inicio</span>
          </button>


          {/* Finanzas */}
          <div className="mb-6">

            <p className="
        mb-2 px-3
        text-xs font-medium
        uppercase tracking-wider
        text-mute
      ">
              Finanzas
            </p>

            <div className="space-y-1">
              {NAV.finanzas.map(n => (
                <button
                  key={n.id}
                  onClick={() => setPage(n.id)}
                  className={`
              flex w-full items-center gap-3
              rounded-xl px-3 py-2.5
              transition-colors
              ${page === n.id
                      ? 'bg-brand/10 text-brand'
                      : 'text-mute hover:bg-hover hover:text-ink'
                    }
            `}
                >
                  <n.icon size={19} />
                  <span>{n.label}</span>
                </button>
              ))}
            </div>

          </div>


          {/* Productividad */}
          <div className="mb-6">

            <p className="
        mb-2 px-3
        text-xs font-medium
        uppercase tracking-wider
        text-mute
      ">
              Productividad
            </p>

            <div className="space-y-1">
              {NAV.productividad.map(n => (
                <button
                  key={n.id}
                  onClick={() => setPage(n.id)}
                  className={`
              flex w-full items-center gap-3
              rounded-xl px-3 py-2.5
              transition-colors
              ${page === n.id
                      ? 'bg-brand/10 text-brand'
                      : 'text-mute hover:bg-hover hover:text-ink'
                    }
            `}
                >
                  <n.icon size={19} />
                  <span>{n.label}</span>
                </button>
              ))}
            </div>

          </div>


          {/* Personal */}
          <div>

            <p className="
        mb-2 px-3
        text-xs font-medium
        uppercase tracking-wider
        text-mute
      ">
              Personal
            </p>

            <div className="space-y-1">
              {NAV.personal.map(n => (
                <button
                  key={n.id}
                  onClick={() => setPage(n.id)}
                  className={`
              flex w-full items-center gap-3
              rounded-xl px-3 py-2.5
              transition-colors
              ${page === n.id
                      ? 'bg-brand/10 text-brand'
                      : 'text-mute hover:bg-hover hover:text-ink'
                    }
            `}
                >
                  <n.icon size={19} />
                  <span>{n.label}</span>
                </button>
              ))}
            </div>

          </div>

        </div>


        {/* Configuración */}
        <button
          onClick={() => setPage('config')}
          className={`
      mt-auto
      flex w-full items-center gap-3
      rounded-xl px-3 py-2.5
      transition-colors
      ${page === 'config'
              ? 'bg-brand/10 text-brand'
              : 'text-mute hover:bg-hover hover:text-ink'
            }
    `}
        >
          <Settings size={19} />
          <span>Configuración</span>
        </button>

      </aside>

      {/* Main */}
      <main className="mx-auto max-w-5xl p-4 pb-28 md:p-8">
        {page === 'dash' && <Dashboard s={s} />}
        {page === 'movs' && <Movimientos s={s} />}
        {page === 'carts' && <Carteras s={s} />}
        {page === 'metas' && <Metas s={s} />}
        {page === 'analisis' && <Analisis s={s} />}
        {page === 'tareas' && <Tareas s={s} />}
        {page === 'config' && <Config s={s} />}
      </main>

      {/* Mobile finance menu */}
      {showFinance && (
        <div className="
    md:hidden
    fixed inset-x-3 bottom-20
    z-30
    rounded-2xl
    border border-white/[0.06]
    bg-[#111619]/95
    p-3
    shadow-2xl
    backdrop-blur-2xl
  ">

          <div className="grid grid-cols-2 gap-2">

            {NAV.finanzas.map(n => (
              <button
                key={n.id}
                onClick={() => {
                  setPage(n.id)
                  setShowFinance(false)
                }}
                className={`
            flex items-center gap-3
            rounded-xl px-3 py-3
            text-left
            transition-colors
            ${page === n.id
                    ? 'bg-brand/10 text-brand'
                    : 'text-mute hover:bg-hover hover:text-ink'
                  }
          `}
              >
                <n.icon size={19} />

                <span className="text-sm">
                  {n.label}
                </span>
              </button>
            ))}

          </div>

        </div>
      )}

      {/* Mobile more menu */}
      {showMore && (
        <div className="
    md:hidden
    fixed inset-x-3 bottom-20
    z-30
    rounded-2xl
    border border-white/[0.06]
    bg-[#111619]/95
    p-3
    shadow-2xl
    backdrop-blur-2xl
  ">

          <div className="grid grid-cols-2 gap-2">

            {[
              ...NAV.productividad,
              ...NAV.personal,
            ].map(n => (
              <button
                key={n.id}
                onClick={() => {
                  setPage(n.id)
                  setShowMore(false)
                }}
                className={`
            flex items-center gap-3
            rounded-xl px-3 py-3
            text-left
            transition-colors
            ${page === n.id
                    ? 'bg-brand/10 text-brand'
                    : 'text-mute hover:bg-hover hover:text-ink'
                  }
          `}
              >
                <n.icon size={19} />

                <span className="text-sm">
                  {n.label}
                </span>
              </button>
            ))}


            {/* Configuración */}
            <button
              onClick={() => {
                setPage('config')
                setShowMore(false)
              }}
              className={`
          flex items-center gap-3
          rounded-xl px-3 py-3
          text-left
          transition-colors
          ${page === 'config'
                  ? 'bg-brand/10 text-brand'
                  : 'text-mute hover:bg-hover hover:text-ink'
                }
        `}
            >
              <Settings size={19} />

              <span className="text-sm">
                Configuración
              </span>
            </button>

          </div>

        </div>
      )}

      {/* Mobile navigation */}
      <nav className="
  md:hidden
  fixed inset-x-0 bottom-0
  z-20
  flex
  border-t border-white/[0.05]
  bg-[#0d1214]/85
  backdrop-blur-2xl
">

        {/* Inicio */}
        <button
          onClick={() => {
            setPage('dash')
            setShowMore(false)
          }}
          className={`
      flex flex-1
      flex-col items-center
      justify-center gap-1
      py-3
      transition-colors
      ${page === 'dash'
              ? 'text-brand'
              : 'text-mute'
            }
    `}
        >
          <LayoutDashboard size={22} />
          <span className="text-[11px]">
            Inicio
          </span>
        </button>


        {/* Finanzas */}
        <button
          onClick={() => {
            setShowFinance(!showFinance)
            setShowMore(false)
          }}
          className={`
    flex flex-1
    flex-col items-center
    justify-center gap-1
    py-3
    transition-colors
    ${showFinance ||
              NAV.finanzas.some(
                n => n.id === page
              )
              ? 'text-brand'
              : 'text-mute'
            }
  `}
        >
          <Wallet size={22} />

          <span className="text-[11px]">
            Finanzas
          </span>
        </button>


        {/* Más */}
        <button
          onClick={() =>
            setShowMore(!showMore)
          }
          className={`
      flex flex-1
      flex-col items-center
      justify-center gap-1
      py-3
      transition-colors
      ${showMore ||
              NAV.productividad.some(
                n => n.id === page
              ) ||
              NAV.personal.some(
                n => n.id === page
              ) ||
              page === 'config'
              ? 'text-brand'
              : 'text-mute'
            }
    `}
        >
          <span className="text-xl leading-none">
            ☰
          </span>

          <span className="text-[11px]">
            Más
          </span>
        </button>

      </nav>

      {/* Movimiento modal */}
      {modal && (
        <MovModal
          s={s}
          mov={modal.mov}
          onSave={save}
          onClose={() =>
            setModal(null)
          }
        />
      )}

      {/* Alert modal */}
      {alert && (
        <AlertModal
          alert={alert}
          onClose={() =>
            setAlert(null)
          }
        />
      )}
    </div>
  )
}
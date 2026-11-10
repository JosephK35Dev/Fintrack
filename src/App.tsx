import { useEffect, useState } from 'react'
import { useMediaQuery } from './hooks/useMediaQuery'
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
  Plus,
} from 'lucide-react'

import {
  AlertOptions,
  Mov,
  Store,
  signed,
  Tarea,
  Habito,
  HabitoRegistro,
  MotoInfo,
  MantenimientoMoto,
  GastoMoto,
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
  Habitos,
  MotoPage,
  Metas,
  MovModal,
  Movimientos,
  DashboardMobile,
  TransferModal,
} from './Pages'

import { getCarteras } from './services/carteras'

import { getCategorias } from './services/categorias'

import {
  getMovimientos,
  createMovimiento,
  updateMovimiento,
} from './services/movimientos'

import { createTransferencia, getTransferencias } from './services/transferencias'

import { getMetas } from './services/metas'

import { getTareas } from './services/tareas'
import { getHabitos, getRegistrosHabitos } from './services/habitos'
import { getMoto } from './services/moto'
import { getMantenimientosMoto } from './services/mantenimientosMoto'
import { getGastosMoto } from './services/gastosMoto'

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

const TABS = [
  { id: 'dash', label: 'Inicio' },
  ...NAV.finanzas,
  ...NAV.productividad,
  ...NAV.personal,
]

export default function App() {

  const [showMore, setShowMore] =
    useState(false)

  const [showFinance, setShowFinance] =
    useState(false)

  const isMobile = useMediaQuery('(max-width: 767px)')
  const [transferModalOpen, setTransferModalOpen] = useState(false)
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

  // HÁBITOS
  const [habitos, setHabitos] = useState<Habito[]>([])
  const [registrosHabitos, setRegistrosHabitos] =
    useState<HabitoRegistro[]>([])

  useEffect(() => {
    const loadHabitos = async () => {
      try {
        const [habitosData, registrosData] = await Promise.all([
          getHabitos(),
          getRegistrosHabitos(),
        ])
        setHabitos(habitosData)
        setRegistrosHabitos(registrosData)
      } catch (error) {
        console.error('ERROR CARGANDO HÁBITOS:', error)
        setAlert({
          title: 'Error',
          message: 'No se pudieron cargar los hábitos desde Supabase.',
          variant: 'danger',
          confirmText: 'Entendido',
        })
      }
    }

    loadHabitos()
  }, [])

  // MOTO
  const [moto, setMoto] = useState<MotoInfo | null>(null)
  const [mantenimientosMoto, setMantenimientosMoto] =
    useState<MantenimientoMoto[]>([])
  const [gastosMoto, setGastosMoto] = useState<GastoMoto[]>([])

  useEffect(() => {
    const loadMoto = async () => {
      try {
        const [motoData, mantenimientosData, gastosData] = await Promise.all([
          getMoto(),
          getMantenimientosMoto(),
          getGastosMoto(),
        ])
        setMoto(motoData)
        setMantenimientosMoto(mantenimientosData)
        setGastosMoto(gastosData)
      } catch (error) {
        console.error('ERROR CARGANDO MÓDULO MOTO:', error)
        setAlert({
          title: 'Error',
          message: 'No se pudo cargar la información de la moto desde Supabase.',
          variant: 'danger',
          confirmText: 'Entendido',
        })
      }
    }

    loadMoto()
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

    habitos,
    setHabitos,
    registrosHabitos,
    setRegistrosHabitos,

    moto,
    setMoto,
    mantenimientosMoto,
    setMantenimientosMoto,
    gastosMoto,
    setGastosMoto,

    transfers,
    setTransfers,

    saldo,

    openMov: mov =>
      setModal({ mov }),

    openTransfer: () => setTransferModalOpen(true),

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

  const saveDashboardTransfer = async (t: Transferencia) => {
    if (t.monto > s.saldo(t.desde)) {
      setAlert({ title: 'Saldo insuficiente', message: 'La cartera de origen no tiene saldo suficiente para esta transferencia.', variant: 'warning', confirmText: 'Entendido' })
      return
    }
    try {
      const nueva = await createTransferencia(t)
      setTransfers([nueva, ...transfers])
      setTransferModalOpen(false)
    } catch (error) {
      console.error('Error creando transferencia:', error)
      setAlert({ title: 'Error', message: 'No se pudo guardar la transferencia en Supabase.', variant: 'danger', confirmText: 'Entendido' })
    }
  }

  return (
    <div className="min-h-screen bg-bg text-ink">

      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-brand/[0.035] blur-3xl" />

        <div className="absolute right-0 top-20 h-80 w-80 rounded-full bg-indigo-400/[0.025] blur-3xl" />
      </div>

      {/* Barra superior (escritorio) */}
      <header className="hidden md:block">
        <div className="mx-auto flex max-w-[1120px] items-center justify-between gap-3 px-5 pb-4 pt-5">
          <div className="flex items-center gap-2.5 text-[17px] font-semibold">
            <span className="grid h-[26px] w-[26px] place-items-center rounded-lg bg-brand text-bg">
              <Wallet size={16} />
            </span>
            FinTrack
          </div>

          <nav
            aria-label="Principal"
            className="flex gap-0.5 overflow-x-auto rounded-full border border-white/[0.07] bg-[#0d0f0e] p-1 [scrollbar-width:none]"
          >
            {TABS.map(t => (
              <button
                key={t.id}
                onClick={() => setPage(t.id)}
                className={`whitespace-nowrap rounded-full px-3.5 py-[7px] text-[13.5px] transition-colors ${
                  page === t.id
                    ? 'bg-[#131615] text-ink shadow-[inset_0_0_0_1px_rgba(255,255,255,0.13)]'
                    : 'text-mute hover:text-ink'
                }`}
              >
                {t.label}
              </button>
            ))}

            <button
              onClick={() => setPage('config')}
              aria-label="Configuración"
              title="Configuración"
              className={`grid place-items-center rounded-full px-3 transition-colors ${
                page === 'config'
                  ? 'bg-[#131615] text-ink shadow-[inset_0_0_0_1px_rgba(255,255,255,0.13)]'
                  : 'text-mute hover:text-ink'
              }`}
            >
              <Settings size={16} />
            </button>
          </nav>
        </div>
      </header>
      {/* Main */}
      <main className={`mx-auto ${
        page === 'dash'
          ? 'max-w-none !p-0'
          : 'max-w-[1120px] p-4 pb-28 md:px-5 md:pb-16 md:pt-2'
     }`}>
        {page === 'dash' && (isMobile ? <DashboardMobile s={s} onNavigate={setPage} /> : <Dashboard s={s} onNavigate={setPage} />)}
        {page === 'movs' && <Movimientos s={s} />}
        {page === 'carts' && <Carteras s={s} />}
        {page === 'metas' && <Metas s={s} />}
        {page === 'analisis' && <Analisis s={s} />}
        {page === 'tareas' && <Tareas s={s} />}
        {page === 'habitos' && <Habitos s={s} />}
        {page === 'moto' && <MotoPage s={s} />}
        {page === 'config' && <Config s={s} />}
      </main>

      {/* Mobile finance menu */}
      {showFinance && (
        <div className="
    md:hidden
    fixed inset-x-3 bottom-[calc(96px+env(safe-area-inset-bottom))]
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

            {[...NAV.finanzas, ...NAV.productividad, ...NAV.personal].map(n => (
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

      {isMobile && <div className="mb-dashboard"><div className="mb-dock">
        <nav aria-label="Principal">
          <button className={page === 'dash' ? 'mb-on' : ''} onClick={() => { setPage('dash'); setShowMore(false); setShowFinance(false) }}><LayoutDashboard size={22} />Inicio</button>
          <button className={page === 'movs' ? 'mb-on' : ''} onClick={() => { setPage('movs'); setShowMore(false); setShowFinance(false) }}><ArrowLeftRight size={22} />Movs</button>
          <button className="mb-fab" aria-label="Nuevo movimiento" onClick={() => { s.openMov(); setShowMore(false); setShowFinance(false) }}><Plus size={26} /></button>
          <button className={page === 'metas' ? 'mb-on' : ''} onClick={() => { setPage('metas'); setShowMore(false); setShowFinance(false) }}><Target size={22} />Metas</button>
          <button className={showMore || showFinance ? 'mb-on' : ''} onClick={() => { setShowMore(!showMore); setShowFinance(false) }}><Wallet size={22} />Más</button>
        </nav>
      </div></div>}

      {transferModalOpen && <TransferModal s={s} onSave={saveDashboardTransfer} onClose={() => setTransferModalOpen(false)} />}

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

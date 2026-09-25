import { useState } from 'react'
import {
  LayoutDashboard,
  ArrowLeftRight,
  Wallet,
  Target,
  PieChart,
  Settings,
} from 'lucide-react'

import {
  INIT_CARTS,
  INIT_CATS,
  INIT_MOVS,
  INIT_METAS,
  INIT_TRANSFERS,
  AlertOptions,
  Mov,
  Store,
  signed,
  uid,
  useLS,
} from './lib'

import {
  Analisis,
  AlertModal,
  Carteras,
  Config,
  Dashboard,
  Metas,
  MovModal,
  Movimientos,
} from './Pages'

const NAV = [
  {
    id: 'dash',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
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
  {
    id: 'config',
    label: 'Configuración',
    icon: Settings,
  },
] as const

export default function App() {
  const [page, setPage] =
    useState<string>('dash')

  const [movs, setMovs] =
    useLS('fin:movs', INIT_MOVS)

  const [carts, setCarts] =
    useLS('fin:carts', INIT_CARTS)

  const [cats, setCats] =
    useLS('fin:cats', INIT_CATS)

  const [metas, setMetas] =
    useLS('fin:metas', INIT_METAS)

  const [transfers, setTransfers] =
    useLS('fin:transfers', INIT_TRANSFERS)

  const [alert, setAlert] =
    useState<AlertOptions | null>(null)

  const [modal, setModal] =
    useState<{ mov?: Mov } | null>(null)

  const saldo = (id: string) =>
    (carts.find(c => c.id === id)?.saldoInicial ?? 0) +

    movs
      .filter(m => m.cartera === id)
      .reduce(
        (a, m) => a + signed(m),
        0
      ) +

    transfers.reduce((a, t) => {
      if (t.desde === id) return a - t.monto
      if (t.hacia === id) return a + t.monto
      return a
    }, 0)

  const s: Store = {
    movs,
    setMovs,
    carts,
    setCarts,
    cats,
    setCats,
    metas,
    setMetas,
    transfers,
    setTransfers,
    saldo,
    openMov: mov =>
      setModal({ mov }),
    showAlert: options =>
      setAlert(options),
  }

  const save = (m: Mov) => {
    const exists = movs.some(
      x => x.id === m.id
    )

    setMovs(
      exists
        ? movs.map(x =>
          x.id === m.id ? m : x
        )
        : [
          {
            ...m,
            id: uid(),
          },
          ...movs,
        ]
    )

    setModal(null)
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
        flex-col gap-1
        border-r border-white/[0.05]
        bg-[#0d1214]/80
        p-4
        backdrop-blur-2xl
        md:flex
      ">
        <div className="mb-6 flex items-center gap-2 px-2 text-lg font-semibold">
          <span className="
            grid h-8 w-8
            place-items-center
            rounded-xl
            bg-brand
            text-bg
            shadow-[0_0_20px_rgba(112,214,165,0.15)]
          ">
            <Wallet size={18} />
          </span>

          Finanzas
        </div>

        {NAV.map(n => (
          <button
            key={n.id}
            onClick={() =>
              setPage(n.id)
            }
            className={`
              group relative
              flex items-center gap-3
              rounded-xl
              px-3 py-2.5
              text-sm
              transition-all duration-200
              ${page === n.id
                ? `
                    bg-brand/[0.09]
                    text-brand
                    shadow-[inset_0_0_0_1px_rgba(112,214,165,0.06)]
                  `
                : `
                    text-mute
                    hover:bg-hover
                    hover:text-ink
                  `
              }
            `}
          >
            {page === n.id && (
              <span className="
                absolute left-0
                h-5 w-0.5
                rounded-full
                bg-brand
              " />
            )}

            <n.icon size={18} />

            {n.label}
          </button>
        ))}
      </aside>

      {/* Main */}
      <main className="mx-auto max-w-5xl p-4 pb-28 md:p-8">
        {page === 'dash' && (
          <Dashboard s={s} />
        )}

        {page === 'movs' && (
          <Movimientos s={s} />
        )}

        {page === 'carts' && (
          <Carteras s={s} />
        )}

        {page === 'metas' && (
          <Metas s={s} />
        )}

        {page === 'analisis' && (
          <Analisis s={s} />
        )}

        {page === 'config' && (
          <Config s={s} />
        )}
      </main>

     
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
        {NAV.map(n => (
          <button
            key={n.id}
            onClick={() =>
              setPage(n.id)
            }
            className={`
        flex
        w-1/6
        min-w-0
        shrink-0
        items-center
        justify-center
        py-3
        transition-colors
        ${page === n.id
                ? 'text-brand'
                : 'text-mute'
              }
      `}
          >
            <n.icon size={21} />
          </button>
        ))}
      </nav>
      


      {
        modal && (
          <MovModal
            s={s}
            mov={modal.mov}
            onSave={save}
            onClose={() =>
              setModal(null)
            }
          />
        )
      }
      {
        alert && (
          <AlertModal
            alert={alert}
            onClose={() => setAlert(null)}
          />
        )
      }
    </div >
  )
}

import { useEffect, useState } from 'react'

export type Tipo = 'ingreso' | 'gasto'

export interface Mov {
  id: string
  desc: string
  tipo: Tipo
  monto: number
  fecha: string
  cat: string
  cartera?: string
}

export interface Cartera {
  id: string
  nombre: string
  saldoInicial: number
  incluirEnTotal: boolean
}

export interface Meta {
  id: string
  nombre: string
  objetivo: number
  aporteManual: number
  carteras: string[]
}

export interface Tarea {
  id: string
  titulo: string
  descripcion?: string
  fecha?: string
  completada: boolean
  prioridad: 'baja' | 'media' | 'alta'
  created_at: string
}

export interface Transferencia {
  id: string
  desde: string
  hacia: string
  monto: number
  fecha: string
}

export type AlertVariant = 'info' | 'warning' | 'danger'

export interface AlertOptions {
  title: string
  message: string
  variant?: AlertVariant
  confirmText?: string
  cancelText?: string
  onConfirm?: () => void
}

export interface Store {
  movs: Mov[]
  setMovs: (m: Mov[]) => void

  carts: Cartera[]
  setCarts: (c: Cartera[]) => void

  cats: string[]
  setCats: (c: string[]) => void

  metas: Meta[]
  setMetas: (m: Meta[]) => void

  transfers: Transferencia[]
  setTransfers: (t: Transferencia[]) => void

  saldo: (id: string) => number
  openMov: (m?: Mov) => void

  showAlert: (options: AlertOptions) => void

  tareas: Tarea[]
  setTareas: (t: Tarea[]) => void
}

export function useLS<T>(
  key: string,
  init: T
): [T, (v: T) => void] {
  const [v, setV] = useState<T>(() => {
    try {
      const s = localStorage.getItem(key)
      return s ? JSON.parse(s) : init
    } catch {
      return init
    }
  })

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(v))
  }, [key, v])

  return [v, setV]
}

export const uid = () =>
  Math.random().toString(36).slice(2, 10)

export const money = (n: number) =>
  (n < 0 ? '-' : '') +
  '$' +
  Math.abs(Math.round(n)).toLocaleString('es-CO')

export const signed = (m: Mov) =>
  m.tipo === 'ingreso'
    ? m.monto
    : -m.monto

export const daysAgo = (o: number) => {
  const x = new Date()
  x.setDate(x.getDate() - o)
  return x.toLocaleDateString('sv')
}

export const sum = (
  ms: Mov[],
  t: Tipo
) =>
  ms
    .filter(m => m.tipo === t)
    .reduce((a, m) => a + m.monto, 0)

export const INIT_CATS = [
  'Salario',
  'Comida',
  'Transporte',
  'Hogar',
  'Ocio',
  'Salud',
  'Otros',
]

export const INIT_CARTS: Cartera[] = [
  {
    id: 'nequi',
    nombre: 'Nequi',
    saldoInicial: 868000,
    incluirEnTotal: true,
  },
  {
    id: 'banco',
    nombre: 'Bancolombia',
    saldoInicial: 1700000,
    incluirEnTotal: true,
  },
  {
    id: 'efectivo',
    nombre: 'Cartera real',
    saldoInicial: 460000,
    incluirEnTotal: true,
  },
  {
    id: 'alcancia',
    nombre: 'Alcancía',
    saldoInicial: 970000,
    incluirEnTotal: false,
  },
]

export const INIT_MOVS: Mov[] = [
  {
    id: 'm1',
    desc: 'Salario 1',
    tipo: 'ingreso',
    monto: 1800000,
    fecha: daysAgo(3),
    cat: 'Salario',
    cartera: 'banco',
  },
  {
    id: 'm2',
    desc: 'Almuerzo',
    tipo: 'gasto',
    monto: 18000,
    fecha: daysAgo(2),
    cat: 'Comida',
    cartera: 'nequi',
  },
  {
    id: 'm3',
    desc: 'Combustible',
    tipo: 'gasto',
    monto: 40000,
    fecha: daysAgo(1),
    cat: 'Transporte',
    cartera: 'efectivo',
  },
  {
    id: 'm4',
    desc: 'Supermercado',
    tipo: 'gasto',
    monto: 120000,
    fecha: daysAgo(0),
    cat: 'Hogar',
  },
]

export const INIT_METAS: Meta[] = []

export const INIT_TRANSFERS: Transferencia[] = []
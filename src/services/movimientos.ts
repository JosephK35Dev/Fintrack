import { supabase } from '../supabase'
import type { Mov } from '../lib'

type MovimientoDB = {
  id: string
  descripcion: string
  tipo: Mov['tipo']
  monto: number | string
  fecha: string
  cartera_id: string | null
  categoria_id: string | null
  categorias:
    | { nombre: string }
    | { nombre: string }[]
    | null
}

function mapMovimiento(m: MovimientoDB): Mov {
  const categoria = Array.isArray(m.categorias)
    ? m.categorias[0]?.nombre
    : m.categorias?.nombre

  return {
    id: m.id,
    desc: m.descripcion,
    tipo: m.tipo,
    monto: Number(m.monto),
    fecha: m.fecha,
    cat: categoria ?? 'Otros',
    cartera: m.cartera_id ?? undefined,
  }
}

export async function getMovimientos(): Promise<Mov[]> {
  const { data, error } = await supabase
    .from('movimientos')
    .select(`
      id,
      descripcion,
      tipo,
      monto,
      fecha,
      cartera_id,
      categoria_id,
      categorias (
        nombre
      )
    `)
    .order('fecha', { ascending: false })
    .order('created_at', { ascending: false })

  if (error) {
    throw error
  }

  return (data ?? []).map(
    m => mapMovimiento(m as MovimientoDB)
  )
}

export async function createMovimiento(
  movimiento: Mov,
  categoriaId: string | null
): Promise<Mov> {
  const { data, error } = await supabase
    .from('movimientos')
    .insert({
      descripcion: movimiento.desc,
      tipo: movimiento.tipo,
      monto: movimiento.monto,
      fecha: movimiento.fecha,
      cartera_id: movimiento.cartera || null,
      categoria_id: categoriaId,
    })
    .select(`
      id,
      descripcion,
      tipo,
      monto,
      fecha,
      cartera_id,
      categoria_id,
      categorias (
        nombre
      )
    `)
    .single()

  if (error) {
    throw error
  }

  return mapMovimiento(data as MovimientoDB)
}

export async function updateMovimiento(
  movimiento: Mov,
  categoriaId: string | null
): Promise<Mov> {
  const { data, error } = await supabase
    .from('movimientos')
    .update({
      descripcion: movimiento.desc,
      tipo: movimiento.tipo,
      monto: movimiento.monto,
      fecha: movimiento.fecha,
      cartera_id: movimiento.cartera || null,
      categoria_id: categoriaId,
    })
    .eq('id', movimiento.id)
    .select(`
      id,
      descripcion,
      tipo,
      monto,
      fecha,
      cartera_id,
      categoria_id,
      categorias (
        nombre
      )
    `)
    .single()

  if (error) {
    throw error
  }

  return mapMovimiento(data as MovimientoDB)
}

export async function deleteMovimiento(
  id: string
): Promise<void> {
  const { error } = await supabase
    .from('movimientos')
    .delete()
    .eq('id', id)

  if (error) {
    throw error
  }
}
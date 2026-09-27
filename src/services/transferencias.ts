import { supabase } from '../supabase'
import type { Transferencia } from '../lib'

type TransferenciaDB = {
  id: string
  desde_id: string
  hacia_id: string
  monto: number | string
  fecha: string
}

function mapTransferencia(
  t: TransferenciaDB
): Transferencia {
  return {
    id: t.id,
    desde: t.desde_id,
    hacia: t.hacia_id,
    monto: Number(t.monto),
    fecha: t.fecha,
  }
}

export async function getTransferencias(): Promise<Transferencia[]> {
  const { data, error } = await supabase
    .from('transferencias')
    .select(`
      id,
      desde_id,
      hacia_id,
      monto,
      fecha
    `)
    .order('fecha', { ascending: false })
    .order('created_at', { ascending: false })

  if (error) {
    throw error
  }

  return (data ?? []).map(
    t => mapTransferencia(t as TransferenciaDB)
  )
}

export async function createTransferencia(
  transferencia: Transferencia
): Promise<Transferencia> {
  const { data, error } = await supabase
    .from('transferencias')
    .insert({
      desde_id: transferencia.desde,
      hacia_id: transferencia.hacia,
      monto: transferencia.monto,
      fecha: transferencia.fecha,
    })
    .select(`
      id,
      desde_id,
      hacia_id,
      monto,
      fecha
    `)
    .single()

  if (error) {
    throw error
  }

  return mapTransferencia(
    data as TransferenciaDB
  )
}

export async function deleteTransferencia(
  id: string
): Promise<void> {
  const { error } = await supabase
    .from('transferencias')
    .delete()
    .eq('id', id)

  if (error) {
    throw error
  }
}
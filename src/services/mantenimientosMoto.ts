import { supabase } from '../supabase'
import type { MantenimientoMoto } from '../lib'

type MantenimientoRow = Omit<MantenimientoMoto, 'kilometraje' | 'costo' | 'notas'> & {
  kilometraje: number | string
  costo: number | string
  notas: string | null
}

const toMantenimiento = (row: MantenimientoRow): MantenimientoMoto => ({
  ...row,
  kilometraje: Number(row.kilometraje),
  costo: Number(row.costo),
  notas: row.notas ?? undefined,
})

export async function getMantenimientosMoto(): Promise<MantenimientoMoto[]> {
  const { data, error } = await supabase
    .from('mantenimientos_moto')
    .select('*')
    .order('fecha', { ascending: false })

  if (error) throw error
  return (data ?? []).map(row => toMantenimiento(row as MantenimientoRow))
}

export async function createMantenimientoMoto(
  mantenimiento: Omit<MantenimientoMoto, 'id' | 'created_at'>
): Promise<MantenimientoMoto> {
  const { data, error } = await supabase
    .from('mantenimientos_moto')
    .insert({
      tipo: mantenimiento.tipo.trim(),
      fecha: mantenimiento.fecha,
      kilometraje: mantenimiento.kilometraje,
      costo: mantenimiento.costo,
      notas: mantenimiento.notas?.trim() || null,
    })
    .select()
    .single()

  if (error) throw error
  return toMantenimiento(data as MantenimientoRow)
}

export async function updateMantenimientoMoto(
  mantenimiento: MantenimientoMoto
): Promise<MantenimientoMoto> {
  const { data, error } = await supabase
    .from('mantenimientos_moto')
    .update({
      tipo: mantenimiento.tipo.trim(),
      fecha: mantenimiento.fecha,
      kilometraje: mantenimiento.kilometraje,
      costo: mantenimiento.costo,
      notas: mantenimiento.notas?.trim() || null,
    })
    .eq('id', mantenimiento.id)
    .select()
    .single()

  if (error) throw error
  return toMantenimiento(data as MantenimientoRow)
}

export async function deleteMantenimientoMoto(id: string): Promise<void> {
  const { error } = await supabase
    .from('mantenimientos_moto')
    .delete()
    .eq('id', id)

  if (error) throw error
}

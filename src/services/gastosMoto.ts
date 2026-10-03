import { supabase } from '../supabase'
import type { GastoMoto } from '../lib'

type GastoRow = Omit<GastoMoto, 'valor'> & { valor: number | string }

const toGasto = (row: GastoRow): GastoMoto => ({
  ...row,
  valor: Number(row.valor),
})

export async function getGastosMoto(): Promise<GastoMoto[]> {
  const { data, error } = await supabase
    .from('gastos_moto')
    .select('*')
    .order('fecha', { ascending: false })

  if (error) throw error
  return (data ?? []).map(row => toGasto(row as GastoRow))
}

export async function createGastoMoto(
  gasto: Omit<GastoMoto, 'id' | 'created_at'>
): Promise<GastoMoto> {
  const { data, error } = await supabase
    .from('gastos_moto')
    .insert({
      categoria: gasto.categoria.trim(),
      descripcion: gasto.descripcion.trim(),
      valor: gasto.valor,
      fecha: gasto.fecha,
    })
    .select()
    .single()

  if (error) throw error
  return toGasto(data as GastoRow)
}

export async function updateGastoMoto(gasto: GastoMoto): Promise<GastoMoto> {
  const { data, error } = await supabase
    .from('gastos_moto')
    .update({
      categoria: gasto.categoria.trim(),
      descripcion: gasto.descripcion.trim(),
      valor: gasto.valor,
      fecha: gasto.fecha,
    })
    .eq('id', gasto.id)
    .select()
    .single()

  if (error) throw error
  return toGasto(data as GastoRow)
}

export async function deleteGastoMoto(id: string): Promise<void> {
  const { error } = await supabase
    .from('gastos_moto')
    .delete()
    .eq('id', id)

  if (error) throw error
}

import { supabase } from '../supabase'
import { DIAS_SEMANA_TODOS, type Habito, type HabitoRegistro } from '../lib'

export async function getHabitos(): Promise<Habito[]> {
  const { data, error } = await supabase
    .from('habitos')
    .select('*')
    .eq('activo', true)
    .order('created_at', { ascending: true })

  if (error) throw error

  return (data ?? []).map(row => ({
    ...row,
    descripcion: row.descripcion ?? undefined,
    diasSemana: row.dias_semana ?? [...DIAS_SEMANA_TODOS],
  }))
}

export async function getRegistrosHabitos(): Promise<HabitoRegistro[]> {
  const { data, error } = await supabase
    .from('habito_registros')
    .select('*')
    .order('fecha', { ascending: false })

  if (error) throw error

  return data ?? []
}

export async function createHabito(
  habito: Pick<Habito, 'nombre' | 'descripcion' | 'diasSemana'>
): Promise<Habito> {
  const { data, error } = await supabase
    .from('habitos')
    .insert({
      nombre: habito.nombre.trim(),
      descripcion: habito.descripcion?.trim() || null,
      dias_semana: habito.diasSemana,
    })
    .select()
    .single()

  if (error) throw error

  return {
    ...data,
    descripcion: data.descripcion ?? undefined,
    diasSemana: data.dias_semana ?? [...DIAS_SEMANA_TODOS],
  }
}

export async function updateHabito(
  habito: Pick<Habito, 'id' | 'nombre' | 'descripcion' | 'diasSemana'>
): Promise<Habito> {
  const { data, error } = await supabase
    .from('habitos')
    .update({
      nombre: habito.nombre.trim(),
      descripcion: habito.descripcion?.trim() || null,
      dias_semana: habito.diasSemana,
    })
    .eq('id', habito.id)
    .select()
    .single()

  if (error) throw error

  return {
    ...data,
    descripcion: data.descripcion ?? undefined,
    diasSemana: data.dias_semana ?? [...DIAS_SEMANA_TODOS],
  }
}

export async function deleteHabito(id: string): Promise<void> {
  const { error } = await supabase
    .from('habitos')
    .delete()
    .eq('id', id)

  if (error) throw error
}

export async function marcarHabito(
  habitoId: string,
  fecha: string
): Promise<HabitoRegistro> {
  const { data, error } = await supabase
    .from('habito_registros')
    .upsert(
      { habito_id: habitoId, fecha },
      { onConflict: 'habito_id,fecha' }
    )
    .select()
    .single()

  if (error) throw error

  return data
}

export async function desmarcarHabito(
  habitoId: string,
  fecha: string
): Promise<void> {
  const { error } = await supabase
    .from('habito_registros')
    .delete()
    .eq('habito_id', habitoId)
    .eq('fecha', fecha)

  if (error) throw error
}

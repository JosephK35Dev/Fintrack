import { supabase } from '../supabase'
import type { MotoInfo } from '../lib'

type MotoRow = {
  id: number
  nombre: string
  marca: string
  modelo: string
  anio: number
  kilometraje_actual: number | string
  imagen_url: string | null
  ultimo_cambio_aceite: number | string | null
  fecha_ultimo_cambio_aceite: string | null
  notas: string | null
  created_at: string
}

const toMoto = (row: MotoRow): MotoInfo => ({
  id: row.id,
  nombre: row.nombre,
  marca: row.marca,
  modelo: row.modelo,
  anio: Number(row.anio),
  kilometrajeActual: Number(row.kilometraje_actual),
  imagenUrl: row.imagen_url ?? undefined,
  ultimoCambioAceite: row.ultimo_cambio_aceite == null
    ? undefined
    : Number(row.ultimo_cambio_aceite),
  fechaUltimoCambioAceite: row.fecha_ultimo_cambio_aceite ?? undefined,
  notas: row.notas ?? undefined,
  created_at: row.created_at,
})

export async function getMoto(): Promise<MotoInfo | null> {
  const { data, error } = await supabase
    .from('moto')
    .select('*')
    .eq('id', 1)
    .maybeSingle()

  if (error) throw error
  return data ? toMoto(data as MotoRow) : null
}

export async function saveMoto(
  moto: Omit<MotoInfo, 'created_at'>
): Promise<MotoInfo> {
  const { data, error } = await supabase
    .from('moto')
    .upsert({
      id: 1,
      nombre: moto.nombre.trim(),
      marca: moto.marca.trim(),
      modelo: moto.modelo.trim(),
      anio: moto.anio,
      kilometraje_actual: moto.kilometrajeActual,
      imagen_url: moto.imagenUrl?.trim() || null,
      ultimo_cambio_aceite: moto.ultimoCambioAceite ?? null,
      fecha_ultimo_cambio_aceite: moto.fechaUltimoCambioAceite || null,
      notas: moto.notas?.trim() || null,
    })
    .select()
    .single()

  if (error) throw error
  return toMoto(data as MotoRow)
}

export async function uploadMotoImage(file: File): Promise<string> {
  const { error } = await supabase.storage
    .from('moto')
    .upload('principal', file, {
      cacheControl: '0',
      contentType: file.type,
      upsert: true,
    })

  if (error) throw error

  const { data } = supabase.storage
    .from('moto')
    .getPublicUrl('principal')

  return data.publicUrl + '?v=' + Date.now()
}

export async function updateMotoImage(imagenUrl: string): Promise<MotoInfo> {
  const { data, error } = await supabase
    .from('moto')
    .update({ imagen_url: imagenUrl })
    .eq('id', 1)
    .select()
    .single()

  if (error) throw error
  return toMoto(data as MotoRow)
}

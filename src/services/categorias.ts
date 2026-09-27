import { supabase } from '../supabase'

export async function getCategorias(): Promise<string[]> {
  const { data, error } = await supabase
    .from('categorias')
    .select('nombre')
    .order('created_at', { ascending: true })

  if (error) {
    throw error
  }

  return (data ?? []).map(c => c.nombre)
}

export async function createCategoria(
  nombre: string
): Promise<string> {
  const { data, error } = await supabase
    .from('categorias')
    .insert({
      nombre: nombre.trim(),
    })
    .select('nombre')
    .single()

  if (error) {
    throw error
  }

  return data.nombre
}

export async function updateCategoria(
  anterior: string,
  nuevo: string
): Promise<string> {
  const { data, error } = await supabase
    .from('categorias')
    .update({
      nombre: nuevo.trim(),
    })
    .eq('nombre', anterior)
    .select('nombre')
    .single()

  if (error) {
    throw error
  }

  return data.nombre
}

export async function deleteCategoria(
  nombre: string
): Promise<void> {
  const { error } = await supabase
    .from('categorias')
    .delete()
    .eq('nombre', nombre)

  if (error) {
    throw error
  }
}
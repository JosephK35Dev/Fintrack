import { supabase } from '../supabase'
import type { Tarea } from '../lib'

export async function getTareas(): Promise<Tarea[]> {
    console.log('SUPABASE:', supabase)

    const { data, error } = await supabase
        .from('tareas')
        .select('*')

    console.log('DATA:', data)
    console.log('ERROR:', error)

    if (error) throw error

    return data ?? []
}

export async function createTarea(
    tarea: Omit<Tarea, 'id' | 'created_at'>
): Promise<Tarea> {
    const { data, error } = await supabase
        .from('tareas')
        .insert({
            titulo: tarea.titulo.trim(),
            descripcion: tarea.descripcion?.trim() || null,
            fecha: tarea.fecha,
            completada: tarea.completada,
            prioridad: tarea.prioridad,
        })
        .select()
        .single()

    if (error) throw error

    return data
}

export async function updateTarea(
    tarea: Tarea
): Promise<Tarea> {
    const { data, error } = await supabase
        .from('tareas')
        .update({
            titulo: tarea.titulo.trim(),
            descripcion: tarea.descripcion?.trim() || null,
            fecha: tarea.fecha,
            completada: tarea.completada,
            prioridad: tarea.prioridad,
        })
        .eq('id', tarea.id)
        .select()
        .single()

    if (error) throw error

    return data
}

export async function deleteTarea(
    id: string
): Promise<void> {
    const { error } = await supabase
        .from('tareas')
        .delete()
        .eq('id', id)

    if (error) throw error
}
import { supabase } from '../supabase'
import type { Meta } from '../lib'

type MetaRow = {
    id: string
    nombre: string
    objetivo: number | string
    aporte_manual: number | string
    created_at: string
}


async function mapMeta(row: MetaRow): Promise<Meta> {
    const { data, error } = await supabase
        .from('meta_carteras')
        .select('cartera_id')
        .eq('meta_id', row.id)

    if (error) throw error

    return {
        id: row.id,
        nombre: row.nombre,
        objetivo: Number(row.objetivo),
        aporteManual: Number(row.aporte_manual),
        carteras: (data ?? []).map(
            x => x.cartera_id
        ),
    }
}

export async function getMetas(): Promise<Meta[]> {
    const { data, error } = await supabase
        .from('metas')
        .select('*')
        .order('created_at', {
            ascending: true,
        })

    if (error) throw error

    return Promise.all(
        (data ?? []).map(
            row => mapMeta(row as MetaRow)
        )
    )
}

export async function createMeta(
    meta: Omit<Meta, 'id'>
): Promise<Meta> {
    const { data, error } = await supabase
        .from('metas')
        .insert({
            nombre: meta.nombre.trim(),
            objetivo: meta.objetivo,
            aporte_manual: meta.aporteManual,
        })
        .select()
        .single()

    if (error) throw error

    const metaId = data.id

    if (meta.carteras.length > 0) {
        const { error: carterasError } =
            await supabase
                .from('meta_carteras')
                .insert(
                    meta.carteras.map(carteraId => ({
                        meta_id: metaId,
                        cartera_id: carteraId,
                    }))
                )

        if (carterasError) {
            await supabase
                .from('metas')
                .delete()
                .eq('id', metaId)

            throw carterasError
        }
    }

    return {
        id: metaId,
        nombre: data.nombre,
        objetivo: Number(data.objetivo),
        aporteManual: Number(data.aporte_manual),
        carteras: meta.carteras,
    }
}

export async function updateMeta(
    meta: Meta
): Promise<Meta> {
    const { data, error } = await supabase
        .from('metas')
        .update({
            nombre: meta.nombre.trim(),
            objetivo: meta.objetivo,
            aporte_manual: meta.aporteManual,
        })
        .eq('id', meta.id)
        .select()
        .single()

    if (error) throw error

    const { error: deleteError } =
        await supabase
            .from('meta_carteras')
            .delete()
            .eq('meta_id', meta.id)

    if (deleteError) throw deleteError

    if (meta.carteras.length > 0) {
        const { error: insertError } =
            await supabase
                .from('meta_carteras')
                .insert(
                    meta.carteras.map(carteraId => ({
                        meta_id: meta.id,
                        cartera_id: carteraId,
                    }))
                )

        if (insertError) throw insertError
    }

    return {
        id: data.id,
        nombre: data.nombre,
        objetivo: Number(data.objetivo),
        aporteManual: Number(data.aporte_manual),
        carteras: meta.carteras,
    }
}

export async function deleteMeta(
    id: string
): Promise<void> {
    const { error } = await supabase
        .from('metas')
        .delete()
        .eq('id', id)

    if (error) throw error
}
import { supabase } from '../supabase'
import type { Cartera } from '../lib'

export async function getCarteras(): Promise<Cartera[]> {
  const { data, error } = await supabase
    .from('carteras')
    .select('*')
    .order('created_at', { ascending: true })

  if (error) {
    throw error
  }

  return (data ?? []).map(c => ({
    id: c.id,
    nombre: c.nombre,
    saldoInicial: Number(c.saldo_inicial),
    incluirEnTotal: c.incluir_total,
  }))
}

export async function createCartera(
  cartera: Omit<Cartera, 'id'>
): Promise<Cartera> {
  const { data, error } = await supabase
    .from('carteras')
    .insert({
      nombre: cartera.nombre,
      saldo_inicial: cartera.saldoInicial,
      incluir_total: cartera.incluirEnTotal,
    })
    .select()
    .single()

  if (error) {
    throw error
  }

  return {
    id: data.id,
    nombre: data.nombre,
    saldoInicial: Number(data.saldo_inicial),
    incluirEnTotal: data.incluir_total,
  }
}

export async function updateCartera(
  cartera: Cartera
): Promise<Cartera> {
  const { data, error } = await supabase
    .from('carteras')
    .update({
      nombre: cartera.nombre,
      saldo_inicial: cartera.saldoInicial,
      incluir_total: cartera.incluirEnTotal,
    })
    .eq('id', cartera.id)
    .select()
    .single()

  if (error) {
    throw error
  }

  return {
    id: data.id,
    nombre: data.nombre,
    saldoInicial: Number(data.saldo_inicial),
    incluirEnTotal: data.incluir_total,
  }
}

export async function deleteCartera(id: string): Promise<void> {
  const { error } = await supabase
    .from('carteras')
    .delete()
    .eq('id', id)

  if (error) {
    throw error
  }
}
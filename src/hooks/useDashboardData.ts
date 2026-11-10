import { Mov, Store, Tarea, daysAgo, signed, sum } from '../lib'

const TODOS_LOS_DIAS = [1, 2, 3, 4, 5, 6, 7]

const clave = (d: Date) =>
  [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, '0'),
    String(d.getDate()).padStart(2, '0'),
  ].join('-')

export const ordenarMovs = (ms: Mov[]) =>
  [...ms].sort((a, b) => b.fecha.localeCompare(a.fecha))

export const gastosPorCategoria = (ms: Mov[]) => {
  const o: Record<string, number> = {}
  ms.filter(m => m.tipo === 'gasto').forEach(m => {
    o[m.cat] = (o[m.cat] || 0) + m.monto
  })
  return Object.entries(o)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
}

/**
 * Cálculos del dashboard. Las fórmulas son las del Dashboard original;
 * solo se movieron aquí para que escritorio y móvil muestren lo mismo.
 */
export function useDashboardData(s: Store) {
  const now = new Date()
  const hora = now.getHours()
  const saludo = hora < 12 ? 'Buenos días' : hora < 19 ? 'Buenas tardes' : 'Buenas noches'

  // Fechas calendario (YYYY-MM-DD): se comparan como texto, no como Date.
  const fechaMes = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  const movimientosMes = s.movs.filter(m => m.fecha.slice(0, 7) === fechaMes)
  const ingresosMes = sum(movimientosMes, 'ingreso')
  const gastosMes = sum(movimientosMes, 'gasto')
  const balanceMes = ingresosMes - gastosMes

  const total = s.carts
    .filter(c => c.incluirEnTotal)
    .reduce((a, c) => a + s.saldo(c.id), 0)

  const prioridad = { alta: 0, media: 1, baja: 2 }
  const compararTareas = (a: Tarea, b: Tarea) => {
    const porPrioridad = prioridad[a.prioridad] - prioridad[b.prioridad]
    if (porPrioridad) return porPrioridad
    if (a.fecha && b.fecha) return a.fecha.localeCompare(b.fecha)
    if (a.fecha) return -1
    if (b.fecha) return 1
    return b.created_at.localeCompare(a.created_at)
  }
  const pendientes = s.tareas.filter(t => !t.completada).sort(compararTareas)

  const fechaActual = new Intl.DateTimeFormat('es-CO', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(now)
  const fechaHoy = clave(now)
  const diaHoy = ((now.getDay() + 6) % 7) + 1

  const habitosActivos = s.habitos.filter(h => h.activo)
  const habitosDeHoy = habitosActivos.filter(h =>
    (h.diasSemana ?? TODOS_LOS_DIAS).includes(diaHoy)
  )
  const completadosHoy = new Set(
    s.registrosHabitos.filter(r => r.fecha === fechaHoy).map(r => r.habito_id)
  )
  const completadosProgramados = habitosDeHoy.filter(h => completadosHoy.has(h.id)).length
  const progresoHabitos = habitosDeHoy.length
    ? Math.round((completadosProgramados / habitosDeHoy.length) * 100)
    : 0

  const rachaDe = (habitoId: string) => {
    const habito = habitosActivos.find(h => h.id === habitoId)
    if (!habito) return 0
    const dias = habito.diasSemana ?? TODOS_LOS_DIAS
    const registros = new Set(
      s.registrosHabitos.filter(r => r.habito_id === habitoId).map(r => r.fecha)
    )
    const cursor = new Date(now)
    if (dias.includes(diaHoy) && !registros.has(fechaHoy)) cursor.setDate(cursor.getDate() - 1)
    let racha = 0
    while (true) {
      const dia = ((cursor.getDay() + 6) % 7) + 1
      if (dias.includes(dia)) {
        if (!registros.has(clave(cursor))) break
        racha += 1
      }
      cursor.setDate(cursor.getDate() - 1)
    }
    return racha
  }
  const rachaActual = habitosActivos.reduce((max, h) => Math.max(max, rachaDe(h.id)), 0)

  const formatFecha = (fecha?: string) => {
    if (!fecha) return 'Sin registrar'
    const [year, month, day] = fecha.slice(0, 10).split('-').map(Number)
    return new Intl.DateTimeFormat('es-CO', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(new Date(year, month - 1, day))
  }

  const etiquetaDia = (fecha: string) => {
    const f = fecha.slice(0, 10)
    if (f === fechaHoy) return 'Hoy'
    if (f === daysAgo(1)) return 'Ayer'
    const [year, month, day] = f.split('-').map(Number)
    return new Intl.DateTimeFormat('es-CO', { day: 'numeric', month: 'short' }).format(
      new Date(year, month - 1, day)
    )
  }

  const recientes = ordenarMovs(s.movs).slice(0, 6)
  const categorias = gastosPorCategoria(s.movs)

  // Evolución del balance (solo visual): se reconstruye hacia atrás desde el
  // balance actual, restando lo que ocurrió después de cada día.
  const incluidas = new Set(s.carts.filter(c => c.incluirEnTotal).map(c => c.id))
  const serie = Array.from({ length: 30 }, (_, i) => {
    const fecha = daysAgo(29 - i)
    const movsDespues = s.movs
      .filter(m => m.cartera && incluidas.has(m.cartera) && m.fecha.slice(0, 10) > fecha)
      .reduce((a, m) => a + signed(m), 0)
    const transDespues = s.transfers
      .filter(t => t.fecha.slice(0, 10) > fecha)
      .reduce(
        (a, t) => a + (incluidas.has(t.hacia) ? t.monto : 0) - (incluidas.has(t.desde) ? t.monto : 0),
        0
      )
    return { fecha, valor: total - movsDespues - transDespues }
  })

  return {
    now,
    saludo,
    fechaActual,
    fechaHoy,
    total,
    ingresosMes,
    gastosMes,
    balanceMes,
    pendientes,
    compararTareas,
    habitosDeHoy,
    completadosHoy,
    completadosProgramados,
    progresoHabitos,
    rachaActual,
    recientes,
    categorias,
    serie,
    // Alias que usa el Dashboard de escritorio
    movimientosRecientes: recientes.slice(0, 5),
    balanceHistory: serie.map(p => ({ date: p.fecha, value: p.valor })),
    formatFecha,
    etiquetaDia,
  }
}
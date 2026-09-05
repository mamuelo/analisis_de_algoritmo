/**
 * @file activitySelection.js
 * @description Módulo de Lógica Pura: Algoritmo Voraz de Selección de Actividades (Activity Selection Problem)
 * aplicado a la optimización de reservas de una sala de juntas en un Coworking Space.
 * 
 * @author Análisis de Algoritmos - 8vo Semestre
 * @version 1.0.0
 * 
 * FUNDAMENTO TEÓRICO:
 * Dado un conjunto S = {a_1, a_2, ..., a_n} de n actividades que compiten por un recurso común (sala exclusiva),
 * cada actividad tiene un tiempo de inicio s_i y un tiempo de fin f_i, donde 0 <= s_i < f_i < inf.
 * Dos actividades a_i y a_j son compatibles si sus intervalos no se solapan: [s_i, f_i) ∩ [s_j, f_j) = ∅.
 * El problema consiste en seleccionar un subconjunto compatible A ⊆ S de cardinalidad máxima |A|.
 * 
 * ESTRATEGIA VORAZ (GREEDY CHOICE):
 * 1. Ordenar actividades en orden monótonamente creciente según su tiempo de finalización (f_1 <= f_2 <= ... <= f_n).
 * 2. Seleccionar vorazmente la primera actividad a_1 (deja la mayor cantidad de tiempo libre para las actividades restantes).
 * 3. Para cada actividad restante a_i, si su hora de inicio es mayor o igual al fin de la última actividad aceptada
 *    (s_i >= f_last), se acepta y se actualiza f_last = f_i. De lo contrario, se rechaza.
 * 
 * COMPLEJIDAD:
 * - Temporal: O(n log n) debido al ordenamiento por tiempo de finalización; el barrido posterior es lineal O(n).
 * - Espacial: O(n) para estructurar el resultado, la traza pedagógica y los elementos seleccionados/rechazados.
 */

/**
 * @typedef {Object} Activity
 * @property {string|number} id - Identificador único de la solicitud
 * @property {string} title - Nombre o descripción del evento
 * @property {string|number} start - Hora de inicio (formato "HH:mm" o número decimal de horas, ej: "09:30" o 9.5)
 * @property {string|number} end - Hora de finalización (formato "HH:mm" o número decimal de horas)
 * @property {string} [organizer] - Opcional: persona o equipo solicitante
 * @property {string} [color] - Opcional: color temático para UI
 */

/**
 * @typedef {Object} NormalizedActivity
 * @property {string|number} id - Identificador único
 * @property {string} title - Nombre del evento
 * @property {number} startMinutes - Hora de inicio convertida a minutos absolutos desde las 00:00
 * @property {number} endMinutes - Hora de fin convertida a minutos absolutos desde las 00:00
 * @property {string} startFormatted - Hora de inicio formateada "HH:mm"
 * @property {string} endFormatted - Hora de fin formateada "HH:mm"
 * @property {number} durationMinutes - Duración en minutos
 * @property {string} [organizer] - Organizador
 * @property {string} [color] - Color asignado
 */

/**
 * @typedef {Object} RejectedActivity
 * @property {NormalizedActivity} activity - Datos del evento rechazado
 * @property {string} reason - Motivo formal y pedagógico del descarte
 * @property {NormalizedActivity|null} conflictingWith - Evento aceptado con el cual entra en colisión
 */

/**
 * @typedef {Object} TraceStep
 * @property {number} step - Número correlativo de decisión (1-indexed)
 * @property {NormalizedActivity} candidate - Actividad bajo evaluación
 * @property {'SELECTED'|'REJECTED'} decision - Decisión tomada por la regla voraz
 * @property {string} explanation - Explicación matemática/pedagógica de la decisión
 * @property {number} lastFinishMinutes - Hora de fin de la última actividad aprobada (en minutos)
 * @property {string} lastFinishFormatted - Hora de fin de la última actividad aprobada ("HH:mm")
 * @property {NormalizedActivity[]} currentSelectedSnapshot - Copia del estado de seleccionados hasta este paso
 */

/**
 * @typedef {Object} ActivitySelectionResult
 * @property {NormalizedActivity[]} selected - Lista de actividades admitidas en el horario óptimo
 * @property {RejectedActivity[]} rejected - Lista de actividades rechazadas con justificación
 * @property {TraceStep[]} trace - Registro paso a paso de la ejecución voraz para inspección pedagógica
 * @property {Object} metrics - Indicadores cuantitativos de rendimiento
 * @property {number} metrics.totalRequests - Cantidad total de solicitudes (n)
 * @property {number} metrics.selectedCount - Cantidad máxima de eventos agendados (|A|)
 * @property {number} metrics.rejectedCount - Cantidad de eventos descartados (|R|)
 * @property {number} metrics.utilizationMinutes - Minutos totales en que la sala estará en uso
 * @property {number} metrics.utilizationPercentage - Porcentaje de uso respecto a la jornada (08:00 - 20:00 = 720 min)
 * @property {number} metrics.executionTimeMs - Tiempo de cómputo medido en milisegundos
 */

/**
 * Convierte cualquier formato de tiempo válido ("HH:mm", número decimal) a minutos totales desde 00:00.
 * @param {string|number} timeValue - Ej: "08:30", "14:15", 8.5, 14.25
 * @returns {number} Minutos enteros desde las 00:00
 */
export function timeToMinutes(timeValue) {
  if (typeof timeValue === 'number') {
    return Math.round(timeValue * 60);
  }
  if (typeof timeValue === 'string') {
    const parts = timeValue.trim().split(':');
    if (parts.length === 2) {
      const hours = parseInt(parts[0], 10);
      const minutes = parseInt(parts[1], 10);
      if (!isNaN(hours) && !isNaN(minutes)) {
        return hours * 60 + minutes;
      }
    }
    const parsedNum = parseFloat(timeValue);
    if (!isNaN(parsedNum)) {
      return Math.round(parsedNum * 60);
    }
  }
  throw new Error(`Formato de hora inválido: "${timeValue}". Se espera "HH:mm" (ej: "09:30") o número decimal.`);
}

/**
 * Convierte minutos totales desde 00:00 a formato canónico "HH:mm".
 * @param {number} minutes - Minutos absolutos
 * @returns {string} Formato "HH:mm" con relleno a 2 dígitos
 */
export function minutesToTime(minutes) {
  const bounded = Math.max(0, Math.floor(minutes));
  const h = Math.floor(bounded / 60);
  const m = bounded % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

/**
 * Normaliza y valida una actividad de entrada garantizando consistencia temporal.
 * @param {Activity} raw 
 * @returns {NormalizedActivity}
 */
export function normalizeActivity(raw) {
  if (!raw || typeof raw !== 'object') {
    throw new Error('Objeto de actividad inválido.');
  }

  const startMinutes = typeof raw.startMinutes === 'number'
    ? raw.startMinutes
    : timeToMinutes(raw.start || raw.startFormatted);

  const endMinutes = typeof raw.endMinutes === 'number'
    ? raw.endMinutes
    : timeToMinutes(raw.end || raw.endFormatted);

  if (startMinutes >= endMinutes) {
    throw new Error(
      `Inconsistencia temporal en "${raw.title}": la hora de inicio (${minutesToTime(startMinutes)}) debe ser estrictamente anterior a la de finalización (${minutesToTime(endMinutes)}).`
    );
  }

  return {
    id: raw.id || `act-${Math.random().toString(36).substring(2, 9)}`,
    title: raw.title || 'Evento sin nombre',
    start: raw.start || minutesToTime(startMinutes),
    end: raw.end || minutesToTime(endMinutes),
    startMinutes,
    endMinutes,
    startFormatted: raw.startFormatted || minutesToTime(startMinutes),
    endFormatted: raw.endFormatted || minutesToTime(endMinutes),
    durationMinutes: endMinutes - startMinutes,
    organizer: raw.organizer || 'Miembro Coworking',
    color: raw.color || '#3b82f6'
  };
}

/**
 * Resuelve el problema de selección de actividades mediante el algoritmo voraz clásico (Greedy).
 * Esta función es pura: no muta el arreglo de entrada y no produce efectos secundarios.
 * 
 * Teorema de Correctitud (Greedy Choice Property):
 * Sea S = {a_1, ..., a_n} ordenado tal que f_1 <= f_2 <= ... <= f_n.
 * Existe un subconjunto óptimo de actividades compatibles A ⊆ S tal que a_1 ∈ A.
 * Demostración por reducción (Cut-and-Paste):
 * Sea B un conjunto óptimo compatible cualquiera. Ordenemos las actividades de B por fin.
 * Sea k la primera actividad en B. Si k = a_1, entonces B ya contiene a a_1.
 * Si k ≠ a_1, dado que f_1 <= f_k (por ser a_1 la de fin mínimo en S), podemos sustituir k por a_1
 * formando B' = (B - {k}) ∪ {a_1}. Como a_1 termina antes o igual que k, no entra en conflicto con
 * ninguna otra actividad de B, por lo que B' es compatible y |B'| = |B|. En consecuencia, B' también
 * es óptimo y contiene a a_1.
 * 
 * @param {Activity[]} activities - Lista no ordenada de solicitudes de reserva
 * @returns {ActivitySelectionResult} Resultado óptimo con selección, descartes, traza pedagógica y métricas
 */
export function solveActivitySelection(activities = []) {
  const startTimePerf = typeof performance !== 'undefined' ? performance.now() : Date.now();

  if (!Array.isArray(activities) || activities.length === 0) {
    return {
      selected: [],
      rejected: [],
      trace: [],
      metrics: {
        totalRequests: 0,
        selectedCount: 0,
        rejectedCount: 0,
        utilizationMinutes: 0,
        utilizationPercentage: 0,
        executionTimeMs: 0
      }
    };
  }

  // 1. Normalización de datos
  const normalized = activities.map(normalizeActivity);

  // 2. Ordenamiento voraz por tiempo de finalización ascendente O(n log n)
  // En caso de empate en f_i, se prioriza la que inicie más tarde (menor duración)
  const sorted = [...normalized].sort((a, b) => {
    if (a.endMinutes !== b.endMinutes) {
      return a.endMinutes - b.endMinutes;
    }
    return b.startMinutes - a.startMinutes;
  });

  const selected = [];
  const rejected = [];
  const trace = [];

  let lastFinishMinutes = 0;
  let lastAcceptedActivity = null;

  // 3. Barrido lineal Voraz O(n)
  sorted.forEach((candidate, index) => {
    const stepNumber = index + 1;

    // Condición voraz de compatibilidad: s_i >= f_last
    if (lastAcceptedActivity === null || candidate.startMinutes >= lastFinishMinutes) {
      // DECISIÓN: SELECCIONAR
      selected.push(candidate);
      lastFinishMinutes = candidate.endMinutes;
      lastAcceptedActivity = candidate;

      const explanation = stepNumber === 1
        ? `[ELECCIÓN VORAZ INICIAL] Aceptado. Es el evento que termina más temprano (${candidate.endFormatted}), maximizando el tiempo restante para reuniones futuras.`
        : `[COMPATIBLE] Aceptado. Su inicio (${candidate.startFormatted}) ocurre después o exactamente al término de "${lastAcceptedActivity.title}" (${lastAcceptedActivity.endFormatted}).`;

      trace.push({
        step: stepNumber,
        candidate,
        decision: 'SELECTED',
        explanation,
        lastFinishMinutes,
        lastFinishFormatted: minutesToTime(lastFinishMinutes),
        currentSelectedSnapshot: [...selected]
      });
    } else {
      // DECISIÓN: RECHAZAR POR SOLAPAMIENTO
      const conflictMsg = `Conflicto temporal con "${lastAcceptedActivity.title}". La sala está ocupada hasta las ${lastAcceptedActivity.endFormatted}, pero "${candidate.title}" solicita iniciar a las ${candidate.startFormatted} (solapamiento de ${lastFinishMinutes - candidate.startMinutes} min).`;

      rejected.push({
        activity: candidate,
        reason: conflictMsg,
        conflictingWith: lastAcceptedActivity
      });

      trace.push({
        step: stepNumber,
        candidate,
        decision: 'REJECTED',
        explanation: `[RECHAZADO] Solapamiento detectado. La sala se desocupa a las ${lastAcceptedActivity.endFormatted}, no permitiendo iniciar a las ${candidate.startFormatted}.`,
        lastFinishMinutes,
        lastFinishFormatted: minutesToTime(lastFinishMinutes),
        currentSelectedSnapshot: [...selected]
      });
    }
  });

  const endTimePerf = typeof performance !== 'undefined' ? performance.now() : Date.now();
  const executionTimeMs = Number((endTimePerf - startTimePerf).toFixed(3));

  // Jornada laboral estándar del coworking: 08:00 (480 min) a 20:00 (1200 min) = 720 min
  const DAY_CAPACITY_MINUTES = 12 * 60;
  const utilizationMinutes = selected.reduce((acc, act) => acc + act.durationMinutes, 0);
  const utilizationPercentage = Number(((utilizationMinutes / DAY_CAPACITY_MINUTES) * 100).toFixed(1));

  return {
    selected,
    rejected,
    trace,
    sortedActivities: sorted,
    metrics: {
      totalRequests: activities.length,
      selectedCount: selected.length,
      rejectedCount: rejected.length,
      utilizationMinutes,
      utilizationPercentage,
      executionTimeMs
    }
  };
}

/**
 * Caso de prueba predefinido (Demo) con 10 reuniones realistas de un Coworking Space.
 * Diseñado específicamente para demostrar casos de solapamiento severo, reuniones largas
 * que intentan acaparar la sala y cómo la estrategia voraz maximiza el número total de eventos.
 */
export const DEMO_ACTIVITIES = [
  {
    id: 'demo-1',
    title: 'Reunión Diaria - Equipo de Desarrollo',
    start: '08:30',
    end: '09:30',
    organizer: 'Líder de Ingeniería',
    color: '#06b6d4'
  },
  {
    id: 'demo-2',
    title: 'Presentación ante Inversionistas',
    start: '09:00',
    end: '11:00',
    organizer: 'Director General',
    color: '#f59e0b'
  },
  {
    id: 'demo-3',
    title: 'Sincronización de Producto y Diseño',
    start: '09:45',
    end: '10:45',
    organizer: 'Gerente de Producto',
    color: '#3b82f6'
  },
  {
    id: 'demo-4',
    title: 'Planificación Estratégica Trimestral',
    start: '10:30',
    end: '13:30',
    organizer: 'Coordinador de Proyectos',
    color: '#ec4899'
  },
  {
    id: 'demo-5',
    title: 'Demostración para Cliente Corporativo',
    start: '11:00',
    end: '12:00',
    organizer: 'Director Comercial',
    color: '#10b981'
  },
  {
    id: 'demo-6',
    title: 'Almuerzo de Socios y Directivos',
    start: '12:00',
    end: '13:00',
    organizer: 'Junta Directiva',
    color: '#8b5cf6'
  },
  {
    id: 'demo-7',
    title: 'Taller de Ciberseguridad y Operaciones',
    start: '13:00',
    end: '15:30',
    organizer: 'Equipo de Seguridad',
    color: '#ef4444'
  },
  {
    id: 'demo-8',
    title: 'Entrevista Técnica: Arquitecto Principal',
    start: '13:15',
    end: '14:30',
    organizer: 'Atracción de Talento',
    color: '#14b8a6'
  },
  {
    id: 'demo-9',
    title: 'Comité de Finanzas y Presupuesto',
    start: '14:45',
    end: '16:15',
    organizer: 'Director Financiero',
    color: '#6366f1'
  },
  {
    id: 'demo-10',
    title: 'Retrospectiva e Integración de Equipo',
    start: '16:30',
    end: '18:00',
    organizer: 'Gestión de Personas',
    color: '#84cc16'
  }
];

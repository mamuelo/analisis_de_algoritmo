/**
 * @file activitySelection.test.js
 * @description Suite de pruebas unitarias y de verificación formal para el Algoritmo Voraz
 * de Selección de Actividades (Activity Selection Problem).
 */

import { solveActivitySelection, DEMO_ACTIVITIES, timeToMinutes, minutesToTime } from './activitySelection.js';

let passed = 0;
let total = 0;

function assert(condition, message) {
  total++;
  if (!condition) {
    console.error(`❌ FALLÓ: ${message}`);
    process.exitCode = 1;
  } else {
    passed++;
    console.log(`✅ PASÓ: ${message}`);
  }
}

console.log('--- INICIO DE PRUEBAS UNITARIAS: activitySelection.js ---');

// Test 1: Conversión de formatos temporales
assert(timeToMinutes('08:30') === 510, '08:30 equivale a 510 minutos');
assert(timeToMinutes('14:45') === 885, '14:45 equivale a 885 minutos');
assert(timeToMinutes(9.5) === 570, '9.5 decimal equivale a 570 minutos (09:30)');
assert(minutesToTime(510) === '08:30', '510 minutos se formatea como 08:30');
assert(minutesToTime(885) === '14:45', '885 minutos se formatea como 14:45');

// Test 2: Caso base lista vacía
const emptyResult = solveActivitySelection([]);
assert(emptyResult.selected.length === 0, 'Lista vacía produce 0 seleccionados');
assert(emptyResult.rejected.length === 0, 'Lista vacía produce 0 rechazados');

// Test 3: Actividades sin solapamiento (todas deben ser seleccionadas)
const nonOverlapping = [
  { id: '1', title: 'A', start: '08:00', end: '09:00' },
  { id: '2', title: 'B', start: '09:00', end: '10:30' },
  { id: '3', title: 'C', start: '11:00', end: '12:00' }
];
const resNonOverlapping = solveActivitySelection(nonOverlapping);
assert(resNonOverlapping.selected.length === 3, 'Todas las actividades sin conflicto son aceptadas (3/3)');
assert(resNonOverlapping.rejected.length === 0, 'Cero actividades rechazadas en conjunto compatible');

// Test 4: Actividades idénticas en horario (solo 1 debe ser seleccionada)
const identical = [
  { id: '1', title: 'A1', start: '10:00', end: '11:00' },
  { id: '2', title: 'A2', start: '10:00', end: '11:00' },
  { id: '3', title: 'A3', start: '10:00', end: '11:00' }
];
const resIdentical = solveActivitySelection(identical);
assert(resIdentical.selected.length === 1, 'Solo 1 actividad aceptada ante horarios idénticos');
assert(resIdentical.rejected.length === 2, '2 actividades rechazadas correctamente');

// Test 5: Caso clásico voraz: Reunión larga que inicia temprano vs 3 reuniones cortas
// Si se eligiera por hora de inicio, se elegiría la larga (subóptimo: 1 evento).
// El algoritmo greedy por hora de fin debe elegir las 3 reuniones cortas (óptimo: 3 eventos).
const greedyProofCase = [
  { id: 'long', title: 'Reunión Monopolizadora', start: '08:00', end: '12:00' },
  { id: 'short1', title: 'Corta 1', start: '08:15', end: '09:00' },
  { id: 'short2', title: 'Corta 2', start: '09:15', end: '10:00' },
  { id: 'short3', title: 'Corta 3', start: '10:15', end: '11:00' }
];
const resGreedyProof = solveActivitySelection(greedyProofCase);
assert(resGreedyProof.selected.length === 3, 'Greedy maximiza cantidad eligiendo las 3 reuniones cortas en vez de la larga');
assert(resGreedyProof.selected.map(s => s.id).join(',') === 'short1,short2,short3', 'Selecciona short1, short2, short3');
assert(resGreedyProof.rejected.some(r => r.activity.id === 'long'), 'Reunión monopolizadora fue rechazada');

// Test 6: Verificación de invariante de no-solapamiento en el resultado
const demoResult = solveActivitySelection(DEMO_ACTIVITIES);
assert(demoResult.selected.length > 0, 'Demo produce eventos seleccionados');
assert(demoResult.selected.length + demoResult.rejected.length === DEMO_ACTIVITIES.length, 'Suma de seleccionados y rechazados igual al total de solicitudes');

let noOverlapInvariant = true;
for (let i = 1; i < demoResult.selected.length; i++) {
  const prev = demoResult.selected[i - 1];
  const curr = demoResult.selected[i];
  if (curr.startMinutes < prev.endMinutes) {
    noOverlapInvariant = false;
    break;
  }
}
assert(noOverlapInvariant, 'Invariante de no-solapamiento verificada: s_i >= f_{i-1} para todo i');

// Test 7: Verificación de la traza pedagógica
assert(demoResult.trace.length === DEMO_ACTIVITIES.length, 'La traza contiene exactamente un registro por cada candidato evaluado');
assert(demoResult.trace[0].decision === 'SELECTED', 'El primer elemento evaluado tras ordenar por fin siempre es SELECTED (Greedy Choice)');

console.log(`\n--- RESULTADO FINAL: ${passed}/${total} pruebas superadas exitosamente. ---`);

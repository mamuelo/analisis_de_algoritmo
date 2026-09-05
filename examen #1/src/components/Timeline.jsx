import React, { useState } from 'react';
import { normalizeActivity, minutesToTime } from '../algorithms/activitySelection.js';

const START_OF_DAY_MINUTES = 8 * 60; // 08:00 = 480 min
const END_OF_DAY_MINUTES = 20 * 60;   // 20:00 = 1200 min
const TOTAL_DAY_MINUTES = END_OF_DAY_MINUTES - START_OF_DAY_MINUTES; // 720 min (12 horas)

const HOURS = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

export default function Timeline({ 
  activities = [], 
  selectedActivities = [], 
  rejectedActivities = [], 
  isExecuted = false 
}) {
  const [selectedEventModal, setSelectedEventModal] = useState(null);
  const [filterMode, setFilterMode] = useState('all'); // 'all' | 'selected' | 'rejected'
  const [viewMode, setViewMode] = useState('lanes'); // 'lanes' | 'master'

  // Normalización segura a prueba de fallos
  const normalizedActivities = (activities || []).map((act) => {
    try {
      return normalizeActivity(act);
    } catch {
      return null;
    }
  }).filter(Boolean);

  const normalizedSelected = (selectedActivities || []).map((act) => {
    try {
      return normalizeActivity(act);
    } catch {
      return null;
    }
  }).filter(Boolean);

  const selectedIds = new Set(normalizedSelected.map((a) => a.id));
  const rejectedMap = new Map((rejectedActivities || []).map((r) => [r.activity?.id || r.id, r]));

  // Calcula posición porcentual exacta en el canvas de 12 horas
  const getCoordinates = (startMinutes, endMinutes) => {
    const s = Number(startMinutes);
    const e = Number(endMinutes);
    if (isNaN(s) || isNaN(e)) {
      return { left: '0%', width: '8%' };
    }
    const clampedStart = Math.max(START_OF_DAY_MINUTES, Math.min(s, END_OF_DAY_MINUTES));
    const clampedEnd = Math.max(START_OF_DAY_MINUTES, Math.min(e, END_OF_DAY_MINUTES));
    
    const leftPercent = ((clampedStart - START_OF_DAY_MINUTES) / TOTAL_DAY_MINUTES) * 100;
    const rawWidthPercent = ((clampedEnd - clampedStart) / TOTAL_DAY_MINUTES) * 100;
    const widthPercent = Math.max(rawWidthPercent, 3.5);
    
    return { 
      left: `${leftPercent}%`, 
      width: `${Math.min(widthPercent, 100 - leftPercent)}%` 
    };
  };

  // Asignación de carriles
  const computeLanes = (items) => {
    const lanes = [];
    const sorted = [...items].sort((a, b) => a.startMinutes - b.startMinutes);

    sorted.forEach((act) => {
      let placed = false;
      for (let i = 0; i < lanes.length; i++) {
        const lastInLane = lanes[i][lanes[i].length - 1];
        if (act.startMinutes >= lastInLane.endMinutes) {
          lanes[i].push(act);
          placed = true;
          break;
        }
      }
      if (!placed) {
        lanes.push([act]);
      }
    });

    return lanes;
  };

  const filteredActivities = normalizedActivities.filter((act) => {
    if (!isExecuted || filterMode === 'all') return true;
    if (filterMode === 'selected') return selectedIds.has(act.id);
    if (filterMode === 'rejected') return !selectedIds.has(act.id);
    return true;
  });

  const lanes = computeLanes(filteredActivities);

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
      {/* Header del Timeline */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-slate-900">
              Línea de Tiempo (08:00 – 20:00)
            </h2>
            {isExecuted && (
              <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                Agenda generada
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Distribución de eventos a lo largo de la jornada. Haz clic en un bloque para consultar los detalles.
          </p>
        </div>

        {/* Controles de Vista y Filtros */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Selector de modo */}
          <div className="bg-slate-100 p-0.5 rounded-lg border border-slate-200 flex items-center text-xs">
            <button
              type="button"
              onClick={() => setViewMode('lanes')}
              className={`px-2.5 py-1 rounded font-medium transition-all cursor-pointer ${
                viewMode === 'lanes'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Vista Solicitudes
            </button>
            <button
              type="button"
              onClick={() => setViewMode('master')}
              disabled={!isExecuted}
              className={`px-2.5 py-1 rounded font-medium transition-all ${
                !isExecuted
                  ? 'opacity-40 cursor-not-allowed text-slate-400'
                  : viewMode === 'master'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 cursor-pointer'
              }`}
            >
              Agenda Confirmada
            </button>
          </div>

          {/* Filtros */}
          {isExecuted && viewMode === 'lanes' && (
            <div className="bg-slate-100 p-0.5 rounded-lg border border-slate-200 flex items-center text-xs">
              <button
                type="button"
                onClick={() => setFilterMode('all')}
                className={`px-2 py-1 rounded transition-all cursor-pointer ${
                  filterMode === 'all' ? 'bg-white text-slate-900 font-medium shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Todos ({normalizedActivities.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterMode('selected')}
                className={`px-2 py-1 rounded transition-all cursor-pointer ${
                  filterMode === 'selected' ? 'bg-white text-emerald-800 font-medium shadow-xs' : 'text-slate-600 hover:text-emerald-700'
                }`}
              >
                Aprobados ({normalizedSelected.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterMode('rejected')}
                className={`px-2 py-1 rounded transition-all cursor-pointer ${
                  filterMode === 'rejected' ? 'bg-white text-slate-800 font-medium shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Descartados ({rejectedActivities.length})
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Canvas del Timeline */}
      <div className="mt-4 overflow-x-auto pb-2">
        <div className="min-w-[1000px] relative select-none">
          
          {/* Regla Horaria Superior */}
          <div className="relative h-6 border-b border-slate-200 text-slate-500 text-[11px] font-mono mb-2">
            {HOURS.map((hour) => {
              const leftPercent = ((hour - 8) / 12) * 100;
              return (
                <div 
                  key={`label-${hour}`} 
                  style={{ left: `${leftPercent}%` }}
                  className={`absolute top-0 transform ${
                    hour === 8 ? 'translate-x-0' : hour === 20 ? '-translate-x-full' : '-translate-x-1/2'
                  } flex flex-col items-center pointer-events-none`}
                >
                  <span className="font-medium text-slate-600">{String(hour).padStart(2, '0')}:00</span>
                  <span className="w-px h-1 bg-slate-300 mt-0.5"></span>
                </div>
              );
            })}
          </div>

          {/* Grilla Vertical de Fondo */}
          <div className="absolute top-6 bottom-0 left-0 right-0 pointer-events-none z-0">
            {HOURS.map((hour) => {
              const leftPercent = ((hour - 8) / 12) * 100;
              return (
                <div 
                  key={`grid-line-${hour}`} 
                  style={{ left: `${leftPercent}%` }}
                  className="absolute top-0 bottom-0 border-l border-slate-100"
                />
              );
            })}
          </div>

          {/* CONTENIDO 1: Vista Agenda Confirmada (Máster) */}
          {viewMode === 'master' && isExecuted && (
            <div className="mt-2 relative z-10">
              <div className="text-xs font-medium text-slate-700 mb-2">
                Horario Confirmado de la Sala
              </div>
              <div className="relative h-18 bg-slate-50 rounded-lg border border-slate-200 p-2 overflow-hidden">
                {normalizedSelected.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-xs text-slate-400">
                    No hay actividades programadas.
                  </div>
                ) : (
                  normalizedSelected.map((act) => {
                    const coords = getCoordinates(act.startMinutes, act.endMinutes);
                    return (
                      <div
                        key={`master-${act.id}`}
                        onClick={() => setSelectedEventModal(act)}
                        style={{ left: coords.left, width: coords.width }}
                        className="absolute top-1.5 bottom-1.5 rounded bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-900 p-2 cursor-pointer transition-all flex flex-col justify-between overflow-hidden shadow-xs"
                      >
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-medium text-xs truncate text-slate-900">
                            {act.title}
                          </span>
                          <span className="text-[10px] text-emerald-800 font-mono font-medium flex-shrink-0">
                            {act.startFormatted}-{act.endFormatted}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-500 truncate">
                          {act.organizer} • {act.durationMinutes} min
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* CONTENIDO 2: Vista Multi-Pista */}
          {viewMode === 'lanes' && (
            <div className="mt-2 space-y-2 relative z-10">
              {normalizedActivities.length === 0 ? (
                <div className="py-10 text-center text-slate-400 text-xs">
                  No hay solicitudes registradas. Agrega una arriba o presiona "Cargar Ejemplo (10)".
                </div>
              ) : (
                lanes.map((lane, laneIdx) => (
                  <div
                    key={`lane-${laneIdx}`}
                    className="relative h-14 bg-slate-50/70 rounded-lg border border-slate-200 transition-colors"
                  >
                    {lane.map((act) => {
                      const isSelected = selectedIds.has(act.id);
                      const coords = getCoordinates(act.startMinutes, act.endMinutes);

                      return (
                        <div
                          key={`lane-act-${act.id}`}
                          onClick={() => setSelectedEventModal(act)}
                          style={{ left: coords.left, width: coords.width }}
                          className={`absolute top-1 bottom-1 rounded p-1.5 cursor-pointer transition-all flex flex-col justify-between overflow-hidden shadow-xs ${
                            !isExecuted
                              ? 'bg-white border border-slate-300 text-slate-800'
                              : isSelected
                              ? 'bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-950'
                              : 'bg-slate-100 hover:bg-slate-200/70 border border-slate-200 text-slate-500'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-1">
                            <span className={`text-xs font-medium truncate ${
                              isExecuted && !isSelected ? 'line-through text-slate-400' : 'text-slate-900'
                            }`}>
                              {act.title}
                            </span>
                            {isExecuted && (
                              <span className={`text-[10px] font-bold px-1 rounded flex-shrink-0 font-mono ${
                                isSelected ? 'text-emerald-700 bg-emerald-100' : 'text-slate-500 bg-slate-200'
                              }`}>
                                {isSelected ? '✓' : '✗'}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                            <span>{act.startFormatted} - {act.endFormatted}</span>
                            <span>({act.durationMinutes} min)</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))
              )}
            </div>
          )}

          {/* Leyenda Inferior */}
          <div className="mt-4 pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-emerald-50 border border-emerald-300 inline-block"></span>
                <span>Aprobada</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-slate-100 border border-slate-200 inline-block"></span>
                <span>Conflicto</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-white border border-slate-300 inline-block"></span>
                <span>Sin procesar</span>
              </div>
            </div>
            <div className="text-[11px] text-slate-400">
              Haz clic en cualquier reunión para ver detalles
            </div>
          </div>
        </div>
      </div>

      {/* Modal Inspector de Detalles */}
      {selectedEventModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/30 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-xl max-w-md w-full p-5 shadow-lg animate-in fade-in duration-150">
            <div className="flex items-start justify-between pb-3 border-b border-slate-200">
              <div>
                <span className={`inline-block text-[11px] font-medium px-2 py-0.5 rounded mb-1 ${
                  !isExecuted
                    ? 'bg-slate-100 text-slate-700 border border-slate-200'
                    : selectedIds.has(selectedEventModal.id)
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-slate-100 text-slate-700 border border-slate-200'
                }`}>
                  {!isExecuted
                    ? 'Estado: En Cola'
                    : selectedIds.has(selectedEventModal.id)
                    ? 'Aprobada'
                    : 'No Asignada'}
                </span>
                <h3 className="text-base font-semibold text-slate-900">{selectedEventModal.title}</h3>
              </div>
              <button
                onClick={() => setSelectedEventModal(null)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded hover:bg-slate-100 transition-colors cursor-pointer text-sm"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-semibold">Horario</span>
                  <span className="text-slate-900 font-mono font-semibold text-sm">
                    {selectedEventModal.startFormatted} – {selectedEventModal.endFormatted}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-semibold">Duración</span>
                  <span className="text-slate-900 font-mono font-semibold text-sm">
                    {selectedEventModal.durationMinutes} minutos
                  </span>
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex items-center justify-between">
                <span className="text-slate-500">Organizador / Equipo:</span>
                <span className="text-slate-800 font-medium">{selectedEventModal.organizer || 'Miembro Coworking'}</span>
              </div>

              {isExecuted && (
                <div className={`p-3 rounded-lg border ${
                  selectedIds.has(selectedEventModal.id)
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}>
                  <div className="font-semibold mb-1 text-xs">
                    {selectedIds.has(selectedEventModal.id) ? 'Disponibilidad confirmada' : 'Conflicto de horario'}
                  </div>
                  <p className="text-[11px] leading-relaxed text-slate-600">
                    {selectedIds.has(selectedEventModal.id)
                      ? `Reunión agendada para la sala principal de ${selectedEventModal.startFormatted} a ${selectedEventModal.endFormatted}.`
                      : (rejectedMap.get(selectedEventModal.id)?.reason || 'No se pudo asignar debido a solapamiento con otra reunión ya programada.')}
                  </p>
                </div>
              )}
            </div>

            <div className="mt-5 pt-3 border-t border-slate-200 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedEventModal(null)}
                className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded transition-colors cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

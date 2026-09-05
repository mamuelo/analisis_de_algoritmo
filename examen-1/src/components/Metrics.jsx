import React from 'react';

export default function Metrics({ metrics, isExecuted }) {
  const {
    totalRequests = 0,
    selectedCount = 0,
    rejectedCount = 0,
    utilizationMinutes = 0,
    utilizationPercentage = 0,
    executionTimeMs = 0
  } = metrics || {};

  const utilHours = Math.floor(utilizationMinutes / 60);
  const utilRemainingMins = utilizationMinutes % 60;
  const formattedUtilTime = `${utilHours} h ${utilRemainingMins} min`;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
      {/* 1. Total Solicitudes */}
      <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
        <span className="text-xs font-medium text-slate-500 block mb-1">Total Solicitudes</span>
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-semibold text-slate-900 font-mono">{totalRequests}</span>
          <span className="text-xs text-slate-400">reuniones</span>
        </div>
        <div className="mt-1 text-[11px] text-slate-400">
          En cola para la sala
        </div>
      </div>

      {/* 2. Eventos Agendados */}
      <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
        <span className="text-xs font-medium text-slate-700 block mb-1">Aprobadas</span>
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-semibold text-slate-900 font-mono">
            {isExecuted ? selectedCount : '-'}
          </span>
          <span className="text-xs text-slate-500">confirmadas</span>
        </div>
        <div className="mt-1 text-[11px] text-slate-500">
          {isExecuted ? `${((selectedCount / (totalRequests || 1)) * 100).toFixed(0)}% del total` : 'Sin procesar'}
        </div>
      </div>

      {/* 3. Eventos Rechazados */}
      <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
        <span className="text-xs font-medium text-slate-500 block mb-1">Descartadas</span>
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-semibold text-slate-900 font-mono">
            {isExecuted ? rejectedCount : '-'}
          </span>
          <span className="text-xs text-slate-400">con conflicto</span>
        </div>
        <div className="mt-1 text-[11px] text-slate-400">
          {isExecuted ? 'Horario no disponible' : 'Sin procesar'}
        </div>
      </div>

      {/* 4. Tasa de Ocupación */}
      <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
        <span className="text-xs font-medium text-slate-500 block mb-1">Ocupación de Sala</span>
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-semibold text-slate-900 font-mono">
            {isExecuted ? `${utilizationPercentage}%` : '-'}
          </span>
          <span className="text-xs text-slate-400">{isExecuted ? formattedUtilTime : ''}</span>
        </div>
        <div className="mt-2 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
          <div 
            className="bg-slate-700 h-full rounded-full transition-all duration-500" 
            style={{ width: `${isExecuted ? Math.min(utilizationPercentage, 100) : 0}%` }}
          />
        </div>
      </div>

      {/* 5. Rendimiento de Cómputo */}
      <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs col-span-2 md:col-span-1">
        <span className="text-xs font-medium text-slate-500 block mb-1">Tiempo de Cálculo</span>
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-semibold text-slate-900 font-mono">
            {isExecuted ? `${executionTimeMs} ms` : '0 ms'}
          </span>
        </div>
        <div className="mt-1 text-[11px] text-slate-400">
          {isExecuted ? 'Procesamiento en tiempo real' : 'En espera'}
        </div>
      </div>
    </div>
  );
}

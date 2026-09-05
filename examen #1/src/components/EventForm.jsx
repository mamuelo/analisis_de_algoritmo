import React, { useState } from 'react';

export default function EventForm({ 
  onAddEvent, 
  onLoadDemo, 
  onExecute, 
  onClear, 
  hasActivities, 
  isExecuted 
}) {
  const [title, setTitle] = useState('');
  const [organizer, setOrganizer] = useState('');
  const [start, setStart] = useState('09:00');
  const [end, setEnd] = useState('10:30');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Por favor ingresa un título para el evento.');
      return;
    }

    if (start >= end) {
      setError('La hora de inicio debe ser anterior a la de finalización.');
      return;
    }

    if (start < '08:00' || end > '20:00') {
      setError('El horario de reservas debe estar entre las 08:00 y las 20:00.');
      return;
    }

    onAddEvent({
      id: `custom-${Date.now()}`,
      title: title.trim(),
      organizer: organizer.trim() || 'Solicitante Coworking',
      start,
      end
    });

    setTitle('');
    setOrganizer('');
    setStart(end);
    const endHour = Math.min(20, parseInt(end.split(':')[0], 10) + 1);
    setEnd(`${String(endHour).padStart(2, '0')}:00`);
  };

  return (
    <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-base font-semibold text-slate-900">
            Registro de Solicitudes
          </h2>
          <p className="text-xs text-slate-500">
            Ingresa solicitudes individuales o carga el lote de prueba con reuniones simultáneas.
          </p>
        </div>

        {/* Acciones secundarias */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onLoadDemo}
            className="px-3 py-1.5 rounded-md text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors cursor-pointer"
          >
            Cargar Ejemplo (10)
          </button>

          {hasActivities && (
            <button
              type="button"
              onClick={onClear}
              className="px-2.5 py-1.5 rounded-md text-xs font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Limpiar
            </button>
          )}
        </div>
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="mt-4">
        {error && (
          <div className="mb-3 p-2.5 rounded-md bg-rose-50 border border-rose-200 text-rose-700 text-xs">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
          {/* Título */}
          <div className="lg:col-span-4">
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Nombre de la Reunión
            </label>
            <input
              type="text"
              placeholder="Ej. Revisión Técnica"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-md px-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-500 transition-colors"
            />
          </div>

          {/* Organizador */}
          <div className="lg:col-span-3">
            <label className="block text-[11px] font-medium text-slate-600 mb-1">
              Organizador / Equipo
            </label>
            <input
              type="text"
              placeholder="Ej. Equipo Producto"
              value={organizer}
              onChange={(e) => setOrganizer(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-md px-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-500 transition-colors"
            />
          </div>

          {/* Horas */}
          <div className="lg:col-span-3 grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Inicio (08:00+)
              </label>
              <input
                type="time"
                min="08:00"
                max="19:45"
                step="900"
                value={start}
                onChange={(e) => setStart(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-md px-2 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-slate-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Fin (-20:00)
              </label>
              <input
                type="time"
                min="08:15"
                max="20:00"
                step="900"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-md px-2 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-slate-500 font-mono"
              />
            </div>
          </div>

          {/* Botón Añadir */}
          <div className="lg:col-span-2 flex items-end">
            <button
              type="submit"
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 font-medium py-1.5 px-3 rounded-md text-xs transition-colors cursor-pointer"
            >
              Añadir
            </button>
          </div>
        </div>
      </form>

      {/* Botón Principal */}
      <div className="mt-4 pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-xs text-slate-500">
          Horario disponible: 08:00 a 20:00 (12 horas continuas)
        </div>

        <button
          type="button"
          onClick={onExecute}
          disabled={!hasActivities}
          className={`w-full sm:w-auto px-5 py-2 rounded-md font-medium text-xs transition-colors cursor-pointer ${
            hasActivities 
              ? 'bg-slate-900 hover:bg-slate-800 text-white shadow-xs'
              : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
          }`}
        >
          {isExecuted ? 'Actualizar Horario de Sala' : 'Calcular Horario de Sala'}
        </button>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar.jsx';
import Metrics from './components/Metrics.jsx';
import EventForm from './components/EventForm.jsx';
import Timeline from './components/Timeline.jsx';
import { 
  solveActivitySelection, 
  DEMO_ACTIVITIES,
  normalizeActivity 
} from './algorithms/activitySelection.js';

export default function App() {
  const [activities, setActivities] = useState([]);
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [rejectedActivities, setRejectedActivities] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [isExecuted, setIsExecuted] = useState(false);

  // Carga inicial del caso demo para una experiencia inmediata
  useEffect(() => {
    handleLoadDemo();
  }, []);

  const executeAlgorithm = (itemsToSolve) => {
    const currentList = itemsToSolve || activities;
    if (!currentList || currentList.length === 0) {
      setSelectedActivities([]);
      setRejectedActivities([]);
      setMetrics(null);
      setIsExecuted(false);
      return;
    }

    const result = solveActivitySelection(currentList);
    setSelectedActivities(result.selected);
    setRejectedActivities(result.rejected);
    setMetrics(result.metrics);
    setIsExecuted(true);
  };

  const handleAddEvent = (newEvent) => {
    try {
      const normalized = normalizeActivity(newEvent);
      const updated = [...activities, normalized];
      setActivities(updated);
      executeAlgorithm(updated);
    } catch (err) {
      console.error('Error agregando evento:', err);
    }
  };

  const handleRemoveEvent = (id) => {
    const updated = activities.filter((act) => act.id !== id);
    setActivities(updated);
    executeAlgorithm(updated);
  };

  const handleLoadDemo = () => {
    const normalizedDemo = DEMO_ACTIVITIES.map(normalizeActivity);
    setActivities(normalizedDemo);
    executeAlgorithm(normalizedDemo);
  };

  const handleClear = () => {
    setActivities([]);
    setSelectedActivities([]);
    setRejectedActivities([]);
    setMetrics(null);
    setIsExecuted(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Barra de Navegación Superior */}
      <Navbar onReset={handleClear} />

      {/* Contenedor Principal */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">
        
        {/* Banner de Presentación */}
        <section className="bg-white border border-slate-200 p-5 rounded-xl shadow-xs">
          <div className="max-w-3xl">
            <h2 className="text-xl font-semibold text-slate-900 tracking-tight">
              Programación de la Sala de Juntas
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-600 leading-relaxed">
              Distribución de reservas para maximizar el uso de la sala durante la jornada (08:00 a 20:00), resolviendo conflictos de solapamiento y asignando los horarios disponibles.
            </p>
          </div>
        </section>

        {/* Visualizador de Línea de Tiempo (08:00 a 20:00) */}
        <section aria-label="Visualizador de Línea de Tiempo">
          <Timeline
            activities={activities}
            selectedActivities={selectedActivities}
            rejectedActivities={rejectedActivities}
            isExecuted={isExecuted}
          />
        </section>

        {/* Dashboard de Métricas */}
        <section aria-label="Métricas de Uso">
          <Metrics metrics={metrics} isExecuted={isExecuted} />
        </section>

        {/* Grid de Formulario y Lista de Solicitudes */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Formulario de Entrada (8 cols) */}
          <div className="lg:col-span-8">
            <EventForm
              onAddEvent={handleAddEvent}
              onLoadDemo={handleLoadDemo}
              onExecute={() => executeAlgorithm(activities)}
              onClear={handleClear}
              hasActivities={activities.length > 0}
              isExecuted={isExecuted}
            />
          </div>

          {/* Lista de Solicitudes Recibidas (4 cols) */}
          <div className="lg:col-span-4 bg-white border border-slate-200 p-4 rounded-xl shadow-xs max-h-[460px] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-xs font-semibold text-slate-800 uppercase tracking-wider">
                Solicitudes ({activities.length})
              </h3>
              <span className="text-[11px] text-slate-500 font-mono">08:00 - 20:00</span>
            </div>

            <div className="mt-3 space-y-2 overflow-y-auto flex-1 pr-1">
              {activities.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-xs">
                  No hay reservas en cola.
                </div>
              ) : (
                activities.map((act) => {
                  const isAccepted = selectedActivities.some((s) => s.id === act.id);
                  return (
                    <div
                      key={act.id}
                      className={`p-2.5 rounded-lg border transition-all flex items-center justify-between gap-2 text-xs ${
                        !isExecuted
                          ? 'bg-slate-50 border-slate-200 text-slate-700'
                          : isAccepted
                          ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                          : 'bg-slate-50 border-slate-200 text-slate-500'
                      }`}
                    >
                      <div className="truncate flex-1">
                        <div className="flex items-center gap-1.5">
                          {isExecuted && (
                            <span className={`text-[10px] font-bold ${
                              isAccepted ? 'text-emerald-700' : 'text-slate-400'
                            }`}>
                              {isAccepted ? '✓' : '✗'}
                            </span>
                          )}
                          <span className={`font-medium truncate ${
                            isExecuted && !isAccepted ? 'line-through text-slate-400' : 'text-slate-900'
                          }`}>
                            {act.title}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                          {act.startFormatted || act.start} – {act.endFormatted || act.end} ({act.organizer || 'Miembro'})
                        </div>
                      </div>

                      <button
                        onClick={() => handleRemoveEvent(act.id)}
                        className="text-slate-400 hover:text-slate-700 p-1 rounded transition-colors cursor-pointer text-xs"
                        title="Eliminar solicitud"
                      >
                        ✕
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-10 py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 space-y-0.5">
          <p className="font-medium text-slate-600">
            Planificador de Coworking • Sistema de Gestión de Espacios
          </p>
          <p className="text-[11px] text-slate-400">
            Horario de Sala: 08:00 a 20:00
          </p>
        </div>
      </footer>
    </div>
  );
}

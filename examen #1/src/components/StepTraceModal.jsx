import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Activity, 
  ArrowRight,
  ListOrdered
} from 'lucide-react';

export default function StepTraceModal({ isOpen, onClose, trace = [] }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCurrentStepIndex(0);
      setIsPlaying(false);
    }
  }, [isOpen]);

  useEffect(() => {
    let interval = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev < trace.length - 1) {
            return prev + 1;
          } else {
            setIsPlaying(false);
            return prev;
          }
        });
      }, 1400);
    }
    return () => clearInterval(interval);
  }, [isPlaying, trace.length]);

  if (!isOpen || trace.length === 0) return null;

  const currentTrace = trace[currentStepIndex];
  const { candidate, decision, explanation, lastFinishFormatted, currentSelectedSnapshot } = currentTrace;
  const isSelected = decision === 'SELECTED';

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-6 shadow-2xl animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ListOrdered className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>Depurador Algorítmico Voraz (Paso a Paso)</span>
                <span className="text-xs font-mono font-normal px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  Paso {currentStepIndex + 1} de {trace.length}
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Inspección pedagógica de las decisiones tomadas por la regla voraz en tiempo de ejecución.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Cuerpo del Paso */}
        <div className="mt-4 space-y-4 overflow-y-auto pr-1 flex-1">
          {/* Card del Candidato */}
          <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Actividad Evaluada (Ordenada por f_i)
              </span>
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                isSelected 
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-glow-emerald' 
                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
              }`}>
                {isSelected ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                <span>{isSelected ? 'SELECCIONADA' : 'RECHAZADA'}</span>
              </span>
            </div>

            <div className="text-base font-bold text-white mb-2">
              {candidate.title}
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs font-mono bg-slate-900 p-2.5 rounded-lg border border-slate-800 text-center">
              <div>
                <span className="text-[10px] text-slate-500 block uppercase">Hora Inicio (s_i)</span>
                <span className="text-amber-300 font-bold">{candidate.startFormatted}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase">Hora Fin (f_i)</span>
                <span className="text-emerald-400 font-bold">{candidate.endFormatted}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase">Último Fin (f_last)</span>
                <span className="text-indigo-300 font-bold">{lastFinishFormatted || '00:00'}</span>
              </div>
            </div>
          </div>

          {/* Comparación Matemática */}
          <div className={`p-3.5 rounded-xl border text-xs ${
            isSelected 
              ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-200' 
              : 'bg-rose-950/30 border-rose-500/30 text-rose-200'
          }`}>
            <div className="font-bold mb-1 flex items-center gap-1.5">
              <span>Evaluación de la condición de compatibilidad:</span>
              <code className="font-mono px-1 py-0.2 bg-slate-900 rounded text-[11px]">
                s_{currentStepIndex + 1} &ge; f_last &rarr; {candidate.startFormatted} &ge; {lastFinishFormatted || '00:00'}
              </code>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-300">
              {explanation}
            </p>
          </div>

          {/* Estado actual de seleccionados */}
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center justify-between">
              <span>Solución Óptima Acumulada hasta el Paso {currentStepIndex + 1}</span>
              <span className="text-emerald-400 font-mono">|A| = {currentSelectedSnapshot.length}</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {currentSelectedSnapshot.map((item, idx) => (
                <span
                  key={`snapshot-${item.id}`}
                  className="px-2.5 py-1 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-emerald-200 text-xs flex items-center gap-1.5 font-mono"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span>
                  <span className="font-bold text-white">{idx + 1}.</span>
                  <span>{item.title}</span>
                  <span className="text-emerald-400/80 text-[10px]">({item.startFormatted}-{item.endFormatted})</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Controles de Reproducción y Navegación */}
        <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentStepIndex(Math.max(0, currentStepIndex - 1))}
              disabled={currentStepIndex === 0}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              title="Paso anterior"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-glow-emerald"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-white" />}
              <span>{isPlaying ? 'Pausar' : 'Reproducir'}</span>
            </button>

            <button
              onClick={() => setCurrentStepIndex(Math.min(trace.length - 1, currentStepIndex + 1))}
              disabled={currentStepIndex === trace.length - 1}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              title="Siguiente paso"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors"
          >
            Cerrar Depurador
          </button>
        </div>
      </div>
    </div>
  );
}

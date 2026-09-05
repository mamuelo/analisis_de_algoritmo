import React from 'react';

export default function Navbar({ onReset }) {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        {/* Title */}
        <div>
          <h1 className="text-base font-semibold text-slate-900 tracking-tight">
            Planificador de Coworking
          </h1>
          <p className="text-xs text-slate-500 hidden sm:block">
            Gestión y Programación de Sala de Juntas
          </p>
        </div>

        {/* Action Button */}
        <div>
          <button
            onClick={onReset}
            className="px-3 py-1.5 rounded-md text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-300 transition-colors cursor-pointer"
          >
            Reiniciar Agenda
          </button>
        </div>
      </div>
    </header>
  );
}

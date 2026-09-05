import React, { useState } from 'react';
import { 
  BookOpen, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  Code2, 
  GitBranch, 
  Layers, 
  Sparkles, 
  AlertCircle 
} from 'lucide-react';

export default function TheorySection() {
  const [activeTab, setActiveTab] = useState('greedy-choice');
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="glass-panel p-5 rounded-2xl">
      {/* Header de la Sección Teórica */}
      <div 
        className="flex items-center justify-between cursor-pointer pb-3 border-b border-slate-800"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span>Fundamentación Teórica & Demostración de Correctitud</span>
              <span className="text-[11px] font-mono font-normal px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                Nivel Universitario • 8vo Semestre
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Propiedad de Elección Voraz, Subestructura Óptima y Análisis Asintótico formal (CLRS).
            </p>
          </div>
        </div>

        <button 
          className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          aria-label={isExpanded ? 'Colapsar teoría' : 'Expandir teoría'}
        >
          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </div>

      {isExpanded && (
        <div className="mt-4 animate-in fade-in duration-200">
          {/* Barra de Pestañas */}
          <div className="flex flex-wrap gap-1.5 border-b border-slate-800/80 pb-3 text-xs">
            <button
              onClick={() => setActiveTab('greedy-choice')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'greedy-choice'
                  ? 'bg-indigo-600 text-white shadow-glow-indigo'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>1. Propiedad de Elección Voraz</span>
            </button>

            <button
              onClick={() => setActiveTab('substructure')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'substructure'
                  ? 'bg-indigo-600 text-white shadow-glow-indigo'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>2. Subestructura Óptima</span>
            </button>

            <button
              onClick={() => setActiveTab('complexity')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'complexity'
                  ? 'bg-indigo-600 text-white shadow-glow-indigo'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <GitBranch className="w-3.5 h-3.5" />
              <span>3. Análisis Big-O & Comparativa</span>
            </button>

            <button
              onClick={() => setActiveTab('pseudocode')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'pseudocode'
                  ? 'bg-indigo-600 text-white shadow-glow-indigo'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>4. Pseudocódigo Canónico</span>
            </button>
          </div>

          {/* Contenido de la Pestaña Activa */}
          <div className="mt-4 text-xs text-slate-300 leading-relaxed space-y-3">
            {/* TAB 1: PROPIEDAD DE ELECCIÓN VORAZ */}
            {activeTab === 'greedy-choice' && (
              <div className="space-y-4">
                <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
                  <h3 className="text-sm font-bold text-indigo-300 mb-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                    <span>Teorema de la Elección Voraz (Greedy-Choice Property)</span>
                  </h3>
                  <p className="mb-2">
                    Sea <code className="text-amber-300 font-mono">S = {'{a_1, a_2, ..., a_n}'}</code> un conjunto de actividades ordenadas ascendentemente por tiempo de finalización, es decir:
                  </p>
                  <div className="p-2.5 rounded-lg bg-slate-950 font-mono text-center text-emerald-400 border border-slate-800 text-xs my-2">
                    f₁ &le; f₂ &le; f₃ &le; ... &le; f_n
                  </div>
                  <p className="mb-2">
                    <strong>Enunciado:</strong> Existe un subconjunto óptimo compatible <code className="text-amber-300 font-mono">A* &sube; S</code> de cardinalidad máxima tal que contiene a la primera actividad que finaliza: <code className="text-emerald-400 font-mono">a₁ &isin; A*</code>.
                  </p>
                </div>

                <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-2.5">
                  <h4 className="font-bold text-white text-xs uppercase tracking-wider">
                    Demostración Formal: Técnica de Corte y Pega (Cut-and-Paste)
                  </h4>
                  <ol className="list-decimal list-inside space-y-1.5 pl-1 text-slate-300">
                    <li>
                      Sea <code className="text-indigo-300 font-mono">B &sube; S</code> cualquier solución óptima compatible. Ordenamos las actividades de <code className="text-indigo-300 font-mono">B</code> en orden creciente de finalización.
                    </li>
                    <li>
                      Sea <code className="text-amber-300 font-mono">a_k</code> la primera actividad en <code className="text-indigo-300 font-mono">B</code>. Si <code className="text-emerald-400 font-mono">a_k = a₁</code>, la proposición ya es cierta (<code className="text-emerald-400 font-mono">a₁ &isin; B</code>).
                    </li>
                    <li>
                      Si <code className="text-rose-400 font-mono">a_k &ne; a₁</code>, construimos un nuevo conjunto:
                      <div className="my-1.5 p-2 bg-slate-950 rounded font-mono text-center text-indigo-300 border border-slate-800">
                        B' = (B \ {'{a_k}'}) &cup; {'{a₁}'}
                      </div>
                    </li>
                    <li>
                      <strong>Compatibilidad:</strong> Dado que <code className="text-emerald-400 font-mono">f₁ &le; f_k</code> (porque <code className="text-emerald-400 font-mono">a₁</code> tiene la finalización mínima en todo el conjunto inicial <code className="text-slate-300 font-mono">S</code>), el fin de <code className="text-emerald-400 font-mono">a₁</code> ocurre antes o al mismo tiempo que <code className="text-amber-300 font-mono">a_k</code>. Por tanto, <code className="text-emerald-400 font-mono">a₁</code> no puede solaparse con ninguna otra actividad de <code className="text-indigo-300 font-mono">B \ {'{a_k}'}</code>.
                    </li>
                    <li>
                      <strong>Cardinalidad Óptima:</strong> La cantidad de actividades es <code className="text-emerald-400 font-mono">|B'| = |B|</code>. Como <code className="text-indigo-300 font-mono">B</code> era óptima, <code className="text-indigo-300 font-mono">B'</code> también es óptima y contiene explícitamente a <code className="text-emerald-400 font-mono">a₁</code>. <strong>Q.E.D. (Queda Demostrado).</strong>
                    </li>
                  </ol>
                </div>

                {/* Contraejemplos de heurísticas erróneas */}
                <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-200">
                  <div className="font-bold flex items-center gap-1.5 mb-1">
                    <AlertCircle className="w-4 h-4 text-amber-400" />
                    <span>¿Por qué no ordenar por hora de inicio o por menor duración?</span>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-[11px] text-amber-200/90 pl-1">
                    <li>
                      <strong>Ordenar por hora de inicio:</strong> Una reunión que empieza a las 08:00 y dura 10 horas bloquearía todo el día, seleccionando 1 sola actividad en vez de 6 intermedias.
                    </li>
                    <li>
                      <strong>Ordenar por menor duración:</strong> Si una actividad corta de 15 minutos se ubica justo en medio de dos actividades largas que no se tocan entre sí, seleccionar la corta bloquea a ambas, logrando 1 en vez de 2 actividades.
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {/* TAB 2: SUBESTRUCTURA ÓPTIMA */}
            {activeTab === 'substructure' && (
              <div className="space-y-4">
                <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
                  <h3 className="text-sm font-bold text-indigo-300 mb-2 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-indigo-400" />
                    <span>Subestructura Óptima (Optimal Substructure)</span>
                  </h3>
                  <p className="mb-2">
                    Una solución óptima al problema general contiene dentro de sí soluciones óptimas a los subproblemas generados tras cada elección voraz.
                  </p>
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-center text-xs text-slate-300 my-2">
                    S₁ = {'{ a_i ∈ S | s_i ≥ f₁ }'}
                  </div>
                  <p>
                    Tras seleccionar <code className="text-emerald-400 font-mono">a₁</code>, el problema restante consiste en hallar un conjunto máximo compatible en el subproblema <code className="text-indigo-300 font-mono">S₁</code>.
                  </p>
                </div>

                <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-2">
                  <h4 className="font-bold text-white text-xs uppercase tracking-wider">
                    Demostración por Inducción Matemática
                  </h4>
                  <p>
                    Si <code className="text-amber-300 font-mono">A</code> es una solución óptima para <code className="text-slate-300 font-mono">S</code> que contiene a <code className="text-emerald-400 font-mono">a₁</code>, entonces <code className="text-emerald-400 font-mono">A' = A \ {'{a₁}'}</code> es una solución óptima para el subproblema <code className="text-indigo-300 font-mono">S₁</code>.
                  </p>
                  <p className="text-slate-400">
                    <strong>Contradicción:</strong> Supongamos que existiera una solución <code className="text-cyan-300 font-mono">B'</code> para <code className="text-indigo-300 font-mono">S₁</code> con más actividades que <code className="text-emerald-400 font-mono">A'</code> (<code className="text-cyan-300 font-mono">|B'| &gt; |A'|</code>). Entonces <code className="text-cyan-300 font-mono">B' &cup; {'{a₁}'}</code> sería una solución compatible para <code className="text-slate-300 font-mono">S</code> con cardinalidad <code className="text-cyan-300 font-mono">|B'| + 1 &gt; |A'| + 1 = |A|</code>, lo que contradice la hipótesis de que <code className="text-amber-300 font-mono">A</code> era óptima.
                  </p>
                </div>
              </div>
            )}

            {/* TAB 3: ANÁLISIS BIG-O & COMPARATIVA */}
            {activeTab === 'complexity' && (
              <div className="space-y-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse border border-slate-800 rounded-xl overflow-hidden">
                    <thead>
                      <tr className="bg-slate-900 text-slate-200 font-mono text-[11px] border-b border-slate-800">
                        <th className="p-2.5">Estrategia / Algoritmo</th>
                        <th className="p-2.5">Tiempo Peor Caso</th>
                        <th className="p-2.5">Espacio Auxiliar</th>
                        <th className="p-2.5">Garantía de Optimalidad</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80 font-mono text-[11px]">
                      <tr className="bg-slate-950/40 text-slate-400">
                        <td className="p-2.5 font-sans font-medium text-slate-300">Fuerza Bruta (Conjunto Potencia)</td>
                        <td className="p-2.5 text-rose-400">O(2^n · n)</td>
                        <td className="p-2.5">O(n)</td>
                        <td className="p-2.5 text-slate-300">Óptimo (Inviable para n &gt; 30)</td>
                      </tr>
                      <tr className="bg-slate-950/40 text-slate-400">
                        <td className="p-2.5 font-sans font-medium text-slate-300">Programación Dinámica</td>
                        <td className="p-2.5 text-amber-400">O(n²)</td>
                        <td className="p-2.5">O(n²)</td>
                        <td className="p-2.5 text-slate-300">Óptimo (Sobrecarga innecesaria)</td>
                      </tr>
                      <tr className="bg-emerald-950/30 text-emerald-300 font-bold border-l-4 border-emerald-400">
                        <td className="p-2.5 font-sans text-emerald-200">Algoritmo Voraz (Greedy)</td>
                        <td className="p-2.5 text-emerald-400">O(n log n)</td>
                        <td className="p-2.5">O(n)</td>
                        <td className="p-2.5 text-emerald-300">100% Óptimo Matemático</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                  <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                    <h5 className="font-bold text-white text-xs mb-1">Desglose Temporal del Algoritmo</h5>
                    <ul className="space-y-1 text-slate-300 text-[11px]">
                      <li>• <strong>Ordenamiento:</strong> <code className="text-emerald-400 font-mono">O(n log n)</code> ordenando por <code className="text-amber-300 font-mono">f_i</code>.</li>
                      <li>• <strong>Barrido Greedy:</strong> <code className="text-emerald-400 font-mono">O(n)</code> comparando <code className="text-amber-300 font-mono">s_i &ge; f_last</code>.</li>
                      <li>• <strong>Total Asintótico:</strong> <code className="text-emerald-400 font-mono">O(n log n) + O(n) = O(n log n)</code>.</li>
                    </ul>
                  </div>
                  <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                    <h5 className="font-bold text-white text-xs mb-1">Cota Inferior de Información</h5>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      El problema de selección de actividades puede usarse para ordenar números en tiempo lineal; por tanto, bajo el modelo de comparaciones algebraicas, posee una cota inferior teórica de <code className="text-emerald-400 font-mono">&Omega;(n log n)</code>. La solución Voraz es <strong>asintóticamente óptima</strong>.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: PSEUDOCÓDIGO */}
            {activeTab === 'pseudocode' && (
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs overflow-x-auto text-slate-200">
                <div className="text-slate-500 mb-2">// Algoritmo Canónico de Selección de Actividades (CLRS)</div>
                <pre className="text-emerald-300">
{`GREEDY-ACTIVITY-SELECTOR(s, f, n)
  1. A = { a₁ }                 // Seleccionar vorazmente la primera actividad
  2. k = 1                      // Índice de la última actividad aceptada
  3. for m = 2 to n do
  4.     if s[m] ≥ f[k] then    // Condición de compatibilidad temporal
  5.         A = A ∪ { a_m }    // Aceptar actividad compatible
  6.         k = m              // Actualizar puntero al nuevo fin de sala
  7.     else
  8.         // Descartar a_m debido a conflicto temporal con a_k
  9. return A`}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

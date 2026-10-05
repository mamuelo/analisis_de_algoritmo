# 📚 Análisis de Algoritmos

> Repositorio principal de trabajos prácticos, exámenes y proyectos de la asignatura **Análisis de Algoritmos** (8vo Semestre — Ingeniería de Sistemas / Software).

---

## 📑 Directorio de Entregables

| Entregable | Tema / Problema | Paradigma y Algoritmo | Complejidad | Documentación | Video Sustentación |
| :--- | :--- | :--- | :---: | :---: | :---: |
| **Examen #1** | Planificador de Reservas para Sala de Coworking (*Coworking Space Scheduler*) | Algoritmo Voraz de Selección de Actividades (*Activity Selection Problem*) | $\Theta(n \log n)$ | [README Examen #1](./examen-1/README.md) | [▶️ Ver en YouTube](https://youtu.be/a85-XYHGyGc) |
| **Examen #2** | Rutas Óptimas en Red de Transporte y Logística | Camino Más Corto / Algoritmo de Dijkstra | $O((V + E) \log V)$ | [README Examen #2](./examen-2/README.md) | — |
| **Taller** | Solución a 5 problemas algorítmicos clásicos (LeetCode) | Sorting, Grafos (DFS), DP, Greedy, Backtracking | Varias | [README Taller](./taller/README.md) | — |

---

## 🛠️ Contenido del Taller

El taller incluye la solución, análisis de complejidad y evidencia de aceptación (*Accepted*) en LeetCode para 5 familias algorítmicas fundamentales:

1. **[56. Merge Intervals](./taller/56-merge-intervals/)**
   - **Familia:** Ordenamiento (*Sorting*)
   - **Complejidad:** $O(n \log n)$ tiempo, $O(n)$ espacio.
2. **[200. Number of Islands](./taller/200-number-of-islands/)**
   - **Familia:** Grafos (*DFS / Componentes conexas*)
   - **Complejidad:** $\Theta(m \cdot n)$ tiempo, $O(m \cdot n)$ espacio.
3. **[1143. Longest Common Subsequence](./taller/1143-longest-common-subsequence/)**
   - **Familia:** Programación Dinámica (*Tabulación 2D*)
   - **Complejidad:** $\Theta(n \cdot m)$ tiempo, $\Theta(n \cdot m)$ espacio.
4. **[435. Non-overlapping Intervals](./taller/435-non-overlapping-intervals/)**
   - **Familia:** Algoritmos Voraces (*Greedy*)
   - **Complejidad:** $O(n \log n)$ tiempo, $O(1)$ espacio auxiliar.
5. **[39. Combination Sum](./taller/39-combination-sum/)**
   - **Familia:** Búsqueda Exhaustiva (*Backtracking con poda*)
   - **Complejidad:** $O(n^{t / \min})$ tiempo, $O(t / \min)$ espacio en pila.

Para ver el detalle completo de cada ejercicio y las capturas de ejecución aceptada, consulta el **[`taller/README.md`](./taller/README.md)**.

---

## 🎥 Video de Sustentación (Examen #1)

> 📺 **Enlace de visualización para el docente:**  
> 👉 **[https://youtu.be/a85-XYHGyGc](https://youtu.be/a85-XYHGyGc)**  

---

## 🚀 Acceso Rápido a los Entregables

### Examen #1: Planificador de Coworking (React + Vite)
```bash
cd examen-1
npm install
npm test
npm run dev
```

### Examen #2: Visualizador de Dijkstra (Vanilla JS)
Abrir directamente `examen-2/index.html` en el navegador o iniciar un servidor estático:
```bash
cd examen-2
npx serve .
```

### Taller: Ejercicios de LeetCode (Python)
Las soluciones están implementadas en Python 3 dentro de cada subcarpeta en `taller/`:
- `taller/56-merge-intervals/solution.py`
- `taller/200-number-of-islands/solution.py`
- `taller/1143-longest-common-subsequence/solution.py`
- `taller/435-non-overlapping-intervals/solution.py`
- `taller/39-combination-sum/solution.py`
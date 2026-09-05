# 🏢 Coworking Space Scheduler
> **Optimizador de Reservas de Sala de Juntas mediante el Algoritmo Voraz de Selección de Actividades (*Activity Selection Problem*)**  
> **Asignatura:** Análisis de Algoritmos — 8vo Semestre de Ingeniería de Sistemas / Software  
> **Paradigma:** Algoritmos Voraces (*Greedy Algorithms*)  
> **Estado:** Listo para Producción y Sustentación Universitaria  

---

## 📌 1. Descripción del Problema del Mundo Real

En un moderno espacio de coworking, múltiples startups, equipos de desarrollo y consultores compiten por el uso exclusivo de la **Sala de Juntas Principal** durante la jornada laboral (de 08:00 a 20:00, 12 horas continuas = 720 minutos).

A lo largo del día, la administración recibe $n$ solicitudes de reserva formalizadas como:
$$a_i = (s_i, f_i, \text{título}_i, \text{organizador}_i)$$
donde:
- $s_i$ es la hora de inicio solicitada.
- $f_i$ es la hora de finalización solicitada ($s_i < f_i$).
- La sala es un **recurso no compartible**: dos reuniones $a_i$ y $a_j$ solo pueden celebrarse en el mismo espacio si no se solapan en el tiempo:
$$[s_i, f_i) \cap [s_j, f_j) = \emptyset \iff f_i \le s_j \quad \lor \quad f_j \le s_i$$

### Objetivo de Optimización
Maximizar la **cantidad total de eventos atendidos** en el día:
$$\max |A| \quad \text{sujeto a } A \subseteq S \quad \text{y } A \text{ es un conjunto compatible}$$

---

## 🧮 2. Fundamento Matemático del Algoritmo Voraz (Greedy)

### 2.1 La Estrategia Voraz
El algoritmo toma en cada iteración la **mejor decisión local inmediata** con la expectativa de alcanzar el óptimo global:
1. **Criterio Voraz:** Seleccionar siempre la actividad compatible que **termine más temprano** ($f_i$ mínimo).
2. **Justificación Intuitiva:** Al terminar lo antes posible, se deja libre la sala el mayor tiempo posible para admitir la mayor cantidad de reuniones subsecuentes.

### 2.2 Demostración de Correctitud: Propiedad de Elección Voraz (Greedy-Choice Property)
> **Teorema:** Sea $S = \{a_1, a_2, \dots, a_n\}$ el conjunto de actividades ordenadas ascendentemente por tiempo de fin ($f_1 \le f_2 \le \dots \le f_n$). Existe un subconjunto óptimo compatible $A^* \subseteq S$ tal que $a_1 \in A^*$.

**Demostración (Técnica Cut-and-Paste / Corte y Pega):**
1. Sea $B \subseteq S$ una solución óptima cualquiera para el problema.
2. Ordenemos las actividades de $B$ por tiempo de fin. Sea $a_k$ la primera actividad en $B$.
3. Si $a_k = a_1$, entonces $B$ ya contiene la elección voraz y la demostración concluye.
4. Si $a_k \ne a_1$, construimos un nuevo conjunto:
   $$B' = (B \setminus \{a_k\}) \cup \{a_1\}$$
5. Dado que $a_1$ tiene el tiempo de fin mínimo de todo $S$, se cumple por definición que $f_1 \le f_k$.
6. Como todas las actividades restantes en $B$ comienzan después o igual a $f_k$, necesariamente comienzan después o igual a $f_1$. Por lo tanto, $a_1$ no entra en conflicto con ninguna actividad en $B \setminus \{a_k\}$.
7. El nuevo conjunto $B'$ es compatible y su cardinalidad es:
   $$|B'| = |B|$$
8. Como $B$ era óptimo, $B'$ también es una solución óptima y contiene explícitamente a $a_1$. $\blacksquare$

### 2.3 Subestructura Óptima (Optimal Substructure)
Tras haber elegido vorazmente $a_1$, el problema restante consiste en encontrar una solución óptima en el subproblema:
$$S_1 = \{ a_i \in S \mid s_i \ge f_1 \}$$
Si $A$ es óptimo para $S$, entonces $A' = A \setminus \{a_1\}$ es una solución óptima para $S_1$. La recursión garantiza que aplicar reiteradamente la elección voraz sobre los subproblemas residuales converge a la solución óptima global.

---

## 💻 3. Pseudocódigo Formal (CLRS Style)

```text
ALGORITMO: GREEDY-ACTIVITY-SELECTOR(S)
ENTRADA: Un conjunto S = {a_1, a_2, ..., a_n} con tiempos s[i] y f[i]
SALIDA: Un subconjunto A ⊆ S de cardinalidad máxima compatible

1. ORDENAR S en orden creciente según f[i] tal que f[1] ≤ f[2] ≤ ... ≤ f[n]  // O(n log n)
2. A = { a_1 }                                                               // O(1)
3. k = 1                                                                     // Último aceptado
4. para m = 2 hasta n hacer                                                  // O(n)
5.     si s[m] ≥ f[k] entonces
6.         A = A ∪ { a_m }                                                   // Compatible
7.         k = m                                                             // Actualizar fin
8.     fin si
9. fin para
10. retornar A
```

---

## ⏱️ 4. Análisis de Complejidad Asintótica (Big-O)

| Etapa del Algoritmo | Operación Principal | Complejidad Temporal | Complejidad Espacial |
| :--- | :--- | :--- | :--- |
| **1. Normalización y Validación** | Parseo de horas (`HH:mm` a min) | $O(n)$ | $O(n)$ |
| **2. Ordenamiento de Actividades** | TimSort / MergeSort por $f_i$ | $\Theta(n \log n)$ | $O(n)$ |
| **3. Barrido Lineal Voraz** | Comparación $s_i \ge f_{last}$ | $\Theta(n)$ | $O(1)$ auxiliar |
| **4. Generación de Traza Pedagógica**| Snapshots para el depurador | $O(n)$ | $O(n)$ |
| **COMPLEJIDAD TOTAL** | — | $\mathbf{\Theta(n \log n)}$ | $\mathbf{O(n)}$ |

### Comparativa frente a otros paradigmas:
- **Fuerza Bruta (Conjunto Potencia):** Generar los $2^n$ subconjuntos posibles y verificar compatibilidad en $O(n)$ toma $O(n \cdot 2^n)$. Para $n = 30$, requeriría más de 32 mil millones de operaciones.
- **Programación Dinámica:** Construir la matriz de compatibilidades requiere $O(n^2)$ en tiempo y espacio.
- **Algoritmo Voraz (Greedy):** Resuelve el problema en $O(n \log n)$, alcanzando la cota inferior teórica $\Omega(n \log n)$ para algoritmos basados en comparaciones.

---

## 🚀 5. Instalación y Ejecución Local

### Prerrequisitos
- **Node.js**: Versión 18+ (o superior) y `npm`.

### Paso a paso:
```bash
# 1. Clonar el repositorio y entrar a la carpeta del examen
git clone <url-del-repositorio>
cd "analisis_de_algoritmo/examen #1"

# 2. Instalar dependencias del ecosistema Vite + React + Tailwind
npm install

# 3. Ejecutar la suite de pruebas unitarias algorítmicas (19 pruebas formales)
npm test

# 4. Iniciar el servidor de desarrollo local
npm run dev
```

Abre tu navegador en: [http://localhost:5173](http://localhost:5173)

---

## 📁 6. Arquitectura del Proyecto

```text
analisis_de_algoritmo/
└── examen #1/
    ├── src/
    │   ├── algorithms/
    │   │   ├── activitySelection.js      # Lógica matemática pura aislada (JSDoc, O(n log n))
    │   │   └── activitySelection.test.js # Suite de 19 pruebas de verificación formal
│   ├── components/
│   │   ├── Navbar.jsx                # Header institucional e insignias de complejidad
│   │   ├── Metrics.jsx               # Tarjetas KPI (n, |A|, |R|, ocupación, Big-O)
│   │   ├── EventForm.jsx             # Formulario de alta, botón demo y disparador voraz
│   │   ├── Timeline.jsx              # Canvas horizontal tipo Gantt (08:00 - 20:00)
│   │   ├── TheorySection.jsx         # Pestañas con demostración formal (Corte y Pega)
│   │   └── StepTraceModal.jsx        # Depurador interactivo paso a paso
│   ├── App.jsx                       # Orquestador y estado central
│   ├── index.css                     # Tailwind, efectos glassmorphism y grilla horaria
│   └── main.jsx                      # Bootstrap React 18
├── index.html                        # Plantilla HTML5 con Google Fonts (Inter)
├── vite.config.js                    # Configuración de empaquetado Vite
├── tailwind.config.js                # Sistema de diseño con paleta esmeralda / oscura
├── package.json                      # Scripts y dependencias del proyecto
└── README.md                         # Documento académico y guion de sustentación
```

---

## 🎙️ 7. Guion Estructurado para el Video de Sustentación (5 Minutos)

Utiliza este guion cronometrado para tu grabación o sustentación oral frente al docente:

| Minuto | Sección | Mensaje Clave y Acción en Pantalla |
| :---: | :--- | :--- |
| **0:00 – 0:45** | **1. Introducción y Planteamiento del Problema** | *"Buenos días, profesor. Mi nombre es [Tu Nombre] y presento el proyecto Coworking Space Scheduler para el examen de Análisis de Algoritmos. El problema consiste en optimizar el uso de una sala de juntas de alta demanda de 08:00 a 20:00, donde múltiples solicitudes se solapan. Nuestro objetivo es maximizar la cantidad de reuniones atendidas."* <br>👉 **Acción:** Muestra la pantalla principal con el diseño dark mode y la tarjeta de bienvenida. |
| **0:45 – 1:45** | **2. Fundamento Algorítmico y Regla Voraz** | *"Este escenario corresponde al clásico Activity Selection Problem. A diferencia de heurísticas intuitivas pero erróneas —como elegir reuniones cortas o las que inician primero—, la estrategia voraz óptima consiste en ordenar por hora de finalización ascendente ($f_i$). Al elegir el evento que finaliza más temprano, liberamos la sala en el menor tiempo posible. Demostramos matemáticamente esto mediante la técnica de Corte y Pega (Cut-and-Paste) y la Subestructura Óptima."* <br>👉 **Acción:** Despliega el acordeón de **"Fundamentación Teórica"** y muestra la pestaña de la demostración. |
| **1:45 – 2:45** | **3. Demostración en Vivo de la Aplicación** | *"En la aplicación tenemos precargado un caso de prueba con 10 reuniones realistas de negocios y tecnología. Al presionar 'Ejecutar Algoritmo Voraz', observamos la reactividad inmediata. En el Timeline horizontal de 08:00 a 20:00, los bloques en verde esmeralda representan las reuniones aprobadas sin solapamiento, mientras que los bloques en rojo atenuado con tachado indican las solicitudes descartadas. Si hago clic en una rechazada, el sistema explica exactamente con cuál reunión colisiona."* <br>👉 **Acción:** Haz clic en **"Cargar Caso Demo"**, presiona **"Ejecutar Algoritmo Voraz"**, y abre el popup de detalle de un evento rechazado y uno aceptado. |
| **2:45 – 3:45** | **4. Depuración Paso a Paso (Traza Pedagógica)** | *"Para evidenciar la toma de decisiones algorítmica, implementamos un depurador paso a paso. Abrimos la traza y vemos cómo el algoritmo evalúa al primer candidato por ser el de menor hora de finalización ($f_1 = 09:30$). Luego evalúa los siguientes candidatos comparando si su inicio $s_i \ge f_{last}$. Si la condición se cumple, se admite; si no, se rechaza justificando el motivo."* <br>👉 **Acción:** Abre el modal **"Depurador Paso a Paso"** y navega por los pasos usando los botones o el Auto-Play. |
| **3:45 – 4:30** | **5. Análisis de Complejidad y Conclusiones** | *"En términos de complejidad asintótica: ordenar las $n$ actividades toma $\Theta(n \log n)$ y el barrido voraz toma $\Theta(n)$. Por lo tanto, la complejidad global es $\Theta(n \log n)$ en tiempo y $O(n)$ en espacio. Frente a un enfoque de fuerza bruta que requeriría evaluar $O(2^n)$ combinaciones, nuestro algoritmo reduce millones de operaciones a apenas milisegundos, garantizando un resultado 100% óptimo."* <br>👉 **Acción:** Señala la tarjeta de métricas que compara el tiempo en milisegundos vs las combinaciones de Fuerza Bruta. |
| **4:30 – 5:00** | **Cierre y Preguntas** | *"El código se encuentra modularizado con separación estricta entre la lógica algorítmica pura (`activitySelection.js`) y la capa visual en React. Todas las 19 pruebas unitarias se ejecutaron con éxito. Quedo atento a sus preguntas."* |

---

## 👥 Créditos Académicos
- **Estudiante:** Examen 8vo Semestre — Análisis de Algoritmos
- **Framework:** React 18 + Vite 5 + Tailwind CSS + Lucide Icons
- **Algoritmo:** Activity Selection Problem (Cormen, Leiserson, Rivest & Stein — *Introduction to Algorithms*)
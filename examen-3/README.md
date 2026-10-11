# Examen 3 - Programación Dinámica (Problema de la Mochila 0/1)

Entrega del tercer examen de la asignatura **Análisis de Algoritmos** (Ingeniería de Sistemas).  
Se implementó una solución web ligera y funcional que evidencia la resolución del **Problema de la Mochila 0/1** mediante el paradigma de **Programación Dinámica** con la técnica de tabulación (*Bottom-Up*).

---

## 1. El Problema que se Desea Solucionar

El **Problema de la Mochila 0/1** (*0/1 Knapsack Problem*) es un problema fundamental de optimización combinatoria:

- **Contexto:** Se dispone de una mochila o contenedor con una capacidad máxima de carga en peso $W$.
- **Elementos disponibles:** Se tiene un conjunto de $n$ objetos $\{1, 2, \dots, n\}$. Cada objeto $i$ cuenta con un peso $w_i > 0$ y un valor o beneficio asociado $v_i > 0$.
- **Objetivo:** Determinar qué subconjunto de objetos empacar con el fin de **maximizar el beneficio total obtenido** sin sobrepasar el límite de capacidad de la mochila ($W$).
- **Restricción 0/1:** Cada objeto puede ser incluido una sola vez ($x_i = 1$) o ser descartado ($x_i = 0$). No se permite fraccionar los objetos (a diferencia de la versión continua/fraccionaria) ni tomar cantidades infinitas de los mismos.

### Formulación Matemática

$$\max \sum_{i=1}^{n} v_i x_i$$

sujeto a:

$$\sum_{i=1}^{n} w_i x_i \le W, \quad x_i \in \{0, 1\}$$

---

## 2. El Algoritmo de Programación Dinámica Seleccionado

Se seleccionó el **Algoritmo de la Mochila 0/1 mediante Tabulación (*Bottom-Up*)**.

### Justificación de la Elección:
1. **Falla del enfoque Voraz (Greedy):** La estrategia voraz (elegir por mayor relación valor/peso) no garantiza la solución óptima en la variante 0/1 porque los objetos indivisibles pueden dejar espacios muertos que impidan alcanzar el óptimo global.
2. **Ineficiencia de la Fuerza Bruta:** Evaluar todas las $2^n$ combinaciones posibles tiene un costo exponencial inaceptable para valores moderados de $n$.
3. **Propiedades de Programación Dinámica:**
   - **Subestructura Óptima:** La solución óptima de tamaño $(n, W)$ está compuesta por soluciones óptimas de subproblemas de menor tamaño $(i < n, w < W)$.
   - **Subproblemas Superpuestos:** Múltiples ramas de decisión evalúan exactamente la misma capacidad remanente con los mismos objetos previos. La Programación Dinámica evita recalculaciones almacenando los resultados intermedios en una matriz bidimensional.

---

## 3. Definición del Estado o Subproblemas

El estado del sistema se modela a través de una matriz bidimensional:

$$DP[i][w]$$

### Significado del Estado:
$DP[i][w]$ representa el **valor máximo acumulado** que es posible conseguir considerando únicamente los primeros $i$ objetos (es decir, el subconjunto $\{1, 2, \dots, i\}$) y disponiendo de una capacidad máxima disponible de $w$.

- **Dominio de $i$:** $0 \le i \le n$ (cantidad de objetos considerados).
- **Dominio de $w$:** $0 \le w \le W$ (capacidad de carga evaluada).

---

## 4. La Relación de Recurrencia Utilizada

Para cada objeto $i$ con peso $w_i$ y beneficio $v_i$, se toma una decisión binaria con respecto a la capacidad actual $w$:

$$DP[i][w] = \begin{cases} 
DP[i-1][w] & \text{si } w_i > w \\ 
\max\Big(DP[i-1][w], \; v_i + DP[i-1][w - w_i]\Big) & \text{si } w_i \le w 
\end{cases}$$

### Desglose de las Decisiones:
1. **Si $w_i > w$ (El objeto no cabe):**  
   El peso del objeto $i$ sobrepasa la capacidad disponible $w$. No hay opción viable de incluirlo, por lo que el mejor valor posible es el que ya se tenía con los $i-1$ elementos anteriores: $DP[i-1][w]$.
2. **Si $w_i \le w$ (El objeto sí cabe):**  
   Se presentan dos alternativas y se elige la que maximice el valor:
   - **No tomar el objeto:** Conservar la solución óptima previa con $i-1$ objetos y capacidad $w$: $DP[i-1][w]$.
   - **Tomar el objeto:** Sumar el valor $v_i$ del objeto actual al valor óptimo obtenido con los anteriores $i-1$ objetos en la capacidad restante $(w - w_i)$: $v_i + DP[i-1][w - w_i]$.

### Reconstrucción de la Solución (*Backtracking*):
Una vez construida la tabla hasta la celda final $DP[n][W]$, el algoritmo rastrea en retroceso para identificar qué elementos fueron seleccionados:
- Partiendo de $i = n$ y $w = W$:
  - Si $DP[i][w] \neq DP[i-1][w]$, el objeto $i$ fue incluido en la mochila. Se agrega a la lista de seleccionados y se actualiza $w \leftarrow w - w_i$.
  - Si $DP[i][w] == DP[i-1][w]$, el objeto $i$ no fue incluido.
  - Se decrementa $i \leftarrow i - 1$ y se repite hasta llegar a $i = 0$ o $w = 0$.

---

## 5. El Manejo de los Casos Base

Los casos base representan situaciones límite donde el beneficio máximo posible es trivialmente cero:

$$DP[0][w] = 0 \quad \text{para todo } w \in [0, W]$$
$$DP[i][0] = 0 \quad \text{para todo } i \in [0, n]$$

- **Fila 0 ($i = 0$):** Al no disponer de ningún elemento, el beneficio total obtenido es $0$, sin importar cuánta capacidad posea la mochila.
- **Columna 0 ($w = 0$):** Con una capacidad de mochila igual a $0$, ningún objeto con peso positivo puede ser almacenado, por lo que el valor acumulado es $0$.

En la implementación, estos casos base se atienden creando una matriz de tamaño $(n + 1) \times (W + 1)$ pre-rellenada con ceros.

---

## 6. La Implementación del Algoritmo

La lógica central está implementada en JavaScript estándar dentro de `app.js`:

```javascript
function resolverMochila01(items, W) {
    const n = items.length;

    // 1. Manejo de casos base (Matriz con ceros)
    const dp = Array.from({ length: n + 1 }, () => Array(W + 1).fill(0));

    // 2. Tabulación Bottom-Up usando la relación de recurrencia
    for (let i = 1; i <= n; i++) {
        const pesoActual = items[i - 1].peso;
        const valorActual = items[i - 1].valor;

        for (let w = 1; w <= W; w++) {
            if (pesoActual > w) {
                dp[i][w] = dp[i - 1][w];
            } else {
                dp[i][w] = Math.max(
                    dp[i - 1][w],
                    valorActual + dp[i - 1][w - pesoActual]
                );
            }
        }
    }

    // 3. Reconstrucción de la solución óptima (Backtracking)
    const seleccionadosIndices = new Set();
    const celdasCamino = new Set();
    let wRestante = W;
    celdasCamino.add(`${n},${W}`);

    for (let i = n; i > 0; i--) {
        if (dp[i][wRestante] !== dp[i - 1][wRestante]) {
            seleccionadosIndices.add(i - 1);
            wRestante -= items[i - 1].peso;
        }
        celdasCamino.add(`${i - 1},${wRestante}`);
    }

    const valorOptimo = dp[n][W];
    let pesoTotal = 0;
    items.forEach((item, idx) => {
        if (seleccionadosIndices.has(idx)) {
            pesoTotal += item.peso;
        }
    });

    return {
        valorOptimo,
        pesoTotal,
        capacidadMaxima: W,
        seleccionadosIndices,
        dp,
        celdasCamino
    };
}
```

### Análisis de Complejidad:
- **Complejidad Temporal:** $\Theta(n \cdot W)$  
  Se ejecutan dos ciclos anidados: el externo itera $n$ veces y el interno $W$ veces. En cada celda se efectúan comparaciones y sumas en tiempo constante $O(1)$.
- **Complejidad Espacial:** $\Theta(n \cdot W)$  
  Se reserva memoria para la tabla de dimensiones $(n + 1) \times (W + 1)$, necesaria para la visualización educativa y la reconstrucción del conjunto óptimo.

---

## 7. Los Resultados Obtenidos

La aplicación calcula y expone los resultados de manera visual e interactiva:

1. **Métricas Clave (KPIs):**
   - **Valor Máximo Óptimo:** Beneficio económico o utilidad total conseguida.
   - **Capacidad Ocupada:** Peso acumulado frente al peso límite y porcentaje de utilización.
   - **Objetos Seleccionados:** Razón de objetos empacados respecto al total.
2. **Tabla de Decisiones Detallada:**  
   Muestra cada objeto individual con su peso, valor, estado (`✓ Incluido` o `✗ Descartado`) y la justificación algorítmica de la decisión.
3. **Matriz DP Interactiva:**  
   Representa visualmente la tabla de tabulación $DP[i][w]$ completa. Las celdas que integran la trayectoria óptima calculada por el algoritmo se resaltan en color azul/destacado, permitiendo corroborar paso a paso la subestructura óptima del problema.

### Ejemplo de Prueba Académico:
- **Capacidad ($W$):** 7 kg
- **Objetos:**
  1. Libro ($w=1$, $v=1$)
  2. Reloj ($w=3$, $v=4$)
  3. Celular ($w=4$, $v=5$)
  4. Laptop ($w=5$, $v=7$)
- **Resultado Óptimo:**
  - Valor Máximo: **$9**
  - Peso Utilizado: **7 kg / 7 kg** (100% de uso)
  - Objetos seleccionados: **Reloj ($w=3$, $v=4$)** y **Celular ($w=4$, $v=5$)**. *(Se descarta Laptop porque $7 + 1 = 8 < 9$)*.

---

## Estructura de Archivos

```
examen-3/
├── index.html   # Estructura de la aplicación web y visualización de pestañas
├── styles.css   # Estilos CSS sobrios y formato de tabla DP
├── app.js       # Lógica del algoritmo de DP y controladores de eventos
└── README.md    # Documentación técnica completa de los 7 requerimientos
```

---

## Cómo Ejecutar el Proyecto

El desarrollo utiliza únicamente tecnologías web nativas (HTML5, CSS3 y JavaScript ES6), por lo que **no requiere instalación de dependencias ni librerías externas**.

### Opción 1: Abrir directamente en el navegador
Hacer doble clic sobre el archivo `examen-3/index.html` o abrirlo en cualquier navegador (Chrome, Edge, Firefox).

### Opción 2: Usar un servidor estático local
Desde la terminal en la raíz del proyecto:
```bash
cd examen-3
npx serve .
# O con Python:
python -m http.server 8080
```
Luego abrir `http://localhost:8080` en el navegador.

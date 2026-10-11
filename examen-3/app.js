/**
 * Examen 3 - Análisis de Algoritmos
 * Implementación del Algoritmo de Programación Dinámica: Problema de la Mochila 0/1
 */

// =============================================================================
// PRESETS / EJEMPLOS PRECONFIGURADOS
// =============================================================================
const PRESETS = {
    academico: {
        capacidad: 7,
        items: [
            { nombre: "Libro", peso: 1, valor: 1 },
            { nombre: "Reloj", peso: 3, valor: 4 },
            { nombre: "Celular", peso: 4, valor: 5 },
            { nombre: "Laptop", peso: 5, valor: 7 }
        ]
    },
    camping: {
        capacidad: 10,
        items: [
            { nombre: "Linterna", peso: 1, valor: 10 },
            { nombre: "Botiquín", peso: 2, valor: 15 },
            { nombre: "Botella de Agua", peso: 3, valor: 20 },
            { nombre: "Raciones de Comida", peso: 4, valor: 30 },
            { nombre: "Saco de Dormir", peso: 5, valor: 40 },
            { nombre: "Carpa Liviana", peso: 6, valor: 45 }
        ]
    },
    logistica: {
        capacidad: 12,
        items: [
            { nombre: "Paquete Alpha", peso: 2, valor: 25 },
            { nombre: "Paquete Beta", peso: 3, valor: 35 },
            { nombre: "Paquete Gamma", peso: 5, valor: 60 },
            { nombre: "Paquete Delta", peso: 7, valor: 80 },
            { nombre: "Paquete Epsilon", peso: 8, valor: 95 }
        ]
    }
};

// =============================================================================
// ESTADO GLOBAL DE LA APLICACIÓN
// =============================================================================
let currentItems = JSON.parse(JSON.stringify(PRESETS.academico.items));
let currentCapacity = PRESETS.academico.capacidad;

// =============================================================================
// ALGORITMO DE PROGRAMACIÓN DINÁMICA (MOCHILA 0/1)
// =============================================================================
/**
 * Resuelve el Problema de la Mochila 0/1 mediante Tabulación Bottom-Up
 * 
 * @param {Array<{nombre: string, peso: number, valor: number}>} items 
 * @param {number} W - Capacidad máxima
 * @returns {Object} Información de la solución óptima y tabla de DP
 */
function resolverMochila01(items, W) {
    const n = items.length;

    // 1. MANEJO DE CASOS BASE:
    // Creamos la matriz de dimensiones (n + 1) x (W + 1) inicializada en 0.
    // dp[0][w] = 0 para toda capacidad w (0 objetos -> 0 valor)
    // dp[i][0] = 0 para todo objeto i (0 capacidad -> 0 valor)
    const dp = Array.from({ length: n + 1 }, () => Array(W + 1).fill(0));

    // 2. TABULACIÓN BOTTOM-UP UTILIZANDO LA RELACIÓN DE RECURRENCIA:
    for (let i = 1; i <= n; i++) {
        const pesoActual = items[i - 1].peso;
        const valorActual = items[i - 1].valor;

        for (let w = 1; w <= W; w++) {
            if (pesoActual > w) {
                // El elemento no cabe: mantenemos el resultado sin este elemento
                dp[i][w] = dp[i - 1][w];
            } else {
                // El elemento cabe: evaluamos el máximo entre no incluirlo e incluirlo
                const sinElemento = dp[i - 1][w];
                const conElemento = valorActual + dp[i - 1][w - pesoActual];
                dp[i][w] = Math.max(sinElemento, conElemento);
            }
        }
    }

    // 3. RECONSTRUCCIÓN DE LA SOLUCIÓN ÓPTIMA (BACKTRACKING):
    // Rastrear desde dp[n][W] hacia atrás para identificar qué objetos fueron elegidos
    const seleccionadosIndices = new Set();
    const celdasCamino = new Set();
    let wRestante = W;
    celdasCamino.add(`${n},${W}`);

    for (let i = n; i > 0; i--) {
        if (dp[i][wRestante] !== dp[i - 1][wRestante]) {
            // Si el valor difiere, el objeto i - 1 fue seleccionado
            seleccionadosIndices.add(i - 1);
            wRestante -= items[i - 1].peso;
        }
        celdasCamino.add(`${i - 1},${wRestante}`);
    }

    // Cálculo de métricas finales
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

// =============================================================================
// RENDERIZADO DE LA INTERFAZ
// =============================================================================

/**
 * Renderiza la tabla editable de objetos disponibles
 */
function renderItemsTable() {
    const tbody = document.getElementById("items-tbody");
    tbody.innerHTML = "";

    if (currentItems.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: #888;">No hay objetos registrados. Agregue uno abajo.</td></tr>`;
        return;
    }

    currentItems.forEach((item, index) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${index + 1}</td>
            <td><strong>${escapeHtml(item.nombre)}</strong></td>
            <td>${item.peso} kg</td>
            <td>$${item.valor}</td>
            <td>
                <button class="btn-delete" data-index="${index}" title="Eliminar objeto">✕ Quitar</button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    // Asignar eventos de eliminación
    tbody.querySelectorAll(".btn-delete").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const idx = parseInt(e.target.getAttribute("data-index"), 10);
            eliminarObjeto(idx);
        });
    });
}

/**
 * Renderiza los resultados del algoritmo
 */
function renderResultados(resultado) {
    const { valorOptimo, pesoTotal, capacidadMaxima, seleccionadosIndices, dp, celdasCamino } = resultado;

    // Actualizar KPIs
    document.getElementById("kpi-max-value").textContent = `$${valorOptimo}`;
    document.getElementById("kpi-total-weight").textContent = `${pesoTotal} / ${capacidadMaxima} kg`;
    
    const pctUso = capacidadMaxima > 0 ? Math.round((pesoTotal / capacidadMaxima) * 100) : 0;
    document.getElementById("kpi-weight-pct").textContent = `${pctUso}% de capacidad utilizada`;
    
    document.getElementById("kpi-items-count").textContent = `${seleccionadosIndices.size} / ${currentItems.length}`;

    // Actualizar tabla de decisión de objetos
    const resultsTbody = document.getElementById("results-tbody");
    resultsTbody.innerHTML = "";

    if (currentItems.length === 0) {
        resultsTbody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: #888;">Agregue elementos para calcular la solución.</td></tr>`;
    } else {
        currentItems.forEach((item, idx) => {
            const incluido = seleccionadosIndices.has(idx);
            const tr = document.createElement("tr");

            const justificacion = incluido
                ? "Forma parte del subconjunto óptimo que maximiza el beneficio global."
                : (item.peso > capacidadMaxima 
                    ? `Excluido: Su peso (${item.peso} kg) excede la capacidad total (${capacidadMaxima} kg).`
                    : "Excluido: No compensa el uso del espacio frente a otras combinaciones.");

            tr.innerHTML = `
                <td><strong>${escapeHtml(item.nombre)}</strong></td>
                <td>${item.peso} kg</td>
                <td>$${item.valor}</td>
                <td>
                    <span class="badge ${incluido ? 'badge-included' : 'badge-excluded'}">
                        ${incluido ? '✓ Incluido' : '✗ Descartado'}
                    </span>
                </td>
                <td style="font-size: 13px; color: ${incluido ? '#166534' : '#64748b'};">${justificacion}</td>
            `;
            resultsTbody.appendChild(tr);
        });
    }

    // Renderizar la Matriz DP
    renderMatrizDP(dp, capacidadMaxima, celdasCamino);
}

/**
 * Genera la visualización tabular de la matriz bidimensional DP[i][w]
 */
function renderMatrizDP(dp, W, celdasCamino) {
    const table = document.getElementById("dp-matrix-table");
    table.innerHTML = "";

    const n = currentItems.length;

    // Fila de encabezado con los pesos w = 0..W
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");

    const thItem = document.createElement("th");
    thItem.className = "item-col";
    thItem.textContent = "Objeto / Capacidad (w)";
    headerRow.appendChild(thItem);

    for (let w = 0; w <= W; w++) {
        const th = document.createElement("th");
        th.textContent = `${w}`;
        th.title = `Capacidad w = ${w}`;
        headerRow.appendChild(th);
    }
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Cuerpo de la matriz
    const tbody = document.createElement("tbody");

    // Fila 0: Caso Base
    const tr0 = document.createElement("tr");
    const tdLabel0 = document.createElement("td");
    tdLabel0.className = "item-col";
    tdLabel0.textContent = "0 (Sin objetos)";
    tr0.appendChild(tdLabel0);

    for (let w = 0; w <= W; w++) {
        const td = document.createElement("td");
        td.textContent = dp[0][w];
        td.className = "base-cell";
        if (celdasCamino.has(`0,${w}`)) {
            td.classList.add("optimal-path");
        }
        td.title = `dp[0][${w}] = ${dp[0][w]} (Caso base: 0 objetos)`;
        tr0.appendChild(td);
    }
    tbody.appendChild(tr0);

    // Filas 1..n para cada objeto
    for (let i = 1; i <= n; i++) {
        const item = currentItems[i - 1];
        const tr = document.createElement("tr");

        const tdLabel = document.createElement("td");
        tdLabel.className = "item-col";
        tdLabel.innerHTML = `${i}. ${escapeHtml(item.nombre)} <br><small style="color: #64748b; font-weight: normal;">(w=${item.peso}, v=$${item.valor})</small>`;
        tr.appendChild(tdLabel);

        for (let w = 0; w <= W; w++) {
            const td = document.createElement("td");
            td.textContent = dp[i][w];

            if (w === 0) {
                td.classList.add("base-cell");
            }

            if (celdasCamino.has(`${i},${w}`)) {
                td.classList.add("optimal-path");
            }

            td.title = `dp[${i}][${w}] = ${dp[i][w]} (Con primeros ${i} objetos y capacidad ${w})`;
            tr.appendChild(td);
        }
        tbody.appendChild(tr);
    }

    table.appendChild(tbody);
}

// =============================================================================
// ACCIONES Y CONTROLADORES DE EVENTOS
// =============================================================================

/**
 * Ejecuta el cálculo completo y refresca la vista
 */
function ejecutarSolucion() {
    const inputW = document.getElementById("input-capacity");
    let W = parseInt(inputW.value, 10);

    if (isNaN(W) || W < 1) {
        alert("Por favor ingrese una capacidad válida (mínimo 1).");
        inputW.value = 7;
        W = 7;
    }

    if (W > 50) {
        alert("Para propósitos de visualización de la tabla, la capacidad máxima permitida es 50.");
        inputW.value = 50;
        W = 50;
    }

    currentCapacity = W;
    const resultado = resolverMochila01(currentItems, currentCapacity);
    renderResultados(resultado);
}

/**
 * Carga un preset seleccionado
 */
function cargarPreset(presetKey) {
    if (PRESETS[presetKey]) {
        currentCapacity = PRESETS[presetKey].capacidad;
        currentItems = JSON.parse(JSON.stringify(PRESETS[presetKey].items));
        document.getElementById("input-capacity").value = currentCapacity;
        renderItemsTable();
        ejecutarSolucion();
    }
}

/**
 * Agrega un nuevo objeto personalizado
 */
function agregarObjeto() {
    const inputNombre = document.getElementById("new-item-name");
    const inputPeso = document.getElementById("new-item-weight");
    const inputValor = document.getElementById("new-item-value");

    const nombre = inputNombre.value.trim();
    const peso = parseInt(inputPeso.value, 10);
    const valor = parseInt(inputValor.value, 10);

    if (!nombre) {
        alert("Ingrese un nombre descriptivo para el objeto.");
        inputNombre.focus();
        return;
    }

    if (isNaN(peso) || peso <= 0) {
        alert("El peso debe ser un número entero mayor a 0.");
        inputPeso.focus();
        return;
    }

    if (isNaN(valor) || valor <= 0) {
        alert("El valor debe ser un número entero mayor a 0.");
        inputValor.focus();
        return;
    }

    currentItems.push({ nombre, peso, valor });

    // Limpiar campos
    inputNombre.value = "";
    inputPeso.value = "";
    inputValor.value = "";

    // Actualizar preset a "personalizado"
    document.getElementById("select-preset").value = "personalizado";

    renderItemsTable();
    ejecutarSolucion();
}

/**
 * Elimina un objeto por índice
 */
function eliminarObjeto(idx) {
    currentItems.splice(idx, 1);
    document.getElementById("select-preset").value = "personalizado";
    renderItemsTable();
    ejecutarSolucion();
}

/**
 * Función de escape básico para prevenir inyecciones HTML
 */
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// =============================================================================
// INICIALIZACIÓN AL CARGAR LA PÁGINA
// =============================================================================
document.addEventListener("DOMContentLoaded", () => {
    // Configurar pestañas
    const tabButtons = document.querySelectorAll(".tab-btn");
    const tabContents = document.querySelectorAll(".tab-content");

    tabButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            tabButtons.forEach(b => b.classList.remove("active"));
            tabContents.forEach(c => c.classList.remove("active"));

            btn.classList.add("active");
            const targetTab = document.getElementById(btn.getAttribute("data-tab"));
            if (targetTab) {
                targetTab.classList.add("active");
            }
        });
    });

    // Selector de preset
    document.getElementById("select-preset").addEventListener("change", (e) => {
        if (e.target.value !== "personalizado") {
            cargarPreset(e.target.value);
        }
    });

    // Botón Resolver
    document.getElementById("btn-resolver").addEventListener("click", ejecutarSolucion);

    // Botón Restablecer
    document.getElementById("btn-restablecer").addEventListener("click", () => {
        document.getElementById("select-preset").value = "academico";
        cargarPreset("academico");
    });

    // Formulario de agregar objeto
    document.getElementById("btn-add-item").addEventListener("click", agregarObjeto);
    
    // Permitir agregar presionando Enter en los inputs
    ["new-item-name", "new-item-weight", "new-item-value"].forEach(id => {
        document.getElementById(id).addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                agregarObjeto();
            }
        });
    });

    // Iniciar con datos por defecto
    renderItemsTable();
    ejecutarSolucion();
});

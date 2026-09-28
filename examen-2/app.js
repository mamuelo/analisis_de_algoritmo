const presets = {
    urbana: {
        nodes: {
            "A": { x: 120, y: 190 },
            "B": { x: 300, y: 90 },
            "C": { x: 300, y: 290 },
            "D": { x: 580, y: 90 },
            "E": { x: 580, y: 290 },
            "F": { x: 780, y: 190 }
        },
        edges: [
            { u: "A", v: "B", w: 4 },
            { u: "A", v: "C", w: 2 },
            { u: "B", v: "C", w: 1 },
            { u: "B", v: "D", w: 5 },
            { u: "C", v: "D", w: 8 },
            { u: "C", v: "E", w: 10 },
            { u: "D", v: "E", w: 2 },
            { u: "D", v: "F", w: 6 },
            { u: "E", v: "F", w: 3 }
        ]
    },
    nacional: {
        nodes: {
            "BOG": { x: 450, y: 240 },
            "MDE": { x: 320, y: 160 },
            "CLO": { x: 230, y: 290 },
            "BAQ": { x: 400, y: 50 },
            "BGA": { x: 520, y: 130 },
            "PEI": { x: 260, y: 210 },
            "CTG": { x: 290, y: 60 }
        },
        edges: [
            { u: "BOG", v: "MDE", w: 415 },
            { u: "BOG", v: "CLO", w: 460 },
            { u: "BOG", v: "BGA", w: 395 },
            { u: "BOG", v: "PEI", w: 310 },
            { u: "MDE", v: "PEI", w: 215 },
            { u: "MDE", v: "CTG", w: 640 },
            { u: "MDE", v: "BGA", w: 390 },
            { u: "CLO", v: "PEI", w: 210 },
            { u: "BGA", v: "BAQ", w: 580 },
            { u: "CTG", v: "BAQ", w: 120 }
        ]
    },
    academica: {
        nodes: {
            "V1": { x: 150, y: 190 },
            "V2": { x: 350, y: 100 },
            "V3": { x: 350, y: 280 },
            "V4": { x: 550, y: 100 },
            "V5": { x: 720, y: 190 }
        },
        edges: [
            { u: "V1", v: "V2", w: 10 },
            { u: "V1", v: "V3", w: 5 },
            { u: "V2", v: "V3", w: 2 },
            { u: "V2", v: "V4", w: 1 },
            { u: "V3", v: "V4", w: 9 },
            { u: "V3", v: "V5", w: 2 },
            { u: "V4", v: "V5", w: 4 }
        ]
    }
};

class Graph {
    constructor() {
        this.nodes = {};
        this.adjacency = {};
    }

    addNode(id, x, y) {
        if (!this.nodes[id]) {
            this.nodes[id] = {
                x: x !== undefined ? x : Math.floor(Math.random() * 650 + 100),
                y: y !== undefined ? y : Math.floor(Math.random() * 200 + 80)
            };
            this.adjacency[id] = [];
        }
    }

    addEdge(u, v, weight) {
        this.addNode(u);
        this.addNode(v);

        const parsedWeight = parseFloat(weight);

        const existingForward = this.adjacency[u].find(edge => edge.node === v);
        if (existingForward) {
            existingForward.weight = parsedWeight;
        } else {
            this.adjacency[u].push({ node: v, weight: parsedWeight });
        }

        const existingBackward = this.adjacency[v].find(edge => edge.node === u);
        if (existingBackward) {
            existingBackward.weight = parsedWeight;
        } else {
            this.adjacency[v].push({ node: u, weight: parsedWeight });
        }
    }

    loadPreset(presetKey) {
        const config = presets[presetKey];
        if (!config) return;

        this.nodes = {};
        this.adjacency = {};

        for (const [id, pos] of Object.entries(config.nodes)) {
            this.nodes[id] = { x: pos.x, y: pos.y };
            this.adjacency[id] = [];
        }

        for (const edge of config.edges) {
            this.addEdge(edge.u, edge.v, edge.w);
        }
    }

    getNodesList() {
        return Object.keys(this.nodes).sort();
    }

    runDijkstra(startNode, endNode) {
        const startTime = performance.now();
        const nodeKeys = Object.keys(this.nodes);
        const distances = {};
        const previous = {};
        const unvisited = new Set(nodeKeys);

        for (const node of nodeKeys) {
            distances[node] = Infinity;
            previous[node] = null;
        }

        if (!this.nodes[startNode]) {
            return { error: `El nodo inicial ${startNode} no existe en el grafo.` };
        }

        distances[startNode] = 0;

        while (unvisited.size > 0) {
            let currentNode = null;
            let currentMin = Infinity;

            for (const node of unvisited) {
                if (distances[node] < currentMin) {
                    currentMin = distances[node];
                    currentNode = node;
                }
            }

            if (currentNode === null || currentMin === Infinity) {
                break;
            }

            unvisited.delete(currentNode);

            const neighbors = this.adjacency[currentNode] || [];
            for (const neighbor of neighbors) {
                const targetNode = neighbor.node;
                const weight = neighbor.weight;

                if (!unvisited.has(targetNode)) {
                    continue;
                }

                const tentativeDist = distances[currentNode] + weight;
                if (tentativeDist < distances[targetNode]) {
                    distances[targetNode] = tentativeDist;
                    previous[targetNode] = currentNode;
                }
            }

            if (endNode && currentNode === endNode) {
                break;
            }
        }

        const endTime = performance.now();

        const path = [];
        let curr = endNode;
        if (distances[endNode] !== Infinity) {
            while (curr !== null) {
                path.unshift(curr);
                curr = previous[curr];
            }
        }

        return {
            startNode: startNode,
            endNode: endNode,
            distance: distances[endNode],
            path: path,
            executionTime: (endTime - startTime).toFixed(3)
        };
    }
}

const currentGraph = new Graph();

const svgCanvas = document.getElementById("graph-canvas");
const selectPreset = document.getElementById("select-preset");
const selectSource = document.getElementById("select-source");
const selectTarget = document.getElementById("select-target");
const btnRun = document.getElementById("btn-run");
const btnReset = document.getElementById("btn-reset");
const resultContainer = document.getElementById("result-container");

function updateDropdowns() {
    const nodes = currentGraph.getNodesList();
    const prevSource = selectSource.value;
    const prevTarget = selectTarget.value;

    selectSource.innerHTML = "";
    selectTarget.innerHTML = "";

    nodes.forEach(node => {
        const optSource = document.createElement("option");
        optSource.value = node;
        optSource.textContent = node;
        selectSource.appendChild(optSource);

        const optTarget = document.createElement("option");
        optTarget.value = node;
        optTarget.textContent = node;
        selectTarget.appendChild(optTarget);
    });

    if (nodes.includes(prevSource)) {
        selectSource.value = prevSource;
    } else if (nodes.length > 0) {
        selectSource.value = nodes[0];
    }

    if (nodes.includes(prevTarget)) {
        selectTarget.value = prevTarget;
    } else if (nodes.length > 1) {
        selectTarget.value = nodes[nodes.length - 1];
    }
}

function renderGraph(activePathNodes = new Set(), activePathEdges = new Set(), source = null, target = null) {
    svgCanvas.innerHTML = "";

    const drawnEdges = new Set();

    for (const [u, neighbors] of Object.entries(currentGraph.adjacency)) {
        const posU = currentGraph.nodes[u];
        if (!posU) continue;

        for (const edge of neighbors) {
            const v = edge.node;
            const posV = currentGraph.nodes[v];
            if (!posV) continue;

            const edgeKey = [u, v].sort().join("--");
            if (drawnEdges.has(edgeKey)) continue;
            drawnEdges.add(edgeKey);

            const isHighlighted = activePathEdges.has(`${u}->${v}`) || activePathEdges.has(`${v}->${u}`);

            const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
            line.setAttribute("x1", posU.x);
            line.setAttribute("y1", posU.y);
            line.setAttribute("x2", posV.x);
            line.setAttribute("y2", posV.y);
            line.setAttribute("class", isHighlighted ? "edge-line path-highlight" : "edge-line");
            svgCanvas.appendChild(line);

            const midX = (posU.x + posV.x) / 2;
            const midY = (posU.y + posV.y) / 2;

            const textBg = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            textBg.setAttribute("x", midX - 14);
            textBg.setAttribute("y", midY - 10);
            textBg.setAttribute("width", 28);
            textBg.setAttribute("height", 20);
            textBg.setAttribute("fill", "#ffffff");
            textBg.setAttribute("stroke", isHighlighted ? "#d9534f" : "#cccccc");
            textBg.setAttribute("stroke-width", "1");
            textBg.setAttribute("rx", "3");
            svgCanvas.appendChild(textBg);

            const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
            text.setAttribute("x", midX);
            text.setAttribute("y", midY);
            text.setAttribute("class", "edge-weight");
            if (isHighlighted) {
                text.setAttribute("fill", "#d9534f");
            }
            text.textContent = edge.weight;
            svgCanvas.appendChild(text);
        }
    }

    for (const [id, pos] of Object.entries(currentGraph.nodes)) {
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("cx", pos.x);
        circle.setAttribute("cy", pos.y);
        circle.setAttribute("r", 20);

        let circleClass = "node-circle";
        if (id === source) {
            circleClass += " start-node";
        } else if (id === target) {
            circleClass += " end-node";
        } else if (activePathNodes.has(id)) {
            circleClass += " path-node";
        }
        circle.setAttribute("class", circleClass);
        svgCanvas.appendChild(circle);

        const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
        label.setAttribute("x", pos.x);
        label.setAttribute("y", pos.y);
        label.setAttribute("class", "node-text");
        label.textContent = id;
        svgCanvas.appendChild(label);
    }
}

function handlePresetChange() {
    const selected = selectPreset.value;
    currentGraph.loadPreset(selected);
    updateDropdowns();
    renderGraph();
    resetResults();
}

function resetResults() {
    resultContainer.className = "result-box info";
    resultContainer.textContent = "Seleccione el nodo de origen y el nodo de destino, luego presione 'Calcular Ruta'.";
    renderGraph();
}

function executeDijkstra() {
    const source = selectSource.value;
    const target = selectTarget.value;

    if (!source || !target) {
        resultContainer.className = "result-box error";
        resultContainer.textContent = "Debe seleccionar un nodo de origen y un nodo de destino válidos.";
        return;
    }

    const result = currentGraph.runDijkstra(source, target);

    if (result.error) {
        resultContainer.className = "result-box error";
        resultContainer.textContent = result.error;
        return;
    }

    const lastPathNodes = new Set(result.path);
    const lastPathEdges = new Set();
    for (let i = 0; i < result.path.length - 1; i++) {
        lastPathEdges.add(`${result.path[i]}->${result.path[i + 1]}`);
    }

    renderGraph(lastPathNodes, lastPathEdges, source, target);

    if (result.distance === Infinity || result.path.length === 0) {
        resultContainer.className = "result-box error";
        resultContainer.innerHTML = `<strong>Inalcanzable:</strong> No existe ninguna ruta conectada entre el nodo <strong>${source}</strong> y el nodo <strong>${target}</strong>.`;
    } else {
        resultContainer.className = "result-box success";
        resultContainer.innerHTML = `
            <strong>Ruta Más Corta Calculada:</strong> ${result.path.join(" &rarr; ")}<br>
            <strong>Costo / Distancia Total:</strong> ${result.distance} unidades / km.<br>
            <strong>Tiempo de Ejecución:</strong> ${result.executionTime} ms
        `;
    }
}

selectPreset.addEventListener("change", handlePresetChange);
btnRun.addEventListener("click", executeDijkstra);
btnReset.addEventListener("click", resetResults);

currentGraph.loadPreset("urbana");
updateDropdowns();
renderGraph();

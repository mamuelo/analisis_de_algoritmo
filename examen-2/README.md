# Examen 2 - Algoritmo de Dijkstra

Entrega del segundo examen de Análisis de Algoritmos. Se implementó una aplicación web sencilla para encontrar la ruta más corta entre nodos de una red usando el algoritmo de Dijkstra.

## Problema

Es el problema clásico de transporte y logística: tenemos varios puntos o ciudades conectadas por vías que tienen cierta distancia o costo (pesos no negativos), y se necesita calcular la ruta más corta para ir desde un punto de salida hasta un punto de llegada.

El grafo representa las ciudades o centros de acopio como nodos, y las carreteras como aristas con su peso correspondiente.

## Algoritmo usado

Se utilizó el algoritmo de Dijkstra porque sirve exactamente para encontrar el camino más corto desde un nodo origen hacia los demás en grafos con pesos positivos.

Básicamente hace lo siguiente:
1. Pone la distancia de todos los nodos en infinito, menos la del nodo de inicio que arranca en 0.
2. Toma el nodo no visitado con la distancia más pequeña.
3. Revisa a sus vecinos y calcula si la distancia acumulada es menor a la que ya tenían (relajación). Si es menor, la actualiza y guarda el nodo anterior.
4. Repite el proceso hasta llegar al nodo destino o recorrer los nodos alcanzables.
5. Al terminar, reconstruye el camino yendo hacia atrás desde el destino usando los nodos previos.

## Complejidad

- Tiempo: O((V + E) log V) usando cola de prioridad, o O(V^2) de forma secuencial.
- Espacio: O(V + E) para almacenar la lista de adyacencia del grafo, las distancias y los predecesores.

## Archivos

- index.html: Estructura básica con los selectores de origen/destino y el SVG donde se dibuja el grafo.
- styles.css: Estilos simples para ordenar la interfaz.
- app.js: Toda la lógica del grafo y la función de Dijkstra.

## Cómo correrlo

No requiere instalar librerías ni paquetes raros.
Solo hay que abrir `index.html` directamente en el navegador (con doble clic) o corriendo en la terminal:

```bash
npx serve .
```

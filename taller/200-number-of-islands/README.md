# 200. Number of Islands

## Modelo del Grafo

La grilla se modela como un grafo no dirigido implicito:
- Vertices: Cada celda `(r, c)` que contiene un `'1'` (tierra). Las celdas con `'0'` son agua y no se toman como vertices.
- Aristas: Conexiones no dirigidas unicamente con los vecinos ortogonales (arriba, abajo, izquierda y derecha) que tambien sean `'1'`. No se consideran diagonales.
- Problema: Contar cuantas componentes conexas existen en el grafo.

## Explicacion

Para resolverlo solo hay que recorrer la matriz buscando tierras que no hayamos visitado:

1. Se recorre la grilla celda por celda con dos ciclos.
2. Si la celda actual es un `'1'`, significa que encontramos una isla nueva, sumamos 1 al contador.
3. Llamamos a un DFS sobre esa celda para recorrer toda la isla. En el DFS vamos cambiando los `'1'` por `'0'` para hundir la tierra y marcarla como visitada, asi evitamos contarla dos veces o ciclar.
4. Al terminar de recorrer toda la grilla devolvemos el contador.

## Complejidad

- Tiempo: Theta(m * n), donde m es el numero de filas y n el numero de columnas. Cada celda se visita una cantidad constante de veces (a lo sumo 4 llamadas desde sus vecinas).
- Espacio: O(m * n) en el peor de los casos por la memoria de la pila de recursion si toda la grilla estuviera llena de tierra.

## Evidencia

![Accepted](accepted.png)

# 39. Combination Sum

## Modelo de Backtracking

- Que se elige: En cada paso se toma un numero `candidates[i]` a partir de la posicion actual `inicio`. Se mete a la lista temporal de la combinacion (`camino`) y se descuenta de lo que falta para llegar a la meta (`resto - candidates[i]`). Se puede volver a reutilizar ese mismo numero dejando el indice en `i`.
- Control de duplicados: No se vuelve a indices anteriores a `inicio`. Asi se evita generar permutaciones diferentes del mismo conjunto (por ejemplo, genera `[2, 2, 3]` pero no `[3, 2, 2]`).
- Condicion de exito: Si `resto == 0`, la combinacion suma exactamente el `target`. Guardamos una copia de `camino` en la lista final.
- Poda: Si `resto < 0` (o si `candidates[i] > resto` al estar ordenados), nos pasamos del objetivo, por lo que cortamos esa rama de inmediato y no seguimos bajando en el arbol.
- Que se deshace (Backtrack): Al regresar de la llamada recursiva, se hace un `camino.pop()` para sacar el ultimo elemento seleccionado, devolviendo la lista a su estado anterior para poder probar con el siguiente candidato.

## Explicacion

A diferencia de problemas como Coin Change donde solo interesa saber el numero minimo de monedas con DP, aqui se necesita listar todas las combinaciones reales.

Greedy no sirve porque no puede rectificar decisiones equivocadas; por eso se usa backtracking para recorrer las ramas prometedoras:

1. Se ordenan los candidatos de menor a mayor para podar mas rapido el bucle cuando un candidato sea mayor a lo que resta.
2. Se ejecuta la funcion recursiva `backtrack(inicio, resto, camino)`.
3. Si `resto == 0`, se guarda la combinacion encontrada.
4. En el bucle de candidatos, se agrega el numero a `camino`, se llama a recursion con `resto - candidates[i]`, y al volver se retira con `camino.pop()`.
5. Se devuelve la lista de combinaciones encontradas.

## Complejidad

- Tiempo: O(n^(t / min_val)), donde n es el numero de candidatos, t es el valor de target y min_val es el candidato con el valor mas bajo. En el peor escenario (por ejemplo candidatos con 1s o numeros pequenos), el arbol alcanza una altura de t / min_val con hasta n ramificaciones por nivel.
- Espacio: O(t / min_val) para la profundidad maxima de la pila de recursion y para almacenar la combinacion parcial actual en memoria (sin incluir la estructura donde se guardan las soluciones resultantes).

## Evidencia

![Accepted](accepted.png)

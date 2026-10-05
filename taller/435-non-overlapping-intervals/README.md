# 435. Non-overlapping Intervals

## Criterio Greedy

El problema pide el minimo numero de intervalos a eliminar para que ninguno se solape. Esto es equivalente al clasico problema de seleccion de actividades (Activity Selection), pero visto al reves: para borrar la menor cantidad posible, debemos quedarnos con la mayor cantidad de intervalos compatibles.

- Ordenamiento: Se ordenan todos los intervalos por su tiempo de fin (`end`).
- Criterio local de seleccion: Entre los intervalos disponibles, siempre conviene elegir el que termine mas temprano. Esto deja la mayor cantidad de tiempo libre posible para poder acomodar los siguientes intervalos sin conflicto.
- Decision en cada paso:
  - Si el intervalo actual empieza antes de que termine el ultimo aceptado (`start < last_end`), hay colision. Como el anterior termina antes o igual, vorazmente descartamos el actual y sumamos 1 a los borrados.
  - Si no colisiona (`start >= last_end`), lo aceptamos y actualizamos `last_end` con el fin del intervalo actual (notar que si un intervalo empieza exactamente donde termina el anterior no se considera solape).

## Explicacion

1. Se ordenan los intervalos ascendentemente fijandose en la posicion `[1]` (su fin).
2. Se toma el fin del primer intervalo como referencia (`ultimo_fin`).
3. Se recorren los demas intervalos:
   - Si su inicio es menor que `ultimo_fin`, se cruzan y hay que borrarlo, por lo que sumamos 1 al contador de borrados.
   - Si su inicio es mayor o igual que `ultimo_fin`, es compatible, asi que lo dejamos y actualizamos `ultimo_fin` a su respectivo fin.
4. Retornamos la cuenta total de borrados.

## Complejidad

- Tiempo: O(n log n), donde n es el numero total de intervalos. El cuello de botella es ordenar la lista; recorrerla luego de forma lineal solo toma O(n).
- Espacio: O(1) de memoria adicional si el ordenamiento se hace in-place sobre el mismo arreglo (u O(n) segun la implementacion interna de Timsort en Python).

## Evidencia

![Accepted](accepted.png)

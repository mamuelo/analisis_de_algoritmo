# 56. Merge Intervals

## Explicacion

El ejercicio nos da una lista de intervalos y pide que si se cruzan o se tocan, los juntemos en uno solo.

Para no complicarse la vida haciendo comparaciones de todos contra todos con dos bucles que dan O(n^2), la forma facil es ordenar primero:

1. Se ordenan los intervalos por el numero con el que empiezan (el start).
2. Se toma el primer intervalo como el actual y se mete al resultado.
3. Se va pasando por los demas intervalos uno por uno:
   - Si el intervalo en el que vamos empieza antes o justo cuando termina el anterior, se solapan, asi que solo se actualiza el final del anterior con el numero mas grande entre los dos.
   - Si no se tocan, significa que el anterior ya quedo listo, entonces se mete este nuevo intervalo a la lista de respuestas y ahora este pasa a ser el actual.

## Complejidad

- Tiempo: O(n log n), donde n es la cantidad de intervalos. Lo mas pesado es ordenar la lista al inicio. La pasada para unirlos solo es O(n).
- Espacio: O(n) para guardar la lista con los intervalos ya fusionados.

## Evidencia

![Accepted](accepted.png)

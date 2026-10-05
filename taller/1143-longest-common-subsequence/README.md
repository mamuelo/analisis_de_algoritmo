# 1143. Longest Common Subsequence

## Modelo de Programacion Dinamica

- Estado: `dp[i][j]` guarda la longitud de la subsecuencia comun mas larga entre los prefijos `text1[0..i)` y `text2[0..j)`.
- Casos Base: `dp[0][j] = 0` y `dp[i][0] = 0` para todo `i, j`, porque cualquier cadena comparada contra una cadena vacia tiene LCS de longitud 0.
- Recurrencia:
  - Si los caracteres coinciden (`text1[i - 1] == text2[j - 1]`):
    `dp[i][j] = 1 + dp[i - 1][j - 1]`
  - Si no coinciden:
    `dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])`

## Explicacion

El problema pide hallar el largo de la subsecuencia comun mas larga entre dos cadenas. Como es subsecuencia, se pueden ignorar caracteres intermedios pero se debe respetar el orden original.

Irse por el camino voraz (greedy) tomando la primera coincidencia no sirve, y hacerlo con recursion simple sin memorizacion da tiempo exponencial. La forma directa es tabular:

1. Se arma una matriz `dp` de tamano `(n + 1) x (m + 1)` llena de ceros.
2. Se recorren las dos cadenas con dos ciclos anidados.
3. Si las letras actuales coinciden, sumamos 1 al resultado de la diagonal anterior (es decir, sin considerar esas dos letras).
4. Si son distintas, tomamos el valor maximo entre haber omitido la letra de `text1` o la de `text2`.
5. El resultado final queda almacenado en la esquina inferior derecha `dp[n][m]`.

## Complejidad

- Tiempo: Theta(n * m), donde n es la longitud de text1 y m la longitud de text2. Hay que calcular cada una de las celdas de la tabla y cada paso toma tiempo O(1).
- Espacio: Theta(n * m) para guardar la matriz de dimensiones (n + 1) x (m + 1).

## Evidencia

![Accepted](accepted.png)

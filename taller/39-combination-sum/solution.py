class Solution:
    def combinationSum(self, candidates: list[int], target: int) -> list[list[int]]:
        resultados = []
        # ordenar facilita podar ramas temprano cuando candidates[i] > resto
        candidates.sort()

        def backtrack(inicio: int, resto: int, camino: list[int]):
            if resto == 0:
                resultados.append(list(camino))
                return

            for i in range(inicio, len(candidates)):
                # si el candidato actual ya supera lo que resta, los siguientes tambien lo haran
                if candidates[i] > resto:
                    break

                # elegir
                camino.append(candidates[i])
                # recursar permitiendo reutilizar el mismo elemento (indice i)
                backtrack(i, resto - candidates[i], camino)
                # deshacer (backtrack)
                camino.pop()

        backtrack(0, target, [])
        return resultados

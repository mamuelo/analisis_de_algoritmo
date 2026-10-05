class Solution:
    def eraseOverlapIntervals(self, intervals: list[list[int]]) -> int:
        if not intervals:
            return 0

        # ordenar por el extremo de finalizacion (end)
        intervals.sort(key=lambda x: x[1])

        borrados = 0
        ultimo_fin = intervals[0][1]

        for i in range(1, len(intervals)):
            # si empieza antes de que termine el ultimo aceptado, se solapan
            if intervals[i][0] < ultimo_fin:
                borrados += 1
            else:
                # no se solapan, se actualiza el fin del ultimo aceptado
                ultimo_fin = intervals[i][1]

        return borrados

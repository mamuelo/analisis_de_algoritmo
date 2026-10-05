class Solution:
    def numIslands(self, grid: list[list[str]]) -> int:
        if not grid or not grid[0]:
            return 0

        m, n = len(grid), len(grid[0])
        islas = 0

        def dfs(r: int, c: int):
            # salir si estamos fuera de los limites o si es agua / ya visitado
            if r < 0 or r >= m or c < 0 or c >= n or grid[r][c] != "1":
                return

            # hundir la tierra para marcarla como visitada
            grid[r][c] = "0"

            # explorar arriba, abajo, izquierda y derecha (sin diagonales)
            dfs(r + 1, c)
            dfs(r - 1, c)
            dfs(r, c + 1)
            dfs(r, c - 1)

        for i in range(m):
            for j in range(n):
                if grid[i][j] == "1":
                    islas += 1
                    dfs(i, j)

        return islas

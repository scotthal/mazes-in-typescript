import { Cell } from "./cell";
import { Grid } from "./grid";

function sampleNeighbors(cell: Cell, grid: Grid) {
  const neighbors = grid.getCellNeighbors(cell.x, cell.y);
  return neighbors[Math.floor(Math.random() * neighbors.length)];
}

export function wilson(grid: Grid) {
  const unvisitedIndices = [];
  for (let i = 0; i < grid.cells.length; i++) {
    unvisitedIndices[i] = i;
  }

  let currentUnvisitedIndex = Math.floor(
    Math.random() * unvisitedIndices.length
  );
  unvisitedIndices.splice(currentUnvisitedIndex, 1);

  while (unvisitedIndices.length > 0) {
    currentUnvisitedIndex = Math.floor(Math.random() * unvisitedIndices.length);
    let currentIndex = unvisitedIndices[currentUnvisitedIndex];
    const path = [currentIndex];
    let cell = grid.cells[currentIndex];

    while (unvisitedIndices.includes(currentIndex)) {
      const [neighborX, neighborY] = sampleNeighbors(cell, grid);
      const neighborIndex = grid.getCellIndex(neighborX, neighborY);
      const neighborPathIndex = path.indexOf(neighborIndex);
      if (neighborPathIndex === -1) {
        path.push(neighborIndex);
      } else {
        path.splice(neighborPathIndex + 1);
      }
      currentIndex = neighborIndex;
      cell = grid.cells[currentIndex];
    }

    for (let i = 0; i < path.length - 1; i++) {
      const currentCell = grid.cells[path[i]];
      const currentLinkTarget = grid.cells[path[i + 1]];
      const direction = currentCell.neighborDirection(currentLinkTarget);
      if (direction === null) {
        throw new Error("Neighbor isn't a neighbor");
      }
      currentCell.link(currentLinkTarget, direction);
      const unvisitedIndex = unvisitedIndices.indexOf(path[i]);
      if (unvisitedIndex !== -1) {
        unvisitedIndices.splice(unvisitedIndex, 1);
      }
    }
  }
}

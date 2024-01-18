import { Grid } from "./grid";

export function aldousBroder(grid: Grid) {
  let cell = grid.randomCell();
  let unvisited = grid.cells.length - 1;

  while (unvisited > 0) {
    const neighbors = grid.getCellNeighbors(cell.x, cell.y);
    const neighborIndex = Math.floor(Math.random() * neighbors.length);
    const neighbor = grid.getCell(...neighbors[neighborIndex]);
    if (neighbor === null) {
      throw new Error("Grid is corrupt.  A cell neighbor does not exist.");
    }
    if (neighbor.links.length === 0) {
      const direction = cell.neighborDirection(neighbor);
      if (direction === null) {
        throw new Error("Neighbor isn't a neighbor?");
      }
      cell.link(neighbor, direction);
      unvisited--;
    }
    cell = neighbor;
  }
}

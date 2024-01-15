import { DirectedCellLink } from "./cell";
import { Grid } from "./grid";

export function binaryTree(grid: Grid) {
  for (const cell of grid.cells) {
    const cellEast = grid.getCellEast(cell);
    const cellNorth = grid.getCellNorth(cell);
    if (cellEast && cellNorth) {
      if (Math.random() > 0.5) {
        cell.link(cellEast, DirectedCellLink.EAST);
      } else {
        cell.link(cellNorth, DirectedCellLink.NORTH);
      }
    } else if (cellNorth) {
      cell.link(cellNorth, DirectedCellLink.NORTH);
    } else if (cellEast) {
      cell.link(cellEast, DirectedCellLink.EAST);
    }
  }
}

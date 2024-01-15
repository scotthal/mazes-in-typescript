import { Cell, DirectedCellLink } from "./cell";
import { Coordinate } from "./coordinate";
import { Grid } from "./grid";

export function sidewinder(grid: Grid) {
  for (let y = 0; y < grid.rows; y++) {
    let run: Cell[] = [];
    for (let x = 0; x < grid.columns; x++) {
      const cell = grid.getCell(new Coordinate(x, y));
      if (!cell) {
        throw new Error("I can't believe in anything");
      }
      run.push(cell);
      const cellEast = grid.getCellEast(cell);
      const cellNorth = grid.getCellNorth(cell);
      const heads = Math.random() > 0.5;
      const endRun = !cellEast || (!!cellNorth && heads);
      if (endRun) {
        const northTunneler = run[Math.floor(Math.random() * run.length)];
        const northTunnelerNorthCell = grid.getCellNorth(northTunneler);
        if (northTunnelerNorthCell) {
          northTunneler.link(northTunnelerNorthCell, DirectedCellLink.NORTH);
        }
        run = [];
      } else {
        cell.link(cellEast, DirectedCellLink.EAST);
      }
    }
  }
}

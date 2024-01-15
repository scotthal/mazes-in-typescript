import { Cell, DirectedCellLink } from "./cell";
import { Coordinate } from "./coordinate";

export class Grid {
  cells: Cell[];
  constructor(public rows: number, public columns: number) {
    if (rows <= 0 || columns <= 0) {
      throw new Error(`Invalid dimension rows=${rows} columns=${columns}`);
    }
    this.cells = [];
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < columns; x++) {
        this.cells.push(new Cell(new Coordinate(x, y)));
      }
    }
  }

  getCell(coordinate: Coordinate) {
    if (
      coordinate.x < 0 ||
      coordinate.x >= this.columns ||
      coordinate.y < 0 ||
      coordinate.y >= this.rows
    ) {
      return null;
    }
    return this.cells[coordinate.y * this.columns + coordinate.x];
  }

  getCellNorth(cell: Cell) {
    return this.getCell(
      new Coordinate(cell.coordinate.x, cell.coordinate.y + 1)
    );
  }

  getCellSouth(cell: Cell) {
    return this.getCell(
      new Coordinate(cell.coordinate.x, cell.coordinate.y - 1)
    );
  }

  getCellEast(cell: Cell) {
    return this.getCell(
      new Coordinate(cell.coordinate.x + 1, cell.coordinate.y)
    );
  }

  getCellWest(cell: Cell) {
    return this.getCell(
      new Coordinate(cell.coordinate.x - 1, cell.coordinate.y)
    );
  }

  getCellNeighbors(cell: Cell) {
    const result: Cell[] = [];
    for (let y = -1; y <= 1; y++) {
      for (let x = -1; x <= 1; x++) {
        const currentCoordinate = new Coordinate(
          x + cell.coordinate.x,
          y + cell.coordinate.y
        );
        const possibleCell = this.getCell(currentCoordinate);
        if (possibleCell) {
          result.push(possibleCell);
        }
      }
    }
    return result;
  }

  randomCell() {
    const x = Math.floor(Math.random() * this.columns);
    const y = Math.floor(Math.random() * this.rows);
    const possibleCell = this.getCell(new Coordinate(x, y));
    if (possibleCell) {
      return possibleCell;
    } else {
      throw new Error("I can't trust anything");
    }
  }

  render(ctx: CanvasRenderingContext2D, cellWidth: number, cellHeight: number) {
    for (const cell of this.cells) {
      ctx.beginPath();
      ctx.strokeStyle = "black";
      ctx.lineWidth = 1;
      if (!cell.directedLinks.includes(DirectedCellLink.NORTH)) {
        ctx.moveTo(
          cell.coordinate.x * cellWidth,
          (cell.coordinate.y + 1) * cellHeight
        );
        ctx.lineTo(
          (cell.coordinate.x + 1) * cellWidth,
          (cell.coordinate.y + 1) * cellHeight
        );
      }
      if (!cell.directedLinks.includes(DirectedCellLink.SOUTH)) {
        ctx.moveTo(
          cell.coordinate.x * cellWidth,
          cell.coordinate.y * cellHeight
        );
        ctx.lineTo(
          (cell.coordinate.x + 1) * cellWidth,
          cell.coordinate.y * cellHeight
        );
      }
      if (!cell.directedLinks.includes(DirectedCellLink.EAST)) {
        ctx.moveTo(
          (cell.coordinate.x + 1) * cellWidth,
          cell.coordinate.y * cellHeight
        );
        ctx.lineTo(
          (cell.coordinate.x + 1) * cellWidth,
          (cell.coordinate.y + 1) * cellHeight
        );
      }
      if (!cell.directedLinks.includes(DirectedCellLink.WEST)) {
        ctx.moveTo(
          cell.coordinate.x * cellWidth,
          cell.coordinate.y * cellHeight
        );
        ctx.lineTo(
          cell.coordinate.x * cellWidth,
          (cell.coordinate.y + 1) * cellHeight
        );
      }
      ctx.stroke();
    }
  }
}

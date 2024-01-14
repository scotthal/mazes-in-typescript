import { Cell } from "./cell";
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
}

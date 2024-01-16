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

  getCellIndex(coordinate: Coordinate) {
    return coordinate.y * this.columns + coordinate.x;
  }

  getCellAtIndex(index: number) {
    if (index < 0 || index >= this.cells.length) {
      return null;
    }
    return this.cells[index];
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
    return this.getCellAtIndex(this.getCellIndex(coordinate));
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
    const index = Math.floor(Math.random() * this.cells.length);
    const possibleCell = this.getCellAtIndex(index);
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

  computeDistancesForCell(coordinate: Coordinate) {
    const index = this.getCellIndex(coordinate);
    const root = this.getCellAtIndex(index);
    if (!root) {
      throw new Error("Nothing exists");
    }

    root.distanceByIndex = new Array<number>(this.cells.length);
    root.distanceByIndex = root.distanceByIndex.fill(-1, 0, this.cells.length);
    root.distanceByIndex[index] = 0;
    const todo: number[] = [];
    for (const linkCoordinate of root.links) {
      const linkIndex = this.getCellIndex(linkCoordinate);
      root.distanceByIndex[linkIndex] = 1;
      todo.push(linkIndex);
    }

    while (todo.length > 0) {
      const currentIndex = todo.pop();
      if (currentIndex === undefined) {
        break;
      }
      const currentCell = this.getCellAtIndex(currentIndex);
      if (currentCell === null) {
        continue;
      }
      for (const linkCoordinate of currentCell.links) {
        const linkIndex = this.getCellIndex(linkCoordinate);
        if (root.distanceByIndex[linkIndex] != -1) {
          continue;
        }
        root.distanceByIndex[linkIndex] =
          root.distanceByIndex[currentIndex] + 1;
        todo.push(linkIndex);
      }
    }
  }
}

import { Cell, DirectedCellLink } from "./cell";
import { Coordinate } from "./coordinate";

export type GridStringContentProvider = (coordinate: Coordinate) => string;

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

  toString(
    contentProvider: GridStringContentProvider = (_coordinate: Coordinate) => ""
  ) {
    let result = "";
    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.columns; x++) {
        const cell = this.getCell(new Coordinate(x, y));
        if (!cell) {
          throw new Error("Nonexistent cell in grid");
        }
        result += "+";
        if (y === 0 || !cell.directedLinks.includes(DirectedCellLink.SOUTH)) {
          result += "---";
        } else {
          result += "   ";
        }
      }
      result += "+\n";
      for (let x = 0; x < this.columns; x++) {
        const cell = this.getCell(new Coordinate(x, y));
        if (!cell) {
          throw new Error("Nonexistent cell in grid.");
        }
        if (x === 0) {
          result += "|";
        }
        const content = contentProvider(cell.coordinate);
        for (let i = 0; i < 3 - content.length; i++) {
          result += " ";
        }
        result += `${content}`;
        if (
          x === this.columns - 1 ||
          !cell.directedLinks.includes(DirectedCellLink.EAST)
        ) {
          result += "|";
        } else {
          result += " ";
        }
      }
      result += "\n";
    }
    for (let x = 0; x < this.columns; x++) {
      result += "+---";
    }
    result += "+\n";

    return result;
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

  computeDistancesForCellIndex(index: number) {
    const root = this.getCellAtIndex(index);
    if (!root) {
      throw new Error("Nothing exists");
    }

    if (root.distanceByIndex.length === this.cells.length) {
      return;
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

    return root.distanceByIndex;
  }

  computeDistancesForCell(coordinate: Coordinate) {
    const index = this.getCellIndex(coordinate);
    return this.computeDistancesForCellIndex(index);
  }

  toDistanceString(coordinate: Coordinate) {
    this.computeDistancesForCell(coordinate);
    const root = this.getCell(coordinate);
    if (!root) {
      return "";
    }
    return this.toString((coordinate: Coordinate) => {
      const index = this.getCellIndex(coordinate);
      return `${root.distanceByIndex[index]}`;
    });
  }

  computePathForIndices(rootIndex: number, originIndex: number) {
    this.computeDistancesForCellIndex(rootIndex);
    const root = this.getCellAtIndex(rootIndex);
    if (!root) {
      throw new Error("No cell at root coordinate");
    }

    const distanceByIndex = root.distanceByIndex;

    let currentIndex = originIndex;

    const breadcrumbs = new Array<number>(this.cells.length);
    breadcrumbs.fill(-1, 0, breadcrumbs.length);
    breadcrumbs[currentIndex] = distanceByIndex[currentIndex];

    while (currentIndex != rootIndex) {
      const currentCell = this.getCellAtIndex(currentIndex);
      if (!currentCell) {
        throw new Error("Grid appears corrupt");
      }
      for (const neighbor of currentCell.links) {
        const neighborIndex = this.getCellIndex(neighbor);
        if (distanceByIndex[neighborIndex] < distanceByIndex[currentIndex]) {
          breadcrumbs[neighborIndex] = distanceByIndex[neighborIndex];
          currentIndex = neighborIndex;
          break;
        }
      }
    }
    return breadcrumbs;
  }

  computePath(rootCoordinate: Coordinate, originCoordinate: Coordinate) {
    const rootIndex = this.getCellIndex(rootCoordinate);
    const originIndex = this.getCellIndex(originCoordinate);

    return this.computePathForIndices(rootIndex, originIndex);
  }

  toPathString(path: number[]) {
    return this.toString((coordinate: Coordinate) => {
      const index = this.getCellIndex(coordinate);
      return path[index] === -1 ? "" : `${path[index]}`;
    });
  }

  findMaxDistance(rootIndex: number) {
    const root = this.getCellAtIndex(rootIndex);
    if (!root) {
      throw new Error("Invalid root coordinate");
    }

    let maxDistance = -1;
    let maxDistanceIndex = -1;
    for (let i = 0; i < root.distanceByIndex.length; i++) {
      if (root.distanceByIndex[i] > maxDistance) {
        maxDistance = root.distanceByIndex[i];
        maxDistanceIndex = i;
      }
    }
    return [maxDistanceIndex, maxDistance];
  }

  longestPath(rootCoordinate: Coordinate) {
    const rootIndex = this.getCellIndex(rootCoordinate);
    this.computeDistancesForCellIndex(rootIndex);
    const [startIndex, _rootMaxDistance] = this.findMaxDistance(rootIndex);
    this.computeDistancesForCellIndex(startIndex);
    const [goalIndex, _goalDistance] = this.findMaxDistance(startIndex);
    return this.computePathForIndices(startIndex, goalIndex);
  }

  private backgroundColorForDistance(distance: number, maxDistance: number) {
    const intensity = (maxDistance - distance) / maxDistance;
    const dark = Math.floor(255 * intensity);
    const bright = Math.floor(128 + 127 * intensity);
    return `rgb(${dark}, ${bright}, ${dark})`;
  }

  renderBackgroundColors(
    ctx: CanvasRenderingContext2D,
    cellWidth: number,
    cellHeight: number,
    distanceByIndex: number[],
    maxDistance: number
  ) {
    for (let index = 0; index < this.cells.length; index++) {
      ctx.save();
      ctx.beginPath();
      ctx.fillStyle = this.backgroundColorForDistance(
        distanceByIndex[index],
        maxDistance
      );
      ctx.fillRect(
        this.cells[index].coordinate.x * cellWidth,
        this.cells[index].coordinate.y * cellHeight,
        cellWidth,
        cellHeight
      );
      ctx.restore();
    }
  }
}

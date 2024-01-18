import { Cell, DirectedCellLink } from "./cell";

export type GridStringContentProvider = (x: number, y: number) => string;

export interface PathInformation {
  distanceByIndex: number[];
  orderedIndices: number[];
}

export class Grid {
  cells: Cell[];
  constructor(public rows: number, public columns: number) {
    if (rows <= 0 || columns <= 0) {
      throw new Error(`Invalid dimension rows=${rows} columns=${columns}`);
    }
    this.cells = [];
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < columns; x++) {
        this.cells.push(new Cell(x, y));
      }
    }
  }

  getCellIndex(x: number, y: number) {
    return y * this.columns + x;
  }

  getCellAtIndex(index: number) {
    if (index < 0 || index >= this.cells.length) {
      return null;
    }
    return this.cells[index];
  }

  getCell(x: number, y: number) {
    if (x < 0 || x >= this.columns || y < 0 || y >= this.rows) {
      return null;
    }
    return this.getCellAtIndex(this.getCellIndex(x, y));
  }

  getCellNorth(cell: Cell) {
    return this.getCell(cell.x, cell.y + 1);
  }

  getCellSouth(cell: Cell) {
    return this.getCell(cell.x, cell.y - 1);
  }

  getCellEast(cell: Cell) {
    return this.getCell(cell.x + 1, cell.y);
  }

  getCellWest(cell: Cell) {
    return this.getCell(cell.x - 1, cell.y);
  }

  getCellNeighbors(cell: Cell) {
    const result: Cell[] = [];
    for (let y = -1; y <= 1; y++) {
      for (let x = -1; x <= 1; x++) {
        const possibleCell = this.getCell(x + cell.x, y + cell.y);
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
      throw new Error("Nonexistent cell in grid");
    }
  }

  toString(contentProvider: GridStringContentProvider = (_x, _y) => "") {
    let result = "";
    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.columns; x++) {
        const cell = this.getCell(x, y);
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
        const cell = this.getCell(x, y);
        if (!cell) {
          throw new Error("Nonexistent cell in grid.");
        }
        if (x === 0) {
          result += "|";
        }
        const content = contentProvider(x, y);
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
        ctx.moveTo(cell.x * cellWidth, (cell.y + 1) * cellHeight);
        ctx.lineTo((cell.x + 1) * cellWidth, (cell.y + 1) * cellHeight);
      }
      if (!cell.directedLinks.includes(DirectedCellLink.SOUTH)) {
        ctx.moveTo(cell.x * cellWidth, cell.y * cellHeight);
        ctx.lineTo((cell.x + 1) * cellWidth, cell.y * cellHeight);
      }
      if (!cell.directedLinks.includes(DirectedCellLink.EAST)) {
        ctx.moveTo((cell.x + 1) * cellWidth, cell.y * cellHeight);
        ctx.lineTo((cell.x + 1) * cellWidth, (cell.y + 1) * cellHeight);
      }
      if (!cell.directedLinks.includes(DirectedCellLink.WEST)) {
        ctx.moveTo(cell.x * cellWidth, cell.y * cellHeight);
        ctx.lineTo(cell.x * cellWidth, (cell.y + 1) * cellHeight);
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
    for (const [linkX, linkY] of root.links) {
      const linkIndex = this.getCellIndex(linkX, linkY);
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
      for (const [linkX, linkY] of currentCell.links) {
        const linkIndex = this.getCellIndex(linkX, linkY);
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

  computeDistancesForCell(x: number, y: number) {
    const index = this.getCellIndex(x, y);
    return this.computeDistancesForCellIndex(index);
  }

  toDistanceString(x: number, y: number) {
    this.computeDistancesForCell(x, y);
    const root = this.getCell(x, y);
    if (!root) {
      return "";
    }
    return this.toString((x, y) => {
      const index = this.getCellIndex(x, y);
      return `${root.distanceByIndex[index]}`;
    });
  }

  computePathForIndices(rootIndex: number, originIndex: number) {
    this.computeDistancesForCellIndex(rootIndex);
    const root = this.getCellAtIndex(rootIndex);
    if (!root) {
      throw new Error("No cell at root location");
    }

    const distanceByIndex = root.distanceByIndex;

    let currentIndex = originIndex;

    const breadcrumbs = new Array<number>(this.cells.length);
    breadcrumbs.fill(-1, 0, breadcrumbs.length);
    breadcrumbs[currentIndex] = distanceByIndex[currentIndex];
    const orderedIndices = [];
    orderedIndices.push(currentIndex);

    while (currentIndex != rootIndex) {
      const currentCell = this.getCellAtIndex(currentIndex);
      if (!currentCell) {
        throw new Error("Grid appears corrupt");
      }
      for (const [neighborX, neighborY] of currentCell.links) {
        const neighborIndex = this.getCellIndex(neighborX, neighborY);
        if (distanceByIndex[neighborIndex] < distanceByIndex[currentIndex]) {
          breadcrumbs[neighborIndex] = distanceByIndex[neighborIndex];
          currentIndex = neighborIndex;
          orderedIndices.push(currentIndex);
          break;
        }
      }
    }
    return {
      distanceByIndex: breadcrumbs,
      orderedIndices: orderedIndices,
    } as PathInformation;
  }

  computePath(rootX: number, rootY: number, originX: number, originY: number) {
    const rootIndex = this.getCellIndex(rootX, rootY);
    const originIndex = this.getCellIndex(originX, originY);

    return this.computePathForIndices(rootIndex, originIndex);
  }

  toPathString(path: number[]) {
    return this.toString((x, y) => {
      const index = this.getCellIndex(x, y);
      return path[index] === -1 ? "" : `${path[index]}`;
    });
  }

  renderOrderedIndexPath(
    ctx: CanvasRenderingContext2D,
    cellWidth: number,
    cellHeight: number,
    orderedIndices: number[]
  ) {
    const halfCellWidth = Math.floor(cellWidth / 2);
    const halfCellHeight = Math.floor(cellHeight / 2);

    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = "red";
    ctx.lineWidth = Math.min(0.1 * cellWidth, 0.2 * cellHeight);
    ctx.moveTo(
      this.cells[orderedIndices[0]].x * cellWidth + halfCellWidth,
      this.cells[orderedIndices[0]].y * cellHeight + halfCellHeight
    );
    for (const index of orderedIndices) {
      ctx.lineTo(
        this.cells[index].x * cellWidth + halfCellWidth,
        this.cells[index].y * cellHeight + halfCellHeight
      );
    }
    ctx.stroke();
    ctx.restore();
  }

  findMaxDistance(rootIndex: number) {
    const root = this.getCellAtIndex(rootIndex);
    if (!root) {
      throw new Error("Invalid root location");
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

  longestPath(rootX: number, rootY: number) {
    const rootIndex = this.getCellIndex(rootX, rootY);
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
        this.cells[index].x * cellWidth,
        this.cells[index].y * cellHeight,
        cellWidth,
        cellHeight
      );
      ctx.restore();
    }
  }
}

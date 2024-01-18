export enum DirectedCellLink {
  NORTH,
  SOUTH,
  EAST,
  WEST,
}

export function oppositeDirection(direction: DirectedCellLink) {
  switch (direction) {
    case DirectedCellLink.NORTH:
      return DirectedCellLink.SOUTH;
    case DirectedCellLink.SOUTH:
      return DirectedCellLink.NORTH;
    case DirectedCellLink.EAST:
      return DirectedCellLink.WEST;
    case DirectedCellLink.WEST:
      return DirectedCellLink.EAST;
  }
}

export class Cell {
  links: [number, number][] = [];
  directedLinks: DirectedCellLink[] = [];
  distanceByIndex: number[] = [];
  constructor(public x: number, public y: number) {}

  private linkInternal(x: number, y: number, direction: DirectedCellLink) {
    this.links.push([x, y]);
    this.directedLinks.push(direction);
  }

  link(cell: Cell, direction: DirectedCellLink) {
    this.linkInternal(cell.x, cell.y, direction);
    cell.linkInternal(this.x, this.y, oppositeDirection(direction));
  }

  private unlinkInternal(x: number, y: number, direction: DirectedCellLink) {
    this.links = this.links.filter(([linkX, linkY]) => {
      linkX !== x && linkY !== y;
    });
    this.directedLinks = this.directedLinks.filter((linkDirection) => {
      linkDirection !== direction;
    });
  }

  unlink(cell: Cell, direction: DirectedCellLink) {
    this.unlinkInternal(cell.x, cell.y, direction);
    cell.unlinkInternal(this.x, this.y, oppositeDirection(direction));
  }

  neighborDirection(cell: Cell) {
    if (cell.x === this.x && cell.y === this.y + 1) {
      return DirectedCellLink.NORTH;
    } else if (cell.x === this.x && cell.y === this.y - 1) {
      return DirectedCellLink.SOUTH;
    } else if (cell.x === this.x + 1 && cell.y === this.y) {
      return DirectedCellLink.EAST;
    } else if (cell.x === this.x - 1 && cell.y === this.y) {
      return DirectedCellLink.WEST;
    } else {
      return null;
    }
  }
}

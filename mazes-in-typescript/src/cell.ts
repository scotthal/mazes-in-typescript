import { Coordinate } from "./coordinate";

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
  links: Coordinate[] = [];
  directedLinks: DirectedCellLink[] = [];
  distanceByIndex: number[] = [];
  constructor(public coordinate: Coordinate) {}

  private linkInternal(coordinate: Coordinate, direction: DirectedCellLink) {
    this.links.push(coordinate);
    this.directedLinks.push(direction);
  }

  link(cell: Cell, direction: DirectedCellLink) {
    this.linkInternal(cell.coordinate, direction);
    cell.linkInternal(this.coordinate, oppositeDirection(direction));
  }

  private unlinkInternal(coordinate: Coordinate, direction: DirectedCellLink) {
    this.links = this.links.filter((link) => {
      link.x !== coordinate.x && link.y !== coordinate.y;
    });
    this.directedLinks = this.directedLinks.filter((linkDirection) => {
      linkDirection !== direction;
    });
  }

  unlink(cell: Cell, direction: DirectedCellLink) {
    this.unlinkInternal(cell.coordinate, direction);
    cell.unlinkInternal(this.coordinate, oppositeDirection(direction));
  }
}

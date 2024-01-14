import { Coordinate } from "./coordinate";

export class Cell {
  links: Coordinate[] = [];
  constructor(public coordinate: Coordinate) {}

  private linkInternal(coordinate: Coordinate) {
    this.links.push(coordinate);
  }

  link(cell: Cell) {
    this.linkInternal(cell.coordinate);
    cell.linkInternal(this.coordinate);
  }

  private unlinkInternal(coordinate: Coordinate) {
    this.links = this.links.filter((link) => {
      link.x !== coordinate.x && link.y !== coordinate.y;
    });
  }

  unlink(cell: Cell) {
    this.unlinkInternal(cell.coordinate);
    cell.unlinkInternal(this.coordinate);
  }
}

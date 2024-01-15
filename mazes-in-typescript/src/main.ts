import "./style.css";

import { DirectedCellLink } from "./cell";
import { Grid } from "./grid";
import { Coordinate } from "./coordinate";

const app = document.querySelector("#app")! as HTMLDivElement;
const canvas = document.createElement("canvas") as HTMLCanvasElement;
app.appendChild(canvas);

const ctx = canvas.getContext("2d")!;

const grid = new Grid(9, 9);
const firstCell = grid.getCell(new Coordinate(2, 2));
const secondCell = grid.getCell(new Coordinate(2, 3));
const thirdCell = grid.getCell(new Coordinate(3, 2));
const fourthCell = grid.getCell(new Coordinate(4, 2));
const fifthCell = grid.getCell(new Coordinate(1, 2));
const sixthCell = grid.getCell(new Coordinate(2, 1));
if (
  firstCell &&
  secondCell &&
  thirdCell &&
  fourthCell &&
  fifthCell &&
  sixthCell
) {
  firstCell.link(secondCell, DirectedCellLink.NORTH);
  firstCell.link(thirdCell, DirectedCellLink.EAST);
  thirdCell.link(fourthCell, DirectedCellLink.EAST);
  firstCell.link(fifthCell, DirectedCellLink.WEST);
  firstCell.link(sixthCell, DirectedCellLink.SOUTH);
}

function animate() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  grid.render(ctx, canvas.width / grid.columns, canvas.height / grid.rows);

  window.requestAnimationFrame(animate);
}

animate();

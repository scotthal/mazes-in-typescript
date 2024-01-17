import "./style.css";

import { Coordinate } from "./coordinate";
import { Grid } from "./grid";
import { sidewinder } from "./sidewinder";

const app = document.querySelector("#app")! as HTMLDivElement;
const canvas = document.createElement("canvas") as HTMLCanvasElement;
app.appendChild(canvas);

const ctx = canvas.getContext("2d")!;

const grid = new Grid(25, 25);
const rootCoordinate = new Coordinate(12, 12);
sidewinder(grid);
const distanceByIndex = grid.computeDistancesForCell(rootCoordinate);
if (!distanceByIndex) {
  throw new Error("Couldn't calculate cell distances");
}
const maxDistance = Math.max(...distanceByIndex);

const { distanceByIndex: _, orderedIndices: longestPathOrderedIndices } =
  grid.longestPath(rootCoordinate);

function animate() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const cellWidth = canvas.width / grid.columns;
  const cellHeight = canvas.height / grid.rows;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (distanceByIndex) {
    grid.renderBackgroundColors(
      ctx,
      cellWidth,
      cellHeight,
      distanceByIndex,
      maxDistance
    );
  }
  grid.renderOrderedIndexPath(
    ctx,
    cellWidth,
    cellHeight,
    longestPathOrderedIndices
  );
  grid.render(ctx, cellWidth, cellHeight);

  window.requestAnimationFrame(animate);
}

animate();

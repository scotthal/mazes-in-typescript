import "./style.css";

import { wilson } from "./wilson";
import { Grid } from "./grid";

const app = document.querySelector("#app")! as HTMLDivElement;
const canvas = document.createElement("canvas") as HTMLCanvasElement;
app.appendChild(canvas);

const ctx = canvas.getContext("2d")!;

const grid = new Grid(25, 25);
const rootX = 12;
const rootY = 12;
wilson(grid);
const distanceByIndex = grid.computeDistancesForCell(rootX, rootY);
if (!distanceByIndex) {
  throw new Error("Couldn't calculate cell distances");
}
const maxDistance = Math.max(...distanceByIndex);

const { distanceByIndex: _, orderedIndices: longestPathOrderedIndices } =
  grid.longestPath(rootX, rootY);

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

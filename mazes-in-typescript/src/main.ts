import "./style.css";

import { Grid } from "./grid";
import { sidewinder } from "./sidewinder";

const app = document.querySelector("#app")! as HTMLDivElement;
const canvas = document.createElement("canvas") as HTMLCanvasElement;
app.appendChild(canvas);

const ctx = canvas.getContext("2d")!;

const grid = new Grid(30, 50);
sidewinder(grid);

function animate() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  grid.render(ctx, canvas.width / grid.columns, canvas.height / grid.rows);

  window.requestAnimationFrame(animate);
}

animate();

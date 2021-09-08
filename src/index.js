import { createWorld, addEntity, addComponent, pipe } from "bitecs";
import { Position, Velocity } from "./components";
import { movementSystem } from "./systems/movement.system";
import { renderSystem } from "./systems/render.system";

import { addSprite } from "./canvas";

const world = createWorld();
world.sprites = [];

const heroEid = addEntity(world);
addComponent(world, Position, heroEid);

addSprite({
  texture: "hero.png",
  world,
  eid: heroEid,
  options: {
    x: 100,
    y: 100,
    anchor: {
      x: 0.5,
      y: 0.5,
    },
    scale: {
      x: 0.25,
      y: 0.25,
    },
  },
});

const pipeline = pipe(movementSystem, renderSystem);

function gameLoop() {
  pipeline(world);
  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);

document.addEventListener("keydown", (ev) => {
  userInput = ev.key;

  if (userInput === "ArrowUp") {
    addComponent(world, Velocity, 0);
    Velocity.y[0] -= 16;
  }
  if (userInput === "ArrowRight") {
    addComponent(world, Velocity, 0);
    Velocity.x[0] += 16;
  }
  if (userInput === "ArrowDown") {
    addComponent(world, Velocity, 0);
    Velocity.y[0] += 16;
  }
  if (userInput === "ArrowLeft") {
    addComponent(world, Velocity, 0);
    Velocity.x[0] -= 16;
  }
});

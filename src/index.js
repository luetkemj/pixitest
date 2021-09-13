import { addComponent, addEntity, createWorld, pipe } from "bitecs";
import {
  Blocking,
  Fov,
  Opaque,
  Position,
  Render,
  Velocity,
} from "./components";
import { fovSystem } from "./systems/fov.system";
import { movementSystem } from "./systems/movement.system";
import { renderSystem } from "./systems/render.system";
import { addSprite } from "./lib/canvas";
import { buildDungeon } from "./lib/dungeon";
import { updatePosition } from "./lib/ecsHelpers";

const world = createWorld();
world.sprites = [];

const dungeon = buildDungeon({ x: 0, y: 0, width: 100, height: 34 });

Object.values(dungeon.tiles).forEach((tile) => {
  const eid = addEntity(world);
  addComponent(world, Position, eid);
  addComponent(world, Render, eid);

  if (tile.sprite === "WALL") {
    addComponent(world, Blocking, eid);
    addComponent(world, Opaque, eid);
  }

  updatePosition({ world, newPos: { x: tile.x, y: tile.y, z: 0 }, eid });

  const textures = {
    FLOOR: "tiles/floor/floor_10.png",
    WALL: "tiles/wall/wall_1.png",
  };

  addSprite({
    texture: textures[tile.sprite],
    world,
    eid: eid,
  });
});

world.hero = addEntity(world);

addComponent(world, Position, world.hero);
addComponent(world, Render, world.hero);
addComponent(world, Fov, world.hero);

const startPos = dungeon.rooms[0].center;
updatePosition({
  world,
  newPos: { x: startPos.x, y: startPos.y, z: 0 },
  eid: world.hero,
});

addSprite({
  texture: "heroes/knight/knight_idle_anim_f0.png",
  world,
  eid: world.hero,
});

const pipeline = pipe(movementSystem, fovSystem, renderSystem);

let pause = false;

function gameLoop() {
  if (!pause) {
    pipeline(world);
    pause = true;
  }
  requestAnimationFrame(gameLoop);
}

gameLoop();

document.addEventListener("keydown", (ev) => {
  userInput = ev.key;
  pause = false;

  if (userInput === "ArrowUp") {
    addComponent(world, Velocity, world.hero);
    Velocity.y[world.hero] -= 1;
  }
  if (userInput === "ArrowRight") {
    addComponent(world, Velocity, world.hero);
    Velocity.x[world.hero] += 1;
  }
  if (userInput === "ArrowDown") {
    addComponent(world, Velocity, world.hero);
    Velocity.y[world.hero] += 1;
  }
  if (userInput === "ArrowLeft") {
    addComponent(world, Velocity, world.hero);
    Velocity.x[world.hero] -= 1;
  }
});

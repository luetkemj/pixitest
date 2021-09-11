import { createWorld, addEntity, addComponent, pipe } from "bitecs";
import { Blocking, Position, Render, Velocity } from "./components";
import { movementSystem } from "./systems/movement.system";
import { renderSystem } from "./systems/render.system";
import { addSprite } from "./lib/canvas";
import { buildDungeon } from "./lib/dungeon";

const world = createWorld();
world.sprites = [];

const dungeon = buildDungeon({ x: 0, y: 0, width: 100, height: 34 });

Object.values(dungeon.tiles).forEach((tile) => {
  const eid = addEntity(world);
  addComponent(world, Position, eid);
  addComponent(world, Render, eid);

  if (tile.sprite === "WALL") {
    addComponent(world, Blocking, eid);
  }

  Position.x[eid] = tile.x;
  Position.y[eid] = tile.y;

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

Position.x[world.hero] = dungeon.rooms[0].center.x;
Position.y[world.hero] = dungeon.rooms[0].center.y;

addSprite({
  texture: "heroes/knight/knight_idle_anim_f0.png",
  world,
  eid: world.hero,
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

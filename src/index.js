import { createWorld, addEntity, addComponent, pipe } from "bitecs";
import { Blocking, Position, Velocity } from "./components";
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
  if (tile.sprite === "WALL") {
    addComponent(world, Blocking, eid);
  }

  const textures = {
    FLOOR: "tiles/floor/floor_10.png",
    WALL: "tiles/wall/wall_1.png",
  };

  addSprite({
    texture: textures[tile.sprite],
    world,
    eid: eid,
    options: {
      x: tile.x * 16,
      y: tile.y * 16,
      anchor: {
        x: 0.5,
        y: 0.5,
      },
    },
  });
});

const hero = addEntity(world);

addComponent(world, Position, hero);
world.hero = hero;

Position.x[hero] = dungeon.rooms[0].center.x;
Position.y[hero] = dungeon.rooms[0].center.y;

addSprite({
  texture: "hero.png",
  world,
  eid: hero,
  options: {
    x: dungeon.rooms[0].center.x * 16,
    y: dungeon.rooms[0].center.y * 16,
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
    addComponent(world, Velocity, hero);
    Velocity.y[hero] -= 1;
  }
  if (userInput === "ArrowRight") {
    addComponent(world, Velocity, hero);
    Velocity.x[hero] += 1;
  }
  if (userInput === "ArrowDown") {
    addComponent(world, Velocity, hero);
    Velocity.y[hero] += 1;
  }
  if (userInput === "ArrowLeft") {
    addComponent(world, Velocity, hero);
    Velocity.x[hero] -= 1;
  }
});

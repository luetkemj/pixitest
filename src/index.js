import _ from "lodash";
import { addComponent, addEntity, createWorld, pipe } from "bitecs";
import {
  Blocking,
  Forgettable,
  Fov,
  Health,
  Opaque,
  Position,
  Render,
} from "./components";
import { fovSystem } from "./systems/fov.system";
import { movementSystem } from "./systems/movement.system";
import { renderSystem } from "./systems/render.system";
import { addSprite } from "./lib/canvas";
import { buildDungeon } from "./lib/dungeon";
import { updatePosition } from "./lib/ecsHelpers";
import { processUserInput } from "./lib/userInput";

// create the world
const world = createWorld();
world.sprites = [];
world.gameState = "GAME";
world.turn = "WORLD";

// create the dungeon
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

// create the hero
world.hero = addEntity(world);
addComponent(world, Position, world.hero);
addComponent(world, Render, world.hero);
addComponent(world, Fov, world.hero);
addComponent(world, Health, world.hero);

Health.max[world.hero] = 10;
Health.current[world.hero] = 10;

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

// spawn baddies
const openTiles = _.filter(dungeon.tiles, (tile) => tile.sprite === "FLOOR");
_.times(10, () => {
  const eid = addEntity(world);
  addComponent(world, Position, eid);
  addComponent(world, Render, eid);
  addComponent(world, Blocking, eid);
  addComponent(world, Forgettable, eid);
  addComponent(world, Health, eid);

  Health.max[eid] = 10;
  Health.current[eid] = 10;

  const { x, y } = _.sample(openTiles);

  updatePosition({
    world,
    newPos: { x, y, z: 0 },
    eid: eid,
  });

  addSprite({
    texture: "enemies/goblin/goblin_idle_anim_f0.png",
    world,
    eid: eid,
  });
});

// run the game
const pipelinePlayerTurn = pipe(movementSystem, fovSystem, renderSystem);

function gameLoop() {
  if (world.userInput && world.turn === "PLAYER") {
    processUserInput(world);
    pipelinePlayerTurn(world);
    world.turn = "WORLD";
  }

  if (world.turn === "WORLD") {
    pipelinePlayerTurn(world);
    world.turn = "PLAYER";
  }

  requestAnimationFrame(gameLoop);
}

gameLoop();

document.addEventListener("keydown", (ev) => {
  world.userInput = ev.key;
});

import _ from "lodash";
import { createWorld, pipe } from "bitecs";

import { createHero } from "./prefabs/hero";
import { createGoblin } from "./prefabs/goblin";
import { createFloor } from "./prefabs/floor";
import { createWall } from "./prefabs/wall";

import { aiSystem } from "./systems/ai.system";
import { debugSystem } from "./systems/debug.system";
import { fovSystem } from "./systems/fov.system";
import { movementSystem } from "./systems/movement.system";
import { renderSystem } from "./systems/render.system";

import { buildDungeon } from "./lib/dungeon";
import { processUserInput } from "./lib/userInput";

// create the world
const world = createWorld();
world.sprites = [];
world.meta = [];
world.gameState = "GAME";
world.turn = "WORLD";
world.debug = false;

// create the dungeon
const dungeon = buildDungeon({ x: 0, y: 0, width: 100, height: 34 });

Object.values(dungeon.tiles).forEach((tile) => {
  if (tile.sprite === "WALL") {
    const { x, y } = tile;
    createWall(world, { x, y, z: 0 });
  }
  if (tile.sprite === "FLOOR") {
    const { x, y } = tile;
    createFloor(world, { x, y, z: 0 });
  }
});

// create the hero
createHero(world, {
  x: dungeon.rooms[0].center.x,
  y: dungeon.rooms[0].center.y,
  z: 0,
});

// spawn baddies
const openTiles = _.filter(dungeon.tiles, (tile) => tile.sprite === "FLOOR");
_.times(10, () => {
  const { x, y } = _.sample(openTiles);
  createGoblin(world, { x, y, z: 0 });
});

// run the game
const pipelinePlayerTurn = pipe(movementSystem, fovSystem, renderSystem);
const pipelineWorldTurn = pipe(
  aiSystem,
  movementSystem,
  fovSystem,
  renderSystem
);
const debugPipeline = pipe(debugSystem);

function gameLoop() {
  if (world.userInput && world.turn === "PLAYER") {
    processUserInput(world);
    pipelinePlayerTurn(world);
    debugPipeline(world);
    world.turn = "WORLD";
  }

  if (world.turn === "WORLD") {
    pipelineWorldTurn(world);
    debugPipeline(world);
    world.turn = "PLAYER";
  }

  requestAnimationFrame(gameLoop);
}

gameLoop();

document.addEventListener("keydown", (ev) => {
  world.userInput = ev.key;
});

document.querySelector("#debug").addEventListener("click", () => {
  world.debug = !world.debug;

  if (!world.debug) {
    world.RESETTING_DEBUG = true;
  }
});

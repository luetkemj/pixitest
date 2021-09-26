import * as PIXI from "pixi.js";
import _ from "lodash";
import { pipe } from "bitecs";

import { aiSystem } from "./systems/ai.system";
import { debugSystem } from "./systems/debug.system";
import { fovSystem } from "./systems/fov.system";
import { movementSystem } from "./systems/movement.system";
import { renderSystem } from "./systems/render.system";

import { processUserInput } from "./lib/userInput";

import { initWorld } from "./lib/initWorld";
import { loadSprites } from "./lib/canvas";

// pixi loader load all the sprites and initialize game
const loader = loadSprites(initGame);

function initGame() {
  const { world } = initWorld(loader);
  world.loader = loader;

  const pipelinePlayerTurn = pipe(movementSystem, fovSystem, renderSystem);
  const pipelineWorldTurn = pipe(
    aiSystem,
    movementSystem,
    fovSystem,
    renderSystem
  );
  const debugPipeline = pipe(debugSystem);

  function gameLoop() {
    if (world.gameState === "GAMEOVER") {
      console.log("GAME OVER");
      return;
    }

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
}

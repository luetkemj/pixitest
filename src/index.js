import _ from "lodash";
import { pipe } from "bitecs";

import { aiSystem } from "./systems/ai.system";
import { debugSystem } from "./systems/debug.system";
import { fovSystem } from "./systems/fov.system";
import { gameOverSystem } from "./systems/gameOver.system";
import { movementSystem } from "./systems/movement.system";
import { renderSystem } from "./systems/render.system";
import { userInputSystem } from "./systems/userInput.system";

import { processUserInput } from "./lib/userInput";

import { initWorld } from "./lib/initWorld";
import { loadSprites, initUi } from "./lib/canvas";

// pixi loader load all the sprites and initialize game
const loader = loadSprites(initGame);

let mode = "GAME";
const setMode = (str) => (mode = str);
const getMode = () => mode;

function initGame() {
  const { world } = initWorld(loader);
  world.loader = loader;
  world.mode = mode;
  world.getMode = getMode;
  world.setMode = setMode;

  initUi(loader);

  const pipelinePlayerTurn = pipe(
    gameOverSystem,
    userInputSystem,
    movementSystem,
    fovSystem,
    renderSystem
  );
  const pipelineWorldTurn = pipe(
    aiSystem,
    movementSystem,
    fovSystem,
    renderSystem
  );

  const uiPipeline = pipe(userInputSystem, renderSystem);

  const debugPipeline = pipe(debugSystem);

  // set up for FPS
  let fps = 0;
  let now = null;
  let fpsSamples = [];
  const fpsEl = document.querySelector("#fps");

  function gameLoop() {
    if (mode === "GAMEOVER") {
      console.log("GAME OVER");
      return;
    }

    if (world.userInput && ["INVENTORY", "LOG"].includes(mode)) {
      console.log("UI UI UI");
      processUserInput(world);
      uiPipeline(world);
    }

    if (mode === "GAME") {
      if (world.userInput && world.turn === "PLAYER") {
        processUserInput(world);
        pipelinePlayerTurn(world);
        debugPipeline(world);
      }

      if (world.turn === "WORLD") {
        pipelineWorldTurn(world);
        debugPipeline(world);
        world.turn = "PLAYER";
      }
    }

    requestAnimationFrame(gameLoop);

    // calculate frames/second
    if (!now) {
      now = Date.now();
    }
    if (Date.now() - now > 1000) {
      fpsSamples.unshift(fps);
      if (fpsSamples.length > 3) {
        fpsSamples.pop();
      }
      fpsEl.innerHTML = Math.round(_.mean(fpsSamples));

      now = Date.now();
      fps = 0;
    }
    fps++;
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

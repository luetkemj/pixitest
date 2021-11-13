import _ from "lodash";
import { defineQuery, pipe } from "bitecs";
import { PC } from "./components";
import {
  pipelinePlayerTurn,
  pipelineWorldTurn,
  uiPipeline,
  debugPipeline,
} from "./pipelines";

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
  world.looking = null;
  world.inventory = {
    columnIndex: 0,
    inventoryListIndex: 0,
    inReachListIndex: 0,
    selectedItemEid: "",
  };

  initUi(loader);

  // set up for FPS
  let fps = 0;
  let now = null;
  let fpsSamples = [];
  const fpsEl = document.querySelector("#fps");

  const pcQuery = defineQuery([PC]);

  function gameLoop() {
    if (mode === "GAMEOVER") {
      console.log("GAME OVER");
      return;
    }

    if (world.userInput && ["INVENTORY", "LOG", "LOOKING"].includes(mode)) {
      const pcEnts = pcQuery(world);
      world.pcEnts = pcEnts;

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
    world.userInput = ev;
  });

  document.querySelector("#debug").addEventListener("click", () => {
    world.debug = !world.debug;

    if (!world.debug) {
      world.RESETTING_DEBUG = true;
    }
  });
}

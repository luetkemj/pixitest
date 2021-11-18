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

const state = {
  mode: "GAME",
  looking: null,
  inventory: {
    columnIndex: 0,
    inventoryListIndex: 0,
    inReachListIndex: 0,
    selectedItemEid: "",
  },
  world: {},
  pcEnts: [],
  userInput: "",
  turn: "",
  debug: false,
  log: [],
  RESETTING_DEBUG: true,
};

export const setState = (callback) => {
  callback(state);
};

export const getState = () => state;

function initGame() {
  setState((state) => {
    state.world = initWorld(loader).world;
  });

  initUi(loader);

  // set up for FPS
  let fps = 0;
  let now = null;
  let fpsSamples = [];
  const fpsEl = document.querySelector("#fps");

  const pcQuery = defineQuery([PC]);

  function gameLoop() {
    if (getState().mode === "GAMEOVER") {
      console.log("GAME OVER");
      return;
    }

    const { world } = getState();

    if (
      getState().userInput &&
      ["INVENTORY", "LOG", "LOOKING"].includes(getState().mode)
    ) {
      setState((state) => {
        state.pcEnts = pcQuery(world);
      });

      processUserInput(world);
      uiPipeline(world);
    }

    if (getState().mode === "GAME") {
      if (getState().userInput && getState().turn === "PLAYER") {
        processUserInput(world);
        pipelinePlayerTurn(world);
        debugPipeline(world);
      }

      if (getState().turn === "WORLD") {
        pipelineWorldTurn(world);
        debugPipeline(world);
        setState((state) => {
          state.turn = "PLAYER";
        });
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
    setState((state) => {
      state.userInput = ev;
    });
  });

  document.querySelector("#debug").addEventListener("click", () => {
    setState((state) => {
      state.debug = !state.debug;
    });

    const { debug } = getState();

    if (!debug) {
      setState((state) => {
        state.RESETTING_DEBUG = true;
      });
    }
  });
}

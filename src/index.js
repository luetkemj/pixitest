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

// pixi loader load all the sprites and initialize game
const loader = PIXI.Loader.shared; // PixiJS exposes a premade instance for you to use.

loader
  .add("static/fonts/courier-prime-regular.json")
  .add("floor", "static/tiles/floor/floor_10.png")
  .add("wall", "static/tiles/wall/wall_1.png")
  .add("hero", "static/heroes/knight/knight_idle_anim_f0.png")
  .add("goblin", "static/enemies/goblin/goblin_idle_anim_f0.png")
  .add("corpse", "static/effects/enemy_afterdead_explosion_anim_f2.png")
  .load(setup);

function setup() {
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

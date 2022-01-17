import { pipe } from "bitecs";
import { aiSystem } from "./systems/ai.system";
import { debugSystem } from "./systems/debug.system";
import { fovSystem } from "./systems/fov.system";
import { gameOverSystem } from "./systems/gameOver.system";
import { movementSystem } from "./systems/movement.system";
import { renderSystem } from "./systems/render.system";
import { userInputSystem } from "./systems/userInput.system";

export const pipelineFovRender = pipe(fovSystem, renderSystem);

export const pipelinePlayerTurn = pipe(
  gameOverSystem,
  userInputSystem,
  movementSystem,
  fovSystem,
  renderSystem
);

export const pipelineWorldTurn = pipe(
  // aiSystem has some sort of SLOOOOOOW down. Looks like aStar. (time to look at dikstra?)
  aiSystem,
  movementSystem,
  fovSystem,
  renderSystem
);

export const uiPipeline = pipe(userInputSystem, renderSystem);

export const debugPipeline = pipe(debugSystem);

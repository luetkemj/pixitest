import { pipe } from "../dist/pkg/bitecs.js";
import { aiSystem } from "./systems/ai.system.js";
import { debugSystem } from "./systems/debug.system.js";
import { fovSystem } from "./systems/fov.system.js";
import { gameOverSystem } from "./systems/gameOver.system.js";
import { movementSystem } from "./systems/movement.system.js";
import { renderSystem } from "./systems/render.system.js";
import { userInputSystem } from "./systems/userInput.system.js";

export const pipelineFovRender = pipe(fovSystem, renderSystem);

export const pipelinePlayerTurn = pipe(
  gameOverSystem,
  userInputSystem,
  movementSystem,
  fovSystem,
  renderSystem
);

export const pipelineWorldTurn = pipe(
  aiSystem,
  movementSystem,
  fovSystem,
  renderSystem
);

export const uiPipeline = pipe(userInputSystem, renderSystem);

export const debugPipeline = pipe(debugSystem);

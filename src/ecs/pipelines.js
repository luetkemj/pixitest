import { pipe } from "bitecs";
import { aiSystem } from "./systems/ai.system";
import { debugSystem } from "./systems/debug.system";
import { burningSystem } from "./systems/burning.system";
import { fovSystem } from "./systems/fov.system";
import { gameOverSystem } from "./systems/gameOver.system";
import { movementSystem } from "./systems/movement.system";
import { lightingSystem } from "./systems/lighting.system";
import { renderSystem } from "./systems/render.system";
import { userInputSystem } from "./systems/userInput.system";

export const pipelineFovRender = pipe(lightingSystem, fovSystem, renderSystem);

export const pipelinePlayerTurn = pipe(
  gameOverSystem,
  userInputSystem,
  movementSystem,
  burningSystem,
  lightingSystem,
  fovSystem,
  renderSystem
);

export const pipelineWorldTurn = pipe(
  aiSystem,
  movementSystem,
  burningSystem,
  lightingSystem,
  fovSystem,
  renderSystem
);

export const uiPipeline = pipe(userInputSystem, renderSystem);

export const debugPipeline = pipe(debugSystem);

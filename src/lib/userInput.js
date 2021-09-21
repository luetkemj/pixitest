import { addComponent } from "../../_snowpack/pkg/bitecs.js";
import { MoveTo, Position } from "../components.js";

export const processUserInput = (world) => {
  const { gameState, userInput, hero } = world;

  if (gameState === "GAME") {
    if (userInput === "ArrowUp") {
      addComponent(world, MoveTo, hero);
      MoveTo.x[hero] = Position.x[hero];
      MoveTo.y[hero] = Position.y[hero] - 1;
      MoveTo.z[hero] = Position.z[hero];
    }
    if (userInput === "ArrowRight") {
      addComponent(world, MoveTo, hero);
      MoveTo.x[hero] = Position.x[hero] + 1;
      MoveTo.y[hero] = Position.y[hero];
      MoveTo.z[hero] = Position.z[hero];
    }
    if (userInput === "ArrowDown") {
      addComponent(world, MoveTo, hero);
      MoveTo.x[hero] = Position.x[hero];
      MoveTo.y[hero] = Position.y[hero] + 1;
      MoveTo.z[hero] = Position.z[hero];
    }
    if (userInput === "ArrowLeft") {
      addComponent(world, MoveTo, hero);
      MoveTo.x[hero] = Position.x[hero] - 1;
      MoveTo.y[hero] = Position.y[hero];
      MoveTo.z[hero] = Position.z[hero];
    }
  }

  world.userInput = null;
};

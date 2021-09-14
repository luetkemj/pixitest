import { addComponent } from "bitecs";
import { Velocity } from "../components";

export const processUserInput = (world) => {
  const { gameState, userInput, hero } = world;

  if (gameState === "GAME") {
    if (userInput === "ArrowUp") {
      addComponent(world, Velocity, hero);
      Velocity.y[hero] -= 1;
    }
    if (userInput === "ArrowRight") {
      addComponent(world, Velocity, hero);
      Velocity.x[hero] += 1;
    }
    if (userInput === "ArrowDown") {
      addComponent(world, Velocity, hero);
      Velocity.y[hero] += 1;
    }
    if (userInput === "ArrowLeft") {
      addComponent(world, Velocity, hero);
      Velocity.x[hero] -= 1;
    }
  }

  world.userInput = null;
};

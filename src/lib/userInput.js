import * as actions from "../lib/actions";

const gameplayControls = [
  "ArrowUp",
  "ArrowRight",
  "ArrowDown",
  "ArrowLeft",
  "g",
];

const uiControls = ["I", "L", "Shift"];

export const processUserInput = (world) => {
  const { gameState, userInput, hero } = world;

  if (userInput === "L") {
    world.menuTab = "LOG";
  }

  if (userInput === "I") {
    world.menuTab = "INVENTORY";
  }

  if (gameState === "GAME") {
    if (gameplayControls.includes(userInput)) {
      world.userInput = userInput;
    }

    if (userInput === "g") {
      actions.get(world, hero);
    }
  }

  // update turn
  if (uiControls.includes(userInput)) {
    world.turn = "PLAYER";
  } else {
    world.turn = "WORLD";
  }
};

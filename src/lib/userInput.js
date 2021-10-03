const gameplayControls = [
  "ArrowUp",
  "ArrowRight",
  "ArrowDown",
  "ArrowLeft",
  "g",
];

const uiControls = ["I", "L", "Shift"];

export const processUserInput = (world) => {
  const { gameState, userInput } = world;

  if (userInput === "I") {
    world.menuTab = "INVENTORY";
  }

  if (userInput === "L") {
    world.menuTab = "LOG";
  }

  if (gameState === "GAME") {
    if (gameplayControls.includes(userInput)) {
      world.userInput = userInput;
    }
  }

  // update turn
  if (uiControls.includes(userInput)) {
    world.turn = "PLAYER";
  } else {
    world.turn = "WORLD";
  }
};

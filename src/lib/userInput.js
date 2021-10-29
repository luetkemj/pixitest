const gameplayControls = [
  "ArrowUp",
  "ArrowRight",
  "ArrowDown",
  "ArrowLeft",
  "g",
];

const uiControls = ["Escape", "i", "k", "l", "Shift"];

export const processUserInput = (world) => {
  const { userInput } = world;

  if (userInput === "Escape") {
    world.setMode("GAME");
  }

  if (userInput === "i") {
    world.setMode("INVENTORY");
  }

  if (userInput === "k") {
    world.setMode("LOOKING");
  }

  if (userInput === "l") {
    world.setMode("LOG");
  }

  if (world.getMode() === "GAME") {
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

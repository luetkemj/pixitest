const gameplayControls = [
  "ArrowUp",
  "ArrowRight",
  "ArrowDown",
  "ArrowLeft",
  "g",
];

const uiControls = ["Escape", "i", "k", "l", "Shift"];

const lookingControls = ["ArrowUp", "ArrowRight", "ArrowDown", "ArrowLeft"];

export const processUserInput = (world) => {
  const { userInput } = world;

  const { key } = userInput;

  // Game modes must be used in the gameLoop() to processUserInput and call pipelines.
  // if you don't the game will hang and never process user input
  if (key === "Escape") {
    world.setMode("GAME");
  }

  if (key === "i") {
    world.setMode("INVENTORY");
  }

  if (key === "k") {
    world.setMode("LOOKING");
  }

  if (key === "l") {
    world.setMode("LOG");
  }

  if (["LOOKING"].includes(world.getMode())) {
    if (lookingControls.includes(key)) {
      world.userInput = userInput;
    }
  }

  if (["GAME"].includes(world.getMode())) {
    if (gameplayControls.includes(key)) {
      world.userInput = userInput;
    }
  }

  // update turn
  if (uiControls.includes(key)) {
    world.turn = "PLAYER";
  } else {
    world.turn = "WORLD";
  }
};

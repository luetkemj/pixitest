import { Inventory } from "../components";
import { walkInventoryTree } from "./ecsHelpers";
import { drop } from "./actions";

const gameplayControls = [
  "ArrowUp",
  "ArrowRight",
  "ArrowDown",
  "ArrowLeft",
  "g",
];

const uiControls = ["Escape", "i", "k", "l", "Shift"];

const lookingControls = ["ArrowUp", "ArrowRight", "ArrowDown", "ArrowLeft"];

const inventoryControls = [
  "ArrowUp",
  "ArrowRight",
  "ArrowDown",
  "ArrowLeft",
  "d",
];

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

  if (["INVENTORY"].includes(world.getMode())) {
    if (inventoryControls.includes(key)) {
      world.userInput = userInput;

      // count items in inventory
      const pcEid = world.pcEnts[0];
      let nItems = 0;
      walkInventoryTree(world, pcEid, Inventory, () => {
        nItems++;
      });

      if (key === "ArrowUp") {
        if (world.inventory.inventoryListIndex === 0) {
          world.inventory.inventoryListIndex = nItems - 1;
        } else {
          world.inventory.inventoryListIndex--;
        }
      }

      if (key === "ArrowDown") {
        if (world.inventory.inventoryListIndex === nItems - 1) {
          world.inventory.inventoryListIndex = 0;
        } else {
          world.inventory.inventoryListIndex++;
        }
      }

      if (key === "d") {
        drop(world, pcEid, world.inventory.selectedItemEid);
      }
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
  } else if (uiControls.includes(userInput)) {
    world.turn = "UI";
  } else {
    world.turn = "WORLD";
  }
};

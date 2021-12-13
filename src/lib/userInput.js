import { getState, setState } from "../index";
import { Inventory, Position } from "../components";
import {
  getWielder,
  gettableEntitiesInReach,
  walkInventoryTree,
} from "./ecsHelpers";
import { drop, get, unwield, wield } from "./actions";

const gameplayControls = [
  "ArrowUp",
  "ArrowRight",
  "ArrowDown",
  "ArrowLeft",
  "g",
];

const uiControls = ["Escape", "c", "i", "k", "l", "Shift"];

const lookingControls = ["ArrowUp", "ArrowRight", "ArrowDown", "ArrowLeft"];

const inventoryControls = [
  "ArrowUp",
  "ArrowRight",
  "ArrowDown",
  "ArrowLeft",
  "d", // drop
  "g", // get
  "r", // remove
  "w", // wield
];

export const processUserInput = (world) => {
  const { userInput, mode, pcEnts } = getState();

  const { key } = userInput;

  // Game modes must be used in the gameLoop() to processUserInput and call pipelines.
  // if you don't the game will hang and never process user input
  if (key === "Escape") {
    setState((state) => {
      state.mode = "GAME";
    });
  }

  if (key === "c") {
    setState((state) => {
      state.mode = "CHARACTER_MENU";
    });
  }

  if (key === "i") {
    setState((state) => {
      state.mode = "INVENTORY";
    });
  }

  if (key === "k") {
    setState((state) => {
      state.mode = "LOOKING";
    });
  }

  if (key === "l") {
    setState((state) => {
      state.mode = "LOG";
    });
  }

  if (["LOOKING"].includes(mode)) {
    if (lookingControls.includes(key)) {
      setState((state) => {
        state.userInput = userInput;
      });
    }
  }

  if (["INVENTORY"].includes(mode)) {
    if (inventoryControls.includes(key)) {
      setState((state) => {
        state.userInput = userInput;
      });

      // count items in inventory
      const pcEid = pcEnts[0];
      let nItems = 0;
      walkInventoryTree(world, pcEid, Inventory, () => {
        nItems++;
      });
      // count gettableEntitiesWithinReach
      const currentLocId = `${Position.x[pcEid]},${Position.y[pcEid]},${Position.z[pcEid]}`;
      const entitiesInReach = gettableEntitiesInReach(world, currentLocId);
      const { inventory } = getState();

      if (key === "ArrowUp") {
        if (inventory.columnIndex === 0) {
          if (inventory.inventoryListIndex === 0) {
            setState((state) => {
              state.inventory.inventoryListIndex = nItems - 1;
            });
          } else {
            setState((state) => {
              state.inventory.inventoryListIndex--;
            });
          }
        }

        if (inventory.columnIndex === 2) {
          if (inventory.inReachListIndex === 0) {
            setState((state) => {
              state.inventory.inReachListIndex = entitiesInReach.length - 1;
            });
          } else {
            setState((state) => {
              state.inventory.inReachListIndex--;
            });
          }
        }
      }

      if (key === "ArrowDown") {
        if (inventory.columnIndex === 0) {
          if (inventory.inventoryListIndex === nItems - 1) {
            setState((state) => {
              state.inventory.inventoryListIndex = 0;
            });
          } else {
            setState((state) => {
              state.inventory.inventoryListIndex++;
            });
          }
        }

        if (inventory.columnIndex === 2) {
          if (inventory.inReachListIndex === entitiesInReach.length - 1) {
            setState((state) => {
              state.inventory.inReachListIndex = 0;
            });
          } else {
            setState((state) => {
              state.inventory.inReachListIndex++;
            });
          }
        }
      }

      if (key === "ArrowLeft") {
        if (inventory.columnIndex === 0) {
          setState((state) => {
            state.inventory.columnIndex = 2;
          });
        } else {
          setState((state) => {
            state.inventory.columnIndex = 0;
          });
        }
      }

      if (key === "ArrowRight") {
        if (inventory.columnIndex === 2) {
          setState((state) => {
            state.inventory.columnIndex = 0;
          });
        } else {
          setState((state) => {
            state.inventory.columnIndex = 2;
          });
        }
      }

      if (key === "d") {
        // possible actions from the Inventory column
        if (inventory.columnIndex === 0) {
          drop(world, pcEid, inventory.selectedInventoryItemEid);
        }
      }

      if (key === "r") {
        // possible actions from the Inventory column
        if (inventory.columnIndex === 0) {
          // get wielder of item
          const wielder = getWielder(
            world,
            pcEid,
            inventory.selectedInventoryItemEid
          );

          if (wielder) {
            unwield(world, wielder[0]);
          }
        }
      }

      if (key === "w") {
        // possible actions from the Inventory column
        if (inventory.columnIndex === 0) {
          wield(world, pcEid, inventory.selectedInventoryItemEid);
        }
      }

      if (key === "g") {
        // possible actions from the WithinReach column
        if (inventory.columnIndex === 2) {
          get(world, pcEid, inventory.selectedInReachItemEid);
        }
      }
    }
  }

  if (["GAME"].includes(mode)) {
    if (gameplayControls.includes(key)) {
      setState((state) => {
        state.userInput = userInput;
      });
    }
  }

  if (uiControls.includes(key)) {
    setState((state) => {
      state.turn = "PLAYER";
    });
  } else if (uiControls.includes(userInput)) {
    setState((state) => {
      state.turn = "UI";
    });
  } else {
    setState((state) => {
      state.turn = "WORLD";
    });
  }
};

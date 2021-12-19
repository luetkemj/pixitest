import { getState, setState } from "../index";
import { Inventory, Position } from "../components";
import {
  getWielder,
  gettableEntitiesInReach,
  walkInventoryTree,
} from "./ecsHelpers";
import { drop, get, quaff, unwield, wield } from "./actions";
import { grid } from "./grid";

const gameplayControls = [
  "ArrowUp",
  "ArrowRight",
  "ArrowDown",
  "ArrowLeft",
  "g",
];

const uiControls = ["Escape", "c", "i", "k", "l", "Shift"];

const logControls = ["ArrowUp", "ArrowDown"];

const lookingControls = ["ArrowUp", "ArrowRight", "ArrowDown", "ArrowLeft"];

const inventoryControls = [
  "ArrowUp",
  "ArrowRight",
  "ArrowDown",
  "ArrowLeft",
  "d", // drop
  "g", // get
  "q", // quaff
  "r", // remove
  "w", // wield
];

export const processUserInput = (world) => {
  const { userInput, mode, pcEnts } = getState();

  const { key, shiftKey } = userInput;

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

  if (["LOG"].includes(mode)) {
    if (logControls.includes(key)) {
      const increment = shiftKey ? 10 : 1;

      if (key === "ArrowDown") {
        // decrease index to zero
        const { rowIndex } = getState().log;

        const newRowIndex = rowIndex - increment;

        if (newRowIndex < 0) {
          // trying to scroll past the top - so reset to top
          setState((state) => (state.log.rowIndex = 0));
        } else {
          // scroll as normal
          setState((state) => (state.log.rowIndex = newRowIndex));
        }
      }

      if (key === "ArrowUp") {
        // increase index until we have reached the bottom and don't need to scroll anymore
        const logHeight = grid.menu.height;
        const { log, rowIndex } = getState().log;

        // no need to scroll
        if (logHeight > log.length) {
          return;
        }

        const newRowIndex = rowIndex + increment;

        // trying to scroll past the bottom so we just set rowIndex to bottom
        if (log.length - logHeight <= newRowIndex) {
          setState((state) => (state.log.rowIndex = log.length - logHeight));
        } else {
          // scroll as normal
          setState((state) => (state.log.rowIndex = newRowIndex));
        }
      }
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
        if (inventory.columnIndex <= 0) {
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
          if (inventory.inventoryListIndex >= nItems - 1) {
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

      // need to "drop" this item - or better yet, consume the liquid within. #77
      if (key === "q") {
        // possible actions from the Inventory column
        if (inventory.columnIndex === 0) {
          quaff(world, pcEid, inventory.selectedInventoryItemEid);
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

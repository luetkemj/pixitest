import { addLog, getState, setState } from "../index";
import { Inventory, Position } from "../ecs/components";
import {
  getName,
  getWielder,
  entitiesInReach,
  walkInventoryTree,
} from "../ecs/ecsHelpers";
import { drop, get, quaff, spark, unwield, wield } from "./actions";
import { grid } from "./grid";
import { pipelineFovRender } from "../ecs/pipelines";

const gameplayControls = [
  "ArrowUp",
  "ArrowRight",
  "ArrowDown",
  "ArrowLeft",
  "g",
  "<",
  ">",
];

const uiControls = ["Escape", "c", "i", "k", "l", "Shift"];

const logControls = ["ArrowUp", "ArrowDown"];

const lookingControls = ["ArrowUp", "ArrowRight", "ArrowDown", "ArrowLeft"];

const inventoryControls = [
  "ArrowUp",
  "ArrowRight",
  "ArrowDown",
  "ArrowLeft",
  "a", // apply
  "d", // drop
  "g", // get
  "q", // quaff
  "r", // remove
  "w", // wield
];

export const processUserInput = (world) => {
  const { userInput, mode, pcEnts } = getState();

  const { key, shiftKey } = userInput;

  // DEBUG VIZ DIJKSTRA
  // Might be nice to have a debug menu at some point for tweaking values in game...
  if (key === "D") {
    setState((state) => {
      if (getState().debugMode === "DIJKSTRA") {
        state.debugMode = "";
      } else {
        state.debugMode = "DIJKSTRA";
      }
    });
  }

  // Game modes must be used in the gameLoop() to processUserInput and call pipelines.
  // if you don't the game will hang and never process user input
  if (key === "Escape") {
    setState((state) => {
      state.inventory.selectedInReachItemEid = "";
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
      const { rowIndex } = getState().log;

      if (key === "ArrowUp") {
        setState((state) => (state.log.rowIndex = rowIndex - increment));
      }

      if (key === "ArrowDown") {
        setState((state) => (state.log.rowIndex = rowIndex + increment));
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
      const entsInReach = entitiesInReach(world, currentLocId);
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
              state.inventory.inReachListIndex = entsInReach.length - 1;
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
          if (inventory.inReachListIndex === entsInReach.length - 1) {
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

      if (key === "a") {
        const { selectedApplierItemEid } = inventory;
        // if no selectedApplierItemEid set it
        if (!selectedApplierItemEid) {
          if (inventory.columnIndex === 0) {
            setState((state) => {
              state.inventory.selectedApplierItemEid =
                state.inventory.selectedInventoryItemEid;
            });

            console.log("prepare to apply from col1");
          }
          if (inventory.columnIndex === 2) {
            setState((state) => {
              state.inventory.selectedApplierItemEid =
                state.inventory.selectedInReachItemEid;
            });

            console.log("prepare to apply from col2");
          }
        }
        // if selectedApplierItemEid apply it
        if (selectedApplierItemEid) {
          const {
            selectedInReachItemEid,
            selectedInventoryItemEid,
          } = inventory;

          if (inventory.columnIndex === 0) {
            spark(world, selectedInventoryItemEid, selectedApplierItemEid);
            console.log("try to apply to col1");
          }
          if (inventory.columnIndex === 2) {
            spark(world, selectedInReachItemEid, selectedApplierItemEid);
            console.log("try to apply to col2");
          }
        }
      }

      pipelineFovRender(world);
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

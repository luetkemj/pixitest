import _ from "lodash";
import { getState, setState } from "../index";
import wrapAnsi from "wrap-ansi";
import { hasComponent } from "bitecs";
import { printRow } from "../lib/canvas";
import { getEquipped, gettableEntitiesInReach } from "../lib/ecsHelpers";
import { getNeighborIds } from "../lib/grid";
import {
  BelongsTo,
  Droppable,
  Pickupable,
  Inventory,
  Position,
  Wieldable,
} from "../components";

const renderInventoryList = (world, pcEid) => {
  const { inventory } = getState();
  const isCurrentColumn = inventory.columnIndex === 0;
  // Render inventory list
  const width = 57;
  const color = isCurrentColumn ? undefined : 0x666666;
  const options = {
    container: "menu",
    width,
    color,
  };

  printRow({
    ...options,
    str: " -- INVENTORY --",
    y: 1,
  });

  const items = _.compact(Inventory.slots[pcEid]);

  if (!items.length) {
    // clear out selected item
    setState((state) => {
      state.inventory.selectedInventoryItemEid = "";
    });
    printRow({
      ...options,
      y: 3,
      str: "    Your inventory is empty.",
    });
  }

  const equippedItems = getEquipped(world, pcEid);

  items.forEach((eid, i) => {
    if (eid) {
      const itemName = world.meta[eid].name;
      const isSelected = inventory.inventoryListIndex === i;
      if (isSelected && isCurrentColumn) {
        setState((state) => {
          state.inventory.selectedInventoryItemEid = eid;
        });
      }

      const equipped = equippedItems.find((x) => x[0] === eid);
      const isEquipped = !!equipped;

      let str = isSelected ? "  * " : "    ";
      str = `${str}${itemName}`;

      if (isEquipped) {
        const equipName = world.meta[equipped[1]].name;
        const equipType = equipped[2];
        str = `${str} (${equipName}) ${equipType}`;
      }

      printRow({
        ...options,
        y: i + 3,
        str,
      });
    }
  });
};

const renderDescription = (world, pcEid) => {
  const { inventory } = getState();

  let itemEid;
  if (inventory.columnIndex === 0) {
    itemEid = inventory.selectedInventoryItemEid;
  }
  if (inventory.columnIndex === 2) {
    itemEid = inventory.selectedInReachItemEid;
  }

  if (!itemEid) return;

  const itemName = world.meta[itemEid].name;
  const itemDesc = world.meta[itemEid].description;
  const currentColumn = inventory.columnIndex;
  const equippedItems = getEquipped(world, pcEid);

  const belongsToEid = BelongsTo.eid[itemEid];
  let belongsTo = "";
  if (belongsToEid) {
    belongsTo = `A ${world.meta[belongsToEid].name}'s `;
  }

  const width = 59;
  let y = 1;

  const header = ` -- ${belongsTo}${itemName}`;

  const content = wrapAnsi(itemDesc, width - 4).split("\n");

  const options = {
    container: "menu",
    width,
    x: 57, // width of first column
    y,
  };

  printRow({ ...options, str: header });

  y = 3;
  content.forEach((row, i) => {
    y = y + i;
    printRow({ ...options, y, str: `    ${row}` });
  });

  // available actions for items in inventory
  let availableActions = "    ";
  if (currentColumn === 0) {
    if (hasComponent(world, Droppable, itemEid)) {
      availableActions += "(d)Drop ";
    }
  }

  const isEquipped = equippedItems.find((x) => x[0] === itemEid);
  if (isEquipped) {
    availableActions += "(r)Remove ";
  }

  if (!isEquipped) {
    if (hasComponent(world, Wieldable, itemEid)) {
      availableActions += "(w)Wield ";
    }
  }

  // available actions for items within reach
  if (currentColumn === 2) {
    if (hasComponent(world, Pickupable, itemEid)) {
      availableActions += "(g)Get ";
    }
  }

  y += 2;
  const actionsContent = wrapAnsi(availableActions, width - 4).split("\n");
  actionsContent.forEach((row, i) => {
    y = y + i;
    printRow({ ...options, y, str: `    ${row}` });
  });
};

const renderInReachList = (world, pcEid) => {
  const { inventory } = getState();
  const currentLocId = `${Position.x[pcEid]},${Position.y[pcEid]},${Position.z[pcEid]}`;
  const entitiesInReach = gettableEntitiesInReach(world, currentLocId);
  const isCurrentColumn = inventory.columnIndex === 2;

  // Render inReach list
  const color = isCurrentColumn ? undefined : 0x666666;
  const options = {
    container: "menu",
    width: 57,
    x: 57 + 59, // width of col1 + col2
    color,
  };

  printRow({
    ...options,
    str: " -- WITHIN REACH --",
    y: 1,
  });

  if (!entitiesInReach.length) {
    // clear out selected item
    setState((state) => {
      state.inventory.selectedInReachItemEid = "";
    });
    printRow({
      ...options,
      y: 3,
      str: "    There is nothing within reach",
    });
  }

  entitiesInReach.forEach((eid, i) => {
    if (eid) {
      const itemName = world.meta[eid].name;
      const isSelected = inventory.inReachListIndex === i;
      if (isSelected && isCurrentColumn) {
        setState((state) => {
          state.inventory.selectedInReachItemEid = eid;
        });
      }

      let str = isSelected ? "  * " : "    ";
      str = `${str}${itemName}`;

      printRow({
        ...options,
        y: i + 3,
        str,
      });
    }
  });
};

export const renderMenuInventory = (world, pcEid) => {
  renderInventoryList(world, pcEid);
  renderInReachList(world, pcEid);
  renderDescription(world, pcEid);
};

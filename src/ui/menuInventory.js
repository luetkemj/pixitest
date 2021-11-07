import _ from "lodash";
import wrapAnsi from "wrap-ansi";
import { hasComponent } from "bitecs";
import { printRow } from "../lib/canvas";
import { BelongsTo, Droppable, Inventory } from "../components";

const renderInventoryList = (world, pcEid) => {
  // Render inventory list
  const width = 57;

  printRow({
    container: "menu",
    str: " -- INVENTORY --",
    y: 1,
    width,
  });

  const items = _.compact(Inventory.slots[pcEid]);
  items.forEach((eid, i) => {
    if (eid) {
      const itemName = world.meta[eid].name;
      const isSelected = world.inventory.inventoryListIndex === i;
      if (isSelected) {
        world.inventory.selectedItemEid = eid;
      }

      let str = isSelected ? "  * " : "    ";
      str = `${str}${itemName}`;

      printRow({
        container: "menu",
        y: i + 3,
        str,
        width,
      });
    }
  });
};

const renderDescription = (world, pcEid) => {
  const itemEid = world.inventory.selectedItemEid;
  if (!itemEid) return;

  const itemName = world.meta[itemEid].name;
  const itemDesc = world.meta[itemEid].description;

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

  // available actions
  let availableActions = "    ";
  if (hasComponent(world, Droppable, itemEid)) {
    availableActions += "(d)Drop ";
  }

  y += 2;
  const actionsContent = wrapAnsi(availableActions, width - 4).split("\n");
  actionsContent.forEach((row, i) => {
    y = y + i;
    printRow({ ...options, y, str: `    ${row}` });
  });
};

export const renderMenuInventory = (world, pcEid) => {
  renderInventoryList(world, pcEid);
  renderDescription(world, pcEid);
};

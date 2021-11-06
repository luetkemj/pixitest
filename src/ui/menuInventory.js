import _ from "lodash";
import { grid } from "../lib/grid";
import { printRow } from "../lib/canvas";
import { BelongsTo, Inventory } from "../components";

export const renderMenuInventory = (world, pcEid) => {
  // Render inventory list
  printRow({
    container: "menu",
    str: "-- INVENTORY --",
    y: 1,
  });

  const items = Inventory.slots[pcEid];
  items.forEach((eid, i) => {
    if (eid) {
      const itemName = world.meta[eid].name;
      const isSelected = world.inventory.inventoryListIndex === i;

      let str = isSelected ? "*" : " ";
      str = `${str}${itemName}`;

      const x = 2;
      printRow({
        container: "menu",
        x,
        y: i + 3,
        str,
        length: str.length + x,
      });
    }
  });

  // Render description
  const itemEid = Inventory.slots[pcEid][world.inventory.inventoryListIndex];
  const itemName = world.meta[itemEid].name;
  const itemDesc = world.meta[itemEid].description;

  const belongsToEid = BelongsTo.eid[itemEid];
  let belongsTo = "";
  if (belongsToEid) {
    belongsTo = `A ${world.meta[belongsToEid].name}'s `;
  }

  const x = 40;
  const str = `-- ${belongsTo}${itemName} --`;
  printRow({
    container: "menu",
    str,
    x,
    y: 1,
    length: str.length + x,
  });

  printRow({
    container: "menu",
    str: itemDesc,
    x,
    y: 3,
    length: itemDesc.length + x,
  });
};

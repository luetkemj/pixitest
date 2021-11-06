import _ from "lodash";
import wrapAnsi from "wrap-ansi";
import { printRow } from "../lib/canvas";
import { BelongsTo, Inventory } from "../components";

export const renderMenuInventory = (world, pcEid) => {
  {
    // Render inventory list
    const width = 57;

    printRow({
      container: "menu",
      str: " -- INVENTORY --",
      y: 1,
      width,
    });

    const items = Inventory.slots[pcEid];
    items.forEach((eid, i) => {
      if (eid) {
        const itemName = world.meta[eid].name;
        const isSelected = world.inventory.inventoryListIndex === i;
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
  }

  // Render description
  {
    const itemEid = Inventory.slots[pcEid][world.inventory.inventoryListIndex];
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
      printRow({ ...options, y: y + i, str: `    ${row}` });
    });
  }
};

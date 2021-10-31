import _ from "lodash";
import { printRow } from "../lib/canvas";
import { Inventory } from "../components";

export const renderMenuInventory = (world, pcEid) => {
  const items = Inventory.slots[pcEid];
  items.forEach((eid, i) => {
    if (eid) {
      const itemName = world.meta[eid].name;
      const str = `${itemName}`;
      printRow({ container: "menu", row: i, str });
    }
  });
};

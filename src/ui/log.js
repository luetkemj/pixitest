import _ from "lodash";
import { printRow } from "../lib/canvas";
import { grid } from "../lib/grid";

export const renderLog = (world) => {
  const arr = world.log;
  const log = arr.slice(Math.max(arr.length - grid.menuTabItem.height, 0));
  const displayHeight = Math.min(grid.menuTabItem.height, log.length);

  _.times(Math.min(displayHeight), (i) => {
    const str = log[i];
    printRow({ container: "menuTabItem", row: i, str });
  });
};

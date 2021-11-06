import _ from "lodash";
import { printRow } from "../lib/canvas";
import { grid } from "../lib/grid";

export const renderMenuLog = (world) => {
  const arr = world.log;
  const log = arr.slice(0, grid.menu.height);

  _.times(log.length, (i) => {
    const str = log[i];
    printRow({ container: "menu", y: i, str });
  });
};

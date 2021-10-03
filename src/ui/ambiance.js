import _ from "lodash";
import { printRow } from "../lib/canvas";
import { grid } from "../lib/grid";

// TODO: add an ambiance field to world. It can be updated directly without a history
export const renderAmbiance = (world) => {
  _.times(grid.ambiance.height, (i) => {
    const arr = world.log;
    // get the last 3 messages in the log
    const log = arr.slice(Math.max(arr.length - grid.ambiance.height, 0));
    const str = log[i];
    printRow({ container: "ambiance", row: i, str });
  });
};

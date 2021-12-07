import _ from "../../dist/pkg/lodash.js";
import { printRow } from "../lib/canvas.js";
import { grid } from "../lib/grid.js";
import { getState } from "../index.js";

export const renderMenuLog = () => {
  const arr = getState().log;
  const log = arr.slice(0, grid.menu.height);

  _.times(log.length, (i) => {
    const str = log[i];
    printRow({ container: "menu", y: i, str });
  });
};

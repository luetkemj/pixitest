import _ from "lodash";
import { printRow, printTemplate } from "../lib/canvas";
import { grid } from "../lib/grid";
import { getState } from "../index";

// TODO: add an ambiance field to world. It can be updated directly without a history
const container = "adventureLog";

export const renderAdventureLog = (world) => {
  const log = getState().log.slice(0, 3).reverse();
  for (const [i, l] of log.entries()) {
    if (Array.isArray(l)) {
      printTemplate({
        container,
        template: l,
        y: i,
      });
    } else {
      printRow({ container, str: l, y: i });
    }
  }
};

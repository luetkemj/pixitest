import _ from "lodash";
import { printRow, printTemplate } from "../lib/canvas";
import { grid } from "../lib/grid";
import { getState } from "../index";

export const renderMenuLog = () => {
  const arr = getState().log;
  const visibleLog = arr.slice(0, grid.menu.height);

  for (const [i, log] of visibleLog.entries()) {
    if (Array.isArray(log)) {
      printTemplate({ container: "menu", y: i, template: log });
    } else {
      printRow({ container: "menu", y: i, str: log });
    }
  }
};

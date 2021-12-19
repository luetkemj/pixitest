import _ from "lodash";
import { printRow, printTemplate } from "../lib/canvas";
import { grid } from "../lib/grid";
import { getState } from "../index";

const container = "menu";

export const renderMenuLog = () => {
  const log = getState().log.log;
  const logRowIndex = getState().log.rowIndex;
  const visibleLog = log.slice(logRowIndex, logRowIndex + grid.menu.height);

  for (const [i, l] of visibleLog.entries()) {
    printTemplate({
      container,
      template: l.log,
      y: i,
    });
  }
};

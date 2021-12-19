import _ from "lodash";
import { printRow, printTemplate } from "../lib/canvas";
import { grid } from "../lib/grid";
import { getState, setState } from "../index";

const container = "menu";

export const renderMenuLog = () => {
  const { log, rowIndex } = getState().log;
  const logHeight = grid.menu.height;

  let logRowIndex = rowIndex;

  if (logHeight < log.length) {
    if (logRowIndex < 0) {
      // trying to scroll past the top - so reset to top
      logRowIndex = 0;
      setState((state) => (state.log.rowIndex = 0));
    }

    if (log.length - logHeight <= logRowIndex) {
      // trying to scroll past the bottom - so reset to bottom
      logRowIndex = log.length - logHeight;
      setState((state) => (state.log.rowIndex = log.length - logHeight));
    }
  } else {
    // no need to scroll yet so just reset scroll index to 0
    logRowIndex = 0;
    setState((state) => (state.log.rowIndex = 0));
  }

  const visibleLog = log.slice(logRowIndex, logRowIndex + grid.menu.height);

  for (const [i, l] of visibleLog.entries()) {
    printTemplate({
      container,
      template: l.log,
      y: i,
    });
  }
};

import _ from "lodash";
import { printRow, printTemplate } from "../lib/canvas";
import { grid } from "../lib/grid";
import { getState, setState } from "../index";

const container = "menu";

export const renderMenuLog = () => {
  const { log, rowIndex } = getState().log;
  // THE ERROR IS HERE - we are getting more logs than we can show because we're adding height with the spacers....
  const logHeight = grid.menu.height - 5;

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

  const visibleLog = log.slice(logRowIndex, logRowIndex + logHeight);

  printTemplate({
    container,
    template: [{ str: " -- ADVENTURER'S LOG --" }],
    y: 1,
  });

  let y = 3;

  let rollingTick = -1;
  let rollingTurn = 1;
  for (const [i, l] of visibleLog.entries()) {
    if (l.tick !== rollingTick) {
      rollingTick = l.tick;
      rollingTurn++;
    }

    const color = rollingTurn % 2 ? 0x00ff77 : 0x58cced;
    printTemplate({
      container,
      template: [{ str: `${l.tick}-`, color }, ...l.log],
      y: y,
      x: 4,
    });
    y++;
  }

  printTemplate({
    container,
    template: [{ str: `(esc)Return to game  (arrow keys)Scroll ` }],
    y: logHeight + 4,
  });
};

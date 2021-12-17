import _ from "lodash";
import { printRow, printTemplate } from "../lib/canvas";
import { grid } from "../lib/grid";
import { getState } from "../index";

// TODO: add an ambiance field to world. It can be updated directly without a history
export const renderAmbiance = (world, str) => {
  if (str) {
    printRow({ container: "ambiance", str });
  } else {
    const log = getState().log[0];

    if (Array.isArray(log)) {
      printTemplate({
        container: "ambiance",
        template: log,
      });
    } else {
      printRow({ container: "ambiance", str: log });
    }
  }
};

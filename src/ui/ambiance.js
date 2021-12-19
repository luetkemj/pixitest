import _ from "lodash";
import { clearContainer, printRow, printTemplate } from "../lib/canvas";
import { getState } from "../index";

const container = "ambiance";
// TODO: add an ambiance field to world. It can be updated directly without a history
export const renderAmbiance = (world, str) => {
  clearContainer(container);

  const log = getState().log[0];
  printTemplate({
    container,
    template: log.log,
  });
};

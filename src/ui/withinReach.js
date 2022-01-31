import { getState } from "../index";
import { printTemplate } from "../lib/canvas";

export const renderWithinReach = () => {
  getState().withinReachPreview.forEach((template, idx) => {
    printTemplate({
      container: "withinReach",
      width: 3,
      x: 0,
      y: 0 + idx,
      template,
      halfWidth: false,
    });
  });
};

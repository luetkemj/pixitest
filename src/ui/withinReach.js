import { getState } from "../index";
import { clearContainer, printTemplate, printTile } from "../lib/canvas";
import { getVelocity } from "../lib/grid";
import { getPosition } from "../ecs/ecsHelpers";

export const renderWithinReach = (world, pcEid) => {
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

  clearContainer("withinReachBelow");

  const selectedEid = state.inventory.selectedInReachItemEid;

  if (!selectedEid) return;

  const pos1 = getPosition(selectedEid);
  const pos2 = getPosition(pcEid);
  const velocity = getVelocity(pos2, pos1);

  printTile({
    container: "withinReachBelow",
    x: getVelocity("1,1,0", velocity).x,
    y: getVelocity("1,1,0", velocity).y,
    color: 0xffffff,
    alpha: 0.1,
  });
};

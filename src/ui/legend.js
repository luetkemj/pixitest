import _ from "lodash";
import { clearContainer, printRow, printTemplate } from "../lib/canvas";
import { distance } from "../lib/grid";
import { getEntityData } from "../lib/ecsHelpers";
import { Health, Position } from "../ecs/components";

const container = "legend";

export const renderLegend = (world, pcEid, legendEnts) => {
  clearContainer(container);
  // get all entities in FOV

  // sort by proximity to pcEid
  const pcX = Position.x[pcEid];
  const pcY = Position.y[pcEid];
  const orderedLegend = _.orderBy(legendEnts, (lEid) => {
    const x = Position.x[lEid];
    const y = Position.y[lEid];
    return distance({ x: pcX, y: pcY }, { x, y });
  });

  // Update pc stats:
  const pcHealthMax = Health.max[pcEid];
  const pcHealthCurrent = Health.current[pcEid];

  if (pcHealthCurrent < 1) {
    printRow({ container, str: "You are dead." });
  } else {
    printRow({ container: "legend", str: "You are a Knight." });
  }

  printRow({
    container,
    y: 1,
    str: `HP: ${pcHealthCurrent}/${pcHealthMax}`,
  });

  for (const [i, eid] of orderedLegend.entries()) {
    const name = world.meta[eid].name;
    const { char, color } = world.sprites[eid];
    printTemplate({
      container,
      template: [{ str: `${char} `, color: color }, { str: name }],
      y: i + 3,
    });
  }
};

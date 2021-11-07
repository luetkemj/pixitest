import { printRow } from "../lib/canvas";
import { Health } from "../components";

export const renderLegend = (world, pcEid) => {
  // get all entities in FOV
  // sort by proximity to pcEid

  // Update pc stats:
  const pcHealthMax = Health.max[pcEid];
  const pcHealthCurrent = Health.current[pcEid];
  if (pcHealthCurrent < 1) {
    printRow({ container: "legend", str: "You are dead." });
  }
  printRow({
    container: "legend",
    y: 1,
    str: `HP: ${pcHealthCurrent}/${pcHealthMax}`,
  });
};

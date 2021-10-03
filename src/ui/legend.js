import { printRow } from "../lib/canvas";
import { Health } from "../components";

export const renderLegend = (world) => {
  // get all entities in FOV
  // sort by proximity to hero

  // Update Player stats:
  const playerHealthMax = Health.max[world.hero];
  const playerHealthCurrent = Health.current[world.hero];
  if (playerHealthCurrent < 1) {
    printRow({ container: "legend", row: 0, str: "You are a dead hero." });
  }
  printRow({
    container: "legend",
    row: 1,
    str: `HP: ${playerHealthCurrent}/${playerHealthMax}`,
  });
};

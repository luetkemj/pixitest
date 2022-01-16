import _ from "lodash";
import wrapAnsi from "wrap-ansi";
import { printRow } from "../lib/canvas";
import { getEntityData, getWielders } from "../ecs/ecsHelpers";

export const renderMenuCharacter = (world, pcEid) => {
  const data = getEntityData(world, pcEid);

  let y = 1;
  let width = 57;

  const opts = {
    container: "menu",
    width,
    x: 0,
    y,
  };

  printRow({ ...opts, str: ` -- CHARACTER --` });
  y += 2;

  printRow({
    ...opts,
    y,
    str: `    ${data.meta.name}`,
  });
  y++;

  const content = wrapAnsi(data.meta.description, width - 4).split("\n");
  content.forEach((row) => {
    y++;
    printRow({ ...opts, y, str: `    ${row}` });
  });
  y += 2;

  printRow({
    ...opts,
    y,
    str: `    HP: ${data.components.Health.current}/${data.components.Health.max}`,
  });
  y++;

  printRow({
    ...opts,
    y,
    str: `    IN: ${data.components.Intelligence.current}/${data.components.Intelligence.max}`,
  });
  y++;

  printRow({
    ...opts,
    y,
    str: `    ST: ${data.components.Strength.current}/${data.components.Strength.max}`,
  });
  y += 2;

  printRow({ ...opts, y, str: `    ANATOMY` });
  y += 2;

  // get wielders
  const wielders = getWielders(world, pcEid);

  data.body.forEach((part) => {
    // const wieldedItem = part
    const wielder = wielders.find((tuple) => tuple[0] === part.eid);
    if (wielder && wielder[1]) {
      const wieldedData = getEntityData(world, wielder[1]);
      printRow({ ...opts, y, str: `    ${part.name} - ${wieldedData.name}` });
    } else {
      printRow({ ...opts, y, str: `    ${part.name}` });
    }
    y++;
  });
};

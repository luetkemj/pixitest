import _ from "lodash";
import { defineQuery, removeComponent, Not } from "bitecs";
import { Position } from "../components";

const positionQuery = defineQuery([Position]);

export const debugSystem = (world) => {
  if (!world.debug) {
    return;
  }

  const positionEnts = positionQuery(world);

  for (let i = 0; i < positionEnts.length; i++) {
    const eid = positionEnts[i];
    world.sprites[eid].alpha = 1;
    world.sprites[eid].tint = `0xffffff`;
  }

  return world;
};

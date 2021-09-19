import _ from "lodash";
import { defineQuery, removeComponent, Not } from "bitecs";
import { Position } from "../components";

const positionQuery = defineQuery([Position]);

export const debugSystem = (world) => {
  const positionEnts = positionQuery(world);

  if (world.PROCESSING_DEBUG_OFF) {
    for (let i = 0; i < positionEnts.length; i++) {
      const eid = positionEnts[i];
      world.sprites[eid].alpha = 0;
    }
    world.PROCESSING_DEBUG_OFF = false;
  }

  if (!world.debug) {
    return;
  }

  for (let i = 0; i < positionEnts.length; i++) {
    const eid = positionEnts[i];
    world.sprites[eid].alpha = 1;
    world.sprites[eid].tint = `0xffffff`;
  }

  return world;
};

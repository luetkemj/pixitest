import _ from "lodash";
import { defineQuery, removeComponent } from "bitecs";
import { Position, Render } from "../components";

const cellWidth = 16;

const renderQuery = defineQuery([Render]);
export const renderSystem = (world) => {
  const ents = renderQuery(world);
  for (let i = 0; i < ents.length; i++) {
    const eid = ents[i];

    world.sprites[eid].x = Position.x[eid] * cellWidth;
    world.sprites[eid].y = Position.y[eid] * cellWidth;

    removeComponent(world, Render, eid);
  }
  return world;
};

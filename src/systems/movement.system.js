import { defineQuery, addComponent, removeComponent } from "bitecs";

import { Position, Render, Velocity } from "../components";

const movementQuery = defineQuery([Position, Velocity]);

export const movementSystem = (world) => {
  const ents = movementQuery(world);
  for (let i = 0; i < ents.length; i++) {
    const eid = ents[i];
    Position.x[eid] += Velocity.x[eid];
    Position.y[eid] += Velocity.y[eid];
    Position.z[eid] += Velocity.z[eid];

    removeComponent(world, Velocity, eid);
    addComponent(world, Render, eid);
  }
  return world;
};

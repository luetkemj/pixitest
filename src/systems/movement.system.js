import { defineQuery, addComponent, removeComponent } from "bitecs";

import { Position, Render, Velocity } from "../components";

const movementQuery = defineQuery([Position, Velocity]);

export const movementSystem = (world) => {
  const ents = movementQuery(world);
  for (let i = 0; i < ents.length; i++) {
    const eid = ents[i];
    let canMove = false;

    console.log(Position);

    // store new location
    const x = Position.x[eid] + Velocity.x[eid];
    const y = Position.y[eid] + Velocity.y[eid];
    const z = Position.z[eid] + Velocity.z[eid];

    console.log({
      x,
      y,
      y,
      canMove: x >= 0 && x < 100 && y >= 0 && y < 34,
      eid,
    });

    // check if location is within bounds
    if (x >= 0 && x < 100 && y >= 0 && y < 34) {
      canMove = true;
    }

    if (canMove) {
      Position.x[eid] = x;
      Position.y[eid] = y;
      Position.z[eid] = z;
    }

    removeComponent(world, Velocity, eid);

    if (canMove) {
      addComponent(world, Render, eid);
    }
  }
  return world;
};

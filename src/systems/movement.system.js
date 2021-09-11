import {
  defineQuery,
  addComponent,
  hasComponent,
  removeComponent,
} from "bitecs";
import { Blocking, Position, Render, Velocity } from "../components";
import { updatePosition } from "../lib/ecsHelpers";

const movementQuery = defineQuery([Position, Velocity]);

export const movementSystem = (world) => {
  const ents = movementQuery(world);
  for (let i = 0; i < ents.length; i++) {
    const eid = ents[i];
    let canMove = false;

    const oldPos = {
      x: Position.x[eid],
      y: Position.y[eid],
      z: Position.z[eid],
    };

    const newPos = {
      x: Position.x[eid] + Velocity.x[eid],
      y: Position.y[eid] + Velocity.y[eid],
      z: Position.z[eid] + Velocity.z[eid],
    };

    // check if location is within bounds
    if (newPos.x >= 0 && newPos.x < 100 && newPos.y >= 0 && newPos.y < 34) {
      canMove = true;
    }

    // check if blocked
    world.eAtPos[`${newPos.x},${newPos.y},${newPos.z}`].forEach((e) => {
      if (hasComponent(world, Blocking, e)) {
        canMove = false;
      }
    });

    // update position
    if (canMove) {
      updatePosition({ world, oldPos, newPos, eid });
    }

    removeComponent(world, Velocity, eid);

    if (canMove) {
      addComponent(world, Render, eid);
    }
  }
  return world;
};

import {
  defineQuery,
  addComponent,
  hasComponent,
  removeComponent,
} from "bitecs";
import { Ai, Brain, Intelligence, Position, Velocity } from "../components";
import { aStar } from "../lib/pathfinding";
import { getVelocity } from "../lib/grid";

const aiQuery = defineQuery([Ai, Brain, Intelligence]);

const moveToTarget = (world, eid) => {
  const startPos = { x: Position.x[eid], y: Position.y[eid], z: 0 };
  const targetPos = {
    x: Position.x[world.hero],
    y: Position.y[world.hero],
    z: 0,
  };
  const path = aStar(world, startPos, targetPos);

  const newLoc = path[1];

  if (newLoc) {
    addComponent(world, Velocity, eid);
    Position.x[eid] = newLoc[0];
    Position.y[eid] = newLoc[1];
  }
};

export const aiSystem = (world) => {
  const ents = aiQuery(world);

  for (let i = 0; i < ents.length; i++) {
    const eid = ents[i];

    moveToTarget(world, eid);
    // if (Intelligence.current
    // if has health
    // if has brain
    // if has intelligence above x
    // do a smart thing
    // else do a dumb thing
  }
  return world;
};

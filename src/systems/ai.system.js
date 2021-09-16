import { defineQuery, addComponent } from "bitecs";
import { Ai, Brain, Intelligence, Position, MoveTo } from "../components";
import { aStar } from "../lib/pathfinding";

const aiQuery = defineQuery([Ai, Brain, Intelligence]);

const moveToTarget = (world, eid) => {
  const startPos = { x: Position.x[eid], y: Position.y[eid], z: 0 };
  const targetPos = {
    x: Position.x[world.hero],
    y: Position.y[world.hero],
    z: 0,
  };
  const path = aStar(world, startPos, targetPos);
  // console.log(path);

  const newLoc = path[1];

  if (newLoc) {
    addComponent(world, MoveTo, eid);

    MoveTo.x[eid] = newLoc[0];
    MoveTo.y[eid] = newLoc[1];
    MoveTo.z[eid] = Position.z[eid];
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

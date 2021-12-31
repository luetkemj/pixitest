import { addComponent } from "bitecs";
import { MoveTo, Position } from "../ecs/components";
import { aStar } from "../lib/pathfinding";
import { aiQuery, pcQuery } from "../queries";

const moveToTarget = (world, eid, targetEid) => {
  const startPos = {
    x: Position.x[eid],
    y: Position.y[eid],
    z: Position.z[eid],
  };
  const targetPos = {
    x: Position.x[targetEid],
    y: Position.y[targetEid],
    z: Position.z[targetEid],
  };
  const path = aStar(world, startPos, targetPos);
  world.meta[eid].ai.path = path;
  world.meta[eid].ai.pathAlgo = "aStar";

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
  const pcEnts = pcQuery(world);

  for (let i = 0; i < ents.length; i++) {
    const eid = ents[i];

    moveToTarget(world, eid, pcEnts[0]);
    // if (Intelligence.current
    // if has health
    // if has intelligence above x
    // do a smart thing
    // else do a dumb thing
  }
  return world;
};

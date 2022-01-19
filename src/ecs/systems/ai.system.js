import { addComponent } from "bitecs";
import { MoveTo, Position } from "../components";
import { walkDijkstra } from "../../lib/pathfinding";
import { aiQuery, pcQuery } from "../queries";

const moveToTarget = (world, eid, targetEid) => {
  const locId = `${Position.x[eid]},${Position.y[eid]},${Position.z[eid]}`;

  const newLoc = walkDijkstra(world, locId, "player");

  if (newLoc.hasOwnProperty("x")) {
    addComponent(world, MoveTo, eid);

    MoveTo.x[eid] = newLoc.x;
    MoveTo.y[eid] = newLoc.y;
    MoveTo.z[eid] = newLoc.z;
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

import { toCell, toLocId, getNeighborIds } from "./grid";
import { getState } from "../index";
import { queryAtLoc } from "../ecs/ecsHelpers";
import { Blocking } from "../ecs/components";
import { hasComponent } from "bitecs";

export const walkDijkstra = (world, locId, dMapName) => {
  const { goals, map } = getState().dijkstra[dMapName];
  const goalIds = goals.map(toLocId);
  const neighbors = getNeighborIds(locId, "ALL");
  const inf = 1000000;
  let score = inf;
  let nextPosition = {};
  neighbors.forEach((nLocId) => {
    const dScore = _.get(map, `[${nLocId}]`, inf);

    if (dScore < score) {
      score = dScore;

      let isBlocking;

      queryAtLoc(nLocId, (eid) => {
        if (hasComponent(world, Blocking, eid)) {
          isBlocking = true;
        }
      });

      // only if if next position is !blocking or a goal
      // todo: don't move if actor has already tried this location - don't get stuck toggling back and forth...
      // maybe that should go in the ai system?
      if (!isBlocking || goalIds.includes(nLocId)) {
        nextPosition = toCell(nLocId);
      }
    }
  });
  return nextPosition;
};

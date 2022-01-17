import { toCell, getNeighborIds } from "./grid";
import { getState } from "../index";

export const walkDijkstra = (locId, dMapName) => {
  const neighbors = getNeighborIds(locId, "CARDINAL");
  const inf = 1000000;
  let score = inf;
  let nextPosition = {};
  neighbors.forEach((locId) => {
    const dScore = _.get(getState(), `dijkstra[${dMapName}][${locId}]`, inf);
    if (dScore < score) {
      score = dScore;
      nextPosition = toCell(locId);
    }
  });
  return nextPosition;
};

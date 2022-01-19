import { toCell, getNeighborIds } from "./grid";
import { getState } from "../index";

// Need to check what is in the location that dijkstra wants ai to roll to.
// If blocking and not the player - it should try again so!
// enemies are getting stacked up in lines because the the next location is where the next gob is....

export const walkDijkstra = (locId, dMapName) => {
  const neighbors = getNeighborIds(locId, "ALL");
  const inf = 1000000;
  let score = inf;
  let nextPosition = {};
  neighbors.forEach((nLocId) => {
    const dScore = _.get(getState(), `dijkstra[${dMapName}][${nLocId}]`, inf);
    if (dScore < score) {
      score = dScore;
      nextPosition = toCell(nLocId);
    }
  });
  return nextPosition;
};

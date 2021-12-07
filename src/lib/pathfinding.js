import PF from "../../dist/pkg/pathfinding.js";
import { some, times } from "../../dist/pkg/lodash.js";

import { Ai, Blocking } from "../components.js";

import { grid, toCell } from "./grid.js";
import { hasComponent } from "../../dist/pkg/bitecs.js";

export const aStar = (world, start, goal) => {
  const matrix = [];
  times(grid.height, () => matrix.push(new Array(grid.width).fill(0)));

  const locIds = Object.keys(world.eAtPos);

  locIds.forEach((locId) => {
    const pos = toCell(locId);

    // need a way to optionally add remove blockers - like doors or other goblins.
    if (
      some([...world.eAtPos[`${pos.x},${pos.y},${pos.z}`]], (eid) => {
        return hasComponent(world, Blocking, eid);
      })
    ) {
      matrix[pos.y][pos.x] = 1;
    }
  });

  matrix[start.y][start.x] = 0;
  matrix[goal.y][goal.x] = 0;

  const pfGrid = new PF.Grid(matrix);
  const finder = new PF.AStarFinder({
    allowDiagonal: false,
    dontCrossCorners: true,
  });

  const path = finder.findPath(start.x, start.y, goal.x, goal.y, pfGrid);

  return path;
};

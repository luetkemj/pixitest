import PF from "pathfinding";
import { some, times } from "lodash";

import { Blocking } from "../components";

import { grid, toCell } from "./grid";
import { hasComponent } from "bitecs";

const baseMatrix = [];
times(grid.height, () => baseMatrix.push(new Array(grid.width).fill(0)));

export const aStar = (world, start, goal) => {
  const matrix = [...baseMatrix];

  const locIds = Object.keys(world.eAtPos);

  locIds.forEach((locId) => {
    const pos = toCell(locId);
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

  const grid = new PF.Grid(matrix);
  const finder = new PF.AStarFinder({
    allowDiagonal: false,
    dontCrossCorners: true,
  });

  const path = finder.findPath(start.x, start.y, goal.x, goal.y, grid);

  return path;
};

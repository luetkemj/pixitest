import _ from "lodash";
import { grid } from "../grid";
import { setState } from "../../index";
import { createFloor } from "../../prefabs/floor";
import { createGoblin } from "../../prefabs/goblin";
import { createHealthPotion } from "../../prefabs/healthPotion";
import { createSword } from "../../prefabs/sword";
import { createWall } from "../../prefabs/wall";
import { createStairs } from "../../prefabs/stairs";

import { buildDungeon } from "../dungeon";

export const generateDungeonFloor = ({ world, z, stairsUp, stairsDown }) => {
  // create the dungeon
  const dungeon = buildDungeon({
    x: 0,
    y: 0,
    width: grid.map.width,
    height: grid.map.height,
  });

  Object.values(dungeon.tiles).forEach((tile) => {
    if (tile.sprite === "WALL") {
      const { x, y } = tile;
      createWall(world, { x, y, z });
    }
    if (tile.sprite === "FLOOR") {
      const { x, y } = tile;
      createFloor(world, { x, y, z });
    }
  });

  const openTiles = _.filter(dungeon.tiles, (tile) => tile.sprite === "FLOOR");

  // spawn weapons
  _.times(10, () => {
    const { x, y } = _.sample(openTiles);
    createSword(world, { x, y, z });
  });

  // spawn potions
  _.times(10, () => {
    const { x, y } = _.sample(openTiles);
    createHealthPotion(world, { x, y, z });
  });

  // spawn baddies
  _.times(10, () => {
    const { x, y } = _.sample(openTiles);
    createGoblin(world, { x, y, z });
  });

  const floor = { z };

  if (stairsUp) {
    const { x, y } = _.sample(openTiles);
    createStairs(world, { x, y, z, dir: "UP" });
    floor.stairsUp = `${x},${y},${z}`;
  }

  if (stairsDown) {
    const { x, y } = _.sample(openTiles);
    createStairs(world, { x, y, z, dir: "DOWN" });
    floor.stairsDown = `${x},${y},${z}`;
  }

  setState((state) => (state.floors[z] = floor));

  return { dungeon, floor };
};

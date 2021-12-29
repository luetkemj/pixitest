import _ from "lodash";
import { addComponent, createWorld } from "bitecs";
import { grid } from "./grid";
import { PC } from "../components";
import { addLog, getState, setState } from "../index";

import { createFloor } from "../prefabs/floor";
import { createGoblin } from "../prefabs/goblin";
import { createHealthPotion } from "../prefabs/healthPotion";
import { createKnight } from "../prefabs/knight";
import { createSword } from "../prefabs/sword";
import { createWall } from "../prefabs/wall";

import { buildDungeon } from "./dungeon";

export const initWorld = (loader) => {
  const { z } = getState();
  // create the world
  const world = createWorld();
  world.sprites = [];
  world.meta = [];

  setState((state) => {
    state.turn = "WORLD";
    state.debug = false;
  });

  addLog([{ str: "Adventure, awaits!" }]);

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

  // create the knight
  const knightEid = createKnight(world, {
    x: dungeon.rooms[0].center.x,
    y: dungeon.rooms[0].center.y,
    z,
  });
  // player is the knight
  addComponent(world, PC, knightEid);

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

  return { world };
};

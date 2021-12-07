import _ from "../../dist/pkg/lodash.js";
import { addComponent, createWorld } from "../../dist/pkg/bitecs.js";
import { grid } from "./grid.js";
import { PC } from "../components.js";
import { setState } from "../index.js";

import { createFloor } from "../prefabs/floor.js";
import { createGoblin } from "../prefabs/goblin.js";
import { createHealthPotion } from "../prefabs/healthPotion.js";
import { createKnight } from "../prefabs/knight.js";
import { createSword } from "../prefabs/sword.js";
import { createWall } from "../prefabs/wall.js";

import { buildDungeon } from "./dungeon.js";

export const initWorld = (loader) => {
  // create the world
  const world = createWorld();
  world.sprites = [];
  world.meta = [];

  setState((state) => {
    state.turn = "WORLD";
    state.debug = false;
    state.log = ["Adventure, awaits!"];
  });

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
      createWall(world, { x, y, z: 0 });
    }
    if (tile.sprite === "FLOOR") {
      const { x, y } = tile;
      createFloor(world, { x, y, z: 0 });
    }
  });

  // create the knight
  const knightEid = createKnight(world, {
    x: dungeon.rooms[0].center.x,
    y: dungeon.rooms[0].center.y,
    z: 0,
  });
  // player is the knight
  addComponent(world, PC, knightEid);

  const openTiles = _.filter(dungeon.tiles, (tile) => tile.sprite === "FLOOR");

  // spawn weapons
  _.times(10, () => {
    const { x, y } = _.sample(openTiles);
    createSword(world, { x, y, z: 0 });
  });

  // spawn potions
  _.times(10, () => {
    const { x, y } = _.sample(openTiles);
    createHealthPotion(world, { x, y, z: 0 });
  });

  // spawn baddies
  _.times(10, () => {
    const { x, y } = _.sample(openTiles);
    createGoblin(world, { x, y, z: 0 });
  });

  return { world };
};

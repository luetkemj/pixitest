import _ from "lodash";
import { createWorld } from "bitecs";
import { grid } from "./grid";

import { createHero } from "../prefabs/hero";
import { createGoblin } from "../prefabs/goblin";
import { createFloor } from "../prefabs/floor";
import { createWall } from "../prefabs/wall";

import { buildDungeon } from "./dungeon";

export const initWorld = (loader) => {
  // create the world
  const world = createWorld();
  world.sprites = [];
  world.meta = [];
  world.gameState = "GAME";
  world.turn = "WORLD";
  world.debug = false;
  world.log = ["Welcome, Adventurer!"];

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
      createWall(world, { x, y, z: 0, loader });
    }
    if (tile.sprite === "FLOOR") {
      const { x, y } = tile;
      createFloor(world, { x, y, z: 0, loader });
    }
  });

  // create the hero
  createHero(world, {
    x: dungeon.rooms[0].center.x,
    y: dungeon.rooms[0].center.y,
    z: 0,
    loader,
  });

  // spawn baddies
  const openTiles = _.filter(dungeon.tiles, (tile) => tile.sprite === "FLOOR");
  _.times(10, () => {
    const { x, y } = _.sample(openTiles);
    createGoblin(world, { x, y, z: 0, loader });
  });

  return { world };
};

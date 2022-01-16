import _ from "lodash";
import { addComponent, createWorld } from "bitecs";
import { PC } from "../ecs/components";
import { addLog, getState, setState } from "../index";
import { createKnight } from "../prefabs/knight";
import { generateDungeonFloor } from "./generators/dungeonfloor";
import { idToCell } from "./grid";

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

  const { dungeon, floor } = generateDungeonFloor({
    world,
    z,
    stairsUp: true,
    stairsDown: true,
  });

  // create the knight
  const knightEid = createKnight(world, {
    // x: dungeon.rooms[0].center.x,
    // y: dungeon.rooms[0].center.y,
    x: idToCell(floor.stairsDown).x,
    y: idToCell(floor.stairsDown).y,
    z,
  });
  // player is the knight
  addComponent(world, PC, knightEid);

  return { world };
};

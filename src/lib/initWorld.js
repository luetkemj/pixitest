import _ from "lodash";
import { addComponent, createWorld } from "bitecs";
import { Burning, Inventory, PC } from "../ecs/components";
import { addLog, getState, setState } from "../index";
import { createKnight } from "../prefabs/knight";
import { createTorch } from "../prefabs/torch";
import { createFlint } from "../prefabs/flint";
import { generateDungeonFloor } from "./generators/dungeonfloor";
import { idToCell } from "./grid";
import { fillFirstEmptySlot } from "../ecs/ecsHelpers";

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

  // create starting inventory
  const torchEid = createTorch(world);
  const flintEid = createFlint(world);

  addComponent(world, Burning, torchEid);

  [torchEid, flintEid].forEach((eid) => {
    fillFirstEmptySlot({
      component: Inventory,
      containerEid: knightEid,
      itemEid: eid,
    });
  });

  // player is the knight
  addComponent(world, PC, knightEid);

  return { world };
};

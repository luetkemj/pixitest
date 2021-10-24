import _ from "lodash";
import { addComponent, addEntity } from "bitecs";

import { Position, Zindex } from "../components";

import { addSprite } from "../lib/canvas";
import { updatePosition } from "../lib/ecsHelpers";

export const createFloor = (world, options) => {
  const { x, y, z } = options;

  const eid = addEntity(world);
  addComponent(world, Position, eid);

  addComponent(world, Zindex, eid);
  Zindex.zIndex[eid] = 10;

  updatePosition({
    world,
    newPos: { x, y, z },
    eid: eid,
  });

  addSprite({
    texture: "•",
    world,
    eid: eid,
    options: {
      tint: 0x555555,
    },
  });

  world.meta[eid] = {};
  world.meta[eid].name = "WALL";
};

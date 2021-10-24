import _ from "lodash";
import { addComponent, addEntity } from "bitecs";

import { Blocking, Opaque, Position, Zindex } from "../components";

import { addSprite } from "../lib/canvas";
import { updatePosition } from "../lib/ecsHelpers";

export const createWall = (world, options) => {
  const { x, y, z } = options;

  const eid = addEntity(world);
  addComponent(world, Position, eid);
  addComponent(world, Blocking, eid);
  addComponent(world, Opaque, eid);
  addComponent(world, Zindex, eid);
  Zindex.zIndex[eid] = 10;

  updatePosition({
    world,
    newPos: { x, y, z },
    eid: eid,
  });

  addSprite({
    texture: "#",
    world,
    eid: eid,
    options: {
      tint: 0xaaaaaa,
    },
  });

  world.meta[eid] = {};
  world.meta[eid].name = "WALL";
};

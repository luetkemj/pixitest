import _ from "../../dist/pkg/lodash.js";
import { addComponent, addEntity } from "../../dist/pkg/bitecs.js";

import { Blocking, Opaque, Position, Zindex } from "../components.js";

import { addSprite } from "../lib/canvas.js";
import { updatePosition } from "../lib/ecsHelpers.js";

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
  world.meta[eid].name = "wall";
  world.meta[eid].description =
    "One of the sides of a room or building connecting floor and ceiling or foundation and roof";
};

import _ from "../../dist/pkg/lodash.js";
import { addComponent, addEntity } from "../../dist/pkg/bitecs.js";

import { Position, Zindex } from "../components.js";

import { addSprite } from "../lib/canvas.js";
import { updatePosition } from "../lib/ecsHelpers.js";

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
  world.meta[eid].name = "floor";
  world.meta[eid].description =
    "The floor of the cave is flat hard and covered in dust.";
};

import _ from "lodash";
import { addComponent } from "bitecs";
import * as gfx from "../lib/graphics";
import { meta } from "../lib/meta";

import { Legendable, Stairs, Position, Zindex } from "../ecs/components";

import { addSprite } from "../lib/canvas";
import { createEntity, updatePosition } from "../ecs/ecsHelpers";

export const createStairs = (world, options) => {
  const { x, y, z, toZ, dir = "DOWN" } = options;

  const eid = createEntity(world);
  addComponent(world, Legendable, eid);
  addComponent(world, Position, eid);

  addComponent(world, Zindex, eid);
  Zindex.zIndex[eid] = 11;

  addComponent(world, Stairs, eid);
  Stairs.toZ[eid] = toZ;

  updatePosition({
    world,
    newPos: { x, y, z },
    eid: eid,
  });

  const stairsUpOrDown = dir === "DOWN" ? "stairsDown" : "stairsUp";

  addSprite({
    texture: gfx.chars[stairsUpOrDown],
    world,
    eid: eid,
    options: {
      tint: gfx.colors.stairs,
    },
  });

  world.meta[eid] = meta[stairsUpOrDown];
};

import _ from "lodash";
import { addComponent, addEntity } from "bitecs";
import * as gfx from "../lib/graphics";
import { meta } from "../lib/meta";

import { Position, Zindex } from "../ecs/components";

import { addSprite } from "../lib/canvas";
import { updatePosition } from "../ecs/ecsHelpers";

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
    texture: gfx.chars.floor,
    world,
    eid: eid,
    options: {
      tint: gfx.colors.floor,
    },
  });

  world.meta[eid] = meta.floor;
};

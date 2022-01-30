import _ from "lodash";
import { addComponent } from "bitecs";
import * as gfx from "../lib/graphics";
import { meta } from "../lib/meta";

import {
  Droppable,
  Legendable,
  Pickupable,
  Position,
  Zindex,
} from "../ecs/components";

import { addSprite } from "../lib/canvas";
import { createEntity, updatePosition } from "../ecs/ecsHelpers";

export const createFlint = (world, options) => {
  const eid = createEntity(world);
  addComponent(world, Droppable, eid);
  addComponent(world, Legendable, eid);
  addComponent(world, Pickupable, eid);
  addComponent(world, Position, eid);
  addComponent(world, Zindex, eid);
  Zindex.zIndex[eid] = 20;

  if (options) {
    const { x, y, z } = options;
    updatePosition({
      world,
      newPos: { x, y, z },
      eid: eid,
    });
  }

  addSprite({
    texture: gfx.chars.tool,
    world,
    eid: eid,
    options: {
      tint: gfx.colors.tool,
    },
  });

  world.meta[eid] = meta.flint;

  return eid;
};

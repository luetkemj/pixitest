import _ from "lodash";
import { addComponent } from "bitecs";
import * as gfx from "../lib/graphics";
import { meta } from "../lib/meta";

import { Blocking, Opaque, Position, Zindex } from "../ecs/components";

import { addSprite } from "../lib/canvas";
import { createEntity, updatePosition } from "../ecs/ecsHelpers";

export const createWall = (world, options) => {
  const { x, y, z } = options;

  const eid = createEntity(world);
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
    texture: gfx.chars.wall,
    world,
    eid: eid,
    options: {
      tint: gfx.colors.wall,
    },
  });

  world.meta[eid] = meta.wall;
};

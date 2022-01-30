import _ from "lodash";
import { addComponent } from "bitecs";
import * as gfx from "../lib/graphics";
import { meta } from "../lib/meta";

import {
  Damage,
  Droppable,
  Legendable,
  Light,
  Pickupable,
  Position,
  Wieldable,
  Zindex,
} from "../ecs/components";

import { addSprite } from "../lib/canvas";
import { createEntity, updatePosition } from "../ecs/ecsHelpers";

export const createTorch = (world, options) => {
  const eid = createEntity(world);
  addComponent(world, Damage, eid);
  addComponent(world, Droppable, eid);
  addComponent(world, Legendable, eid);
  addComponent(world, Light, eid);
  addComponent(world, Pickupable, eid);
  addComponent(world, Position, eid);
  addComponent(world, Wieldable, eid);
  addComponent(world, Zindex, eid);
  Zindex.zIndex[eid] = 20;

  Damage.max[eid] = 1;
  Damage.current[eid] = 1;

  Light.lumens[eid] = { max: 100, current: 100 };
  Light.beam[eid] = { max: 5, current: 5 };

  if (options) {
    const { x, y, z } = options;

    updatePosition({
      world,
      newPos: { x, y, z },
      eid: eid,
    });
  }

  addSprite({
    texture: gfx.chars.torch,
    world,
    eid: eid,
    options: {
      tint: gfx.colors.torchUnlit,
    },
  });

  world.meta[eid] = meta.torch;

  return eid;
};

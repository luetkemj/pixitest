import _ from "lodash";
import { addComponent, addEntity } from "bitecs";
import * as gfx from "../lib/graphics";
import { meta } from "../lib/meta";

import {
  Damage,
  Droppable,
  Pickupable,
  Position,
  Wieldable,
  Zindex,
} from "../components";

import { addSprite } from "../lib/canvas";
import { updatePosition } from "../lib/ecsHelpers";

export const createSword = (world, options) => {
  const { x, y, z } = options;

  const eid = addEntity(world);
  addComponent(world, Damage, eid);
  addComponent(world, Droppable, eid);
  addComponent(world, Pickupable, eid);
  addComponent(world, Position, eid);
  addComponent(world, Wieldable, eid);
  addComponent(world, Zindex, eid);
  Zindex.zIndex[eid] = 20;

  Damage.max[eid] = 2;
  Damage.current[eid] = 20;

  updatePosition({
    world,
    newPos: { x, y, z },
    eid: eid,
  });

  addSprite({
    texture: gfx.chars.weapon,
    world,
    eid: eid,
    options: {
      tint: gfx.colors.weapon,
    },
  });

  world.meta[eid] = meta.sword;
};

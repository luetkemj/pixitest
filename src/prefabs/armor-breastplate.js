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
  // armor component!
  addComponent(world, Droppable, eid);
  addComponent(world, Pickupable, eid);
  addComponent(world, Position, eid);
  // wearable component!
  addComponent(world, Zindex, eid);
  Zindex.zIndex[eid] = 20;

  // Armor.max[eid] = 2;
  // Armor.current[eid] = 20;

  updatePosition({
    world,
    newPos: { x, y, z },
    eid: eid,
  });

  addSprite({
    texture: gfx.chars.armor,
    world,
    eid: eid,
    options: {
      tint: gfx.colors.armor,
    },
  });

  world.meta[eid] = meta.breastplate;
};

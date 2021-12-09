import _ from "lodash";
import { addComponent, addEntity } from "bitecs";
import * as gfx from "../lib/graphics";
import { meta } from "../lib/meta";

import {
  Consumable,
  Droppable,
  Effects,
  Pickupable,
  Position,
  Zindex,
} from "../components";

import { addSprite } from "../lib/canvas";
import { updatePosition } from "../lib/ecsHelpers";

export const createHealthPotion = (world, options) => {
  const { x, y, z } = options;

  const eid = addEntity(world);
  addComponent(world, Consumable, eid);
  addComponent(world, Droppable, eid);
  addComponent(world, Effects, eid);
  addComponent(world, Pickupable, eid);
  addComponent(world, Position, eid);
  addComponent(world, Zindex, eid);
  Zindex.zIndex[eid] = 20;

  Effects.health[eid] = 5;
  Effects.strength[eid] = 0;

  updatePosition({
    world,
    newPos: { x, y, z },
    eid: eid,
  });

  addSprite({
    texture: gfx.chars.potion,
    world,
    eid: eid,
    options: {
      tint: gfx.colors.potion,
    },
  });

  world.meta[eid] = meta.healthPotion;
};

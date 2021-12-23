import _ from "lodash";
import { addComponent, addEntity } from "bitecs";
import * as gfx from "../lib/graphics";
import { meta } from "../lib/meta";

import {
  Droppable,
  Effects,
  Liquid,
  Legendable,
  Pickupable,
  Position,
  Zindex,
} from "../components";

import { addSprite } from "../lib/canvas";
import { updatePosition } from "../lib/ecsHelpers";

export const createHealthPotion = (world, options) => {
  const { x, y, z } = options;

  const eid = addEntity(world);
  addComponent(world, Liquid, eid);
  addComponent(world, Droppable, eid);
  addComponent(world, Effects, eid);
  addComponent(world, Legendable, eid);
  addComponent(world, Pickupable, eid);
  addComponent(world, Position, eid);
  addComponent(world, Zindex, eid);
  Zindex.zIndex[eid] = 20;

  Effects.Health[eid] = 5;
  Effects.Strength[eid] = 0;

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

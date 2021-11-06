import _ from "lodash";
import { addComponent, addEntity } from "bitecs";

import {
  Consumable,
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
    texture: "!",
    world,
    eid: eid,
    options: {
      tint: 0xdaa520,
    },
  });

  world.meta[eid] = {};
  world.meta[eid].name = "health potion";
  world.meta[eid].description =
    "A shimmering red liquid in a small glass vial.";
};

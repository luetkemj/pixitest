import _ from "../../_snowpack/pkg/lodash.js";
import { addComponent, addEntity } from "../../_snowpack/pkg/bitecs.js";

import {
  Damage,
  Droppable,
  Pickupable,
  Position,
  Wieldable,
  Zindex,
} from "../components.js";

import { addSprite } from "../lib/canvas.js";
import { updatePosition } from "../lib/ecsHelpers.js";

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
    texture: ")",
    world,
    eid: eid,
    options: {
      tint: 0xdaa520,
    },
  });

  world.meta[eid] = {};
  world.meta[eid].name = "sword";
  world.meta[eid].description =
    "A weapon with a long blade for cutting or thrusting that is often used as a symbol of honor or authority";
};

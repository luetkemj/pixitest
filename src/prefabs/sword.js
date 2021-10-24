import _ from "lodash";
import { addComponent, addEntity } from "bitecs";

import { Damage, Pickupable, Position, Wieldable, Zindex } from "../components";

import { addSprite } from "../lib/canvas";
import { updatePosition } from "../lib/ecsHelpers";

export const createSword = (world, options) => {
  const { x, y, z } = options;

  const eid = addEntity(world);
  addComponent(world, Damage, eid);
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
  world.meta[eid].name = "Sword";
};

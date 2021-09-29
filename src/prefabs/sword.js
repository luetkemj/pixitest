import _ from "lodash";
import { addComponent, addEntity } from "bitecs";

import { Damage, Pickupable, Position, Render, Wieldable } from "../components";

import { addSprite } from "../lib/canvas";
import { updatePosition } from "../lib/ecsHelpers";

export const createSword = (world, options) => {
  const { x, y, z } = options;

  const eid = addEntity(world);
  addComponent(world, Damage, eid);
  addComponent(world, Pickupable, eid);
  addComponent(world, Position, eid);
  addComponent(world, Render, eid);
  addComponent(world, Wieldable, eid);

  Damage.max[eid] = 2;
  Damage.current[eid] = 20;

  updatePosition({
    world,
    newPos: { x, y, z },
    eid: eid,
  });

  addSprite({
    texture: "sword",
    world,
    eid: eid,
  });

  world.meta[eid] = {};
  world.meta[eid].name = "Sword";
};

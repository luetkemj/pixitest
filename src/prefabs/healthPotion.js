import _ from "lodash";
import { addComponent, addEntity } from "bitecs";

import {
  Consumable,
  Effects,
  Pickupable,
  Position,
  Render,
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
  addComponent(world, Render, eid);

  Effects.health[eid] = 5;
  Effects.strength[eid] = 0;

  updatePosition({
    world,
    newPos: { x, y, z },
    eid: eid,
  });

  addSprite({
    texture: "healthPotion",
    world,
    eid: eid,
  });

  world.meta[eid] = {};
  world.meta[eid].name = "Health Potion";
};

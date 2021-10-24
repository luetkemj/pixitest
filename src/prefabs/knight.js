import _ from "lodash";
import { addComponent, addEntity } from "bitecs";

import {
  Blocking,
  Health,
  Intelligence,
  Inventory,
  Position,
  Strength,
  Zindex,
} from "../components";

import { addSprite } from "../lib/canvas";
import { updatePosition } from "../lib/ecsHelpers";

export const createKnight = (world, options) => {
  const { x, y, z } = options;

  const eid = addEntity(world);
  addComponent(world, Position, eid);
  addComponent(world, Health, eid);
  addComponent(world, Blocking, eid);
  addComponent(world, Intelligence, eid);
  addComponent(world, Inventory, eid);
  addComponent(world, Strength, eid);
  addComponent(world, Zindex, eid);
  Zindex.zIndex[eid] = 30;

  Health.max[eid] = 10;
  Health.current[eid] = 10;
  Intelligence.max[eid] = 10;
  Intelligence.current[eid] = 10;
  Strength.max[eid] = 5;
  Strength.current[eid] = 5;

  updatePosition({
    world,
    newPos: { x, y, z },
    eid: eid,
  });

  addSprite({
    texture: "@",
    world,
    eid: eid,
  });

  world.meta[eid] = {};
  world.meta[eid].name = "Knight";

  return eid;
};

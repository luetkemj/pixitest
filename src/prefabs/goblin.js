import _ from "lodash";
import { addComponent, addEntity } from "bitecs";

import {
  Ai,
  Blocking,
  Body,
  Forgettable,
  Health,
  Intelligence,
  Pickupable,
  Position,
  Strength,
  Wieldable,
  Zindex,
} from "../components";

import { createHumanoidBody } from "./bodies/createHumanoidBody";

import { addSprite } from "../lib/canvas";
import { updatePosition } from "../lib/ecsHelpers";

export const createGoblin = (world, options) => {
  const { x, y, z } = options;

  const eid = addEntity(world);
  addComponent(world, Position, eid);
  addComponent(world, Blocking, eid);
  addComponent(world, Body, eid);
  addComponent(world, Forgettable, eid);
  addComponent(world, Health, eid);
  addComponent(world, Ai, eid);
  addComponent(world, Intelligence, eid);
  addComponent(world, Pickupable, eid);
  addComponent(world, Strength, eid);
  addComponent(world, Wieldable, eid);
  addComponent(world, Zindex, eid);

  Zindex.zIndex[eid] = 30;
  Health.max[eid] = 10;
  Health.current[eid] = 10;
  Intelligence.max[eid] = 5;
  Intelligence.current[eid] = 5;
  Strength.max[eid] = 1;
  Strength.current[eid] = 1;

  createHumanoidBody(world, eid);

  updatePosition({
    world,
    newPos: { x, y, z },
    eid: eid,
  });

  addSprite({
    texture: "g",
    world,
    eid: eid,
    options: {
      tint: 0x81a842,
    },
  });

  world.meta[eid] = {};
  world.meta[eid].name = "GOBLIN";
  world.meta[eid].debugSprites = [];
  world.meta[eid].ai = { pathAlgo: "", path: [] };

  return eid;
};

import _ from "lodash";
import { addComponent, addEntity } from "bitecs";

import {
  Blocking,
  Fov,
  Health,
  Intelligence,
  Inventory,
  PC,
  Position,
  Render,
  Strength,
} from "../components";

import { addSprite } from "../lib/canvas";
import { updatePosition } from "../lib/ecsHelpers";

export const createHero = (world, options) => {
  const { x, y, z } = options;

  const eid = addEntity(world);
  addComponent(world, PC, eid);
  addComponent(world, Position, eid);
  addComponent(world, Render, eid);
  addComponent(world, Fov, eid);
  addComponent(world, Health, eid);
  addComponent(world, Blocking, eid);
  addComponent(world, Intelligence, eid);
  addComponent(world, Inventory, eid);
  addComponent(world, Strength, eid);

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
    texture: "hero",
    world,
    eid: eid,
  });

  world.meta[eid] = {};
  world.meta[eid].name = "HERO";
};

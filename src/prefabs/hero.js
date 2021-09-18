import _ from "lodash";
import { addComponent, addEntity } from "bitecs";

import {
  Blocking,
  Brain,
  Fov,
  Health,
  Intelligence,
  Position,
  Render,
} from "../components";

import { addSprite } from "../lib/canvas";
import { updatePosition } from "../lib/ecsHelpers";

export const createHero = (world, options) => {
  const { x, y, z } = options;

  const eid = addEntity(world);
  addComponent(world, Position, eid);
  addComponent(world, Render, eid);
  addComponent(world, Fov, eid);
  addComponent(world, Health, eid);
  addComponent(world, Brain, eid);
  addComponent(world, Blocking, eid);
  addComponent(world, Intelligence, eid);

  Health.max[eid] = 10;
  Health.current[eid] = 10;
  Intelligence.max[eid] = 10;
  Intelligence.current[eid] = 10;

  updatePosition({
    world,
    newPos: { x, y, z },
    eid: eid,
  });

  addSprite({
    texture: "heroes/knight/knight_idle_anim_f0.png",
    world,
    eid: eid,
  });

  world.hero = eid;
  world.meta[eid] = {};
  world.meta[eid].name = "HERO";
};

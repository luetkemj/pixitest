import _ from "../../_snowpack/pkg/lodash.js";
import { addComponent, addEntity } from "../../_snowpack/pkg/bitecs.js";

import {
  Blocking,
  Fov,
  Health,
  Intelligence,
  Position,
  Render,
  Strength,
} from "../components.js";

import { addSprite } from "../lib/canvas.js";
import { updatePosition } from "../lib/ecsHelpers.js";

export const createHero = (world, options) => {
  const { x, y, z } = options;

  const eid = addEntity(world);
  addComponent(world, Position, eid);
  addComponent(world, Render, eid);
  addComponent(world, Fov, eid);
  addComponent(world, Health, eid);
  addComponent(world, Blocking, eid);
  addComponent(world, Intelligence, eid);
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
    texture: "../../static/heroes/knight/knight_idle_anim_f0.png",
    world,
    eid: eid,
  });

  world.hero = eid;
  world.meta[eid] = {};
  world.meta[eid].name = "HERO";
};

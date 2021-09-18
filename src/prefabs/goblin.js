import _ from "lodash";
import { addComponent, addEntity } from "bitecs";

import {
  Ai,
  Blocking,
  Brain,
  Forgettable,
  Health,
  Intelligence,
  Position,
  Render,
} from "../components";

import { addSprite } from "../lib/canvas";
import { updatePosition } from "../lib/ecsHelpers";

export const createGoblin = (world, options) => {
  const { x, y, z } = options;

  const eid = addEntity(world);
  addComponent(world, Position, eid);
  addComponent(world, Render, eid);
  addComponent(world, Blocking, eid);
  addComponent(world, Forgettable, eid);
  addComponent(world, Health, eid);
  addComponent(world, Ai, eid);
  addComponent(world, Brain, eid);
  addComponent(world, Intelligence, eid);

  Health.max[eid] = 10;
  Health.current[eid] = 10;
  Intelligence.max[eid] = 5;
  Intelligence.current[eid] = 5;

  updatePosition({
    world,
    newPos: { x, y, z },
    eid: eid,
  });

  addSprite({
    texture: "enemies/goblin/goblin_idle_anim_f0.png",
    world,
    eid: eid,
  });

  world.meta[eid] = {};
  world.meta[eid].name = "GOBLIN";
};

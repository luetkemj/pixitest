import _ from "lodash";
import { addComponent, addEntity } from "bitecs";
import * as gfx from "../lib/graphics";
import { meta } from "../lib/meta";

import {
  Ai,
  Blocking,
  Body,
  Damage,
  Droppable,
  Forgettable,
  Health,
  Intelligence,
  Legendable,
  Position,
  Strength,
  Wieldable,
  Zindex,
} from "../ecs/components";

import { createHumanoidBody } from "./bodies/createHumanoidBody";

import { addSprite } from "../lib/canvas";
import { updatePosition } from "../ecs/ecsHelpers";

export const createGoblin = (world, options) => {
  const { x, y, z } = options;

  const eid = addEntity(world);
  addComponent(world, Position, eid);
  addComponent(world, Blocking, eid);
  addComponent(world, Body, eid);
  addComponent(world, Damage, eid);
  addComponent(world, Droppable, eid);
  addComponent(world, Forgettable, eid);
  addComponent(world, Health, eid);
  addComponent(world, Legendable, eid);
  addComponent(world, Ai, eid);
  addComponent(world, Intelligence, eid);
  addComponent(world, Strength, eid);
  addComponent(world, Wieldable, eid);
  addComponent(world, Zindex, eid);

  Zindex.zIndex[eid] = 30;
  Damage.max[eid] = 2;
  Damage.current[eid] = 2;
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
    texture: gfx.chars.goblin,
    world,
    eid: eid,
    options: {
      tint: gfx.colors.goblin,
    },
  });

  world.meta[eid] = meta.goblin;
  world.meta[eid].debugSprites = [];
  world.meta[eid].ai = { pathAlgo: "", path: [] };

  return eid;
};

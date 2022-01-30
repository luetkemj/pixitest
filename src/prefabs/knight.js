import _ from "lodash";
import { addComponent } from "bitecs";
import * as gfx from "../lib/graphics";
import { meta } from "../lib/meta";
import {
  Blocking,
  Body,
  Droppable,
  FovRange,
  Health,
  Intelligence,
  Inventory,
  Legendable,
  Position,
  Strength,
  Zindex,
  Revealed,
} from "../ecs/components";
import { createHumanoidBody } from "./bodies/createHumanoidBody";
import { addSprite } from "../lib/canvas";
import { createEntity, updatePosition } from "../ecs/ecsHelpers";

export const createKnight = (world, options) => {
  const { x, y, z } = options;

  const eid = createEntity(world);
  addComponent(world, Position, eid);
  addComponent(world, Health, eid);
  addComponent(world, Body, eid);
  addComponent(world, Blocking, eid);
  addComponent(world, Droppable, eid);
  addComponent(world, FovRange, eid);
  addComponent(world, Intelligence, eid);
  addComponent(world, Inventory, eid);
  addComponent(world, Legendable, eid);
  addComponent(world, Strength, eid);
  addComponent(world, Zindex, eid);
  addComponent(world, Revealed, eid);

  // range is full width of map
  FovRange.dist[eid] = 87;
  Health.max[eid] = 1000;
  Health.current[eid] = 1000;
  Intelligence.max[eid] = 10;
  Intelligence.current[eid] = 10;
  Strength.max[eid] = 5;
  Strength.current[eid] = 5;
  Zindex.zIndex[eid] = 30;

  createHumanoidBody(world, eid);

  updatePosition({
    world,
    newPos: { x, y, z },
    eid: eid,
  });

  addSprite({
    texture: gfx.chars.knight,
    world,
    eid: eid,
    tint: gfx.colors.knight,
  });

  world.meta[eid] = meta.knight;

  return eid;
};

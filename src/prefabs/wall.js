import _ from "lodash";
import { addComponent, addEntity } from "bitecs";

import { Blocking, Opaque, Position, Render } from "../components";

import { addSprite } from "../lib/canvas";
import { updatePosition } from "../lib/ecsHelpers";

export const createWall = (world, options) => {
  const { x, y, z, loader } = options;

  const eid = addEntity(world);
  addComponent(world, Position, eid);
  addComponent(world, Render, eid);
  addComponent(world, Blocking, eid);
  addComponent(world, Opaque, eid);

  updatePosition({
    world,
    newPos: { x, y, z },
    eid: eid,
  });

  addSprite({
    texture: loader.resources.wall.texture,
    world,
    eid: eid,
  });

  world.meta[eid] = {};
  world.meta[eid].name = "WALL";
};

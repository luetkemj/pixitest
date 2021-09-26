import _ from "lodash";
import { addComponent, addEntity } from "bitecs";

import { Position, Render } from "../components";

import { addSprite } from "../lib/canvas";
import { updatePosition } from "../lib/ecsHelpers";

export const createFloor = (world, options) => {
  const { x, y, z, loader } = options;

  const eid = addEntity(world);
  addComponent(world, Position, eid);
  addComponent(world, Render, eid);

  updatePosition({
    world,
    newPos: { x, y, z },
    eid: eid,
  });

  addSprite({
    texture: loader.resources.floor.texture,
    world,
    eid: eid,
  });

  world.meta[eid] = {};
  world.meta[eid].name = "WALL";
};

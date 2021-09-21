import _ from "../../_snowpack/pkg/lodash.js";
import { addComponent, addEntity } from "../../_snowpack/pkg/bitecs.js";

import { Blocking, Opaque, Position, Render } from "../components.js";

import { addSprite } from "../lib/canvas.js";
import { updatePosition } from "../lib/ecsHelpers.js";

export const createWall = (world, options) => {
  const { x, y, z } = options;

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
    texture: "../../static/tiles/wall/wall_1.png",
    world,
    eid: eid,
  });

  world.meta[eid] = {};
  world.meta[eid].name = "WALL";
};

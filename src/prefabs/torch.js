import _ from "lodash";
import { addComponent } from "bitecs";
import * as gfx from "../lib/graphics";
import { meta } from "../lib/meta";

import {
  Damage,
  Droppable,
  Burning,
  ResistBurning,
  Durability,
  Legendable,
  Lumens,
  Beam,
  Pickupable,
  Position,
  Wieldable,
  Zindex,
} from "../ecs/components";

import { addSprite } from "../lib/canvas";
import { createEntity, updatePosition } from "../ecs/ecsHelpers";

export const createTorch = (world, options) => {
  const eid = createEntity(world);
  addComponent(world, Damage, eid);
  addComponent(world, Droppable, eid);
  addComponent(world, Legendable, eid);
  addComponent(world, Lumens, eid);
  addComponent(world, Beam, eid);
  addComponent(world, Pickupable, eid);
  addComponent(world, Position, eid);
  addComponent(world, Wieldable, eid);
  addComponent(world, Zindex, eid);

  addComponent(world, Durability, eid);
  addComponent(world, Burning, eid);
  addComponent(world, ResistBurning, eid);

  Durability.current[eid] = 1000;
  Durability.max[eid] = 1000;

  ResistBurning.current[eid] = 1;
  ResistBurning.max[eid] = 1;

  Zindex.zIndex[eid] = 20;

  Damage.max[eid] = 1;
  Damage.current[eid] = 1;

  Lumens.max[eid] = 100;
  Lumens.current[eid] = 100;

  Beam.max[eid] = 5;
  Beam.current[eid] = 5;

  if (options) {
    const { x, y, z } = options;

    updatePosition({
      world,
      newPos: { x, y, z },
      eid: eid,
    });
  }

  addSprite({
    texture: gfx.chars.torch,
    world,
    eid: eid,
    options: {
      tint: gfx.colors.torchUnlit,
    },
  });

  world.meta[eid] = meta.torch;

  return eid;
};

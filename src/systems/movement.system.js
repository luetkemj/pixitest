import {
  defineQuery,
  addComponent,
  hasComponent,
  removeComponent,
} from "bitecs";
import {
  Ai,
  Blocking,
  Damage,
  Dead,
  Forgettable,
  Health,
  PC,
  Position,
  Render,
  Strength,
  Fov,
  MoveTo,
  Wielding,
} from "../components";
import { updatePosition } from "../lib/ecsHelpers";
import { grid } from "../lib/grid";

const movementQuery = defineQuery([Position, MoveTo]);
const pcQuery = defineQuery([PC]);

const kill = (world, eid) => {
  addComponent(world, Dead, eid);
  addComponent(world, Render, eid);
  removeComponent(world, MoveTo, eid);
  removeComponent(world, Ai, eid);
  removeComponent(world, Blocking, eid);
  removeComponent(world, Forgettable, eid);
};

const attack = (world, aggressor, target) => {
  let damage = Strength.current[aggressor];

  const isWielding = hasComponent(world, Wielding, aggressor);
  if (isWielding) {
    const wieldable = Wielding.slot[aggressor];
    if (hasComponent(world, Damage, wieldable)) {
      damage += Damage.current[wieldable];
    }
  }

  Health.current[target] -= damage;
  if (Health.current[target] <= 0) {
    kill(world, target);
  }
};

export const movementSystem = (world) => {
  const ents = movementQuery(world);
  const pcEnts = pcQuery(world);

  for (let i = 0; i < ents.length; i++) {
    const eid = ents[i];
    let canMove = false;

    const oldPos = {
      x: Position.x[eid],
      y: Position.y[eid],
      z: Position.z[eid],
    };

    const newPos = {
      x: MoveTo.x[eid],
      y: MoveTo.y[eid],
      z: MoveTo.z[eid],
    };

    // check if location is within bounds
    if (
      newPos.x >= 0 &&
      newPos.x < grid.width &&
      newPos.y >= 0 &&
      newPos.y < grid.height
    ) {
      canMove = true;
    }

    // check if blocked
    world.eAtPos[`${newPos.x},${newPos.y},${newPos.z}`].forEach((e) => {
      if (hasComponent(world, Blocking, e)) {
        canMove = false;

        // check if blocked by thing with health
        if (hasComponent(world, Health, e)) {
          // attack the thing!
          attack(world, eid, e);

          if (pcEnts.includes(eid)) {
            const msg = `You attack a ${world.meta[e].name}!`;
            world.log.unshift(msg);
          } else {
            const msg = `A ${world.meta[eid].name} attacks you!`;
            world.log.unshift(msg);
          }
        } else {
          world.log.unshift("BUMP!");
        }
      }
    });

    // update position
    if (canMove) {
      updatePosition({ world, oldPos, newPos, eid });
    }

    removeComponent(world, MoveTo, eid);

    if (canMove) {
      addComponent(world, Render, eid);
      if (pcEnts.includes(eid)) {
        addComponent(world, Fov, eid);
      }
    }
  }
  return world;
};

import _ from "../../dist/pkg/lodash.js";
import {
  defineQuery,
  addComponent,
  hasComponent,
  removeComponent,
} from "../../dist/pkg/bitecs.js";
import { setState } from "../index.js";
import {
  Ai,
  Blocking,
  Damage,
  Dead,
  Forgettable,
  Health,
  PC,
  Pickupable,
  Position,
  Strength,
  MoveTo,
  Zindex,
} from "../components.js";
import { getWielders, updatePosition } from "../lib/ecsHelpers.js";
import { grid } from "../lib/grid.js";

const movementQuery = defineQuery([Position, MoveTo]);
const pcQuery = defineQuery([PC]);

const kill = (world, eid) => {
  addComponent(world, Dead, eid);
  addComponent(world, Pickupable, eid);
  removeComponent(world, MoveTo, eid);
  removeComponent(world, Ai, eid);
  removeComponent(world, Blocking, eid);
  removeComponent(world, Forgettable, eid);
  Zindex.zIndex[eid] = 20;
};

const attack = (world, aggressor, target) => {
  let damage = Strength.current[aggressor];

  const wielders = getWielders(world, aggressor);
  _.each(wielders, (wielder) => {
    const itemEid = wielder[1];
    if (itemEid) {
      if (hasComponent(world, Damage, itemEid)) {
        damage += Damage.current[itemEid];
      }
    }
  });

  setState((state) => {
    state.log.unshift(
      `${world.meta[aggressor].name} hits ${world.meta[target].name} for ${damage} damage`
    );
  });

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
            setState((state) => {
              state.log = [msg, ...state.log];
            });
          } else {
            const msg = `A ${world.meta[eid].name} attacks you!`;
            setState((state) => {
              state.log = [msg, ...state.log];
            });
          }
        } else {
          setState((state) => {
            state.log = ["BUMP!", ...state.log];
          });
        }
      }
    });

    // update position
    if (canMove) {
      updatePosition({ world, oldPos, newPos, eid });
    }

    removeComponent(world, MoveTo, eid);
  }
  return world;
};

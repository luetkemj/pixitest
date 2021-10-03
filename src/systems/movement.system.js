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
  Position,
  Render,
  Strength,
  Fov,
  MoveTo,
  Wielding,
} from "../components";
import { updatePosition } from "../lib/ecsHelpers";

const movementQuery = defineQuery([Position, MoveTo]);

const kill = (world, eid) => {
  addComponent(world, Dead, eid);
  addComponent(world, Render, eid);
  removeComponent(world, MoveTo, eid);
  removeComponent(world, Ai, eid);
  removeComponent(world, Blocking, eid);
  removeComponent(world, Forgettable, eid);

  if (world.hero === eid) {
    world.gameState = "GAMEOVER";
  }
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
    if (newPos.x >= 0 && newPos.x < 100 && newPos.y >= 0 && newPos.y < 34) {
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

          if (eid === world.hero) {
            const msg = `You attack a ${world.meta[e].name}!`;
            world.log.push(msg);
          } else {
            const msg = `A ${world.meta[eid].name} attacks you!`;
            world.log.push(msg);
          }
        } else {
          world.log.push("BUMP!");
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
      if (eid === world.hero) {
        addComponent(world, Fov, eid);
      }
    }
  }
  return world;
};

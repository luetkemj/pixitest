import { defineQuery, addComponent } from "bitecs";
import { PC, Position, MoveTo } from "../components";
import * as actions from "../lib/actions";
import { grid } from "../lib/grid";

const pcQuery = defineQuery([PC]);

export const userInputSystem = (world) => {
  const { userInput } = world;

  if (!userInput) {
    return world;
  }

  const { key, shiftKey } = userInput;

  if (world.getMode() === "LOOKING") {
    const steps = shiftKey ? 5 : 1;

    if (key === "ArrowUp") {
      const y = world.lookingAt.y - steps;
      world.lookingAt.y = Math.min(grid.overlay.height - 1, Math.max(0, y));
    }
    if (key === "ArrowRight") {
      const x = world.lookingAt.x + steps;
      world.lookingAt.x = Math.min(grid.overlay.width - 1, Math.max(0, x));
    }
    if (key === "ArrowDown") {
      const y = world.lookingAt.y + steps;
      world.lookingAt.y = Math.min(grid.overlay.height - 1, Math.max(0, y));
    }
    if (key === "ArrowLeft") {
      const x = world.lookingAt.x - steps;
      world.lookingAt.x = Math.min(grid.overlay.width - 1, Math.max(0, x));
    }
  }

  if (world.getMode() === "GAME") {
    const ents = pcQuery(world);

    for (let i = 0; i < ents.length; i++) {
      const eid = ents[i];

      if (key === "ArrowUp") {
        addComponent(world, MoveTo, eid);
        MoveTo.x[eid] = Position.x[eid];
        MoveTo.y[eid] = Position.y[eid] - 1;
        MoveTo.z[eid] = Position.z[eid];
      }
      if (key === "ArrowRight") {
        addComponent(world, MoveTo, eid);
        MoveTo.x[eid] = Position.x[eid] + 1;
        MoveTo.y[eid] = Position.y[eid];
        MoveTo.z[eid] = Position.z[eid];
      }
      if (key === "ArrowDown") {
        addComponent(world, MoveTo, eid);
        MoveTo.x[eid] = Position.x[eid];
        MoveTo.y[eid] = Position.y[eid] + 1;
        MoveTo.z[eid] = Position.z[eid];
      }
      if (key === "ArrowLeft") {
        addComponent(world, MoveTo, eid);
        MoveTo.x[eid] = Position.x[eid] - 1;
        MoveTo.y[eid] = Position.y[eid];
        MoveTo.z[eid] = Position.z[eid];
      }
      if (key === "g") {
        actions.get(world, eid);
      }
    }
  }

  world.userInput = null;
  return world;
};

import { defineQuery, addComponent } from "../../dist/pkg/bitecs.js";
import { PC, Position, MoveTo } from "../components.js";
import * as actions from "../lib/actions.js";
import { grid } from "../lib/grid.js";
import { getState, setState } from "../index.js";

const pcQuery = defineQuery([PC]);

export const userInputSystem = (world) => {
  const { userInput, mode } = getState();

  if (!userInput) {
    return world;
  }

  const { key, shiftKey } = userInput;

  if (mode === "LOOKING") {
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

  if (mode === "GAME") {
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

  setState((state) => {
    state.userInput = null;
  });
  return world;
};

import { defineQuery, addComponent } from "bitecs";
import { PC, Position, MoveTo } from "../components";

const pcQuery = defineQuery([PC]);

export const userInputSystem = (world) => {
  const { userInput } = world;

  if (!userInput) {
    return world;
  }

  const ents = pcQuery(world);

  for (let i = 0; i < ents.length; i++) {
    const eid = ents[i];

    if (userInput === "ArrowUp") {
      addComponent(world, MoveTo, eid);
      MoveTo.x[eid] = Position.x[eid];
      MoveTo.y[eid] = Position.y[eid] - 1;
      MoveTo.z[eid] = Position.z[eid];
    }
    if (userInput === "ArrowRight") {
      addComponent(world, MoveTo, eid);
      MoveTo.x[eid] = Position.x[eid] + 1;
      MoveTo.y[eid] = Position.y[eid];
      MoveTo.z[eid] = Position.z[eid];
    }
    if (userInput === "ArrowDown") {
      addComponent(world, MoveTo, eid);
      MoveTo.x[eid] = Position.x[eid];
      MoveTo.y[eid] = Position.y[eid] + 1;
      MoveTo.z[eid] = Position.z[eid];
    }
    if (userInput === "ArrowLeft") {
      addComponent(world, MoveTo, eid);
      MoveTo.x[eid] = Position.x[eid] - 1;
      MoveTo.y[eid] = Position.y[eid];
      MoveTo.z[eid] = Position.z[eid];
    }
  }

  world.userInput = null;
  return world;
};

import { defineQuery } from "bitecs";
import { Dead, PC } from "../components";

const deadPCQuery = defineQuery([Dead, PC]);

export const gameOverSystem = (world) => {
  const ents = deadPCQuery(world);

  if (ents.length) {
    world.setMode("GAMEOVER");
  }

  return world;
};

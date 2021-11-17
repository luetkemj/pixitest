import { setState } from "../index";
import { defineQuery } from "bitecs";
import { Dead, PC } from "../components";

const deadPCQuery = defineQuery([Dead, PC]);

export const gameOverSystem = (world) => {
  const ents = deadPCQuery(world);

  if (ents.length) {
    setState((state) => {
      state.mode = "GAMEOVER";
    });
  }

  return world;
};

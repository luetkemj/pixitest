import { setState } from "../index.js";
import { defineQuery } from "../../_snowpack/pkg/bitecs.js";
import { Dead, PC } from "../components.js";

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

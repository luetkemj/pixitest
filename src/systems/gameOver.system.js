import { setState } from "../index";
import { deadPCQuery } from "../queries";

export const gameOverSystem = (world) => {
  const ents = deadPCQuery(world);

  if (ents.length) {
    setState((state) => {
      state.mode = "GAMEOVER";
    });
  }

  return world;
};

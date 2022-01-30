import { addComponent, hasComponent, removeComponent } from "bitecs";
import { durabilityQuery } from "../queries";
import { Broken, Burning, Durability, ResistBurning } from "../components";

export const entropySystem = (world) => {
  const ents = durabilityQuery(world);

  for (let i = 0; i < ents.length; i++) {
    const eid = ents[i];

    if (!hasComponent(world, Broken, eid)) {
      // handle burning
      if (hasComponent(world, Burning, eid)) {
        let resistance = 0;
        if (hasComponent(world, ResistBurning, eid)) {
          resistance = ResistBurning.current[eid];
        }

        const delta = 5 - resistance;
        const dur = Durability.current[eid] - delta;
        if (dur > 0) {
          Durability.current[eid] -= delta;
        } else {
          Durability.current[eid] = 0;
        }

        if (Durability.current[eid] <= 0) {
          removeComponent(world, Burning, eid);
          addComponent(world, Broken, eid);
        }
      }
    }
  }

  return world;
};

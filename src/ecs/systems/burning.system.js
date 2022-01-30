import { addComponent, hasComponent, removeComponent } from "bitecs";
import { burningQuery } from "../queries";
import {
  Beam,
  Broken,
  Burning,
  Lumens,
  Durability,
  ResistBurning,
} from "../components";

export const burningSystem = (world) => {
  const ents = burningQuery(world);

  for (let i = 0; i < ents.length; i++) {
    const eid = ents[i];

    if (!hasComponent(world, Broken, eid)) {
      // handle burning
      if (hasComponent(world, Burning, eid)) {
        if (!hasComponent(world, Lumens, eid)) {
          addComponent(world, Lumens, eid);
          Lumens.max[eid] = 100;
          Lumens.current[eid] = 100;
        }

        if (!hasComponent(world, Beam, eid)) {
          addComponent(world, Beam, eid);
          Beam.max[eid] = 5;
          Beam.current[eid] = 5;
        }

        if (hasComponent(world, Durability, eid)) {
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
  }

  return world;
};

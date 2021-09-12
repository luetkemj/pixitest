import {
  defineQuery,
  addComponent,
  hasComponent,
  removeComponent,
  getEntityComponents,
} from "bitecs";
import { Fov, InFov, Opaque, Position, Render, Revealed } from "../components";
import { grid } from "../lib/grid";
import { createFOV } from "../lib/fov";

const FovQuery = defineQuery([Fov]);
const inFovQuery = defineQuery([InFov]);
const opaqueQuery = defineQuery([Opaque]);

export const fovSystem = (world) => {
  const fovEnts = FovQuery(world);

  // return if we don't need to recalc FOV
  if (!fovEnts.length) {
    return world;
  } else {
    // clear out Fov components so we don't recalc FOV again
    for (let i = 0; i < fovEnts.length; i++) {
      const eid = fovEnts[i];
      removeComponent(world, Fov, eid);
      addComponent(world, Render, eid);
    }
  }

  // Create FOV schema
  const { width, height } = grid;
  const origin = { x: Position.x[world.hero], y: Position.y[world.hero] };
  const radius = 4;
  const blockingLocations = new Set();

  const blockingEnts = opaqueQuery(world);
  for (let i = 0; i < blockingEnts.length; i++) {
    const eid = blockingEnts[i];
    blockingLocations.add(`${Position.x[eid]},${Position.y[eid]}`);
  }

  const FOV = createFOV({
    blockingLocations,
    width,
    height,
    originX: origin.x,
    originY: origin.y,
    radius,
  });

  // clear out stale fov
  const inFovEnts = inFovQuery(world);
  for (let i = 0; i < inFovEnts.length; i++) {
    const eid = inFovEnts[i];
    removeComponent(world, InFov, eid);
    addComponent(world, Render, eid);
  }

  console.log(FOV.fov.size);

  FOV.fov.forEach((locId) => {
    const eAtPos = world.eAtPos[`${locId},0`];

    if (eAtPos) {
      // console.log(locId);
      eAtPos.forEach((eidAtPos) => {
        addComponent(world, InFov, eidAtPos);
        addComponent(world, Render, eidAtPos);
        addComponent(world, Revealed, eidAtPos);

        console.log(hasComponent(world, InFov, eidAtPos));
      });
    }
  });

  return world;
};

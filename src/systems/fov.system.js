import {
  defineQuery,
  addComponent,
  hasComponent,
  removeComponent,
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
    }
  }

  // Create FOV schema
  const { width, height } = grid;
  const origin = { x: Position.x[world.hero], y: Position.y[world.hero] };
  const radius = 10;
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
  }

  FOV.fov.forEach((locId) => {
    // add a z to the loc
    const eAtPos = world.eAtPos[`${locId},0`];

    if (eAtPos) {
      eAtPos.forEach((eid) => {
        addComponent(world, InFov, eid);
        addComponent(world, Render, eid);

        if (!hasComponent(world, Revealed, eid)) {
          addComponent(world, Revealed, eid);
        }
      });
    }
  });

  return world;
};

// import { readCacheSet } from "../state/cache";
// import ecs from "../state/ecs";
// import { grid } from "../lib/canvas";
// import createFOV from "../lib/fov";
// import { IsInFov, IsOpaque, IsRevealed } from "../state/components";

// const inFovEntities = ecs.createQuery({
//   all: [IsInFov],
// });

// const opaqueEntities = ecs.createQuery({
//   all: [IsOpaque],
// });

// export const fov = (origin) => {
//   const { width, height } = grid;

//   const originX = origin.position.x;
//   const originY = origin.position.y;

//   const FOV = createFOV(opaqueEntities, width, height, originX, originY, 10);

//   // clear out stale fov
//   inFovEntities.get().forEach((x) => x.remove(IsInFov));

//   FOV.fov.forEach((locId) => {
//     const entitiesAtLoc = readCacheSet("entitiesAtLocation", locId);

//     if (entitiesAtLoc) {
//       entitiesAtLoc.forEach((eId) => {
//         const entity = ecs.getEntity(eId);
//         entity.add(IsInFov);

//         if (!entity.has("IsRevealed")) {
//           entity.add(IsRevealed);
//         }
//       });
//     }
//   });
// };

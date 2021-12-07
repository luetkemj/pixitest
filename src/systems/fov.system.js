import { defineQuery, addComponent, removeComponent } from "../../_snowpack/pkg/bitecs.js";
import {
  FovDistance,
  FovRange,
  InFov,
  Opaque,
  PC,
  Position,
  Revealed,
} from "../components.js";
import { grid } from "../lib/grid.js";
import { createFOV } from "../lib/fov.js";

const inFovQuery = defineQuery([InFov]);
const opaqueQuery = defineQuery([Opaque]);
const pcQuery = defineQuery([PC]);

export const fovSystem = (world) => {
  const pcEnts = pcQuery(world);

  // Create FOV schema
  const { width, height } = grid;
  const origin = { x: Position.x[pcEnts[0]], y: Position.y[pcEnts[0]] };
  const radius = FovRange.dist[pcEnts[0]];
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
    const eAtPos = world.eAtPos[`${locId},0`];

    if (eAtPos) {
      eAtPos.forEach((eidAtPos) => {
        addComponent(world, FovDistance, eidAtPos);
        addComponent(world, InFov, eidAtPos);
        addComponent(world, Revealed, eidAtPos);
        FovDistance.dist[eidAtPos] = FOV.distance[locId];
      });
    }
  });

  return world;
};

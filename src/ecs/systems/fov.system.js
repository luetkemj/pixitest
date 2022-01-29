import { addComponent, removeComponent } from "bitecs";
import {
  FovDistance,
  FovRange,
  InFov,
  Position,
  Revealed,
} from "../components";
import { grid } from "../../lib/grid";
import { createFOV } from "../../lib/fov";
import { inFovQuery, opaqueQuery, pcQuery } from "../queries";
import { getState } from "../../index";

export const fovSystem = (world) => {
  const pcEnts = pcQuery(world);
  const { z } = getState();

  // Create FOV schema
  const { width, height } = grid;
  const origin = { x: Position.x[pcEnts[0]], y: Position.y[pcEnts[0]] };
  const radius = FovRange.dist[pcEnts[0]];
  const blockingLocations = new Set();

  const blockingEnts = opaqueQuery(world);
  for (let i = 0; i < blockingEnts.length; i++) {
    const eid = blockingEnts[i];

    if (Position.z[eid] === z) {
      blockingLocations.add(`${Position.x[eid]},${Position.y[eid]}`);
    }
  }

  const FOV = createFOV({
    blockingLocations,
    width,
    height,
    originX: origin.x,
    originY: origin.y,
    radius,
  });

  // clear out and unrender stale fov
  const inFovEnts = inFovQuery(world);
  for (let i = 0; i < inFovEnts.length; i++) {
    const eid = inFovEnts[i];
    removeComponent(world, InFov, eid);
    world.sprites[eid].renderable = false;
  }

  FOV.fov.forEach((locId) => {
    const eAtPos = getState().eAtPos[`${locId},${z}`];

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

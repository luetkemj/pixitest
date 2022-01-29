import _ from "lodash";
import { addComponent, removeComponent } from "bitecs";
import { Light, Lux, Position } from "../components";
import { grid } from "../../lib/grid";
import { createFOV } from "../../lib/fov";
import { lightQuery, luxQuery, opaqueQuery } from "../queries";
import { getState } from "../../index";
import { queryAtLoc } from "../ecsHelpers";

export const getLux = ({ dist, beam, lumens }) => {
  const lm = lumens;
  const step = lm / beam;
  return lm - dist * step;
};

export const lightingSystem = (world) => {
  const lightSourceEnts = lightQuery(world);
  const litEnts = luxQuery(world);
  const { z } = getState();

  // clear litEnts before relighting
  for (let i = 0; i < litEnts.length; i++) {
    const eid = litEnts[i];
    removeComponent(world, Lux, eid);
  }

  // calc lighting for each lightSource
  for (let i = 0; i < lightSourceEnts.length; i++) {
    const eid = lightSourceEnts[i];

    // Create FOV schema
    const { width, height } = grid;
    const origin = { x: Position.x[eid], y: Position.y[eid] };
    const radius = Light.beam[eid].current;
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

    FOV.fov.forEach((locId) => {
      queryAtLoc(`${locId},${z}`, (eidAtLoc) => {
        addComponent(world, Lux, eidAtLoc);

        const dist = FOV.distance[locId];
        const beam = Light.beam[eid].current;
        const lumens = Light.lumens[eid].current;

        Lux.current[eidAtLoc] =
          Lux.current[eidAtLoc] + getLux({ dist, beam, lumens });
      });
    });
  }

  return world;
};

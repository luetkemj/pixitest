import * as Components from "../components.js";
import { Position } from "../components.js";
import { hasComponent } from "../../_snowpack/pkg/bitecs.js";

export const updatePosition = ({ world, oldPos = {}, newPos, eid }) => {
  if (!world.eAtPos) {
    world.eAtPos = {};
  }

  const newLoc = `${newPos.x},${newPos.y},${newPos.z}`;
  const oldLoc = `${oldPos.x},${oldPos.y},${oldPos.z}`;

  // remove old pos
  if (world.eAtPos[oldLoc]) {
    world.eAtPos[oldLoc].delete(eid);
  }

  // add / update new position
  if (world.eAtPos[newLoc]) {
    world.eAtPos[newLoc].add(eid);
  } else {
    world.eAtPos[newLoc] = new Set();
    world.eAtPos[newLoc].add(eid);
  }

  Position.x[eid] = newPos.x;
  Position.y[eid] = newPos.y;
  Position.z[eid] = newPos.z;
};

export const getEntityData = (world, eid) => {
  const components = Object.keys(Components).reduce((acc, key) => {
    const component = Components[key];
    if (hasComponent(world, component, eid)) {
      const props = Object.keys(component).reduce((propAcc, propKey) => {
        propAcc[propKey] = component[propKey][eid];
        return propAcc;
      }, {});

      acc[key] = props;
    }
    return acc;
  }, {});

  return {
    eid,
    name: world.meta[eid] && world.meta[eid].name,
    components,
    sprite: world.sprites[eid],
    meta: world.meta[eid],
  };
};

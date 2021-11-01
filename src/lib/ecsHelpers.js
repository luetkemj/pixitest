import _ from "lodash";
import * as Components from "../components";
import { Body, Position } from "../components";
import { hasComponent, removeComponent } from "bitecs";

export const findEmptySlot = ({ component, containerEid }) => {
  const slots = component.slots[containerEid];
  const openSlot = _.findIndex(slots, (slot) => slot === 0);
  return openSlot;
};

export const fillFirstEmptySlot = ({ component, containerEid, itemEid }) => {
  const emptySlot = findEmptySlot({ component, containerEid });

  if (emptySlot > -1) {
    component.slots[containerEid][emptySlot] = itemEid;
    return true;
  } else {
    return false;
  }
};

export const updatePosition = ({
  world,
  oldPos = {},
  newPos = {},
  eid,
  remove = false,
}) => {
  if (!world.eAtPos) {
    world.eAtPos = {};
  }

  const newLoc = `${newPos.x},${newPos.y},${newPos.z}`;
  const oldLoc = `${oldPos.x},${oldPos.y},${oldPos.z}`;

  // remove old pos
  if (world.eAtPos[oldLoc]) {
    world.eAtPos[oldLoc].delete(eid);
  }

  if (remove) {
    removeComponent(world, Position, eid);
    return;
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

export const walkInventoryTree = (world, eid, inventoryComponent, callBack) => {
  if (!hasComponent(world, inventoryComponent, eid)) return;

  const walkTree = (eid) => {
    const branch = inventoryComponent.slots[eid];
    _.each(branch, (partEid) => {
      if (partEid) {
        callBack(eid, partEid);
        if (hasComponent(world, inventoryComponent, partEid)) {
          walkTree(partEid);
        }
      }
    });
  };
  walkTree(eid);
};

export const getEntityAnatomy = (world, eid) => {
  if (!hasComponent(world, Body, eid)) return;
  const anatomy = [];

  // recursivley build anatomy
  walkInventoryTree(world, eid, Body, (rootEid, currentEid) => {
    anatomy.push(currentEid);
  });
  return anatomy.map((partEid) => world.meta[partEid].name);
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
    body: getEntityAnatomy(world, eid),
    meta: world.meta[eid],
  };
};

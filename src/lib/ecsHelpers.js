import _ from "lodash";
import * as Components from "../components";
import { Body, Pickupable, Position, Wielding } from "../components";
import { hasComponent, removeComponent, removeEntity } from "bitecs";
import { getNeighborIds } from "../lib/grid";

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
    // clear the sprite from view
    world.sprites[eid].renderable = false;
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

export const deleteEntity = (world, eid) => {
  removeEntity(world, eid);
};

export const walkInventoryTree = (world, eid, inventoryComponent, func) => {
  if (!hasComponent(world, inventoryComponent, eid)) return;

  const walkTree = (eid) => {
    const branch = inventoryComponent.slots[eid];
    _.each(branch, (partEid) => {
      if (partEid) {
        func(partEid);
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
  walkInventoryTree(world, eid, Body, (currentEid) => {
    anatomy.push(currentEid);
  });
  return anatomy.map((partEid) => getEntityData(world, partEid));
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

export const gettableEntitiesInReach = (world, locId) => {
  const neighbors = [...getNeighborIds(locId, "ALL"), locId];
  return _.flatMap(
    neighbors.map((lId) => {
      const eAtLoc = [...world.eAtPos[lId]];
      return eAtLoc.filter((eid) => hasComponent(world, Pickupable, eid));
    })
  );
};

// get all body parts from a given entity that can wield and what if anything they are wielding
// return Array [ [wielderEid, wieldingEid], ... ]
export const getWielders = (world, eid) => {
  let wielders = []; // [wielderEid, wieldingEid]
  walkInventoryTree(world, eid, Body, (currentEid) => {
    if (hasComponent(world, Wielding, currentEid)) {
      const wieldedItemEid = Wielding.slot[currentEid];
      if (wieldedItemEid) {
        wielders.push([currentEid, wieldedItemEid]);
      } else {
        wielders.push([currentEid]);
      }
    }
  });
  return wielders;
};

// check if item is being wielded by entity and return wielder
// return Array [wielderEid, wieldingEid]
export const getWielder = (world, eid, itemEid) => {
  const wielders = getWielders(world, eid);
  return wielders.find((x) => x[1] === itemEid);
};

// get all equipped items for a given entity
// returns Array [ [equippedEid, equipperEid, "Component"], ... ]
export const getEquipped = (world, eid) => {
  let equipped = []; // [equippedEid, equipperEid, "Component"]
  walkInventoryTree(world, eid, Body, (equipperEid) => {
    // wielded Items
    if (hasComponent(world, Wielding, equipperEid)) {
      const wieldedItemEid = Wielding.slot[equipperEid];
      if (wieldedItemEid) {
        equipped.push([wieldedItemEid, equipperEid, "Wielding"]);
      }
    }
  });
  return equipped;
};

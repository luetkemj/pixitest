import _ from "lodash";
import { addLog, getState, setState } from "../index";
import { pipelineFovRender } from "../ecs/pipelines";
import { addComponent, removeComponent, hasComponent } from "bitecs";
import {
  deleteEntity,
  getRelatedEids,
  getWielders,
  removeComponentFromEntities,
  updatePosition,
} from "../ecs/ecsHelpers";
import { cellToId, idToCell, getNeighborIds } from "./grid";
import {
  Blocking,
  Droppable,
  Effects,
  InFov,
  Inventory,
  Liquid,
  OnCurrentMap,
  Pickupable,
  Position,
  Wieldable,
  Wielding,
} from "../ecs/components";
import * as Components from "../ecs/components";
import { generateDungeonFloor } from "./generators/dungeonfloor";

const useStairs = (world, eid, dir) => {
  const { floors, z } = getState();
  const locId = `${Position.x[eid]},${Position.y[eid]},${Position.z[eid]}`;
  const stairsUpOrDown = `stairs${dir}`;

  const floor = floors[z];
  if (!floor) {
    return console.log(`no floor at ${z}`);
  }

  if (!floor[stairsUpOrDown]) {
    return console.log(`no stairs up on this floor`);
  }

  if (locId !== floor[stairsUpOrDown]) {
    return console.log(`no stairs ${dir} at ${locId}`);
  }

  // to change map

  // add one to z if going up, subtract if going down
  // !!TODO get rid of storing z in state here - just get it from mapId
  const newZ = dir === "Up" ? z + 1 : z - 1;
  const stairs = dir === "Up" ? "stairsUp" : "stairsDown";

  // remove OnCurrentMap component from all eids on current level
  const currentMapId = getState().maps.mapId;
  const currentMapZoom = getState().maps.zoom;
  const eidsOnCurrentMap = getState().maps[currentMapZoom][currentMapId];
  removeComponentFromEntities(world, OnCurrentMap, [...eidsOnCurrentMap]);

  // hide sprites on previous floor
  eidsOnCurrentMap.forEach((id) => {
    if (world.sprites[id]) {
      world.sprites[id].renderable = false;
    }
  });

  // get relatedEids for any root entities (player or monsters) moving from one map to another
  const relatedEids = getRelatedEids(world, eid);

  // remove all relatedEids from previous map
  relatedEids.forEach((rEid) => eidsOnCurrentMap.delete(rEid));

  // update mapId in state
  setState((state) => {
    const oldMapId = idToCell(currentMapId);
    oldMapId.z = newZ;
    const newMapId = cellToId(oldMapId);
    state.maps.mapId = newMapId;
  });

  // create new map if needed
  if (floors[newZ]) {
    const oldPos = idToCell(locId);
    const newPos = idToCell(floors[newZ][stairs]);

    updatePosition({
      world,
      eid,
      oldPos,
      newPos,
    });

    // update position of items wielded
    const wielders = getWielders(world, eid);
    wielders.forEach((w) => {
      const wieldedEid = w[1];
      if (wieldedEid) {
        addComponent(world, Position, wieldedEid);
        Position.x[wieldedEid] = newPos.x;
        Position.y[wieldedEid] = newPos.y;
        Position.z[wieldedEid] = newPos.z;
      }
    });
  } else {
    const { floor } = generateDungeonFloor({
      world,
      z: newZ,
      stairsUp: true,
      stairsDown: true,
    });

    const oldPos = idToCell(locId);
    const newPos = idToCell(floor[stairs]);

    updatePosition({
      world,
      eid,
      oldPos,
      newPos,
    });

    // update position of items wielded
    const wielders = getWielders(world, eid);
    wielders.forEach((w) => {
      const wieldedEid = w[1];
      if (wieldedEid) {
        addComponent(world, Position, wieldedEid);
        Position.x[wieldedEid] = newPos.x;
        Position.y[wieldedEid] = newPos.y;
        Position.z[wieldedEid] = newPos.z;
      }
    });
  }

  // add all relatedEids to new map
  const newMapId = getState().maps.mapId;
  const newMapZoom = getState().maps.zoom;
  const eidsOnNewMap = getState().maps[newMapZoom][newMapId];
  relatedEids.forEach((rEid) => {
    eidsOnNewMap.add(rEid);
  });

  // update the currentMap id in state
  eidsOnNewMap.forEach((id) => {
    addComponent(world, OnCurrentMap, id);
  });

  // update z in state
  setState((state) => (state.z = newZ));
};

export const ascend = (world, eid) => {
  useStairs(world, eid, "Up");
};

export const descend = (world, eid) => {
  useStairs(world, eid, "Down");
};

export const get = (world, eid, itemEid) => {
  if (!hasComponent(world, Inventory, eid)) {
    return console.log(`Cannot pickup - ${eid} has no Inventory`);
  }

  if (!hasComponent(world, Position, eid)) {
    return console.log(`Cannot Pickup - ${eid} has no Position`);
  }

  // get entity locId
  const locId = `${Position.x[eid]},${Position.y[eid]},${Position.z[eid]}`;

  // if itemEid pickup that, else attempt to pickup something at currrent location
  const pickupEid =
    itemEid ||
    [...getState().eAtPos[locId]].find((id) =>
      hasComponent(world, Pickupable, id)
    );

  if (!pickupEid) {
    addLog("There is nothing to pickup.");
  } else {
    // find first open inventory slot and add the pickup eid
    const inventory = Inventory.slots[eid];
    const openSlot = _.findIndex(inventory, (slot) => slot === 0);
    if (openSlot > -1) {
      Inventory.slots[eid][openSlot] = pickupEid;
      removeComponent(world, InFov, pickupEid);
      updatePosition({
        world,
        oldPos: {
          x: Position.x[pickupEid],
          y: Position.y[pickupEid],
          z: Position.z[pickupEid],
        },
        eid: pickupEid,
        remove: true,
      });

      addLog(`You pickup ${world.meta[pickupEid].name}.`);
    } else {
      addLog("Your inventory is full.");
    }
  }
};

export const drop = (world, eid, itemEid, dir) => {
  const isDroppable = hasComponent(world, Droppable, itemEid);

  if (!isDroppable) {
    return addLog("You can't drop that!");
  }

  // check if item to be dropped can also be wielded
  const isWieldable = hasComponent(world, Wieldable, itemEid);
  if (isWieldable) {
    // check if entity dropping item can also wield items
    const wielders = getWielders(world, eid);
    if (wielders.length) {
      // check if entity dropping item is also wielding said item
      const wielderToUnwield = _.find(
        wielders,
        (wielder) => wielder[1] === itemEid
      );
      // if item is being wielded, unwield
      if (wielderToUnwield) {
        unwield(world, wielderToUnwield[0]);
      }
    }
  }

  const currentLocId = `${Position.x[eid]},${Position.y[eid]},${Position.z[eid]}`;

  const neighbors = getNeighborIds(currentLocId, "ALL");
  const openNeighbors = neighbors.map((neighbor) => {
    const nEids = [...getState().eAtPos[neighbor]];
    const isBlocked = _.some(nEids, (e) => hasComponent(world, Blocking, e));
    if (!isBlocked) {
      return neighbor;
    }
  });

  const newLoc = _.sample(_.compact(openNeighbors));

  // findSlot index for item
  const slotIndex = _.findIndex(Inventory.slots[eid], (x) => x === itemEid);
  // remove item from inventory
  Inventory.slots[eid][slotIndex] = 0;

  addLog(`You drop a ${world.meta[itemEid].name}.`);

  // add position component if needed
  if (!hasComponent(world, Position, itemEid)) {
    addComponent(world, Position, itemEid);
  }
  // update position with new location
  updatePosition({ world, newPos: idToCell(newLoc), eid: itemEid });
  // remove selectedItemId
  getState().inventory.selectedInventoryItemEid = null;
  // somehow make sure to call FOV system again.
  pipelineFovRender(world);
};

// Instead of "Quaffable" we should look for Liquid
export const quaff = (world, targetEid, itemEid) => {
  const isLiquid = hasComponent(world, Liquid, itemEid);

  if (!isLiquid) {
    return addLog(`You can't drink that!`);
  }

  const components = Object.keys(Effects);

  for (const [i, c] of components.entries()) {
    const component = Components[c];
    if (hasComponent(world, component, targetEid)) {
      component.current[targetEid] += Effects[c][itemEid];
      component.current[targetEid] =
        component.current[targetEid] > component.max[targetEid]
          ? component.max[targetEid]
          : component.current[targetEid];
    }
  }

  // findSlot index for item
  const slotIndex = _.findIndex(
    Inventory.slots[targetEid],
    (x) => x === itemEid
  );
  // remove item from inventory
  Inventory.slots[targetEid][slotIndex] = 0;

  deleteEntity(world, itemEid);

  return addLog(`You drink a ${world.meta[itemEid].name}!`);
};

export const unwield = (world, wielderEid) => {
  if (hasComponent(world, Wielding, wielderEid)) {
    // wielded items get have a position that tracks with the wielder
    // it should be removed on unwield
    const wieldedEid = Wielding.slot[wielderEid];
    removeComponent(world, Position, wieldedEid);

    // actually remove the wielded item
    Wielding.slot[wielderEid] = 0;

    pipelineFovRender(world);
  }
};

export const wield = (world, targetEid, itemEid) => {
  // check if item is wieldable
  const isWieldable = hasComponent(world, Wieldable, itemEid);
  if (!isWieldable) {
    return addLog(`You can't wield that!`);
  }

  // check if entity can wield
  const wielders = getWielders(world, targetEid);
  if (!wielders.length) {
    return addLog(`You cannot wield anything. (no wielders)`);
  }

  // check if all wielders are full
  const hasFreeWielders = _.some(wielders, (wielder) => wielder.length < 2);
  if (!hasFreeWielders) {
    return addLog(`You cannot wield anything. (wielders full)`);
  }

  // get first free wielder add component to be wielded
  const freeWielder = _.find(wielders, (wielder) => wielder.length < 2);
  const wielderEid = freeWielder[0];

  // wielded items have a position that tracks with the wielder
  // add it here to kick off the position tracking
  addComponent(world, Position, itemEid);
  Position.x[itemEid] = Position.x[targetEid];
  Position.y[itemEid] = Position.y[targetEid];
  Position.z[itemEid] = Position.z[targetEid];

  Wielding.slot[wielderEid] = itemEid;
  addLog(
    `You are wielding a ${world.meta[itemEid].name} in your ${world.meta[wielderEid].name}!`
  );

  pipelineFovRender(world);
};

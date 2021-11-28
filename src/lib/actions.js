import _ from "lodash";
import { getState, setState } from "../index";
import { pipelineFovRender } from "../pipelines";
import { addComponent, hasComponent } from "bitecs";
import { getWielders, updatePosition } from "./ecsHelpers";
import { idToCell, getNeighborIds } from "./grid";
import {
  Blocking,
  Body,
  Consumable,
  Droppable,
  Effects,
  Health,
  Inventory,
  Pickupable,
  Position,
  Strength,
  Wieldable,
  Wielding,
} from "../components";

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
    [...world.eAtPos[locId]].find((id) => hasComponent(world, Pickupable, id));

  if (!pickupEid) {
    setState((state) => {
      state.log.unshift("There is nothing to pickup.");
    });
  } else {
    // find first open inventory slot and add the pickup eid
    const inventory = Inventory.slots[eid];
    const openSlot = _.findIndex(inventory, (slot) => slot === 0);
    if (openSlot > -1) {
      Inventory.slots[eid][openSlot] = pickupEid;

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

      setState((state) => {
        state.log.unshift(`You pickup ${world.meta[pickupEid].name}.`);
      });

      // TODO do this in response to an inventory UI input or AI action
      const isConsumable = hasComponent(world, Consumable, pickupEid);
      if (isConsumable) {
        return consume(world, eid, pickupEid);
      }

      const isWieldable = hasComponent(world, Wieldable, pickupEid);
      if (isWieldable) {
        const alreadyWielding = hasComponent(world, Wielding, eid);
        if (!alreadyWielding) {
          wield(world, eid, pickupEid);
        }
      }
    } else {
      setState((state) => {
        state.log.unshift("Your inventory is full.");
      });
    }
  }
};

export const drop = (world, eid, itemEid, dir) => {
  const isDroppable = hasComponent(world, Droppable, itemEid);

  if (!isDroppable) {
    return setState((state) => {
      state.log.unshift("You can't drop that!");
    });
  }

  const currentLocId = `${Position.x[eid]},${Position.y[eid]},${Position.z[eid]}`;

  const neighbors = getNeighborIds(currentLocId, "ALL");
  const openNeighbors = neighbors.map((neighbor) => {
    const nEids = [...world.eAtPos[neighbor]];
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

export const consume = (world, targetEid, itemEid) => {
  const isConsumable = hasComponent(world, Consumable, itemEid);

  if (!isConsumable) {
    return setState((state) => {
      state.log.unshift(`You can't consume that!`);
    });
  }

  if (hasComponent(world, Health, targetEid)) {
    Health.current[targetEid] += Effects.health[itemEid];
    Health.current[targetEid] =
      Health.current[targetEid] > Health.max[targetEid]
        ? Health.max[targetEid]
        : Health.current[targetEid];
  }

  if (hasComponent(world, Strength, targetEid)) {
    Strength.current[targetEid] += Effects.strength[itemEid];
    Strength.current[targetEid] =
      Strength.current[targetEid] > Strength.max[targetEid]
        ? Strength.max[targetEid]
        : Strength.current[targetEid];
  }

  return setState((state) => {
    state.log.unshift(`You consume a ${world.meta[itemEid].name}!`);
  });
};

export const unwield = (world, wielderEid) => {
  if (hasComponent(world, Wielding, wielderEid)) {
    Wielding.slot[wielderEid] = 0;
  }
};

export const wield = (world, targetEid, itemEid) => {
  // check if item is wieldable
  const isWieldable = hasComponent(world, Wieldable, itemEid);
  if (!isWieldable) {
    return setState((state) => {
      state.log.unshift(`You can't wield that!`);
    });
  }

  // check if entity can wield
  const wielders = getWielders(world, targetEid);
  if (!wielders.length) {
    return setState((state) => {
      state.log.unshift(`You cannot wield anything. (no wielders)`);
    });
  }

  // check if all wielders are full
  const hasFreeWielders = _.some(wielders, (wielder) => wielder.length < 2);
  if (!hasFreeWielders) {
    return setState((state) => {
      state.log.unshift(`You cannot wield anything. (wielders full)`);
    });
  }

  // get first free wielder add component to be wielded
  const freeWielder = _.find(wielders, (wielder) => wielder.length < 2);
  const wielderEid = freeWielder[0];

  Wielding.slot[wielderEid] = itemEid;
  // addComponent(world, Wielding, targetEid);
  return setState((state) => {
    state.log.unshift(
      `You are wielding a ${world.meta[itemEid].name} in your ${world.meta[wielderEid].name}!`
    );
  });
};

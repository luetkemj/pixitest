import _ from "lodash";
import { addComponent, hasComponent, removeComponent } from "bitecs";
import {
  Hidden,
  Inventory,
  Pickupable,
  Position,
  Render,
  Wieldable,
  Wielding,
} from "../components";

export const get = (world, eid) => {
  if (!hasComponent(world, Inventory, eid)) {
    return console.log(`Cannot pickup - ${eid} has no Inventory`);
  }

  if (!hasComponent(world, Position, eid)) {
    return console.log(`Cannot Pickup - ${eid} has no Position`);
  }

  // get entity locId
  const locId = `${Position.x[eid]},${Position.y[eid]},${Position.z[eid]}`;

  const pickupAtLoc = [...world.eAtPos[locId]].find((id) =>
    hasComponent(world, Pickupable, id)
  );

  if (!pickupAtLoc) {
    world.log.push("There is nothing to pickup.");
  } else {
    // find first open inventory slot and add the pickup eid
    const inventory = Inventory.slots[eid];
    const openSlot = _.findIndex(inventory, (slot) => slot === 0);
    if (openSlot > -1) {
      Inventory.slots[eid][openSlot] = pickupAtLoc;

      removeComponent(world, Position, pickupAtLoc);
      addComponent(world, Render, pickupAtLoc);
      addComponent(world, Hidden, pickupAtLoc);

      world.log.push(`You pickup ${world.meta[pickupAtLoc].name}.`);

      // TODO do this in response to an inventory UI input or AI action
      const alreadyWielding = hasComponent(world, Wielding, eid);
      if (!alreadyWielding) {
        equip(world, eid, pickupAtLoc);
      }
    } else {
      world.log.push("Your inventory is full.");
    }
  }

  // check for pickup at location
  // add pickup to entity inventory
  // remove pickup position and render components
};

export const equip = (world, targetEid, itemEid) => {
  const alreadyWielding = hasComponent(world, Wielding, targetEid);
  const isWieldable = hasComponent(world, Wieldable, itemEid);

  if (!isWieldable) {
    world.log.push(`You can't wield that!`);
  }

  if (alreadyWielding) {
    return world.log.push(`You are already wielding something!`);
  }

  addComponent(world, Wielding, targetEid);
  Wielding.slot[targetEid] = itemEid;
  return world.log.push(`You are wielding a ${world.meta[itemEid].name}!`);
};

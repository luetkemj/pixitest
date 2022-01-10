import _ from "lodash";
import { addComponent } from "bitecs";
import { Body, Inventory } from "../ecs/components";
import { createHumanoidBody } from "./bodies/createHumanoidBody";
import { createEntity, fillFirstEmptySlot } from "../ecs/ecsHelpers";

export const createTestEntity = (world) => {
  // "player"
  const eid = createEntity(world);
  world.meta[eid] = { name: "eid" };
  addComponent(world, Body, eid);
  addComponent(world, Inventory, eid);
  createHumanoidBody(world, eid);

  // "goblin"
  const gEid = createEntity(world);
  world.meta[gEid] = { name: "gEid" };
  addComponent(world, Body, gEid);
  addComponent(world, Inventory, gEid);
  createHumanoidBody(world, gEid);

  // "something" for "goblin" inventory
  const hEid = createEntity(world);
  world.meta[hEid] = { name: "hEid" };

  // put "goblin" in "player" inventory
  fillFirstEmptySlot({
    component: Inventory,
    containerEid: eid,
    itemEid: gEid,
  });

  // put "something" in "goblin" inventory
  fillFirstEmptySlot({
    component: Inventory,
    containerEid: gEid,
    itemEid: hEid,
  });

  return eid;
};

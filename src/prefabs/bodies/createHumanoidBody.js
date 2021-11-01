import { addComponent, addEntity } from "bitecs";
import { fillFirstEmptySlot } from "../../lib/ecsHelpers";
import {
  Body,
  Inventory,
  Pickupable,
  Position,
  Wieldable,
  Zindex,
} from "../../components";

const createEntity = (world, name) => {
  const eid = addEntity(world);
  world.meta[eid] = {};
  world.meta[eid].name = name;
  return eid;
};

export const createHumanoidBody = (world, parentEid) => {
  // create part entities
  const torsoEid = createEntity(world, "Torso");
  const headEid = createEntity(world, "Head");
  const armLeftEid = createEntity(world, "Left Arm");
  const armRightEid = createEntity(world, "Right Arm");
  const legLeftEid = createEntity(world, "Left Leg");
  const legRightEid = createEntity(world, "Right Leg");
  const handLeftEid = createEntity(world, "Left Hand");
  const handRightEid = createEntity(world, "Right Hand");
  const footLeftEid = createEntity(world, "Left Foot");
  const footRightEid = createEntity(world, "Right Foot");

  // add components to each part
  const bodyParts = [
    torsoEid,
    headEid,
    armLeftEid,
    armRightEid,
    legLeftEid,
    legRightEid,
    handLeftEid,
    handRightEid,
    footLeftEid,
    footRightEid,
  ];

  bodyParts.forEach((partEid) => {
    addComponent(world, Body, partEid);
    addComponent(world, Inventory, partEid);
    addComponent(world, Position, partEid);
    addComponent(world, Pickupable, partEid);
    addComponent(world, Wieldable, partEid);
    addComponent(world, Zindex, partEid);
    Zindex.zIndex[partEid] = 20;
  });

  // Torso
  [headEid, armLeftEid, armRightEid, legLeftEid, legRightEid].forEach(
    (partEid) => {
      fillFirstEmptySlot({
        component: Body,
        containerEid: torsoEid,
        itemEid: partEid,
      });
    }
  );

  // arms
  fillFirstEmptySlot({
    component: Body,
    containerEid: armLeftEid,
    itemEid: handLeftEid,
  });
  fillFirstEmptySlot({
    component: Body,
    containerEid: armRightEid,
    itemEid: handRightEid,
  });

  // legs
  fillFirstEmptySlot({
    component: Body,
    containerEid: legLeftEid,
    itemEid: footLeftEid,
  });
  fillFirstEmptySlot({
    component: Body,
    containerEid: legRightEid,
    itemEid: footRightEid,
  });

  // add root entity to parent
  fillFirstEmptySlot({
    component: Body,
    containerEid: parentEid,
    itemEid: torsoEid,
  });
};

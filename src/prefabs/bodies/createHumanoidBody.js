import { addComponent, addEntity } from "../../../_snowpack/pkg/bitecs.js";
import { fillFirstEmptySlot } from "../../lib/ecsHelpers.js";
import {
  BelongsTo,
  Body,
  Droppable,
  Inventory,
  Pickupable,
  Position,
  Wieldable,
  Wielding,
  Zindex,
} from "../../components.js";

const createEntity = (world, name, description) => {
  const eid = addEntity(world);
  world.meta[eid] = {};
  world.meta[eid].name = name;
  world.meta[eid].description = description;
  return eid;
};

export const createHumanoidBody = (world, parentEid) => {
  // create part entities
  const torsoEid = createEntity(world, "Torso", "A torso");
  const headEid = createEntity(world, "Head", "A head");
  const armLeftEid = createEntity(world, "Left Arm", "A left arm");
  const armRightEid = createEntity(world, "Right Arm", "A right arm");
  const legLeftEid = createEntity(world, "Left Leg", "A left leg");
  const legRightEid = createEntity(world, "Right Leg", "A right leg");
  const handLeftEid = createEntity(world, "Left Hand", "A left hand");
  const handRightEid = createEntity(world, "Right Hand", "A right hand");
  const footLeftEid = createEntity(world, "Left Foot", "A left foot");
  const footRightEid = createEntity(world, "Right Foot", "A right foot");

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
    addComponent(world, BelongsTo, partEid);
    addComponent(world, Body, partEid);
    addComponent(world, Droppable, partEid);
    addComponent(world, Inventory, partEid);
    addComponent(world, Position, partEid);
    addComponent(world, Pickupable, partEid);
    addComponent(world, Wieldable, partEid);
    addComponent(world, Zindex, partEid);
    Zindex.zIndex[partEid] = 20;
    BelongsTo.eid[partEid] = parentEid;
  });

  addComponent(world, Wielding, handLeftEid);
  addComponent(world, Wielding, handRightEid);

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

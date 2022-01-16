import { addComponent } from "bitecs";
import { fillFirstEmptySlot } from "../../ecs/ecsHelpers";
import {
  BelongsTo,
  Body,
  Droppable,
  Inventory,
  Legendable,
  Pickupable,
  Position,
  Wieldable,
  Wielding,
  Zindex,
} from "../../ecs/components";
import { createEntity } from "../../ecs/ecsHelpers";

const makeEntity = (world, name, description) => {
  const eid = createEntity(world);
  world.meta[eid] = {};
  world.meta[eid].name = name;
  world.meta[eid].description = description;
  return eid;
};

export const createHumanoidBody = (world, parentEid) => {
  // create part entities
  const torsoEid = makeEntity(world, "Torso", "A torso");
  const headEid = makeEntity(world, "Head", "A head");
  const armLeftEid = makeEntity(world, "Left Arm", "A left arm");
  const armRightEid = makeEntity(world, "Right Arm", "A right arm");
  const legLeftEid = makeEntity(world, "Left Leg", "A left leg");
  const legRightEid = makeEntity(world, "Right Leg", "A right leg");
  const handLeftEid = makeEntity(world, "Left Hand", "A left hand");
  const handRightEid = makeEntity(world, "Right Hand", "A right hand");
  const footLeftEid = makeEntity(world, "Left Foot", "A left foot");
  const footRightEid = makeEntity(world, "Right Foot", "A right foot");

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
    addComponent(world, Legendable, partEid);
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

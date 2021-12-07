import _ from "../../_snowpack/pkg/lodash.js";
import { Position } from "../components.js";
import { clearContainer, printRow } from "../lib/canvas.js";
import { getEntityData } from "../lib/ecsHelpers.js";
import { renderAmbiance } from "./ambiance.js";

export const renderLooking = (world, pcEid) => {
  let x;
  let y;

  if (!world.lookingAt) {
    world.lookingAt = {};
    world.lookingAt.x = Position.x[pcEid];
    world.lookingAt.y = Position.y[pcEid];
  }

  if (world.lookingAt) {
    x = world.lookingAt.x;
    y = world.lookingAt.y;
  }

  printRow({
    container: "overlay",
    x,
    y,
    width: 1,
    str: "_",
    color: 0xffe800,
    halfWidth: false,
  });

  // get info about whatever you're looking at and print somewhere...
  const pos = `${x},${y},0`;
  let str = "";

  world.eAtPos[pos].forEach((e) => {
    const entityData = getEntityData(world, e);

    if (!entityData.components.InFov && !entityData.components.Revealed) {
      return (str += " ");
    }

    if (!entityData.components.InFov && entityData.components.Forgettable) {
      return (str += " ");
    }

    if (!entityData.components.InFov && entityData.components.Revealed) {
      return (str += `You remember seeing ${entityData.name}`);
    }

    str += `${entityData.name} - ${entityData.meta.description} `;
  });

  clearContainer("ambiance");
  renderAmbiance(world, str);
};

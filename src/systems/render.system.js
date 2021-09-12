import _ from "lodash";
import { defineQuery, hasComponent, removeComponent, Not } from "bitecs";
import { InFov, Position, Render, Revealed } from "../components";
import { grid } from "../lib/grid";

let cellWidth;

const renderQuery = defineQuery([Render]);
const inFovQuery = defineQuery([InFov]);
const revealedQuery = defineQuery([Revealed]);

export const renderSystem = (world) => {
  const inFovEnts = inFovQuery(world);
  console.log(JSON.stringify({ inFovEnts: inFovEnts.length }));

  const revealedEnts = revealedQuery(world);
  console.log(JSON.stringify({ revealedEnts: revealedEnts.length }));

  for (let i = 0; i < revealedEnts.length; i++) {
    const eid = revealedEnts[i];
    world.sprites[eid].alpha = 1;
    world.sprites[eid].tint = `0xff0077`;
  }

  for (let i = 0; i < inFovEnts.length; i++) {
    const eid = inFovEnts[i];
    world.sprites[eid].alpha = 1;
    world.sprites[eid].tint = `0xffffff`;
  }

  const renderEnts = renderQuery(world);
  if (renderEnts.length) {
    cellWidth = window.innerWidth / grid.width;
  }
  for (let i = 0; i < renderEnts.length; i++) {
    const eid = renderEnts[i];
    world.sprites[eid].width = cellWidth;
    world.sprites[eid].height = cellWidth;
    world.sprites[eid].x = Position.x[eid] * cellWidth;
    world.sprites[eid].y = Position.y[eid] * cellWidth;

    removeComponent(world, Render, eid);
  }

  return world;
};

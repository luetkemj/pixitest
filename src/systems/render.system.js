import _ from "lodash";
import { defineQuery, hasComponent, removeComponent, Not } from "bitecs";
import {
  Dead,
  Forgettable,
  FovDistance,
  Hidden,
  InFov,
  Position,
  Render,
  Revealed,
  Health,
} from "../components";
import { grid } from "../lib/grid";

import { renderAmbiance } from "../ui/ambiance";
import { renderLegend } from "../ui/legend";
import { renderMenuTabs } from "../ui/menuTabs";
import { renderLog } from "../ui/log";

let cellWidth;

const hiddenQuery = defineQuery([Hidden]);
const inFovQuery = defineQuery([InFov]);
const renderQuery = defineQuery([Render]);
const revealedQuery = defineQuery([Revealed]);
const forgettableQuery = defineQuery([Revealed, Not(InFov), Forgettable]);

export const renderSystem = (world) => {
  const inFovEnts = inFovQuery(world);
  const revealedEnts = revealedQuery(world);
  const forgettableEnts = forgettableQuery(world);

  // DO FIELD OF VISION THINGS
  for (let i = 0; i < revealedEnts.length; i++) {
    const eid = revealedEnts[i];
    world.sprites[eid].alpha = 1;
    world.sprites[eid].tint = `0x555555`;
  }

  for (let i = 0; i < forgettableEnts.length; i++) {
    const eid = forgettableEnts[i];
    world.sprites[eid].alpha = 0;
  }

  for (let i = 0; i < inFovEnts.length; i++) {
    const eid = inFovEnts[i];
    world.sprites[eid].alpha = 1;
    const tintMap = [
      `0xffffff`,
      `0xffffff`,
      `0xeeeeee`,
      `0xdddddd`,
      `0xcccccc`,
      `0xbbbbbb`,
      `0xaaaaaa`,
      `0x999999`,
      `0x888888`,
      `0x777777`,
      `0x666666`,
    ];
    world.sprites[eid].tint = tintMap[FovDistance.dist[eid]] || `0x666666`;
    if (world.hero === eid) {
      world.sprites[eid].tint = 0xffffff;
    }
  }

  // RENDER OTHER MAP THINGS
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

    if (hasComponent(world, Dead, eid)) {
      world.sprites[eid].texture = world.loader.resources.corpse.texture;
    }

    removeComponent(world, Render, eid);
  }

  // Hide the Hidden things
  const hiddenEnts = hiddenQuery(world);
  for (let i = 0; i < hiddenEnts.length; i++) {
    const eid = hiddenEnts[i];
    world.sprites[eid].alpha = 0;
  }

  // RENDER UI THINGS
  renderAmbiance(world);
  renderLegend(world);
  renderMenuTabs(world);
  renderLog(world);

  return world;
};

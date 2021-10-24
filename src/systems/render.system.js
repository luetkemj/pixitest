import _ from "lodash";
import { defineQuery, hasComponent, Not } from "bitecs";
import {
  Dead,
  Forgettable,
  FovDistance,
  InFov,
  PC,
  Position,
  Revealed,
  Zindex,
} from "../components";
import { grid } from "../lib/grid";
import { clearContainer, getAsciTexture } from "../lib/canvas";
import { renderAmbiance } from "../ui/ambiance";
import { renderLegend } from "../ui/legend";
import { renderMenuTabs } from "../ui/menuTabs";
import { renderMenuTabItemLog } from "../ui/menuTabItemLog";
import { renderMenuTabItemInventory } from "../ui/menuTabItemInventory";

let cellWidth;

const inFovQuery = defineQuery([InFov, Position]);
const revealedQuery = defineQuery([Revealed, Position]);
const forgettableQuery = defineQuery([Revealed, Not(InFov), Forgettable]);
const pcQuery = defineQuery([PC]);

export const renderSystem = (world) => {
  const inFovEnts = inFovQuery(world);
  const revealedEnts = revealedQuery(world);
  const forgettableEnts = forgettableQuery(world);
  const pcEnts = pcQuery(world);

  // DO FIELD OF VISION THINGS
  for (let i = 0; i < revealedEnts.length; i++) {
    const eid = revealedEnts[i];
    world.sprites[eid].renderable = true;
    world.sprites[eid].alpha = 0.1;
  }

  for (let i = 0; i < forgettableEnts.length; i++) {
    const eid = forgettableEnts[i];
    world.sprites[eid].renderable = false;
  }

  for (let i = 0; i < inFovEnts.length; i++) {
    const eid = inFovEnts[i];
    world.sprites[eid].renderable = true;
    const alphaMap = [1, 1, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.25, 0.25];
    world.sprites[eid].alpha = alphaMap[FovDistance.dist[eid]] || 0.55;
    if (pcEnts.includes(eid)) {
      world.sprites[eid].alpha = 1;
    }
  }

  const renderEid = (eid) => {
    world.sprites[eid].x = Position.x[eid] * cellWidth;
    world.sprites[eid].y = Position.y[eid] * cellWidth;

    if (hasComponent(world, Dead, eid)) {
      world.sprites[eid].texture = getAsciTexture({ char: "%" });
    }
  };

  const isOnTop = (eid, eAtPos) => {
    let zIndex = 0;
    let eidOnTop = eid;
    eAtPos.forEach((id) => {
      if (Zindex.zIndex[id] > zIndex) {
        eidOnTop = id;
      }
    });
    return eidOnTop === eid;
  };

  // RENDER OTHER MAP THINGS
  if (inFovEnts.length) {
    cellWidth = window.innerWidth / grid.width;
  }
  for (let i = 0; i < inFovEnts.length; i++) {
    const eid = inFovEnts[i];
    world.sprites[eid].width = cellWidth;
    world.sprites[eid].height = cellWidth;

    const locId = `${Position.x[eid]},${Position.y[eid]},0`;
    const eAtPos = world.eAtPos[locId];

    // If only one item at location - render it
    if (eAtPos.size === 1) {
      renderEid(eid);
    } else {
      // if more than one item at location
      // render if current eid is on top
      // else hide it
      if (isOnTop(eid, eAtPos)) {
        renderEid(eid);
      } else {
        world.sprites[eid].renderable = false;
      }
    }
  }

  // RENDER UI THINGS
  renderAmbiance(world);
  renderLegend(world, pcEnts[0]);
  renderMenuTabs(world);

  // clear the menuTab before rendering
  clearContainer("menuTabItem");
  switch (world.menuTab) {
    case "LOG":
      renderMenuTabItemLog(world);
      break;
    case "INVENTORY":
      renderMenuTabItemInventory(world, pcEnts[0]);
      break;
    default:
      renderMenuTabItemLog(world);
  }

  return world;
};

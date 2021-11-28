import _ from "lodash";
import { defineQuery, hasComponent, Not } from "bitecs";
import { getState } from "../index";
import {
  Dead,
  Forgettable,
  FovDistance,
  FovRange,
  InFov,
  PC,
  Position,
  Revealed,
  Zindex,
} from "../components";
import { grid } from "../lib/grid";
import {
  clearContainer,
  hideContainer,
  showContainer,
  getAsciTexture,
} from "../lib/canvas";
import { renderAmbiance } from "../ui/ambiance";
import { renderLegend } from "../ui/legend";
import { renderMenuLog } from "../ui/menuLog";
import { renderMenuInventory } from "../ui/menuInventory";
import { renderLooking } from "../ui/looking";

let cellWidth;

const inFovQuery = defineQuery([InFov, Position]);
const revealedQuery = defineQuery([Revealed, Position]);
const forgettableQuery = defineQuery([Revealed, Not(InFov), Forgettable]);
const pcQuery = defineQuery([PC]);

const fovAlphaMap = ({ range, max = 1, min = 0.3 }) => {
  const step = (max - min) / range;
  const alphaMap = [1];
  for (let index = 0; index < range; index++) {
    alphaMap.push(alphaMap[alphaMap.length - 1] - step);
  }
  return alphaMap;
};

const renderEid = ({ world, eid, renderable = true, alpha = 1 }) => {
  if (!world.sprites[eid]) return;

  world.sprites[eid].width = cellWidth;
  world.sprites[eid].height = cellWidth;
  world.sprites[eid].renderable = renderable;
  world.sprites[eid].alpha = alpha;
  world.sprites[eid].x = Position.x[eid] * cellWidth;
  world.sprites[eid].y = Position.y[eid] * cellWidth;

  if (hasComponent(world, Dead, eid)) {
    world.sprites[eid].texture = getAsciTexture({ char: "%" });
  }
};

export const renderSystem = (world) => {
  const { mode } = getState();
  const inFovEnts = inFovQuery(world);
  const revealedEnts = revealedQuery(world);
  const forgettableEnts = forgettableQuery(world);
  const pcEnts = pcQuery(world);

  // DO FIELD OF VISION THINGS
  for (let i = 0; i < revealedEnts.length; i++) {
    const eid = revealedEnts[i];
    renderEid({ world, eid, alpha: 0.23, renderable: true });
  }

  for (let i = 0; i < forgettableEnts.length; i++) {
    const eid = forgettableEnts[i];
    renderEid({ world, eid, renderable: false });
  }

  const alphaMap = fovAlphaMap({
    range: FovRange.dist[pcEnts[0]],
    max: 1,
    min: 0.3,
  });

  const isOnTop = (eid, eAtPos) => {
    let zIndex = 0;
    let eidOnTop = eid;
    eAtPos.forEach((id) => {
      if (Zindex.zIndex[id] > zIndex) {
        zIndex = Zindex.zIndex[id];
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
    const locId = `${Position.x[eid]},${Position.y[eid]},0`;
    const eAtPos = world.eAtPos[locId];

    const alpha = alphaMap[FovDistance.dist[eid]] || 0.23;

    // If only one item at location - render it
    if (eAtPos.size === 1) {
      renderEid({ world, eid, alpha });
    } else {
      // if more than one item at location
      // render if current eid is on top
      // else hide it
      if (isOnTop(eid, eAtPos)) {
        renderEid({ world, eid, alpha });
      } else {
        world.sprites[eid].renderable = false;
      }
    }
  }

  // RENDER UI THINGS
  renderAmbiance(world);
  renderLegend(world, pcEnts[0]);

  // hide menu and overlay
  hideContainer("menu");
  hideContainer("overlay");

  // do overlay things
  if (["LOOKING"].includes(mode)) {
    // clear the menuTab before rendering
    clearContainer("overlay");

    switch (mode) {
      case "LOOKING":
        showContainer("overlay");
        renderLooking(world, pcEnts[0]);
        break;
    }
  }

  // reset lookingAt if not in LOOKING mode
  if (!["LOOKING"].includes(mode)) {
    world.lookingAt = null;
  }

  // do menu things
  if (["LOG", "INVENTORY"].includes(mode)) {
    // clear the menuTab before rendering
    clearContainer("menu");

    switch (mode) {
      case "LOG":
        showContainer("menu");
        renderMenuLog();
        break;
      case "INVENTORY":
        showContainer("menu");
        renderMenuInventory(world, pcEnts[0]);
        break;
    }
  }

  return world;
};

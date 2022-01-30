import _ from "lodash";
import { hasComponent } from "bitecs";
import { getState, setState } from "../../index";
import { Dead, Lux, Position, Revealed, Zindex } from "../components";
import { grid } from "../../lib/grid";
import {
  clearContainer,
  hideContainer,
  showContainer,
  getAsciTexture,
} from "../../lib/canvas";
import { renderAmbiance } from "../../ui/ambiance";
import { renderAdventureLog } from "../../ui/adventureLog";
import { renderLegend } from "../../ui/legend";
import { renderMenuCharacter } from "../../ui/menuCharacter";
import { renderMenuInventory } from "../../ui/menuInventory";
import { renderMenuLog } from "../../ui/menuLog";
import { renderLooking } from "../../ui/looking";
import { renderDijkstraViz } from "../../ui/dijkstraViz";
import {
  inFovQuery,
  revealedQuery,
  forgettableQuery,
  pcQuery,
  legendableQuery,
} from "../queries";

let cellWidth;

const minAlpha = 0.1;

// check if entity at pos is top of zIndex layers (should it render)
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

const renderEidIfOnTop = ({ eid, world, alpha = 1 }) => {
  const { z } = getState();
  // only render if the entity is on current z level
  if (z !== Position.z[eid]) {
    return (world.sprites[eid].renderable = false);
  }

  const locId = `${Position.x[eid]},${Position.y[eid]},${z}`;
  const eAtPos = getState().eAtPos[locId];

  // If only one item at location - render it
  if (eAtPos.size === 1) {
    renderEid({ world, eid, alpha, renderable: true });
  } else {
    // render if current eid is on top
    if (isOnTop(eid, eAtPos)) {
      renderEid({ world, eid, alpha, renderable: true });
      // else hide it
    } else {
      world.sprites[eid].renderable = false;
    }
  }
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

  const legendEnts = legendableQuery(world);
  const pcEnts = pcQuery(world);

  // DO FIELD OF VISION THINGS
  // Render revealed entities
  for (let i = 0; i < revealedEnts.length; i++) {
    const eid = revealedEnts[i];
    renderEidIfOnTop({ eid, world, alpha: minAlpha });
  }

  // hide forgettable entities
  for (let i = 0; i < forgettableEnts.length; i++) {
    const eid = forgettableEnts[i];
    renderEid({ world, eid, renderable: false });
  }

  // RENDER OTHER MAP THINGS
  if (inFovEnts.length) {
    cellWidth = window.innerWidth / grid.width;
  }
  for (let i = 0; i < inFovEnts.length; i++) {
    const eid = inFovEnts[i];

    const isRevealed = hasComponent(world, Revealed, eid);
    const isLit = hasComponent(world, Lux, eid);

    if (isRevealed) {
      renderEidIfOnTop({ eid, world, alpha: minAlpha });
    }

    if (isLit) {
      const lx = Lux.current[eid] / 100;
      const alpha = lx > minAlpha ? lx : minAlpha;
      renderEidIfOnTop({ eid, world, alpha });
    }

    if (!isLit && !isRevealed) {
      renderEid({ world, eid, renderable: false });
    }
  }

  // check location of player and set the ambient log render
  // this should eventually be its own system so it can be more interesting
  {
    const locId = `${Position.x[pcEnts[0]]},${Position.y[pcEnts[0]]},${
      Position.z[pcEnts[0]]
    }`;
    const eAtPos = getState().eAtPos[locId];
    const stack = _.orderBy([...eAtPos], (eid) => Zindex.zIndex[eid], "desc");
    const msg = world.meta[stack[1]].description;
    setState((state) => (state.ambientLog = [{ str: msg }]));
  }

  // RENDER UI THINGS
  renderAmbiance(world);
  renderAdventureLog(world);
  renderLegend(world, pcEnts[0], legendEnts);

  // hide menu and overlay
  hideContainer("menu");
  hideContainer("overlay");

  // render DijkstraViz
  if (getState().debugMode === "DIJKSTRA") {
    clearContainer("overlay");
    showContainer("overlay");
    renderDijkstraViz();
  } else {
    clearContainer("overlay");
  }

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
  if (["LOG", "INVENTORY", "CHARACTER_MENU"].includes(mode)) {
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
      case "CHARACTER_MENU":
        showContainer("menu");
        renderMenuCharacter(world, pcEnts[0]);
        break;
    }
  }

  return world;
};

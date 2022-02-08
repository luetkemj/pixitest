import _ from "lodash";
import { hasComponent } from "bitecs";
import { getState, setState } from "../../index";
import { Dead, Lux, Position, Revealed, Zindex } from "../components";
import { distance, getDirection, grid } from "../../lib/grid";
import {
  clearContainer,
  hideContainer,
  showContainer,
  getAsciTexture,
} from "../../lib/canvas";
import { getPosition } from "../ecsHelpers";
import { renderAmbiance } from "../../ui/ambiance";
import { renderAdventureLog } from "../../ui/adventureLog";
import { renderLegend } from "../../ui/legend";
import { renderMenuCharacter } from "../../ui/menuCharacter";
import { renderMenuInventory } from "../../ui/menuInventory";
import { renderMenuLog } from "../../ui/menuLog";
import { renderLooking } from "../../ui/looking";
import { renderDijkstraViz } from "../../ui/dijkstraViz";
import { renderWithinReach } from "../../ui/withinReach";
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

// add to inreach template in state
// need to calc position of item and put in the correct location in template
// [NW,N,NE] [00,01,02]
// [W, X, E] [10,11,12]
// [SW,S,SE] [20,21,22]
const dirMap = {
  NW: "00",
  N: "01",
  NE: "02",
  W: "10",
  X: "11",
  E: "12",
  SW: "20",
  S: "21",
  SE: "22",
};

const maybeAddToInReachPreview = ({ world, eid, pcEid, sprite }) => {
  // if dist from eid to pcEid is <= 1
  const pos1 = getPosition(eid);
  const pos2 = getPosition(pcEid);

  if (distance(pos1, pos2) <= 1) {
    const { dir } = getDirection(pos1, pos2);
    setState((state) => {
      const dirPath = dirMap[dir];
      const { char, color, alpha, renderable } = sprite;
      const template = {
        str: `${char}`,
        color: color,
        alpha: renderable ? alpha : 0,
      };
      state.withinReachPreview[dirPath[0]][dirPath[1]] = template;
    });
  }
};

const renderEidIfOnTop = ({ eid, world, alpha = 1, pcEid }) => {
  const { z } = getState();
  const pos = getPosition(eid);

  // only render if the entity is on current z level
  if (z !== pos.z) {
    return (world.sprites[eid].renderable = false);
  }

  // const locId = `${Position.x[eid]},${Position.y[eid]},${z}`;
  const eAtPos = getState().eAtPos[pos.locId];

  // If only one item at location - render it
  if (eAtPos.size === 1) {
    renderEid({ world, eid, alpha, renderable: true, pcEid });
  } else {
    // render if current eid is on top
    if (isOnTop(eid, eAtPos)) {
      renderEid({ world, eid, alpha, renderable: true, pcEid });
      // else hide it
    } else {
      world.sprites[eid].renderable = false;
    }
  }
};

const renderEid = ({ world, eid, renderable = true, alpha = 1, pcEid }) => {
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

  // check if eid is within reach. If so add to inReach template for use in the withinReach menu
  maybeAddToInReachPreview({
    world,
    eid,
    pcEid,
    sprite: world.sprites[eid],
  });
};

export const renderSystem = (world) => {
  const { mode } = getState();
  const inFovEnts = inFovQuery(world);

  const revealedEnts = revealedQuery(world);
  const forgettableEnts = forgettableQuery(world);

  const legendEnts = legendableQuery(world);
  const pcEnts = pcQuery(world);

  const pcEid = pcEnts[0];

  // DO FIELD OF VISION THINGS
  // Render revealed entities
  for (let i = 0; i < revealedEnts.length; i++) {
    const eid = revealedEnts[i];
    renderEidIfOnTop({ eid, world, alpha: minAlpha, pcEid });
  }

  // hide forgettable entities
  for (let i = 0; i < forgettableEnts.length; i++) {
    const eid = forgettableEnts[i];
    renderEid({ world, eid, renderable: false, pcEid });
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
      renderEidIfOnTop({ eid, world, alpha: minAlpha, pcEid });
    }

    if (isLit) {
      const lx = Lux.current[eid] / 100;
      const alpha = lx > minAlpha ? lx : minAlpha;
      renderEidIfOnTop({ eid, world, alpha, pcEid });
    }

    if (!isLit && !isRevealed) {
      renderEid({ world, eid, renderable: false, pcEid });
    }
  }

  // check location of player and set the ambient log render
  // this should eventually be its own system so it can be more interesting
  {
    const locId = `${Position.x[pcEid]},${Position.y[pcEid]},${Position.z[pcEid]}`;
    const eAtPos = getState().eAtPos[locId];
    const stack = _.orderBy([...eAtPos], (eid) => Zindex.zIndex[eid], "desc");
    const msg = world.meta[stack[1]].description;
    setState((state) => (state.ambientLog = [{ str: msg }]));
  }

  // RENDER UI THINGS
  renderAmbiance(world);
  renderAdventureLog(world);
  renderLegend(world, pcEid, legendEnts);

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
        renderLooking(world, pcEid);
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
        renderMenuInventory(world, pcEid);
        break;
      case "CHARACTER_MENU":
        showContainer("menu");
        renderMenuCharacter(world, pcEid);
        break;
    }
  }

  renderWithinReach(world, pcEid);

  return world;
};

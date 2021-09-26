import _ from "lodash";
import * as PIXI from "pixi.js";
import { Position } from "../components";
import { getEntityData } from "./ecsHelpers";
import { grid } from "./grid";

// add PIXI to the window so the devtools work
window.PIXI = PIXI;

const canvas = document.getElementById("pixi-canvas");

const cellW = window.innerWidth / grid.width;
const cellHfW = cellW / 2;
const app = new PIXI.Application({
  view: canvas,
  width: window.innerWidth,
  height: cellW * grid.height,
  autoDensity: true,
  autoResize: true,
  resolution: window.devicePixelRatio || 1,
});

const containers = {};

containers.map = new PIXI.Container();
containers.map.width = grid.map.width * cellW;
containers.map.height = grid.map.height * cellW;
containers.map.x = grid.map.x * cellW;
containers.map.y = grid.map.y * cellW;

containers.log = new PIXI.Container();
containers.log.width = grid.log.width * cellW;
containers.log.height = grid.log.height * cellW;
containers.log.x = grid.log.x * cellW;
containers.log.y = grid.log.y * cellW;

app.stage.addChild(containers.map);
app.stage.addChild(containers.log);

export const addDebugSprite = ({ texture, x, y }) => {
  const sprite = new PIXI.Sprite.from(texture);
  sprite.x = x;
  sprite.y = y;
  sprite.alpha = 1;

  app.stage.addChild(sprite);
  return sprite;
};

export const addSprite = ({
  container = "map",
  texture,
  options = {},
  world,
  eid,
}) => {
  const sprite = new PIXI.Sprite.from(texture);
  world.sprites[eid] = _.merge(
    sprite,
    {
      alpha: 0,
      interactive: true,
    },
    options
  );

  world.sprites[eid].on("click", (ev) => {
    const x = Position.x[eid];
    const y = Position.y[eid];
    const z = Position.z[eid];
    const pos = `${x},${y},${z}`;
    world.eAtPos[pos].forEach((e) => console.log(getEntityData(world, e)));
  });

  containers[container].addChild(world.sprites[eid]);
};

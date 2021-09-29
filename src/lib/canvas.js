import _ from "lodash";
import * as PIXI from "pixi.js";
import { Position } from "../components";
import { getEntityData } from "./ecsHelpers";
import { grid } from "./grid";
import { alphaMap } from "../../static/fonts/courier-prime-regular.map";

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

const loader = PIXI.Loader.shared;

// load sprites
export const loadSprites = (onLoaded) => {
  loader
    .add("static/fonts/courier-prime-regular.json")

    .add("corpse", "static/effects/enemy_afterdead_explosion_anim_f2.png")
    .add("floor", "static/tiles/floor/floor_10.png")
    .add("goblin", "static/enemies/goblin/goblin_idle_anim_f0.png")
    .add("hero", "static/heroes/knight/knight_idle_anim_f0.png")
    .add("sword", "static/heroes/knight/weapon_sword_1.png")
    .add("wall", "static/tiles/wall/wall_1.png")

    .load(onLoaded);
  return loader;
};

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

containers.playerHud = new PIXI.Container();
containers.playerHud.width = grid.playerHud.width * cellW;
containers.playerHud.height = grid.playerHud.height * cellW;
containers.playerHud.x = grid.playerHud.x * cellW;
containers.playerHud.y = grid.playerHud.y * cellW;

app.stage.addChild(containers.map);
app.stage.addChild(containers.log);
app.stage.addChild(containers.playerHud);

const uiSprites = {
  log: Array.from(Array(grid.log.height), () => []),
  playerHud: Array.from(Array(grid.playerHud.height), () => []),
};

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
  const sprite = new PIXI.Sprite.from(loader.resources[texture].texture);
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

export const printRow = ({ container, row, str }) => {
  for (let i = 0; i < uiSprites[container][row].length; i++) {
    uiSprites[container][row][i].texture = getFontTexture({
      char: str[i],
    });
  }
};

const getFontTexture = ({ char }) => {
  return loader.resources["static/fonts/courier-prime-regular.json"].textures[
    alphaMap[char]
  ];
};

const initUiRow = ({ container, row }) => {
  _.times(grid[container].width * 2, (i) => {
    const sprite = new PIXI.Sprite(getFontTexture({ char: "" }));
    sprite.width = cellHfW;
    sprite.height = cellW;
    sprite.x = i * cellHfW;
    sprite.y = row * cellW;

    uiSprites[container][row][i] = sprite;
    containers[container].addChild(sprite);
  });
};

export const initUi = () => {
  // init log
  _.times(grid.log.height, (i) => {
    initUiRow({ container: "log", row: i });
  });

  // init playerHud
  _.times(grid.playerHud.height, (i) => {
    initUiRow({ container: "playerHud", row: i });
  });
  printRow({ container: "playerHud", row: 0, str: "You are a hero." });
};

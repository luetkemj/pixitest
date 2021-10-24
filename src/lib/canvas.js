import _ from "lodash";
import * as PIXI from "pixi.js";
import { Position } from "../components";
import { getEntityData } from "./ecsHelpers";
import { grid } from "./grid";
import { alphaMap } from "../../static/fonts/courier-prime-regular.map";
import { asciMap } from "../../static/asci/asci.map";

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
    .add("static/asci/asci-sprites.json")
    .load(onLoaded);
  return loader;
};

const getFontTexture = ({ char }) => {
  return loader.resources["static/fonts/courier-prime-regular.json"].textures[
    alphaMap[char]
  ];
};

export const getAsciTexture = ({ char }) => {
  return loader.resources["static/asci/asci-sprites.json"].textures[
    asciMap[char]
  ];
};

const containers = {};
const containerNames = ["legend", "map", "ambiance", "menuTabs", "menuTabItem"];
containerNames.forEach((name) => {
  containers[name] = new PIXI.Container();
  containers[name].width = grid[name].width * cellW;
  containers[name].height = grid[name].height * cellW;
  containers[name].x = grid[name].x * cellW;
  containers[name].y = grid[name].y * cellW;
  app.stage.addChild(containers[name]);
});

const uiSprites = {};
const uiSpriteContainerNames = [
  "legend",
  "ambiance",
  "menuTabs",
  "menuTabItem",
];
uiSpriteContainerNames.forEach((name) => {
  // create array structure for storing uiSprites for later use
  uiSprites[name] = Array.from(Array(grid[name].height), () => []);
});

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
  texture = "?",
  options = {},
  world,
  eid,
}) => {
  const sprite = new PIXI.Sprite(getAsciTexture({ char: texture }));
  world.sprites[eid] = _.merge(
    sprite,
    {
      renderable: false,
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

export const initUi = () => {
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

  uiSpriteContainerNames.forEach((name) => {
    _.times(grid[name].height, (i) => {
      initUiRow({ container: name, row: i });
    });
  });
  printRow({ container: "legend", row: 0, str: "You are a Knight." });
};

export const clearContainer = (container) => {
  const str = new Array(grid[container].width).join(" ");
  uiSprites[container].forEach((row, i) => {
    printRow({ container, row: i, str });
  });
};

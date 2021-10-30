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
const containerNames = ["legend", "map", "ambiance", "menu"];
containerNames.forEach((name) => {
  const width = grid[name].width * cellW;
  const height = grid[name].height * cellW;
  const x = grid[name].x * cellW;
  const y = grid[name].y * cellW;

  const graphics = new PIXI.Graphics();
  graphics.beginFill(0x000000);
  graphics.drawRect(0, 0, width, height);
  graphics.endFill();

  containers[name] = new PIXI.Container();
  containers[name].width = width;
  containers[name].height = height;
  containers[name].x = x;
  containers[name].y = y;

  app.stage.addChild(containers[name]);
  containers[name].addChild(graphics);
});

const uiSprites = {};
const uiSpriteContainerNames = ["legend", "ambiance", "menu"];
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

export const hideContainer = (container) => {
  containers[container].visible = false;
};

export const showContainer = (container) => {
  containers[container].visible = true;
};

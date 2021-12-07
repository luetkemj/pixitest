import * as PIXI from "../dist/pkg/pixijs.js";
import _ from "../dist/pkg/lodash.js";
import { grid } from "./lib/grid.js";
import { makeNoise } from "./lib/worldgen.js";

// add PIXI to the window so the devtools work
window.PIXI = PIXI;

const canvas = document.getElementById("pixi-canvas");

const cellW = window.innerWidth / grid.width;
const cellHfW = cellW / 2;

const appWidth = window.innerWidth;
const appHeight = cellW * grid.height;

const app = new PIXI.Application({
  view: canvas,
  width: appWidth,
  height: appHeight,
  autoDensity: true,
  autoResize: true,
  resolution: window.devicePixelRatio || 1,
});

const mapD = 256;

const loader = PIXI.Loader.shared;

const sprites = new Array(mapD).fill(0).map(() => new Array(mapD).fill(0));

const loadSprites = (onLoaded) => {
  loader.add("tile", "static/tile.png").load(onLoaded);
  return loader;
};

const biomes = {
  OCEAN: 0x0100ff,
  BEACH: 0xddd290,
  SCORCHED: 0xdf8720,
  BARE: 0xbc8d57,
  TUNDRA: 0x80aea8,
  SNOW: 0xffffff,
  TEMPERATE_DESERT: 0xafcfab,
  SHRUBLAND: 0x769272,
  TAIGA: 0x52674f,
  GRASSLAND: 0x00ba3f,
  TEMPERATE_DECIDUOUS_FOREST: 0x00591e,
  TEMPERATE_RAIN_FOREST: 0x2e8d4e,
  SUBTROPICAL_DESERT: 0xcfb938,
  TROPICAL_SEASONAL_FOREST: 0x4f823a,
  TROPICAL_RAIN_FOREST: 0x78b726,
};

function getBiome(e, m) {
  if (e < 0.05) return biomes.OCEAN;
  if (e < 0.06) return biomes.BEACH;

  if (e > 2.5) {
    if (m < 0.1) return biomes.SCORCHED;
    if (m < 0.2) return biomes.BARE;
    if (m < 0.8) return biomes.TUNDRA;
    return biomes.SNOW;
  }

  if (e > 2) {
    if (m < 0.33) return biomes.TEMPERATE_DESERT;
    if (m < 0.66) return biomes.SHRUBLAND;
    return biomes.TAIGA;
  }

  if (e > 1) {
    if (m < 0.16) return biomes.TEMPERATE_DESERT;
    if (m < 0.5) return biomes.GRASSLAND;
    if (m < 0.83) return biomes.TEMPERATE_DECIDUOUS_FOREST;
    return biomes.TEMPERATE_RAIN_FOREST;
  }

  if (m < 0.16) return biomes.SUBTROPICAL_DESERT;
  if (m < 0.21) return biomes.GRASSLAND;
  if (m < 0.36) return biomes.TROPICAL_SEASONAL_FOREST;

  return biomes.TROPICAL_RAIN_FOREST;
}

// pixi loader load all the sprites and initialize game
loadSprites(() => {
  // TEST WORLD GEN
  const elevation = makeNoise({
    width: mapD,
    height: mapD,
    generations: ["gen1", "gen2", "gen3"],
  });
  const moisture = makeNoise({
    width: mapD,
    height: mapD,
    generations: ["gen4", "gen5", "gen6"],
  });
  const worldMap = new PIXI.Container();
  const wH = appHeight;
  const wTW = appHeight / mapD;
  const wTile = { width: wTW, height: wTW };

  elevation.forEach((row, yIndex) => {
    row.forEach((el, xIndex) => {
      const sprite = new PIXI.Sprite.from("tile");
      sprite.width = wTile.width;
      sprite.height = wTile.height;
      sprite.x = xIndex * wTile.width;
      sprite.y = yIndex * wTile.height;

      const ms = moisture[yIndex][xIndex];

      const biome = getBiome(el, ms);
      sprite.tint = biome;

      sprites[yIndex][xIndex] = sprite;

      worldMap.addChild(sprite);
    });
  });

  app.stage.addChild(worldMap);
  // END TEST WORLD GEN
});

function updateMap(args) {
  console.log(args);

  const elevation = makeNoise({
    width: mapD,
    height: mapD,
    generations: ["gen1", "gen2", "gen3"],
    ...args,
  });
  const moisture = makeNoise({
    width: mapD,
    height: mapD,
    generations: ["gen4", "gen5", "gen6"],
    ...args,
  });

  elevation.forEach((row, yIndex) => {
    row.forEach((el, xIndex) => {
      const sprite = sprites[yIndex][xIndex];
      const ms = moisture[yIndex][xIndex];
      const biome = getBiome(el, ms);
      sprite.tint = biome;
    });
  });
}

// const knobs = ["#f1", "#f2", "#f3"];

const args = {
  f1: 4,
  f2: 6,
  f3: 12,
  o1: 1,
  o2: 0.29,
  o3: 0.51,
  valleyPower: 1.13,
  fudgeFactor: 1.06,
  island: false,
  islandAlgo: "diagonal",
  poles: 2,
  equator: -2,
};

document.querySelector("#island").addEventListener("click", () => {
  args.island = !args.island;
  updateMap(args);
});

document.querySelector("#island-algo").addEventListener("change", (event) => {
  args.islandAlgo = event.target.value;
  updateMap(args);
});

document.querySelector("#f1").addEventListener("change", (event) => {
  args.f1 = parseFloat(event.target.value);
  updateMap(args);
});

document.querySelector("#f2").addEventListener("change", (event) => {
  args.f2 = parseFloat(event.target.value);
  updateMap(args);
});

document.querySelector("#f3").addEventListener("change", (event) => {
  args.f3 = parseFloat(event.target.value);
  updateMap(args);
});

document.querySelector("#o1").addEventListener("change", (event) => {
  args.o1 = parseFloat(event.target.value);
  updateMap(args);
});

document.querySelector("#o2").addEventListener("change", (event) => {
  args.o2 = parseFloat(event.target.value);
  updateMap(args);
});

document.querySelector("#o3").addEventListener("change", (event) => {
  args.o3 = parseFloat(event.target.value);
  updateMap(args);
});

document.querySelector("#fudgeFactor").addEventListener("change", (event) => {
  args.fudgeFactor = parseFloat(event.target.value);
  updateMap(args);
});

document.querySelector("#valleyPower").addEventListener("change", (event) => {
  args.valleyPower = parseFloat(event.target.value);
  updateMap(args);
});

document.querySelector("#poles").addEventListener("change", (event) => {
  args.poles = parseFloat(event.target.value);
  updateMap(args);
});

document.querySelector("#equator").addEventListener("change", (event) => {
  args.equator = parseFloat(event.target.value);
  updateMap(args);
});

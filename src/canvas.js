import _ from "lodash";
import * as PIXI from "pixi.js";
// add PIXI to the window so the devtool work
window.PIXI = PIXI;

const canvas = document.getElementById("pixi-canvas");
const app = new PIXI.Application({
  view: canvas,
  width: window.innerWidth,
  height: window.innerHeight,
  autoDensity: true,
  autoResize: true,
  resolution: window.devicePixelRatio || 1,
});

export const addSprite = ({ texture, options, world, eid }) => {
  const sprite = new PIXI.Sprite.from(texture);
  world.sprites[eid] = _.merge(sprite, options);
  app.stage.addChild(world.sprites[eid]);
};

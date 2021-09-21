import _ from "../../_snowpack/pkg/lodash.js";
import * as PIXI from "../../_snowpack/pkg/pixijs.js";
import { Position } from "../components.js";
import { getEntityData } from "./ecsHelpers.js";

// add PIXI to the window so the devtools work
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

export const addDebugSprite = ({ texture, x, y }) => {
  const sprite = new PIXI.Sprite.from(texture);
  sprite.x = x;
  sprite.y = y;
  sprite.alpha = 1;
  sprite.anchor.x = 0.5;
  sprite.anchor.y = 0.5;

  app.stage.addChild(sprite);
  return sprite;
};

export const addSprite = ({ texture, options = {}, world, eid }) => {
  const sprite = new PIXI.Sprite.from(texture);
  world.sprites[eid] = _.merge(
    sprite,
    {
      alpha: 0,
      anchor: {
        x: 0.5,
        y: 0.5,
      },
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

  app.stage.addChild(world.sprites[eid]);
};

export const deadTexture = PIXI.Texture.from(
  "../../static/effects/enemy_afterdead_explosion_anim_f2.png"
);

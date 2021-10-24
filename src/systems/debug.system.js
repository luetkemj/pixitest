import _ from "lodash";
import { defineQuery, removeComponent, Not } from "bitecs";
import { Position } from "../components";
import { addDebugSprite } from "../lib/canvas";
import { grid } from "../lib/grid";

const positionQuery = defineQuery([Position]);

export const debugSystem = (world) => {
  const positionEnts = positionQuery(world);
  const cellWidth = window.innerWidth / grid.width;

  const destroyDebugSprites = (world, eid) => {
    if (world.meta[eid].debugSprites) {
      world.meta[eid].debugSprites.forEach((sprite) => {
        sprite.destroy();
      });
      world.meta[eid].debugSprites = [];
    }
  };

  if (world.RESETTING_DEBUG) {
    for (let i = 0; i < positionEnts.length; i++) {
      const eid = positionEnts[i];
      world.sprites[eid].alpha = 0;

      destroyDebugSprites(world, eid);
    }

    world.RESETTING_DEBUG = false;
  }

  if (!world.debug) {
    return;
  }

  for (let i = 0; i < positionEnts.length; i++) {
    const eid = positionEnts[i];
    world.sprites[eid].alpha = 1;
    world.sprites[eid].tint = `0xffffff`;

    // remove old debug sprites
    destroyDebugSprites(world, eid);

    // add new debug sprites
    if (_.get(world, `meta.${eid}.ai.path`)) {
      world.meta[eid].ai.path.forEach((pos, i) => {
        if (i > 1 && i < world.meta[eid].ai.path.length - 1) {
          const [posX, posY] = pos;
          const x = posX * cellWidth;
          const y = posY * cellWidth;
          const sprite = addDebugSprite({
            texture: "%",
            x,
            y,
          });
          sprite.height = cellWidth;
          sprite.width = cellWidth;

          world.meta[eid].debugSprites.push(sprite);
        }
      });
    }
  }

  return world;
};

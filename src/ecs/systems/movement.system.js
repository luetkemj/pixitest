import _ from "lodash";
import { addComponent, hasComponent, removeComponent } from "bitecs";
import { addLog, getState, setState } from "../../index";
import {
  Ai,
  Blocking,
  Damage,
  Dead,
  Forgettable,
  Health,
  Pickupable,
  Position,
  Strength,
  MoveTo,
  Zindex,
} from "../components";
import { getWielders, updatePosition } from "../ecsHelpers";
import { grid } from "../../lib/grid";
import * as gfx from "../../lib/graphics";
import { movementQuery, pcQuery } from "../queries";
import { dijkstra } from "../../lib/dijkstra";

const kill = (world, eid) => {
  addComponent(world, Dead, eid);
  addComponent(world, Pickupable, eid);
  removeComponent(world, MoveTo, eid);
  removeComponent(world, Ai, eid);
  removeComponent(world, Blocking, eid);
  removeComponent(world, Forgettable, eid);
  Zindex.zIndex[eid] = 20;
  world.sprites[eid].char = "%";
};

const attack = ({ world, aggEid, tarEid, pcEid }) => {
  let damage = Strength.current[aggEid];

  const wielders = getWielders(world, aggEid);
  _.each(wielders, (wielder) => {
    const itemEid = wielder[1];
    if (itemEid) {
      if (hasComponent(world, Damage, itemEid)) {
        damage += Damage.current[itemEid];
      }
    }
  });

  const aggName = pcEid === aggEid ? "you" : world.meta[aggEid].name;
  const tarName = pcEid === tarEid ? "you" : world.meta[tarEid].name;
  const log = [
    {
      str: aggName,
      color: `${world.sprites[aggEid].tint}`,
    },
    {
      str: ` ${pcEid === aggEid ? "hit" : "hits"}`,
    },
    {
      str: ` ${tarName}`,
      color: world.sprites[tarEid].tint,
    },
    {
      str: ` for`,
    },
    {
      str: ` ${damage} damage`,
      color: gfx.colors.blood,
    },
  ];

  Health.current[tarEid] -= damage;
  if (Health.current[tarEid] <= 0) {
    kill(world, tarEid);
    log.push({
      str: ` ${pcEid === tarEid ? "and kills you!" : "and kill it!"}`,
      color: gfx.colors.blood,
    });
  }

  addLog(log);
};

export const movementSystem = (world) => {
  const ents = movementQuery(world);
  const pcEnts = pcQuery(world);

  for (let i = 0; i < ents.length; i++) {
    const eid = ents[i];
    let canMove = false;

    const oldPos = {
      x: Position.x[eid],
      y: Position.y[eid],
      z: Position.z[eid],
    };

    const newPos = {
      x: MoveTo.x[eid],
      y: MoveTo.y[eid],
      z: MoveTo.z[eid],
    };

    // check if location is within bounds
    if (
      newPos.x >= 0 &&
      newPos.x < grid.width &&
      newPos.y >= 0 &&
      newPos.y < grid.height
    ) {
      canMove = true;
    }

    // check if blocked
    getState().eAtPos[`${newPos.x},${newPos.y},${newPos.z}`].forEach((e) => {
      if (hasComponent(world, Blocking, e)) {
        canMove = false;

        // check if blocked by thing with health
        if (hasComponent(world, Health, e)) {
          // attack the thing!
          attack({ world, aggEid: eid, tarEid: e, pcEid: pcEnts[0] });
        } else {
          addLog("BUMP!");
        }
      }
    });

    // update position
    if (canMove) {
      updatePosition({ world, oldPos, newPos, eid });
      // if moved and is player recalc the player dijkstra map
      if (eid === pcEnts[0]) {
        setState((state) => {
          state.dijkstra.player = {
            map: dijkstra(world, [newPos]),
            goals: [newPos],
          };
        });
      }
    }

    removeComponent(world, MoveTo, eid);
  }
  return world;
};

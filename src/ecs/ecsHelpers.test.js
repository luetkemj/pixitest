import _ from "lodash";
import {
  addComponent,
  createWorld,
  deleteWorld,
  resetWorld,
  addEntity,
  getEntityComponents,
  hasComponent,
} from "bitecs";
import { getState } from "../index";
import {
  createEntity,
  deleteEntity,
  getRelatedEids,
  updatePosition,
  removeComponentFromEntities,
} from "./ecsHelpers";
import { createTestEntity } from "../../src/prefabs/testEntity";
import { Position } from "./components";

describe("createEntity", () => {
  let world;
  let eid;

  beforeEach(() => {
    world = createWorld();
    eid = createEntity(world);
  });

  afterEach(() => {
    resetWorld(world);
    deleteWorld(world);
  });

  it("should return an eid", () => {
    expect(eid).toBe(0);
  });

  it("should add eid to the current map in state", () => {
    const { zoom, mapId } = getState().maps;
    expect(getState().maps[zoom][mapId].has(eid)).toBe(true);
  });
});

describe("deleteEntity", () => {
  let world;
  let eid;

  beforeEach(() => {
    world = createWorld();
    eid = createEntity(world);
  });

  afterEach(() => {
    resetWorld(world);
    deleteWorld(world);
  });

  it("should remove the deleted entity from state", () => {
    const { zoom, mapId } = getState().maps;
    expect(getState().maps[zoom][mapId].has(eid)).toBe(true);

    deleteEntity(world, eid);
    expect(getState().maps[zoom][mapId].has(eid)).toBe(false);
  });
});

describe("updatePosition", () => {
  let world;
  let eid;

  beforeEach(() => {
    world = createWorld();
    eid = createEntity(world);
  });

  afterEach(() => {
    resetWorld(world);
    deleteWorld(world);
  });

  describe("when world.eAtPos doesn't exist yet", () => {
    it("should work", () => {
      const newPos = { x: 1, y: 1, z: 0 };
      const newLocId = `1,1,0`;

      updatePosition({ world, newPos, eid });

      const p = { x: Position.x[eid], y: Position.y[eid], z: Position.z[eid] };

      expect(p).toEqual(newPos);
      expect(world.eAtPos[newLocId].has(eid)).toBe(true);
    });
  });

  describe("when updating the position of an entity", () => {
    it("should work", () => {
      const oldPos = { x: 0, y: 0, z: 0 };
      const newPos = { x: 1, y: 1, z: 0 };
      const oldLocId = `0,0,0`;
      const newLocId = `1,1,0`;
      updatePosition({ world, newPos: oldPos, eid });
      updatePosition({ world, newPos, oldPos, eid });

      const p = { x: Position.x[eid], y: Position.y[eid], z: Position.z[eid] };

      expect(p).toEqual(newPos);
      expect(world.eAtPos[oldLocId].has(eid)).toBe(false);
      expect(world.eAtPos[newLocId].has(eid)).toBe(true);
    });
  });

  describe("when remove = true", () => {
    it("should work", () => {
      addComponent(world, Position, eid);
      world.sprites = {};
      world.sprites[eid] = {};

      const oldPos = { x: 0, y: 0, z: 0 };
      const oldLocId = `0,0,0`;
      updatePosition({ world, newPos: oldPos, eid });
      updatePosition({ world, oldPos, eid, remove: true });

      expect(hasComponent(world, Position, eid)).toBe(false);
      expect(world.eAtPos[oldLocId].has(eid)).toBe(false);
      expect(world.sprites[eid].renderable).toBe(false);
    });
  });
});

describe("removeComponentFromEntities", () => {
  let world;

  beforeEach(() => {
    world = createWorld();
  });

  afterEach(() => {
    resetWorld(world);
    deleteWorld(world);
  });

  it("should work", () => {
    const eid0 = addEntity(world);
    const eid1 = addEntity(world);
    addComponent(world, Position, eid0);
    addComponent(world, Position, eid1);

    expect(hasComponent(world, Position, eid0)).toBe(true);
    expect(hasComponent(world, Position, eid1)).toBe(true);

    removeComponentFromEntities(world, Position, [eid0, eid1]);

    expect(hasComponent(world, Position, eid0)).toBe(false);
    expect(hasComponent(world, Position, eid1)).toBe(false);
  });
});

describe("getRelatedEids", () => {
  let world;

  beforeEach(() => {
    world = createWorld();
  });

  afterEach(() => {
    resetWorld(world);
    deleteWorld(world);
  });

  it("should work for nested inventories and nested body parts", () => {
    world.meta = {};
    world.sprites = {};
    const eid = createTestEntity(world);
    const relatedEids = getRelatedEids(world, eid);
    expect(_.orderBy(relatedEids)).toEqual([
      0,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19,
      20,
      21,
      22,
      23,
    ]);
  });
});

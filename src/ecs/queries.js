import { defineQuery, Not } from "bitecs";
import {
  Ai,
  Broken,
  Dead,
  Durability,
  Forgettable,
  InFov,
  Intelligence,
  Legendable,
  Lumens,
  Beam,
  Lux,
  MoveTo,
  OnCurrentMap,
  Opaque,
  PC,
  Position,
  Revealed,
} from "./components";

export const aiQuery = defineQuery([OnCurrentMap, Ai, Intelligence]);
export const deadPCQuery = defineQuery([OnCurrentMap, Dead, PC]);
export const durabilityQuery = defineQuery([OnCurrentMap, Durability]);
export const forgettableQuery = defineQuery([
  OnCurrentMap,
  Revealed,
  Not(InFov),
  Forgettable,
]);
export const inFovQuery = defineQuery([OnCurrentMap, InFov, Position]);
export const legendableQuery = defineQuery([
  OnCurrentMap,
  InFov,
  Legendable,
  Lux,
]);
export const lightQuery = defineQuery([
  OnCurrentMap,
  Lumens,
  Beam,
  Position,
  Not(Broken),
]);
export const luxQuery = defineQuery([OnCurrentMap, Lux]);
export const movementQuery = defineQuery([OnCurrentMap, Position, MoveTo]);
export const opaqueQuery = defineQuery([OnCurrentMap, Opaque]);
export const pcQuery = defineQuery([OnCurrentMap, PC]);
export const positionQuery = defineQuery([OnCurrentMap, Position]);
export const revealedQuery = defineQuery([
  OnCurrentMap,
  Revealed,
  Not(InFov),
  Position,
]);

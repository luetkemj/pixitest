import { defineQuery, Not } from "bitecs";
import {
  Ai,
  Dead,
  Forgettable,
  InFov,
  Intelligence,
  Legendable,
  MoveTo,
  OnCurrentMap,
  Opaque,
  PC,
  Position,
  Revealed,
} from "./components";

export const aiQuery = defineQuery([OnCurrentMap, Ai, Intelligence]);
export const deadPCQuery = defineQuery([OnCurrentMap, Dead, PC]);
export const forgettableQuery = defineQuery([
  OnCurrentMap,
  Revealed,
  Not(InFov),
  Forgettable,
]);
export const inFovQuery = defineQuery([OnCurrentMap, InFov, Position]);
export const legendableQuery = defineQuery([OnCurrentMap, InFov, Legendable]);
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

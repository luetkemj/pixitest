import { defineQuery, Not } from "bitecs";
import {
  Ai,
  Dead,
  Forgettable,
  InFov,
  Intelligence,
  Legendable,
  MoveTo,
  Opaque,
  PC,
  Position,
  Revealed,
} from "./ecs/components";

export const aiQuery = defineQuery([Ai, Intelligence]);
export const deadPCQuery = defineQuery([Dead, PC]);
export const forgettableQuery = defineQuery([
  Revealed,
  Not(InFov),
  Forgettable,
]);
export const inFovQuery = defineQuery([InFov, Position]);
export const legendableQuery = defineQuery([InFov, Legendable]);
export const movementQuery = defineQuery([Position, MoveTo]);
export const opaqueQuery = defineQuery([Opaque]);
export const pcQuery = defineQuery([PC]);
export const positionQuery = defineQuery([Position]);
export const revealedQuery = defineQuery([Revealed, Not(InFov), Position]);

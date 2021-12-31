import { Types, defineComponent } from "bitecs";

const Vector3 = { x: Types.f32, y: Types.f32, z: Types.f32 };
const MaxCurrent = { max: Types.i16, current: Types.i16 };

export const Ai = defineComponent();
export const Attack = defineComponent(MaxCurrent);
export const Blocking = defineComponent();
export const Body = defineComponent({ slots: [Types.eid, 5] });
export const Damage = defineComponent(MaxCurrent);
export const Dead = defineComponent();
export const Droppable = defineComponent();
export const Effects = defineComponent({
  Health: Types.i16,
  Strength: Types.i16,
});
export const Forgettable = defineComponent();
export const FovDistance = defineComponent({ dist: Types.ui8 });
export const FovRange = defineComponent({ dist: Types.ui8 });
export const Health = defineComponent(MaxCurrent);
export const Intelligence = defineComponent(MaxCurrent);
export const InFov = defineComponent();
export const Inventory = defineComponent({ slots: [Types.eid, 24] });
export const Legendable = defineComponent();
export const Liquid = defineComponent();
export const MoveTo = defineComponent(Vector3);
export const Opaque = defineComponent();
export const BelongsTo = defineComponent({ eid: Types.eid });
export const Pickupable = defineComponent();
export const PC = defineComponent();
export const Position = defineComponent(Vector3);
export const Revealed = defineComponent();
export const Show = defineComponent();
export const Stairs = defineComponent({ toZ: Types.ui8 });
export const Strength = defineComponent(MaxCurrent);
export const Velocity = defineComponent(Vector3);
export const Wieldable = defineComponent();
export const Wielding = defineComponent({ slot: Types.eid });
export const Zindex = defineComponent({ zIndex: Types.ui8 });

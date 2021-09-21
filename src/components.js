import { Types, defineComponent } from "../_snowpack/pkg/bitecs.js";

const Vector3 = { x: Types.f32, y: Types.f32, z: Types.f32 };
const MaxCurrent = { max: Types.i16, current: Types.i16 };

export const Ai = defineComponent();
export const Attack = defineComponent(MaxCurrent);
export const Blocking = defineComponent();
export const Dead = defineComponent();
export const Forgettable = defineComponent();
export const Fov = defineComponent();
export const FovDistance = defineComponent({ dist: Types.ui8 });
export const Health = defineComponent(MaxCurrent);
export const Intelligence = defineComponent(MaxCurrent);
export const InFov = defineComponent();
export const Opaque = defineComponent();
export const Position = defineComponent(Vector3);
export const Render = defineComponent();
export const Revealed = defineComponent();
export const Strength = defineComponent(MaxCurrent);
export const Velocity = defineComponent(Vector3);
export const MoveTo = defineComponent(Vector3);

import { Types, defineComponent } from "bitecs";

const Vector3 = { x: Types.f32, y: Types.f32, z: Types.f32 };

export const Blocking = defineComponent();
export const Fov = defineComponent();
export const FovDistance = defineComponent({ dist: Types.ui8 });
export const InFov = defineComponent();
export const Opaque = defineComponent();
export const Position = defineComponent(Vector3);
export const Render = defineComponent();
export const Revealable = defineComponent();
export const Revealed = defineComponent();
export const Velocity = defineComponent(Vector3);

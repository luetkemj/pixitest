import { Types, defineComponent } from "bitecs";

const Vector3 = { x: Types.f32, y: Types.f32, z: Types.f32 };

export const Blocking = defineComponent();
export const Position = defineComponent(Vector3);
export const Render = defineComponent();
export const Velocity = defineComponent(Vector3);

export const InFov = defineComponent();
export const Opaque = defineComponent();
export const Revealed = defineComponent();

export const Fov = defineComponent();

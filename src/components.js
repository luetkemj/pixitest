import { Types, defineComponent } from "bitecs";

const Vector3 = { x: Types.f32, y: Types.f32, z: Types.f32 };

export const Ai = defineComponent();
export const Attack = defineComponent({ max: Types.i16, current: Types.i16 });
export const Blocking = defineComponent();
export const Brain = defineComponent();
export const Forgettable = defineComponent();
export const Fov = defineComponent();
export const FovDistance = defineComponent({ dist: Types.ui8 });
export const Health = defineComponent({ max: Types.i16, current: Types.i16 });
export const Intelligence = defineComponent({
  max: Types.i16,
  current: Types.i16,
});
export const InFov = defineComponent();
export const Opaque = defineComponent();
export const Position = defineComponent(Vector3);
export const Render = defineComponent();
export const Revealed = defineComponent();
export const Velocity = defineComponent(Vector3);
export const MoveTo = defineComponent(Vector3);

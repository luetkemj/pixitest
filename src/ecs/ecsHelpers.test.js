import { getState } from "../index";
import { createEntity } from "./ecsHelpers";

test("adds 1 + 2 to equal 3", () => {
  console.log(getState());
  expect(1).toBe(1);
});

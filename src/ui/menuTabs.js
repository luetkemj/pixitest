import _ from "lodash";
import { printRow } from "../lib/canvas";
import { grid } from "../lib/grid";

export const renderMenuTabs = (world) => {
  console.log("we getting called?");
  const str = `(L)og  (I)nventory  (C)haracter`;
  printRow({ container: "menuTabs", row: 0, str });
};

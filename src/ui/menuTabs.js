import _ from "lodash";
import { printRow } from "../lib/canvas";

export const renderMenuTabs = (world) => {
  const str = `(L)og  (I)nventory  (C)haracter`;
  printRow({ container: "menuTabs", row: 0, str });
};

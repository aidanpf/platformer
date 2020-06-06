import * as bob from "./bob.js";
import * as editor from "./editor.js";
import {init} from "./app.js";

//@ts-check

const app = init();
bob.init(app);
editor.init(app);
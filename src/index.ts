import {editor} from "./editor.js";
import {createApp, initGameObjectWithGraphics} from "./setup.js";
import { bob } from "./bob.js";
import { factory } from "./helpers/gameObjectFactory.js";
import { messenger } from "./helpers/messenger.js";
import {Bump} from './helpers/bump.js';
import { camera } from "./camera.js";

declare const PIXI: any;

const bump = new Bump(PIXI);
const app = createApp();

app.loader.add('bob', `textures/bob.png`);
app.loader.add('bit', `textures/bit.png`);

app.loader.load((_, resources) => {
    initGameObjectWithGraphics(app, bob, 'bob', resources);
});

messenger.subscribe(
    camera(app)
);

messenger.subscribe(
    factory(app, bump)
);

messenger.subscribe(
    editor(app)
);
import {editor} from "./editor.js";
import {createApp, initGameObjectWithGraphics} from "./setup.js";
import { bob } from "./bob.js";
import { factory } from "./helpers/gameObjectFactory.js";
import { messenger, messages } from "./helpers/messenger.js";
import { camera } from "./camera.js";

declare const PIXI: any;

const app = createApp();

app.loader.add('bob', `textures/bob.png`);
app.loader.add('bit', `textures/bit.png`);

app.loader.load((_, resources) => {
    initGameObjectWithGraphics(app, bob, 'bob', resources);
});

messenger.subscribe(
    camera(app),
    factory(app),
    editor(app)
);

messenger.dispatch({
    type: messages.allFinishSubscribing
});
import {editor} from "./editor.js";
import { factory } from "./factory.js";
import { messenger, messages } from "./helpers/messenger.js";
import { camera } from "./camera.js";
import { conversation } from "./conversation.js";
import { app } from "./setup.js";
import { hud } from "./hud.js";

app.loader.add('bob', 'textures/bob.png');
app.loader.add('shop', 'textures/shop.png');

app.loader.load(() => {

    messenger.subscribe(
        camera(),
        factory(),
        editor(),
        conversation(),
        hud()
    );
    
    messenger.dispatch({
        type: messages.allFinishSubscribing
    });
    
    messenger.dispatch({
        type: messages.gameRequestsBobToSpawn
    });
    
});


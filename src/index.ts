import {editor} from "./editor.js";
import { factory } from "./factory.js";
import { messenger, messages } from "./helpers/messenger.js";
import { camera } from "./camera.js";
import { conversation } from "./conversation.js";
import { app } from "./setup.js";

app.loader.add('bob', 'textures/bob.png');

app.loader.load(() => {

    messenger.subscribe(
        camera(app),
        factory(app),
        editor(app),
        conversation(app)
    );
    
    messenger.dispatch({
        type: messages.allFinishSubscribing
    });
    
    messenger.dispatch({
        type: messages.gameRequestsBobToSpawn
    });
    
});


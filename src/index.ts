import {editor} from "./editor";
import { factory } from "./factory";
import { messenger, messages } from "./helpers/messenger";
import { camera } from "./camera";
import { conversation } from "./conversation";
import { app } from "./setup";
import { hud } from "./hud";

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


import { GameObjectCreator } from "./types/GameObjectCreator.js";
import { messenger, messages } from "./helpers/messenger.js";

declare const PIXI: any;

export const bit: GameObjectCreator = (app, sprite, _) => {

    const speed = {
        x: 10,
        y: 0
    }

    const init = () => {
        app.ticker.add(update);
    };
    
    const update = () => {
        sprite.x += speed.x;

        messenger.dispatch({
            type: messages.bitFinishedMoving,
            sprite
        })
    };

    const receive = () => {
        
    };

    init();

    return {receive};
};


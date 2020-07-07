import { messenger, messages } from "./helpers/messenger";

declare const PIXI: any;

export const bit = (app, sprite, x, y) => {

    const speed = {
        x: 10,
        y: 0
    }

    const init = () => {
        sprite.x = x;
        sprite.y = y;
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


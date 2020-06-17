import { messages, messenger } from "./helpers/messenger.js";
import { bump } from "./helpers/bump.js";

export const spike = (sprite, x, y) => {
    
    const receive = (message) => {
        if (message.type === messages.bobFinishesMoving) {
            const overlapping = bump.hit(message.sprite, sprite);

            if (overlapping) {
                messenger.dispatch({
                    type: messages.bobDies
                })
            }
        }
    };

    const init = () => {
        sprite.x = x;
        sprite.y = y;
    };

    return {receive, init};
};
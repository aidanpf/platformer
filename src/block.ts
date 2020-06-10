import { messages, messenger } from "./helpers/messenger.js";

export const block = (_, bump, sprite, x, y) => {
    
    const receive = (message) => {
        if (message.type === messages.bobFinishesMoving) {
            const overlapping = bump.hit(message.sprite, sprite);

            if (overlapping) {
                messenger.dispatch({
                    type: messages.bobBeginsOverlapWithBlock,
                    block: sprite,
                    previousPosition: message.previousPosition
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
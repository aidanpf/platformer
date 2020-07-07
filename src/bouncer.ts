import { messages, messenger } from "./helpers/messenger";
import { bump } from "./helpers/bump";

export const bouncer = (sprite, x, y) => {
    
    const receive = (message) => {
        if (message.type === messages.bobFinishesMoving) {
            const overlapping = bump.hit(message.sprite, sprite);

            if (overlapping) {
                messenger.dispatch({
                    type: messages.bobCollidesWithBouncer
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
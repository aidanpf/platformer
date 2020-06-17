import { Message, messages, messenger } from "./helpers/messenger.js";
import { bump } from "./helpers/bump.js";

export const baddie = (sprite, x, y) => {
    let unsubscribe: Function;
    
    const init = () => {
        sprite.x = x;
        sprite.y = y;
    };

    const receive = (message: Message) => {
        if (message.type === messages.bitFinishedMoving) {
            if (bump.hit(message.sprite, sprite)) {
                destroy();
            }
        }

        if (message.type === messages.bobFinishesMoving) {
            if(bump.hit(sprite, message.sprite)) {
                messenger.dispatch({
                    type: messages.bobDies
                })
            }
        }
    };

    const receiveUnsubscribe = (_unsubscribe: Function) => {
        unsubscribe = _unsubscribe;
    };

    const destroy = () => {
        sprite.destroy(true);
        unsubscribe();
    };

    return {receive, init, receiveUnsubscribe};
};
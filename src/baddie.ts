import { Message, messages, messenger } from "./helpers/messenger.js";
import { bump } from "./helpers/bump.js";
import { e } from "./keyboard.js";

export const baddie = (sprite, x, y) => {
    let unsubscribe: Function;
    let collidingWithBob = false;
    
    const init = () => {
        sprite.x = x;
        sprite.y = y;

        e.press = () => {
            if (collidingWithBob) {
                messenger.dispatch({
                    type: messages.bobInitiatesConversation
                })
            }
        };
    };

    const receive = (message: Message) => {
        if (message.type === messages.bitFinishedMoving) {
            if (bump.hit(message.sprite, sprite)) {
                destroy();
            }
        }

        if (message.type === messages.bobFinishesMoving) {
            collidingWithBob = bump.hit(sprite, message.sprite);
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
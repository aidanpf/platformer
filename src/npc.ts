import { Message, messages, messenger } from "./helpers/messenger.js";
import { bump } from "./helpers/bump.js";
import { e } from "./keyboard.js";

export const npc = (sprite, x, y) => {
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
        if (message.type === messages.bobFinishesMoving) {
            collidingWithBob = bump.hit(sprite, message.sprite);
        }
    };

    return {receive, init};
};
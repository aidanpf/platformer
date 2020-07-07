import { Message, messages, messenger, Unsubscriber } from "./helpers/messenger";
import { bump } from "./helpers/bump";

export const baddie = (sprite, x, y) => {
    const unsubscriber = Unsubscriber();
    
    const init = () => {
        sprite.x = x;
        sprite.y = y;
    };

    const receive = (message: Message) => {
        if (message.type === messages.bitFinishedMoving) {
            if (bump.hit(message.sprite, sprite)) {
                messenger.dispatch({
                    type: messages.baddieDies,
                    sprite
                })
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
    
    const destroy = () => {
        sprite.destroy(true);
        unsubscriber.unsubscribe()();
    };

    return {receive, init, unsubscriber};
};
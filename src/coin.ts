import { Message, messages, messenger } from "./helpers/messenger.js";
import { collidingWithBob } from "./helpers/collisions.js";
import { speedYBehaviour } from "./helpers/speed.js";
import { Frame } from "./helpers/frame.js";
import { Sprite } from "./helpers/sprite.js";

export const coin = (sprite, x, y) => {
    const speedY = speedYBehaviour({init: -10, gravity: 0.6, max: 15});
    const frame = Frame(() => {
        speedY.update();
        sprite.y += speedY.value();
    });
    let unsubscribe;
    const spriteManager = Sprite(sprite, x, y);

    const receive = (message: Message) => {
       if (collidingWithBob(message, sprite)) {
           messenger.dispatch({
               type: messages.bobCollidesWithCoin
           })
           destroy();
       }
    };

    const receiveUnsubscribe = (_unsubscribe: Function) => {
        unsubscribe = _unsubscribe;
    };

    const destroy = () => {
        spriteManager.destroy();
        frame.destroy();
        unsubscribe();
    };

    return {receive, receiveUnsubscribe};
};
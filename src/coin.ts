import { Message, messages, messenger, Unsubscriber } from "./helpers/messenger.js";
import { collidingWithBob, resolveCollision } from "./helpers/collisions.js";
import { gravityBehaviour } from "./helpers/speed.js";
import { Frame } from "./helpers/frame.js";
import { Sprite } from "./helpers/sprite.js";
import { Id } from "./helpers/id.js";

const bounceFriction = 2;
const initialBounceEnergy = 10;

export const coin = (sprite, x, y) => {
    const gravity = gravityBehaviour({initialSpeed: -10, gravity: 0.6, max: 15});
    const id = Id.get();
    let numberOfBounces = 0;

    const frame = Frame(() => {
        gravity.apply();
        sprite.y = gravity.nextY(sprite.y);

        messenger.dispatch({
            type: messages.coinFinishingMoving,
            sprite,
            id,
            previousPosition: { x: sprite.x, y: gravity.lastPosition() }
        });
    });

    const unsubscriber = Unsubscriber();
    const spriteManager = Sprite(sprite, x, y);

    const receive = (message: Message) => {
       if (collidingWithBob(message, sprite)) {
           messenger.dispatch({
               type: messages.bobCollidesWithCoin
           });
           destroy();
       }

       if (message.type === messages.coinCollidesWithFloor && message.id === id) {
           const lostBounceEnergy = numberOfBounces * bounceFriction
           
           if (lostBounceEnergy < initialBounceEnergy) {
                gravity.setSpeed(-(initialBounceEnergy - lostBounceEnergy));
                numberOfBounces ++;
            } else {
                gravity.setSpeed(0);
            }

            const {newPosition} = resolveCollision(sprite, message as any);
            sprite.x = newPosition.x;
            sprite.y = newPosition.y;
       }
    };

    const destroy = () => {
        spriteManager.destroy();
        frame.destroy();
        unsubscriber.unsubscribe()();
    };

    return {receive, unsubscriber};
};
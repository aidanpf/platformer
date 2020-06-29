import { messages, messenger } from "./helpers/messenger.js";
import { bump } from "./helpers/bump.js";
import { EntityTypes } from "./editor.js";

export const block = (_, sprite, x, y, entityType: EntityTypes) => {
    
    const receive = (message) => {
        if (message.type === messages.bobFinishesMoving) {
            const overlapping = bump.hit(message.sprite, sprite);

            if (overlapping) {
                messenger.dispatch({
                    type: messages.bobBeginsOverlapWithBlock,
                    block: sprite,
                    entityType,
                    previousPosition: message.previousPosition
                })
            }
        }

        if (message.type === messages.coinFinishingMoving) {
            if(bump.hit(message.sprite, sprite)) {
                messenger.dispatch({
                    type: messages.coinCollidesWithFloor,
                    id: message.id,
                    block: sprite,
                    previousPosition: message.previousPosition,
                    entityType
                });
            }
        }
    };

    const init = () => {
        sprite.x = x;
        sprite.y = y;
    };

    return {receive, init};
};
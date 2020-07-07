import { gravity, jumpPower, movementSpeed, bouncePower } from "./data";
import { right, left, up, down } from "./keyboard";
import { messenger, messages, Unsubscriber } from "./helpers/messenger";
import { resolveCollision } from "./helpers/collisions";

export const bob = (app, sprite) => {
    let dead = false;
    let inConversation = false;
    const unsubscriber = Unsubscriber();

    const speed = {
        x: 0,
        y: 0
    };

    let canJump = false;

    const dimensions = {
        x: sprite.texture.width,
        y: sprite.texture.height
    };

    const init = () => {

        sprite.x = 0;
        sprite.y = 0;

        app.ticker.add(update);
        down.press = () => {
            const {x, y} = dimensions;

            messenger.dispatch({
                type: messages.bitFired,
                x: sprite.x + x,
                y: sprite.y + y/2
            });
        };
    };
    
    const update = () => {
        const previousPosition = {x: sprite.x, y: sprite.y};
        
        takeInput();
        fall();

        if(!dead) {
            messenger.dispatch({
                type: messages.bobFinishesMoving,
                sprite,
                previousPosition
            });
        }
    };

    const takeInput = () => {
        if (dead || inConversation) {
            return;
        }

        if(right.isDown) {
            sprite.x += movementSpeed;
            sprite.scale.x = 1;
        }
    
        if (left.isDown) {
            sprite.x -= movementSpeed;
        }
    
        if (up.isDown && canJump) {
            speed.y = -jumpPower;
            canJump = false;
        }
    };
    
    const fall = () => {
        speed.y += gravity;
        sprite.y += speed.y;
    };

    const destroy = () => {
        app.ticker.remove(update);
        unsubscriber.unsubscribe()();
        messenger.dispatch({
            type: messages.gameRequestsBobToSpawn
        })
    };

    const receive = (message) => {
        if (message.type === messages.bobBeginsOverlapWithBlock && !dead) {
            moveOutOfBlock(message);
        }

        if (message.type === messages.bobCollidesWithBouncer) {
            speed.y = -bouncePower;
            canJump = false;
        }

        if (message.type === messages.bobDies && !dead) {
            dead = true;
            speed.y = -15;
            setTimeout(destroy, 1000 * 2)
        }

        if (message.type === messages.bobInitiatesConversation) {
            inConversation = true;
        }

        if (message.type === messages.conversationEnds) {
            inConversation = false;
        }
    };

    const moveOutOfBlock = ({block, previousPosition, entityType}) => {

        const collision = resolveCollision(sprite, {block, previousPosition, entityType});
        sprite.x = collision.newPosition.x;
        sprite.y = collision.newPosition.y;

        if (collision.withBelow) {
            speed.y = 0;
            canJump = true;
        }

        if (collision.withAbove) {
            speed.y = 0;
        }

        messenger.dispatch({
            type: messages.bobFinishesCollisionResolution,
            sprite,
            previousPosition
        });
    };

    init();

    return {receive, unsubscriber};
};


import { gravity, jumpPower, movementSpeed, bouncePower } from "./data.js";
import { right, left, up, down } from "./keyboard.js";
import { getSides } from "./helpers/sprites.js";
import { messenger, messages } from "./helpers/messenger.js";
import { diffCoords } from "./helpers/coords.js";

export const bob = (app, sprite) => {
    let dead = false;
    let inConversation = false;
    let unsubscribe: Function;

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

    const moveOutOfBlock = ({block, previousPosition, entityType}) => {

        const diff = diffCoords(sprite, previousPosition);

        const movingRight = diff.x > 0;
        const movingDown = diff.y > 0;
        const movingLeft = diff.x < 0;
        const movingUp = diff.y < 0;

        const blockSides = getSides(block, block.texture);
        const bobSides = getSides(previousPosition, sprite.texture);

        const previouslyToLeftOfBlock = bobSides.right < blockSides.left;
        const previouslyToRightOfBlock = bobSides.left > blockSides.right;
        const previouslyAboveBlock = bobSides.bottom < blockSides.top;
        const previouslyBelowBlock = bobSides.top > blockSides.bottom;


        if (movingRight && previouslyToLeftOfBlock && entityType != 'jump through block') {
            sprite.x = (block.x - sprite.texture.width - 0.1);
        } 
        
        if (movingDown && previouslyAboveBlock) {
            sprite.y = (block.y - sprite.texture.height - 0.1);
            speed.y = 0;
            canJump = true;
        } 

        if (movingLeft && previouslyToRightOfBlock && entityType != 'jump through block') {
            sprite.x = (blockSides.right + 0.1);
        } 
        
        if (movingUp && previouslyBelowBlock && entityType != 'jump through block') {
            sprite.y = (blockSides.bottom + 0.1);
            speed.y = 0;
        }

        messenger.dispatch({
            type: messages.bobFinishesCollisionResolution,
            sprite,
            previousPosition
        });
    };

    const destroy = () => {
        app.ticker.remove(update);
        unsubscribe();
        messenger.dispatch({
            type: messages.gameRequestsBobToSpawn
        })
    };

    const receiveUnsubscribe = (_unsubscribe: Function) => {
        unsubscribe = _unsubscribe;
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

    init();

    return {receive, receiveUnsubscribe};
};


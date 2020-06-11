import { gravity, jumpPower, movementSpeed } from "./data.js";
import { right, left, up, down } from "./keyboard.js";
import { getSides } from "./helpers/sprites.js";
import { GameObjectCreator } from "./types/GameObjectCreator.js";
import { bit } from "./bit.js";
import { initGameObjectWithGraphics } from "./setup.js";
import { messenger, messages } from "./helpers/messenger.js";
import { diffCoords } from "./helpers/coords.js";

export const bob: GameObjectCreator = (app, sprite, resources) => {

    const speed = {
        x: 0,
        y: 0
    };

    let canJump = false;

    const dimensions = {
        x: resources.bob.texture.width,
        y: resources.bob.texture.height
    };

    const init = () => {
        app.ticker.add(update);
        down.press = () => {
            const {x, y} = dimensions;
            initGameObjectWithGraphics(app, bit, 'bit', resources, sprite.x + x, sprite.y + y/2)
        };
    };
    
    const update = () => {
        const previousPosition = {x: sprite.x, y: sprite.y};
    
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

        fall();

        messenger.dispatch({
            type: messages.bobFinishesMoving,
            sprite,
            previousPosition
        });
    };
    
    const fall = () => {
        speed.y += gravity;
        sprite.y += speed.y;
    };

    const moveOutOfBlock = ({block, previousPosition}) => {

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


        if (movingRight && previouslyToLeftOfBlock) {
            sprite.x = (block.x - sprite.texture.width - 0.1);
        } else if (movingDown && previouslyAboveBlock) {
            sprite.y = (block.y - sprite.texture.height - 0.1);
            speed.y = 0;
            canJump = true;
        } else if (movingLeft && previouslyToRightOfBlock) {
            sprite.x = (blockSides.right + 0.1);
        } else if (movingUp && previouslyBelowBlock) {
            sprite.y = (blockSides.bottom + 0.1);
            speed.y = 0;
        }

        messenger.dispatch({
            type: messages.bobFinishesCollisionResolution,
            sprite,
            previousPosition
        });
    };

    const receive = (message) => {
        if (message.type === messages.bobBeginsOverlapWithBlock) {
            moveOutOfBlock(message);
        }
    };

    init();

    return {receive};
};


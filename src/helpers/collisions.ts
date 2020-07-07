import { messages, Message } from "./messenger";
import { bump } from "./bump";
import { diffCoords } from "./coords";
import { getSides } from "./sprites";

export const collidingWithBob = (message: Message, sprite) => 
    message.type === messages.bobFinishesMoving && bump.hit(message.sprite, sprite)
;

export const resolveCollision = (sprite, {block, previousPosition, entityType}) => {

    const diff = diffCoords(sprite, previousPosition);
    const newPosition = {x: sprite.x, y: sprite.y};

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

    const collision = {
        withRight: movingRight && previouslyToLeftOfBlock && entityType != 'jump through block',
        withBelow: movingDown && previouslyAboveBlock,
        withLeft: movingLeft && previouslyToRightOfBlock && entityType != 'jump through block',
        withAbove: movingUp && previouslyBelowBlock && entityType != 'jump through block'
    };


    if (collision.withRight) {
        newPosition.x = (block.x - sprite.texture.width - 0.1);
    } 
    
    if (collision.withBelow) {
        newPosition.y = (block.y - sprite.texture.height - 0.1);
    } 

    if (collision.withLeft) {
        newPosition.x = (blockSides.right + 0.1);
    } 
    
    if (collision.withAbove) {
        newPosition.y = (blockSides.bottom + 0.1);
    }

    return {...collision, newPosition};
};
import { messenger, messages, waitForAllSubscribed, Message } from "./helpers/messenger.js";
import { down } from "./keyboard.js";

declare const PIXI: any;

type Coordinates = {
    x: number;
    y: number;
};

export type BlockTypes = 'baddie' | 'block';

export const editor = (app) => {
    const clickCoords = (e): Coordinates => ({x: e.data.global.x + app.stage.x + app.stage.pivot.x, y: e.data.global.y + app.stage.y + app.stage.pivot.y});
    
    const init = () => {
        let blockStart: Coordinates = { x: 0, y: 0 };
    
        app.renderer.plugins.interaction.on('pointerdown', (e) => {
            blockStart = clickCoords(e);
        });
        
        app.renderer.plugins.interaction.on('pointerup', (e) => 
            addBlock(blockStart, clickCoords(e))
        );

        addBlock({x: -100, y: 1000}, {x: 600, y: 1100});
    }

    const blockType = (): BlockTypes => 
        down.isDown
        ? 'baddie'
        : 'block'
    ;
    
    const addBlock = (start: Coordinates, end: Coordinates) => 
        messenger.dispatch({
            type: messages.editorDrawsBlock,
            blockType: blockType(),
            start,
            end
        })
    ;

    const receive = (message: Message) => 
        waitForAllSubscribed(message).then(init)
    ;

    return {receive};
}

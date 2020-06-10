import { messenger, messages } from "./helpers/messenger.js";

declare const PIXI: any;

type Coordinates = {
    x: number;
    y: number;
};

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
    }
    
    const addBlock = (start: Coordinates, end: Coordinates) => 
        messenger.dispatch({
            type: messages.editorDrawsBlock,
            start,
            end
        })
    ;

    const receive = () => {
        
    };

    init();

    return {receive};
}

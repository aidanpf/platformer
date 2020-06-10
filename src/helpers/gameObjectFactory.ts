import { messages, messenger } from "./messenger.js";
import { block } from "../block.js";

declare const PIXI: any;

export const factory = (app, bump) => {

    const init = () => {
        
    };

    const receive = (message) => {
        
        if (message.type === messages.editorDrawsBlock) {
            makeBlock(message);
        }
    };

    const makeBlock = ({start, end}) => {
        let graphics = new PIXI.Graphics();
        graphics.beginFill(0xFFFFFF);
        graphics.drawRect(0, 0, (end.x - start.x), (end.y - start.y));
        graphics.endFill();
    
        const texture = app.renderer.generateTexture(graphics);
        const sprite = new PIXI.Sprite(texture);
    
        app.stage.addChild(sprite);
    
        const gameObject = block(app, bump, sprite, start.x, start.y);
    
        gameObject.init();
        messenger.subscribe(gameObject);
    };

    init();
    
    return {receive};
};
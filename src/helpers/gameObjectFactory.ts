import { messages, messenger } from "./messenger.js";
import { block } from "../block.js";
import { baddie } from "../baddie.js";
import { bouncer } from "../bouncer.js";

declare const PIXI: any;

export const factory = (app) => {

    const init = () => {
        
    };

    const receive = (message) => {
        
        if (message.type === messages.editorDrawsBlock) {

            if (message.blockType === 'block') {
                makeBlock(message);
            } else if (message.blockType === 'baddie') {
                makeBaddie(message);
            } else {
                makeBouncer(message);
            }
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
    
        const gameObject = block(app, sprite, start.x, start.y);
    
        gameObject.init();
        messenger.subscribe(gameObject);
    };

    const makeBaddie = ({start, end}) => {
        let graphics = new PIXI.Graphics();
        graphics.beginFill(0xDD4433);
        graphics.drawRect(0, 0, (end.x - start.x), (end.y - start.y));
        graphics.endFill();
    
        const texture = app.renderer.generateTexture(graphics);
        const sprite = new PIXI.Sprite(texture);
    
        app.stage.addChild(sprite);
    
        const gameObject = baddie(sprite, start.x, start.y);
    
        gameObject.init();
        messenger.subscribe(gameObject);
    };

    const makeBouncer = ({start, end}) => {
        let graphics = new PIXI.Graphics();
        graphics.beginFill(0x66DD11);
        graphics.drawRect(0, 0, (end.x - start.x), (end.y - start.y));
        graphics.endFill();
    
        const texture = app.renderer.generateTexture(graphics);
        const sprite = new PIXI.Sprite(texture);
    
        app.stage.addChild(sprite);
    
        const gameObject = bouncer(sprite, start.x, start.y);
    
        gameObject.init();
        messenger.subscribe(gameObject);
    };

    init();
    
    return {receive};
};
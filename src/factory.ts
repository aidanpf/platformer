import { messages, messenger } from "./helpers/messenger.js";
import { block } from "./block.js";
import { baddie } from "./baddie.js";
import { bouncer } from "./bouncer.js";
import { EntityTypes } from "./editor.js";
import { spike } from "./spike.js";
import { bob } from "./bob.js";
import { bit } from "./bit.js";
import { npc } from "./npc.js";
import { coin } from "./coin.js";
import { app } from "./setup.js";

declare const PIXI: any;

export const factory = () => {
    let entities: any[] = [];
    const init = () => {
        
    };

    const receive = (message) => {
        
        if (message.type === messages.editorDrawsEntity) {
            entities.push(message);

            localStorage.setItem('entities', JSON.stringify(entities));

            const entityType: EntityTypes = message.entityType;
            if (entityType === 'block' || entityType === 'jump through block') {
                makeBlock(message, entityType);
            } else if (entityType === 'baddie') {
                makeBaddie(message);
            } else if (entityType ==='bouncer') {
                makeBouncer(message);
            } else if (entityType === 'spike') {
                makeSpike(message);
            } else if (entityType === 'npc') {
                makeNpc(message);
            }
        }

        if (message.type === messages.gameRequestsBobToSpawn) {
            makeBob();
        }

        if (message.type === messages.bitFired) {
            makeBit(message);
        }

        if (message.type === messages.baddieDies) {
            makeCoin(message.sprite);
        }
    };

    const makeBlock = ({start, end}, entityType: EntityTypes) => {
        let graphics = new PIXI.Graphics();
        graphics.beginFill(entityType === 'jump through block' ? 0x888888 : 0xFFFFFF);
        graphics.drawRect(0, 0, (end.x - start.x), (end.y - start.y));
        graphics.endFill();
    
        const texture = app.renderer.generateTexture(graphics);
        const sprite = new PIXI.Sprite(texture);
    
        app.stage.addChild(sprite);
    
        const gameObject = block(app, sprite, start.x, start.y, entityType);
    
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

    const makeSpike = ({start, end}) => {

        const {sprite} = rectangle(app, start.x - end.x, start.y - end.y, 0xFF4499);
    
        app.stage.addChild(sprite);
    
        const gameObject = spike(sprite, start.x, start.y);
    
        gameObject.init();
        messenger.subscribe(gameObject);
    };

    const makeNpc = ({start, end, conversation}) => {
        const {sprite} = rectangle(app, start.x - end.x, start.y - end.y, 0x3355DD);
        app.stage.addChild(sprite);
        const gameObject = npc(sprite, start.x, start.y, conversation);
        gameObject.init();
        messenger.subscribe(gameObject);
    };

    const makeBob = () => {
        const bobSprite = PIXI.Sprite.from(PIXI.utils.BaseTextureCache.bob.resource);

        app.stage.addChild(bobSprite);
    
        const gameObject = bob(app, bobSprite);
    
        messenger.subscribe(gameObject);
    };

    const makeCoin = ({x, y}) => {
        const {sprite} = rectangle(app, 20, 20, 0xEEEE22);
        app.stage.addChild(sprite);
        const gameObject = coin(sprite, x, y);
        messenger.subscribe(gameObject);

    };
    
    const makeBit = ({x, y}) => {
        const {sprite} = rectangle(app, 4, 4, 0x00DD55);
        const gameObject = bit(app, sprite, x, y);
        app.stage.addChild(sprite);
        messenger.subscribe(gameObject);
    };

    init();
    
    return {receive};
};

const rectangle = (app, width, height, color) => {
    let graphics = new PIXI.Graphics();
    graphics.beginFill(color);
    graphics.drawRect(0, 0, width, height);
    graphics.endFill();

    const texture = app.renderer.generateTexture(graphics);
    const sprite = new PIXI.Sprite(texture);

    return {sprite, texture};
};
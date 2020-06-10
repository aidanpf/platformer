import { GameObjectCreator } from "./types/GameObjectCreator.js";
import { messenger } from "./helpers/messenger.js";

declare const PIXI: any;

export const createApp = () => {
    const app = new PIXI.Application();
    document.body.appendChild(app.view);
    return app;
}

export const initGameObjectWithGraphics = (app, gameObjectCreator: GameObjectCreator, textureName, resources, x = 0, y = 0) => {

    const sprite = new PIXI.Sprite(resources[textureName].texture);

    sprite.x = x;
    sprite.y = y;

    app.stage.addChild(sprite);

    messenger.subscribe(
        gameObjectCreator(app, sprite, resources)
    );

    return sprite;
};
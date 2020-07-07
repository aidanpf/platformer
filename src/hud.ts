import { Message, messages } from "./helpers/messenger";
import { app } from "./setup";
declare const PIXI: any;

export const hud = () => {
    let coins = 0;
    let graphic = new PIXI.Text('', { fontSize: '18px', fontFamily: 'Arial', fill: '#dddddd', align: 'left' });
    
    const init = () => {
        app.stage.addChild(graphic);
    };

    const receive = (message: Message) => {
        if (message.type === messages.bobFinishesMoving || message.type === messages.bobFinishesCollisionResolution) {
            graphic.x = message.sprite.x - 374;
            graphic.y = message.sprite.y - 270;
        }

        if (message.type === messages.bobCollidesWithCoin) {
            coins++;
            graphic.text = `Gold: ${coins}`;
        }
    };

    init();

    return {receive};
};
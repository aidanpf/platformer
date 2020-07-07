import { Message, messages } from "./helpers/messenger";
import { app } from "./setup";

export const camera = () => {
    
    const receive = (message: Message) => {
        if (message.type === messages.bobFinishesMoving || message.type === messages.bobFinishesCollisionResolution) {
            app.stage.pivot.x = message.sprite.x - 400 + message.sprite.texture.width / 2;
            app.stage.pivot.y = message.sprite.y - 300 + message.sprite.texture.height / 2;
        }
    };

    return {receive};
};
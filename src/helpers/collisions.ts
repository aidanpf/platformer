import { messages, Message } from "./messenger.js";
import { bump } from "./bump.js";

export const collidingWithBob = (message: Message, sprite) => 
    message.type === messages.bobFinishesMoving && bump.hit(message.sprite, sprite)
;
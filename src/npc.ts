import { Message, messages, messenger } from "./helpers/messenger.js";
import { bump } from "./helpers/bump.js";

export const npc = (sprite, x, y, conversation: string[]) => {
    let collidingWithBob = false;
    let inConversation = false;

    const init = () => {
        sprite.x = x;
        sprite.y = y;

        if (conversation.length === 1 && conversation[0] === '') {
            conversation[0] = '[Empty conversation supplied in editor]'
        }
    };

    const receive = (message: Message) => {
        if (message.type === messages.bobFinishesMoving) {
            collidingWithBob = bump.hit(sprite, message.sprite);
        }

        if (message.type === messages.conversationEnds) {
            inConversation = false;
        }

        if (message.type === messages.inputOccurs && message.key === 'e') {
            if (collidingWithBob && !inConversation) {
                inConversation = true;
                messenger.dispatch({
                    type: messages.bobInitiatesConversation,
                    conversation,
                    sprite
                })
            }
        }
    };

    return {receive, init};
};
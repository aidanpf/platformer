import { Message, messages, messenger } from "./helpers/messenger.js";
import { app } from "./setup.js";
declare const PIXI: any;

export const conversation = () => {
    let graphic = new PIXI.Text('Hi', { font: '35px Snippet', fill: 'white', align: 'left' });
    graphic.visible = false;
    let inConversation = false;
    let conversation = ['None'];
    let currentConversationId = 0;
    
    const init = () => {
        app.stage.addChild(graphic);
    };

    const advanceConversation = () => {
        
        if (currentConversationId <= conversation.length - 1) {
            graphic.text = conversation[currentConversationId];
            currentConversationId++;
        } else {
            currentConversationId = 0;
            inConversation = false;
            graphic.text = '';
            onNextTick(() => messenger.dispatch({
                type: messages.conversationEnds
            }));
        }
    };

    const receive = (message: Message) => {
        if (message.type === messages.bobInitiatesConversation && !inConversation) {
            conversation = message.conversation;
            currentConversationId = 0;
            advanceConversation();
            graphic.x = message.sprite.x;
            graphic.y = message.sprite.y - 50;
            graphic.visible = true;
            inConversation = true;
        }

        if (message.type === messages.inputOccurs && message.key === 'e') {
            if (inConversation) {
                advanceConversation();
           }
        }
    };

    init();

    return {receive};
};

const onNextTick = (action: Function) => setTimeout(action, 0);
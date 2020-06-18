import { Message, messages, messenger } from "./helpers/messenger.js";
declare const PIXI: any;

export const conversation = (app) => {
    let text = new PIXI.Text('Hi', { font: '35px Snippet', fill: 'white', align: 'left' });
    text.visible = false;
    let inConversation = false;
    let conversation = ['None'];
    let currentConversationId = 0;
    
    const init = () => {
        app.stage.addChild(text);
    };

    const advanceConversation = () => {
        
        if (currentConversationId <= conversation.length - 1) {
            text.text = conversation[currentConversationId];
            currentConversationId++;
        } else {
            currentConversationId = 0;
            inConversation = false;
            text.text = '';
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
            text.x = message.sprite.x;
            text.y = message.sprite.y - 50;
            text.visible = true;
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
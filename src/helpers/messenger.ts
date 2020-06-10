import { debugMode } from "../data.js";

export type Messenger = {
    dispatch: (message: any) => void;
    subscribe: (subscriber: any) => void;
}

export type Subscriber  = {
    receive: (message) => void;
}

export interface Message {
    type: messages;
    [x: string]: any;
}

export const messenger = (() => {
    let subscribers: Subscriber[] = [];

    const subscribe = (subscriber: Subscriber) => {
        subscribers.push(subscriber);
    }

    const dispatch = (message: Message) => {

        if (debugMode) {
            console.log(message);
        }

        subscribers.forEach(subscriber =>
            subscriber.receive(message)
        );
    }

    return {dispatch, subscribe};
})();

export enum messages {
    editorDrawsBlock = 'editor draws block',
    bobFinishesMoving = 'bob finishes moving',
    bobFinishesCollisionResolution = 'bob finishes collision resolution',
    bobBeginsOverlapWithBlock = 'bob begins overlap with block'
}
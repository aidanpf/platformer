import { debugMode } from "../data.js";

export type Messenger = {
    dispatch: (message: any) => void;
    subscribe: (subscriber: any) => void;
}

export type Subscriber  = {
    receive: (message) => void;
    unsubscriber?: ReturnType<typeof Unsubscriber>;
}

export interface StoredSubscriber extends Subscriber {
    id: number;
}

export interface Message {
    type: messages;
    [x: string]: any;
}

export const messenger = (() => {
    let subscribers: StoredSubscriber[] = [];
    let latestId = 0;

    const storageReadySubscribers = (subscribers: Subscriber[]): StoredSubscriber[] => subscribers.map(s => ({
        ...s,
        id: ++latestId
    }));

    const subscribe = (..._subscribers: Subscriber[]) => {
        const storageReady = storageReadySubscribers(_subscribers); 

        subscribers.push(...storageReady);
        giveUnsubscribe(storageReady);
    };

    const giveUnsubscribe = (storedSubscribers: StoredSubscriber[]) => 
        storedSubscribers.forEach(s => {
            if (s.unsubscriber) {
                s.unsubscriber.setUnsubscribe(() => {
                    subscribers = subscribers.filter(t => t.id !== s.id);
                })
            }
        })
    ;

    const dispatch = (message: Message) => {
        log(message);

        subscribers.forEach(subscriber =>
            subscriber.receive(message)
        );
    }

    return {dispatch, subscribe};
})();

export const waitForAllSubscribed = (message: Message) => ({
    then: (nextFunction: () => void) => {
        if (message.type === messages.allFinishSubscribing) {
            nextFunction();
        }
    }
});

export enum messages {
    editorDrawsEntity = 'editor draws entity',
    bobFinishesMoving = 'bob finishes moving',
    bobFinishesCollisionResolution = 'bob finishes collision resolution',
    bobBeginsOverlapWithBlock = 'bob begins overlap with block',
    allFinishSubscribing = 'all finish subscribing',
    bitFinishedMoving = 'bit finished moving',
    bobInitiatesConversation = 'bob initiates conversation',
    bobCollidesWithBouncer = 'bob colliders with bouncer',
    gameRequestsBobToSpawn = 'game requests bob to spawn',
    bitFired = 'bit fired',
    bobDies = 'bob dies',
    conversationEnds = 'conversation ends',
    inputOccurs = 'input occurs',
    baddieDies = 'baddie dies',
    bobCollidesWithCoin = 'bob collides with coin',
    coinFinishingMoving = 'coin finishing moving',
    coinCollidesWithFloor = 'coin collides with floor'
}

export const Unsubscriber = () => {
    let unsubscribe;

    const setUnsubscribe = (_unsubscribe) => {
        unsubscribe = _unsubscribe;
    }

    return {
        setUnsubscribe,
        unsubscribe: () => unsubscribe
    }
};

// These block up the console when debugging
const log = (message: Message) => {
    if (debugMode && !debugBlacklist.find(item => item === message.type)) {
        console.log(message);
    }
}
const debugBlacklist = [messages.bobFinishesCollisionResolution, messages.bobBeginsOverlapWithBlock, messages.bobFinishesMoving, messages.bitFinishedMoving, messages.coinFinishingMoving];
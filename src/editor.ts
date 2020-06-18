import { messenger, messages, waitForAllSubscribed, Message } from "./helpers/messenger.js";
import { conversation } from "./conversation.js";

declare const PIXI: any;

type Coordinates = {
    x: number;
    y: number;
};

export type EntityTypes = 'baddie' | 'block' |'bouncer' | 'jump through block' | 'spike' | 'npc';

export const editor = (app) => {
    const clickCoords = (e): Coordinates => ({x: e.data.global.x + app.stage.x + app.stage.pivot.x, y: e.data.global.y + app.stage.y + app.stage.pivot.y});
    let entityType = 'block';
    
    const init = () => {
        let blockStart: Coordinates = { x: 0, y: 0 };
    
        app.renderer.plugins.interaction.on('pointerdown', (e) => {
            blockStart = clickCoords(e);
        });
        
        app.renderer.plugins.interaction.on('pointerup', (e) => 
            addEntity(blockStart, clickCoords(e))
        );

        addEntity({x: -100, y: 41}, {x: 1200, y: 81});

        [...document.querySelectorAll('.js-select-block-type button')].forEach(button =>
            button.addEventListener('click', e => 
                setEntityType((e.target as HTMLButtonElement).dataset['type']!)
            )
        );
    }
    
    const setEntityType = (_entityType: string) => {
        entityType = _entityType;
        document.querySelector('.js-editor-content-container')?.classList.toggle('hidden', entityType !== 'npc');
    }

    const conversation = (entityType) => (
        entityType === 'npc' 
        ? {conversation: (document.querySelector('.js-editor-content') as HTMLTextAreaElement).value.split('\n')}
        : {}
    );

    const addEntity = (start: Coordinates, end: Coordinates) => 
        messenger.dispatch({
            type: messages.editorDrawsEntity,
            entityType,
            start,
            end,
            ...conversation(entityType)
        })
    ;

    const receive = (message: Message) => 
        waitForAllSubscribed(message).then(init)
    ;

    return {receive};
}

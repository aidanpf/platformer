import { messenger, messages, waitForAllSubscribed, Message } from "./helpers/messenger";
import { app } from "./setup";

declare const PIXI: any;

type Coordinates = {
    x: number;
    y: number;
};

export type EntityTypes = 'baddie' | 'block' |'bouncer' | 'jump through block' | 'spike' | 'npc';

export const editor = () => {
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

        loadLevel();

        addEntity({x: -100, y: 121}, {x: 1200, y: 161});

        [...document.querySelectorAll('.js-select-block-type button')].forEach(button =>
            button.addEventListener('click', e => 
                setEntityType((e.target as HTMLButtonElement).dataset['type']!)
            )
        );

        document.querySelector('.js-toggle-level-editor-button')?.addEventListener('click', () =>
            document.querySelector('.js-editor')?.classList.toggle('hidden')
        );

        document.querySelector('.js-delete-level')?.addEventListener('click', () => {
            localStorage.removeItem('entities');
            location.reload();
        });
    }
    
    const loadLevel = () => {
        let entitiesString = localStorage.getItem('entities');

        if(entitiesString) {
            let entities: any[] = JSON.parse(entitiesString);

            entities.forEach(entity =>
                messenger.dispatch(entity)
            );
        }
    };

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

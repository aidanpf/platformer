import { messenger, messages, waitForAllSubscribed, Message } from "./helpers/messenger.js";

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
            button.addEventListener('click', e => {
                entityType = (e.target as HTMLButtonElement).dataset['type']!;
            })
        );
    }
    
    const addEntity = (start: Coordinates, end: Coordinates) => 
        messenger.dispatch({
            type: messages.editorDrawsEntity,
            entityType,
            start,
            end
        })
    ;

    const receive = (message: Message) => 
        waitForAllSubscribed(message).then(init)
    ;

    return {receive};
}

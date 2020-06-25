declare const PIXI: any;

const createApp = () => {
    const app = new PIXI.Application();
    document.querySelector('#game-root')?.appendChild(app.view);
    return app;
}

export const app = createApp();
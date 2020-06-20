declare const PIXI: any;

export const createApp = () => {
    const app = new PIXI.Application();
    document.querySelector('#game-root')?.appendChild(app.view);
    return app;
}
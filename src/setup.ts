declare const PIXI: any;

export const createApp = () => {
    const app = new PIXI.Application();
    document.body.appendChild(app.view);
    return app;
}
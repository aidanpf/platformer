declare const PIXI: any;

export const init = () => {
    const app = new PIXI.Application();
    document.body.appendChild(app.view);
    return app;
}
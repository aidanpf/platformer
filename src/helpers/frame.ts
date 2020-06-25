import { app } from "../setup.js";

export const Frame = (update: Function) => {
    app.ticker.add(update);

    return {
        destroy: () => app.ticker.remove(update)
    };
};
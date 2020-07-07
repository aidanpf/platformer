import { app } from "../setup";

export const Frame = (update: Function) => {
    app.ticker.add(update);

    return {
        destroy: () => app.ticker.remove(update)
    };
};
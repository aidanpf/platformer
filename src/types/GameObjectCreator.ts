import { Subscriber } from "../helpers/messenger";

export type GameObjectCreator = (
    app: any,
    sprite: any,
    resources: any
) => Subscriber;
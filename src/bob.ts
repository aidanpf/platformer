import { gravity, jumpPower, movementSpeed } from "./data.js";
import { right, left, up } from "./keyboard.js";
import { spriteHasFallenBelowScreen } from "./helpers/sprites.js";

declare const PIXI: any;
export const init = (app) => {

    const onLoad = (_, resources) => {
        const sprite = new PIXI.Sprite(resources.bob.texture);
        const bob = {
            speed: {
                x: 0,
                y: 0
            }
        };

        sprite.x = 0
        sprite.y = 0;
    
        app.stage.addChild(sprite);

        app.ticker.add(() => {
            update(sprite, resources, app, bob);
        });
    };

    app.loader.add('bob', 'placeholder.png').load(onLoad);
};

const update = (sprite, resources, app, bob) => {
    const bobHeight = resources.bob.texture.height;
    const bottomOfScreen = app.renderer.height;
    const bobHasFallenBelowScreen = spriteHasFallenBelowScreen(sprite, resources, app);

    if(right.isDown) {
        sprite.x += movementSpeed;
    }

    if (left.isDown) {
        sprite.x -= movementSpeed;
    }

    if (up.isDown && bobHasFallenBelowScreen) {
        bob.speed.y = -jumpPower;
    }

    if (bobHasFallenBelowScreen) {
        hitTheGround(sprite, bob, bottomOfScreen, bobHeight);
    } else {
        fall(sprite, bob);
    }
};

const hitTheGround = (sprite, bob, bottomOfScreen, bobHeight) => {
    if (bob.speed.y > 0) {
        bob.speed.y = 0;
    }
    sprite.y = bottomOfScreen - bobHeight;
};

const fall = (sprite, bob) => {
    bob.speed.y += gravity;
    sprite.y += bob.speed.y;
};
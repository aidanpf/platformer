export const Sprite = (sprite, x, y) => {
    sprite.x = x;
    sprite.y = y;

    return {
        destroy: () => sprite.destroy(true)
    };
};
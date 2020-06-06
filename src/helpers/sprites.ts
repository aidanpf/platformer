
const usingHelper = (yValue) => {
    const isBelow = (secondYValue) => yValue > secondYValue;
    return {isBelow};
};

export const spriteHasFallenBelowScreen = (sprite, resources, app) => {
    const spriteHeight = resources.bob.texture.height;
    const bottomOfScreen = app.renderer.height;
    const bottomOfSprite = sprite.y + spriteHeight;
    return usingHelper(bottomOfSprite).isBelow(bottomOfScreen);
}
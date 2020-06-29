export const gravityBehaviour = ({initialSpeed = 0, gravity = 0.5, max = 10}) => {
    let speed = initialSpeed;
    let lastPosition = null;

    const apply = () => {
        speed += gravity;

        if (speed > max) {
            speed = max;
        }
    };

    const nextY = (currentY) => {
        lastPosition = currentY;
        return currentY + speed;
    };

    return {
        apply, 
        speed: () => speed,
        setSpeed: (_speed) => {speed = _speed;},
        setGravity: (_gravity) => {gravity = _gravity;},
        nextY,
        lastPosition: () => lastPosition
    };
};
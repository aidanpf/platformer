export const speedYBehaviour = ({init = 0, gravity = 0.5, max = 10}) => {
    let value = init;

    const update = () => {
        value += gravity;

        if (value > max) {
            value = max;
        }
    };

    return {update, value: () => value};
};
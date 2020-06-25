export const Id = (() => {
    let currentId = 0;

    const get = () => {
        currentId++;
        return currentId;
    };

    return {get};
})();
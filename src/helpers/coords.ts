export const coordsEqual = (coords1, coords2) => coords1.x === coords2.x && coords1.y === coords2.y;
    
export const lerp = (start, end, t) => start * (1 - t) + end * t;

export const lerpCoords = (start, end, t) => ({
    x: lerp(start.x, end.x, t),
    y: lerp(start.y, end.y, t)
});

export const diffCoords = (coords1, coords2) => ({
    x: coords1.x - coords2.x,
    y: coords1.y - coords2.y
});
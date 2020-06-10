interface Key {
  value: string;
  isDown: boolean;
  isUp: boolean;
  press?: () => void;
  release?: () => void;
  unsubscribe: () => void;
  downHandler: (event) => void;
  upHandler: (event) => void;
}

type Keyboard = (value: string) => Key;

const keyboard: Keyboard = (value: string) => {
    const downHandler = event => {
      if (event.key === key.value) {
        if (key.isUp && key.press) {
          key.press();
        }
        key.isDown = true;
        key.isUp = false;
        event.preventDefault();
      }
    };

    const upHandler = event => {
      if (event.key === key.value) {
        if (key.isDown && key.release) {
          key.release();
        }
        key.isDown = false;
        key.isUp = true;
        event.preventDefault();
      }
    };

    const key: Key = {
      value,
      isDown: false,
      isUp: true,
      unsubscribe: () => {
        window.removeEventListener("keydown", downListener);
        window.removeEventListener("keyup", upListener);
      },
      downHandler,
      upHandler
    };

    const downListener = key.downHandler.bind(key);
    const upListener = key.upHandler.bind(key);
    
    window.addEventListener(
      "keydown", downListener, false
    );
    window.addEventListener(
      "keyup", upListener, false
    );
    
    return key;
}

export const right = keyboard("ArrowRight");
export const left = keyboard("ArrowLeft");
export const up = keyboard("ArrowUp");
export const B = keyboard("B");
export const down = keyboard("ArrowDown");
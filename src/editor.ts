declare const PIXI: any;

type Coordinates = {
    x: number;
    y: number;
};

type Block = {
    start: Coordinates | null;
    end: Coordinates | null;
};

export const init = (app) => {
    let currentBlock: Block = { start: null, end: null};
    let blocks: any[] = [];

    app.ticker.add(() => {
        update(blocks);
    });

    document.body.getElementsByTagName('canvas')[0].addEventListener('mousedown', (e) => {
        currentBlock.start = {x: e.clientX/2, y: e.clientY/2};
        console.log(e.clientX, e.clientY);
    });
    
    document.body.getElementsByTagName('canvas')[0].addEventListener('mouseup', (e) => {
        currentBlock.end = {x: e.clientX/2, y: e.clientY/2};
        blocks = addBlock(currentBlock, blocks, app);
    });
}

const addBlock = (currentBlock: Block, blocks: Block[], app) => {

    const {start, end} = currentBlock;

    let block = new PIXI.Graphics();
    block.beginFill(0xEEEEEE);
    block.drawRect(start!.x, start!.y, (end!.x - start!.x)*2, (end!.y - start!.y)*2);
    block.endFill();
    block.x = start!.x;
    block.y = start!.y;
    app.stage.addChild(block);

    return [...blocks, block];


};

const update = (blocks: any[]) => {
    //blocks.forEach()
};
/*
    world class
*/


const BLOCK_WIDTH = 30,
    BLOCK_HEIGHT = 30;

var blocks;



class Block {
    constructor(w,h,x,y,sprite) {
        this.width = w;
        this.height = h;
        this. x = x;
        this.y = y;
        this.sprite = sprite;
    }
    update() {
        var ctx = GameCore.context;
        ctx.fillStyle = this.sprite;
        ctx.fillRect(
            this.x,this.y,
            this.width,this.height);
    }
}


class World {
    constructor() {
        blocks = [];
        for (var i = 0; i < 10; ++i)
            blocks.push(new Block(
                BLOCK_WIDTH,BLOCK_HEIGHT,
                i*BLOCK_WIDTH,200+BLOCK_HEIGHT,'grey'));
    }
    read_map(filepath) {
        // read filepath blocks
    }
    update() {
        for (var i = 0; i < blocks.length; ++i) {
            blocks[i].update();
        }
    }
}


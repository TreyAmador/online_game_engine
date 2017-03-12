/*
    world class
*/


const BLOCK_WIDTH = 30,
    BLOCK_HEIGHT = 30;


class Block {
    constructor(w,h,x,y,sprite) {
        this.width = w;
        this.height = h;
        this.x = x;
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
        this.blocks = [];
        for (var i = 0; i < 10; ++i)
            this.blocks.push(new Block(
                BLOCK_WIDTH,BLOCK_HEIGHT,
                i*BLOCK_WIDTH,200+BLOCK_HEIGHT,'grey'));
    }
    read_map(filepath) {
        // read filepath blocks
    }
    collision(player) {
        for (var i = 0; i < this.blocks.length; ++i) {
            var block = this.blocks[i];
            if (player.x + player.w > block.x)
                player.x = block.x - player.w;
            if (player.x < block.x + block.w)
                player.x = block.x + block.w;
            if (player.y < block.y + block.h)
                player.y = block.y + block.y;
            if (player.y + player.h > block.y)
                player.y = block.y + player.h;
        }
    }
    update() {
        for (var i = 0; i < this.blocks.length; ++i) {
            this.blocks[i].update();
        }
    }
}



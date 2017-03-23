/*
    Game engine in javascript
*/

var STATE = Object.freeze({
    PLAY: 1,
    PAUSE: 2,
    QUIT: 3
});

var KEY = Object.freeze({
    UP: 38,
    DOWN: 40,
    RIGHT: 39,
    LEFT: 37,
    JUMP: 32
});

const MSEC_PER_SEC = 1000;
const FRAMES_PER_SEC = 50;
const FRAME_TIME = MSEC_PER_SEC / FRAMES_PER_SEC;
const WALK_ACCEL = 0.002;
const FRICTION = 0.85;
const MAX_VEL_X = 0.5;
const GRAVITY = 0.001;
const JUMP_VEL = 0.5;
var player,
    input,
    world;


var blocks = [];


$(document).keydown(function(evnt) {
    input.key_down_event(evnt);
});

$(document).keyup(function(evnt) {
    input.key_up_event(evnt);
});


class Input {
    constructor() {
        this.held_keys = [];
        this.pressed_keys = [];
        this.released_keys = [];
    }
    begin_new_frame() {
        this.pressed_keys = [];
        this.released_keys = [];
    }
    key_down_event(evnt) {
        this.pressed_keys[evnt.keyCode] = true;
        this.held_keys[evnt.keyCode] = true;
    }
    key_up_event(evnt) {
        this.released_keys[evnt.keyCode] = true;
        this.held_keys[evnt.keyCode] = false;
    }
    was_key_pressed(key) {
        return this.pressed_keys[key];
    }
    was_key_released(key) {
        return this.released_keys[key];
    }
    is_key_held(key) {
        return this.held_keys[key];
    }
}


class Player {
    constructor(w,h,x,y,sprite) {
        this.width = w;
        this.height = h;
        this.x = x;
        this.y = y;
        this.sprite = sprite;
        this.vel_x = 0.0;
        this.vel_y = 0.0;
        this.accel_x = 0.0;
        this.accel_y = 0.0;
        this.on_ground = false;
    }
    move_left() {
        this.accel_x = -WALK_ACCEL;
    }
    move_right() {
        this.accel_x = WALK_ACCEL;
    }
    stop_moving() {
        this.accel_x = 0.0;
    }
    jump() {
        this.vel_y = -JUMP_VEL;
    }
    update() {
        var ctx = GameCore.context;
        ctx.fillStyle = this.sprite;
        ctx.fillRect(
            this.x,this.y,
            this.width,this.height);
        if (input.is_key_held(KEY.LEFT) && 
            input.is_key_held(KEY.RIGHT))
            this.stop_moving();
        else if (input.is_key_held(KEY.LEFT))
            this.move_left();
        else if (input.is_key_held(KEY.RIGHT))
            this.move_right();
        else
            this.stop_moving();
        if (input.was_key_pressed(KEY.JUMP)) {
            if (this.on_ground) {
                this.jump();
                this.on_ground = false;
            }
        }
        this.vel_x += this.accel_x*FRAME_TIME;
        if (Math.abs(this.vel_x) > MAX_VEL_X)
            this.vel_x = Math.sign(this.vel_x)*MAX_VEL_X;
        this.x += this.vel_x*FRAME_TIME;
        this.vel_x *= FRICTION;
        this.vel_y += GRAVITY*FRAME_TIME;
        this.y += this.vel_y*FRAME_TIME;
        
        
        // fix this hack!
        if (this.y > 200) {
            this.y = 200;
            this.vel_y = 0;
            this.on_ground = true;
        }
        
    }
}



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






var GameCore = {
    canvas: document.createElement('canvas'),
    start: function() {
        this.canvas.width = 480;
        this.canvas.height = 270;
        this.context = this.canvas.getContext('2d');
        document.body.insertBefore(
            this.canvas,
            document.body.childNodes[0]);
        this.interval = setInterval(
                updateGameArea,FRAME_TIME);
    },
    clear: function() {
        this.context.clearRect(0,0,
            this.canvas.width,
            this.canvas.height);
    }
}


function updateGameArea() {
    GameCore.clear();
    world.collision(player);
    player.update();
    world.update();
    input.begin_new_frame();

}


function run() {
    player = new Player(30,30,10,120,'red');
    input = new Input();
    world = new World();
    GameCore.start();
}




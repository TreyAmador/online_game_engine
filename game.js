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
    input;

//var player = new Player();

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

    move_up() {
        //this.y -= delta;
    }
    move_down() {
        //this.y += delta;
    }
    move_left() {
        //this.x -= 1;
        this.accel_x = -WALK_ACCEL;
    }
    move_right() {
        //this.x += 1;
        this.accel_x = WALK_ACCEL;
    }
    stop_moving() {
        this.accel_x = 0.0;
    }
    jump() {
        this.vel_y = -JUMP_VEL;
    }

    // update method for this
    // have sprite, not color
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


//var player = new Player(30,30,10,120,'red');


$(document).keydown(function(evnt) {
    input.key_down_event(evnt);
});

$(document).keyup(function(evnt) {
    input.key_up_event(evnt);
})


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
    player.update();
    input.begin_new_frame();
    
}


function run() {
    player = new Player(30,30,10,120,'red');
    input = new Input();
    GameCore.start();
}





/*
var canvas = document.getElementById("canvas"),
    ctx = canvas.getContext("2d");

canvas.width = canvas.height = 300;

var x = 150,
    y = 150,
    velY = 0,
    velX = 0,
    speed = 2,
    friction = 0.98,
    keys = [];

function update() {
    requestAnimationFrame(update);
    
    if (keys[38]) {
        if (velY > -speed) {
            velY--;
        }
    }
    
    if (keys[40]) {
        if (velY < speed) {
            velY++;
        }
    }
    if (keys[39]) {
        if (velX < speed) {
            velX++;
        }
    }
    if (keys[37]) {
        if (velX > -speed) {
            velX--;
        }
    }

    velY *= friction;
    y += velY;
    velX *= friction;
    x += velX;

    if (x >= 295) {
        x = 295;
    } else if (x <= 5) {
        x = 5;
    }

    if (y > 295) {
        y = 295;
    } else if (y <= 5) {
        y = 5;
    }

    ctx.clearRect(0, 0, 300, 300);
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fill();
}

update();

document.body.addEventListener("keydown", function (e) {
    keys[e.keyCode] = true;
});
document.body.addEventListener("keyup", function (e) {
    keys[e.keyCode] = false;
});
 */


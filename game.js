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
    LEFT: 37
});


var player;
var input;


class Input {
    constructor() {
        this.held_keys = new Map();
        this.pressed_keys = new Map();
        this.released_keys = new Map();
    }
    begin_new_frame() {
        this.pressed_keys.clear();
        this.released_keys.clear();
    }
    key_down_event(evnt) {
        this.pressed_keys.set(evnt.keyCode,true);
        this.held_keys.set(evnt.keyCode,true);
    }
    key_up_event(evnt) {
        this.released_keys.set(evnt.keyCode,true);
        this.held_keys.set(evnt.keyCode,false);
    }
    was_key_pressed(key) {
        return pressed_keys.has(key);
    }
    was_key_released(key) {
        return released_keys.has(key);
    }
    is_key_held(key) {
        return held_keys.has(key);
    }
}



class Player {
    constructor(w,h,x,y,sprite) {
        this.width = w;
        this.height = h;
        this.x = x;
        this.y = y;
        this.sprite = sprite;
    }

    // update method for this
    // have sprite, not color
    update() {
        var ctx = GameCore.context;
        ctx.fillStyle = this.sprite;
        ctx.fillRect(
            this.x,this.y,
            this.width,this.height);
        while(event.)


        
    }
    move_up(delta) {
        this.y -= delta;
    }
    move_down(delta) {
        this.y += delta;
    }
    move_left(delta) {
        this.x -= delta;
    }
    move_right(delta) {
        this.x += delta;
    }
    coordinates() {
        console.log(this.x+' '+this.y);
    }
    controller(e) {
        if (e.keyCode == KEY.UP)
            player.move_up(1);
        if (e.keyCode == KEY.DOWN)
            player.move_down(1);
        if (e.keyCode == KEY.RIGHT)
            player.move_right(1);
        if (e.keyCode == KEY.LEFT)
            player.move_left(1);
        player.coordinates();
    }
}


$(document).keydown(function(e){
    player.controller(e);
});


var GameCore = {
    canvas: document.createElement('canvas'),
    start: function() {
        this.canvas.width = 480;
        this.canvas.height = 270;
        this.context = this.canvas.getContext('2d');
        document.body.insertBefore(
            this.canvas,
            document.body.childNodes[0]);
        this.interval = setInterval(updateGameArea,20);
    },
    clear: function() {
        this.context.clearRect(0,0,
            this.canvas.width,
            this.canvas.height);
    }
}


function updateGameArea() {
    GameCore.clear();
    input.begin_new_frame();
    player.update();
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


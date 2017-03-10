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


//var player = new Player();

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

    // would like to make the polling a class method
    /*
    key_down_event(evnt) {
        $(document).keydown(function(evnt) {
            this.pressed_keys.set(evnt.keyCode,true);
            this.held_keys.set(evnt.keyCode,true);
            console.log('keydown');
        });
    }
    */

    was_key_pressed(key) {
        return this.pressed_keys.has(key);
    }
    was_key_released(key) {
        return this.released_keys.has(key);
    }
    is_key_held(key) {
        return this.held_keys.has(key);
    }
}

var input = new Input();



class Player {
    constructor(w,h,x,y,sprite) {
        this.width = w;
        this.height = h;
        this.x = x;
        this.y = y;
        this.sprite = sprite;
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

    // update method for this
    // have sprite, not color
    update() {
        var ctx = GameCore.context;
        ctx.fillStyle = this.sprite;
        ctx.fillRect(
            this.x,this.y,
            this.width,this.height);
        if (input.was_key_pressed(KEY.UP) || input.is_key_held(KEY.UP))
            this.move_up(1);
        if (input.was_key_pressed(KEY.DOWN) || input.is_key_held(KEY.DOWN))
            this.move_down(1);
        if (input.was_key_pressed(KEY.LEFT) || input.is_key_held(KEY.LEFT))
            this.move_left(1);
        if (input.was_key_pressed(KEY.RIGHT) || input.is_key_held(KEY.RIGHT))
            this.move_right(1);
    }
}


var player = new Player(30,30,10,120,'red');


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
        this.interval = setInterval(updateGameArea,20);
    },
    clear: function() {
        this.context.clearRect(0,0,
            this.canvas.width,
            this.canvas.height);
    }
}


function updateGameArea() {
    input.begin_new_frame();
    GameCore.clear();
    player.update();
    
}


function run() {
    //player = new Player(30,30,10,120,'red');
    //input = new Input();
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


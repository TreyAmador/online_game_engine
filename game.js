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
        var ctx = GameCore.context;
        // update method for this
        // have sprite, not color
        ctx.fillStyle = sprite;
        ctx.fillRect(this.x,this.y,this.width,this.height);
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

var player;


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
    }
}


function run() {
    GameCore.start();
    player = new Player(30,30,10,120,'red');
}



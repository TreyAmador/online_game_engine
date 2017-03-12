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


var blocks = []


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




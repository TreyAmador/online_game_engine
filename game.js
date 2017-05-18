/*
    online game engine!
*/


var GAME_STATE = Object.freeze({
    PLAY: 1,
    PAUSE: 2,
    QUIT: 3
});


var PLAYER_STATES = Object.freeze({
    STILL_RIGHT:0,
    STILL_LEFT:1,
    WALK_RIGHT:2,
    WALK_LEFT:3
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


function Vec2D(x,y) {
    this.x = x;
    this.y = y;
}


function MediaManager() {

    var self = this;
    this.files = new Map();

    this.load = function(filepath) {        
        if (!self.files[filepath]) {
            var img = new Image();
            img.src = filepath;
            self.files[filepath] = img;
        }
        return self.files[filepath];
    }

    this.get = function(filepath) {
        return self.files[filepath];
    }

}


function Input() {

    var self = this;
    this._pressed = {};
    this._timer = new Date();

    this.is_down = function(key_code) {
        return self._pressed[key_code];
    }

    this.on_keydown = function(event) {
        self._pressed[event.keyCode] = self._timer.getTime();
    }
    
    this.on_keyup = function(event) {
        delete self._pressed[event.keyCode];
    }

    window.addEventListener('keyup',function(event) { 
        self.on_keyup(event); 
    },false);
    
    window.addEventListener('keydown',function(event) {
        self.on_keydown(event);
    },false);

}


function Sprite(x,y,w,h,path) {

    var self = this;

    if (typeof x === 'number')
        x = [x];
    this.x = [];
    for (var i = 0; i < x.length; ++i)
        this.x.push(x[i]*w);
    this.y = y*h;
    this.w = w;
    this.h = h;

    this.frame_no = 0;
    //this.img = new Image();
    //this.img.src = path;
    
    this.init = function(media_manager,filepath) {
        self.img = media_manager.load(filepath);
    }
    
    this.increment = function() {
        self.frame_no = ++self.frame_no % (self.x.length);
    }

    this.draw = function(ctx,dest_x,dest_y) {
        ctx.drawImage(self.img,
            self.x[self.frame_no],self.y,self.w,self.h,
            dest_x,dest_y,self.w,self.h);
    }

}


function Player(x,y,w,h) {
    
    var self = this;
    
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.ax = 0;
    this.ay = 0;

    this.w = w;
    this.h = h;

    this.sprites = new Object();
    this.state = PLAYER_STATES.STILL_RIGHT;

    this.init = function(media_manager) {
        self.add_sprite(PLAYER_STATES.WALK_LEFT,[0,1,0,2],0,media_manager);
        self.add_sprite(PLAYER_STATES.WALK_RIGHT,[0,1,0,2],1,media_manager);
        self.add_sprite(PLAYER_STATES.STILL_LEFT,[0],0,media_manager);
        self.add_sprite(PLAYER_STATES.STILL_RIGHT,[0],1,media_manager);
    }

    this.add_sprite = function(state,x,y,media_manager) {
        self.sprites[state] = new Sprite(x,y,32,32,'img/MyChar.bmp');
        self.sprites[state].init(media_manager,'img/MyChar.bmp');
    }

    this.move_left = function() {
        self.ax = -WALK_ACCEL;
        self.state = PLAYER_STATES.WALK_LEFT;
    }

    this.move_right = function() {
        self.ax = WALK_ACCEL;
        self.state = PLAYER_STATES.WALK_RIGHT;
    }

    this.update = function() {

        self.vx += self.ax*FRAME_TIME;
        if (Math.abs(self.vx) > MAX_VEL_X)
            self.vx = Math.sign(self.vx)*MAX_VEL_X;
        self.x += self.vx*FRAME_TIME;
        self.vx *= FRICTION;
        
        //self.vy += GRAVITY*FRAME_TIME;
        //self.y += self.vy*FRAME_TIME;

        self.sprites[self.state].increment();
    }

    this.jump = function() {

    }

    this.stop_moving = function() {
        self.ax = 0;
        if (self.state === PLAYER_STATES.WALK_RIGHT)
            self.state = PLAYER_STATES.STILL_RIGHT;
        if (self.state === PLAYER_STATES.WALK_LEFT)
            self.state = PLAYER_STATES.STILL_LEFT;
    }

    this.draw = function(ctx) {
        self.sprites[self.state].draw(ctx,self.x,self.y);
    }

}



function Tile(x,y,w,h,collide) {
    var self = this;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.collide = collide;
}


function World() {
    
    var self = this;

    //this.background = new Image();
    //this.background.src = world_map;

    this.load = function(world_map) {
        
    }

    this.update = function() {

    }

    this.draw = function() {

    }


}


function Core() {

    var self = this;
    this.canvas = document.createElement('canvas');
    this.canvas.width = 480;
    this.canvas.height = 270;
    this.context = this.canvas.getContext('2d');
    document.body.appendChild(this.canvas);

    this.media_manager = new MediaManager();
    this.input = new Input();
    this.player = new Player(0,0,32,32);

    this.initialize = function() {
        setInterval(self.iteration,FRAME_TIME);
        self.player.init(self.media_manager);
    }

    this.iteration = function() {
        self.update();
        self.draw();
    }

    this.update = function() {
        self.clear();

        if (self.input.is_down(KEY.RIGHT) && self.input.is_down(KEY.LEFT))
            self.player.stop_moving();
        else if (self.input.is_down(KEY.RIGHT))
            self.player.move_right();
        else if (self.input.is_down(KEY.LEFT))
            self.player.move_left();
        else if (!self.input.is_down(KEY.RIGHT) && !self.input.is_down(KEY.LEFT))
            self.player.stop_moving();
        // last could be simply an else statement

        if (self.input.is_down(KEY.JUMP)) {
            // add on ground fxn
            //self.player.jump();
        }

        self.player.update();
    }

    this.draw = function() {
        self.player.draw(self.context);
    }

    this.clear = function(){
        self.context.clearRect(
            0,0,self.canvas.width,self.canvas.height);
    }

}


function run() {
    var core = new Core;
    core.initialize();
}



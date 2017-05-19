/*
    online game engine!
*/


const MSEC_PER_SEC = 1000;
const FRAMES_PER_SEC = 30;
const FRAME_TIME = MSEC_PER_SEC / FRAMES_PER_SEC;
const WALK_ACCEL = 0.001;
const FRICTION = 0.85;
const MAX_VEL_X = 0.5;
const GRAVITY = 0.001;
const JUMP_VEL = 0.5;


var GAME_STATE = Object.freeze({
    PLAY: 1,
    PAUSE: 2,
    QUIT: 3
});


var PLAYER_STATES = Object.freeze({
    STILL_RIGHT:0,
    STILL_LEFT:1,
    WALK_RIGHT:2,
    WALK_LEFT:3,
    JUMP_RIGHT:4,
    JUMP_LEFT:5

});


var KEY = Object.freeze({
    UP: 38,
    DOWN: 40,
    RIGHT: 39,
    LEFT: 37,
    JUMP: 32
});


function Vec2D(x,y) {
    this.x = x;
    this.y = y;
}


function Rectangle(x,y,w,h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
}


function MediaManager() {

    var self = this;
    this.files = new Object();

    this.load = function(filepath) {        
        if (!self.files[filepath]) {
            var img = new Image();
            img.src = filepath;
            self.files[filepath] = img;
        }
        return self.files[filepath];
    }

}


function Input() {

    var self = this;
    this.pressed = {};
    this.timer = new Date();

    this.is_down = function(key_code) {
        return self.pressed[key_code];
    }

    this.on_keydown = function(event) {
        self.pressed[event.keyCode] = self.timer.getTime();
    }
    
    this.on_keyup = function(event) {
        delete self.pressed[event.keyCode];
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

    this.on_ground = false;

    this.sprites = new Object();
    this.state = PLAYER_STATES.STILL_RIGHT;
    this.collision = null;

    this.init_collision = function(off_x, off_y, width, height) {
        var rectangle = new Rectangle(
            self.x + off_x, self.y + off_y,
            self.w - width, self.h - height);
        return rectangle;
    }

    this.add_sprite = function(state,x,y,w,h,media_manager) {
        self.sprites[state] = new Sprite(x,y,w,h);
        self.sprites[state].init(media_manager,'img/MyChar.bmp');
    }

    this.init = function(media_manager) {
        self.add_sprite(PLAYER_STATES.WALK_LEFT,[0,1,0,2],0,32,32,media_manager);
        self.add_sprite(PLAYER_STATES.WALK_RIGHT,[0,1,0,2],1,32,32,media_manager);
        self.add_sprite(PLAYER_STATES.STILL_LEFT,[0],0,32,32,media_manager);
        self.add_sprite(PLAYER_STATES.STILL_RIGHT,[0],1,32,32,media_manager);
        self.add_sprite(PLAYER_STATES.JUMP_RIGHT,[1],1,32,32,media_manager);
        self.add_sprite(PLAYER_STATES.JUMP_LEFT,[1],0,32,32,media_manager);

        self.collision = self.init_collision(10,5,20,5);

    }

    this.move_left = function() {
        self.ax = -WALK_ACCEL;
        self.state = PLAYER_STATES.WALK_LEFT;
    }

    this.move_right = function() {
        self.ax = WALK_ACCEL;
        self.state = PLAYER_STATES.WALK_RIGHT;
    }

    this.jump = function() {
        if (self.on_ground) {
            self.vy = -JUMP_VEL;
        }
    }

    this.stop_moving = function() {
        self.ax = 0;
        if (self.state === PLAYER_STATES.WALK_RIGHT)
            self.state = PLAYER_STATES.STILL_RIGHT;
        else if (self.state === PLAYER_STATES.WALK_LEFT)
            self.state = PLAYER_STATES.STILL_LEFT;
    }

    this.update = function() {

        self.vx += self.ax*FRAME_TIME;
        if (Math.abs(self.vx) > MAX_VEL_X)
            self.vx = Math.sign(self.vx)*MAX_VEL_X;
        self.x += self.vx*FRAME_TIME;
        self.vx *= FRICTION;
        
        self.vy += GRAVITY*FRAME_TIME;
        self.y += self.vy*FRAME_TIME;

        // this is a hack...
        // fix with collision detection!
        if (self.y >= 200) {
            self.vy = 0;
            self.ay = 0;
            self.y = 200;
            self.on_ground = true;
        } else {
            self.on_ground = false;
        }

        // update collsions rectangle
        self.collision.x = self.x + 10;
        self.collision.y = self.y + 5;

        // this will have to be tailored based on player state
        // series of if statements?
        self.sprites[self.state].increment();

    }

    this.draw = function(ctx) {
        self.sprites[self.state].draw(ctx,self.x,self.y);

        // collision detection rect... remove later
        ctx.strokeRect(self.collision.x,self.collision.y,self.collision.w,self.collision.h);
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 3;
        ctx.stroke();
        // remove later

    }

}


function Tile(x,y,w,h) {
    var self = this;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
}


function World() {    
    var self = this;
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
        // last could be simply an else statement ?

        if (self.input.is_down(KEY.JUMP)) {
            self.player.jump();
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



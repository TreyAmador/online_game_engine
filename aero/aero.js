/*  */


var MSEC_PER_SEC = 1000;
var FRAMES_PER_SEC = 30;
var TIME_INTERVAL = MSEC_PER_SEC / FRAMES_PER_SEC;
var CANVAS_WIDTH = 640;
var CANVAS_HEIGHT = 480;


// there should be vectors of accel and vel
// where the magnitude is capped at max value
// not each individual var
var ACCEL_FORWARD = -0.002;
var ACCEL_LEFT = -0.002;
var ACCEL_RIGHT = 0.002
var ACCEL_BACK = 0.002;
var ACCEL_STOP = 0.0;

var MAX_VEL_FORWARD = -0.2;
var MAX_VEL_LEFT = -0.2;
var MAX_VEL_RIGHT = 0.2;
var MAX_VEL_REVERSE = 0.2;

var FRICTION = 0.7;


var KEY = Object({
    UP:38,
    DOWN:40,
    RIGHT:39,
    LEFT:37,
    SPACE:32
});


// corresponds to action strings
// enemeis do action here
// ex.  fly in certain direction
//      fly towards player
//      fire missle somewhere
//      fire missle at player
//      rotate in player's direction
var ENEMY_ACTIONS = Object({

});



function Input() {
    this.held_keys = {};
    this.pressed_keys = {};
    this.released_keys = {};
    this.timer = new Date();
    this.init();
}

Input.prototype.begin_new_frame = function() {
    this.pressed_keys = {};
    this.released_keys = {};
}

Input.prototype.key_down_event = function(event) {
    this.pressed_keys[event.keyCode] = this.timer.getTime();
    this.held_keys[event.keyCode] = this.timer.getTime();
}

Input.prototype.key_up_event = function(event) {
    this.pressed_keys[event.keyCode] = this.timer.getTime();
    delete this.held_keys[event.keyCode];
}

Input.prototype.was_key_pressed = function(key) {
    return this.pressed_keys[key];
}

Input.prototype.was_key_released = function(key) {
    return this.released_keys[key];
}

Input.prototype.is_key_held = function(key) {
    return this.held_keys[key];
}

Input.prototype.init = function() {

    var self = this;
    window.addEventListener('keyup',function(event) { 
        self.key_up_event(event); 
    },false);

    window.addEventListener('keydown',function(event) {
        self.key_down_event(event);
    },false);

}


var MediaManager = {
    files:{},
    load:function(filepath) {
        if (!this.files[filepath]) {
            var img = new Image();
            img.src = filepath;
            this.files[filepath] = img;
        }
        return this.files[filepath];
    }
}



function Vec2D(x,y) {
    this.x = x;
    this.y = y;
}


Vec2D.prototype.magnitude = function() {
    return Math.sqrt(
        this.x * this.x +
        this.y * this.y);
}


// TODO test this the radians and degrees functions
Vec2D.prototype.radians = function() {
    return Math.atan2(this.y/this.x);
}


Vec2D.prototype.degrees = function() {
    return Math.atan(this.y/this.x);
}


// TODO add more physics!
var Physics = {

    velocity_delta: function(a,v,t) {
        return a*t + v;
    },

    kinematics: function(a,v,x,t) {
        return (a/2)*t*t + v*t + x;
    },

    friction: function(f,x) {
        return f*x;
    },

};


function Rectangle(x,y,w,h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
}


function Sprite(x,y,w,h) {
    this.body = new Rectangle(x,y,w,h);
    this.size_height = 1;
    this.size_width = 1;
}


Sprite.prototype.init = function(filepath,manager) {
    this.img = manager.load(filepath);
}


Sprite.prototype.shrink_width = function(factor) {
    this.size_width = 1 / factor;
}


Sprite.prototype.shrink_height = function(factor) {
    this.size_height = 1 / factor;
}


Sprite.prototype.shrink = function(factor) {
    this.size_width = this.size_height = 1 / factor;
}


Sprite.prototype.enlarge_width = function(factor) {
    this.size_width = factor;
}


Sprite.prototype.enlarge_height = function(factor) {
    this.size_height = factor;
}


Sprite.prototype.enlarge = function(factor) {
    this.size_width = this.size_height = factor;
}


// update should probably go with player?
// there will be some sprite update stuff
Sprite.prototype.update = function(elapsed_time) {

}


Sprite.prototype.draw = function(context,x,y) {
    context.drawImage(this.img,
        this.body.x,this.body.y,
        this.body.w,this.body.h,x,y,
        this.size_width*this.body.w,
        this.size_height*this.body.h);
}


// TODO modify this to be a player superclass
function Body(x,y,w,h) {

}



function Enemy(x,y,w,h) {
    // TODO give certain enemies action_string
    // a string representing a sequence of actions
    // to preform... gives illusion of AI
    this.action_string = 'abcdefg';
}



function Player(x,y,w,h) {
    
    this.invincible = false;
    this.in_motion = false;

    // TODO these should all be vectors
    //      of accel, vel, maybe x be pos
    this.x = x;
    this.y = y;
    
    this.vx = 0;
    this.vy = 0;

    this.ax = 0;
    this.ay = 0;

    // represents collision skeleton
    this.rect = new Rectangle(x,y,w,h);

}


Player.prototype.init_sprite = function(filepath,x,y,w,h) {
    this.sprite = new Sprite(x,y,w,h);
    this.sprite.init(filepath,MediaManager);
}


Player.prototype.move_up = function() {
    this.ay = ACCEL_FORWARD;

}


Player.prototype.move_down = function() {
    this.ay = ACCEL_BACK;
}


Player.prototype.move_right = function() {
    this.ax = ACCEL_RIGHT;
}


Player.prototype.move_left = function() {
    //this.vx = -0.1;

    this.ax = ACCEL_LEFT;

}


Player.prototype.stop_moving_horizontally = function() {
    //this.vx = 0;

    this.ax = ACCEL_STOP;

}


Player.prototype.stop_moving_vertically = function() {
    this.ay = ACCEL_STOP;
}


Player.prototype.update = function(elapsed_time) {

    // set velocity between threshold
    this.vx = Physics.velocity_delta(this.ax,this.vx,elapsed_time);
    if (this.vx < MAX_VEL_LEFT) {
        this.vx = MAX_VEL_LEFT;
    }
    else if (this.vx > MAX_VEL_RIGHT) {
        this.vx = MAX_VEL_RIGHT;
    }
    this.x = Physics.kinematics(this.ax,this.vx,this.x,elapsed_time);
    this.vx = Physics.friction(FRICTION,this.vx);

    this.vy = Physics.velocity_delta(this.ay,this.vy,elapsed_time);
    if (this.vy < MAX_VEL_FORWARD) {
        this.vy = MAX_VEL_FORWARD;
    }
    else if (this.vy > MAX_VEL_REVERSE){
        this.vy = MAX_VEL_REVERSE;
    }
    this.y = Physics.kinematics(this.ay,this.vy,this.y,elapsed_time);
    this.vy = Physics.friction(FRICTION,this.vy);

}


Player.prototype.draw = function(context) {
    this.sprite.draw(context,this.x,this.y);
}



var Core = {

    init: function() {
        
        this.canvas = document.createElement('canvas');
        this.canvas.width = 640;
        this.canvas.height = 480;
        this.context = this.canvas.getContext('2d');
        
        var game_port = document.getElementById('game-port');
        game_port.textContent = '';
        game_port.appendChild(this.canvas);

        this.input = new Input();

        this.player = new Player(0,0,180,275);
        this.player.init_sprite('img/spiked ship 3. small.blue_.PNG',0,0,150,120);

        // TODO add a filereader that inputs xml files for level loading

        var self = this;
        setInterval(function(){
            self.update(TIME_INTERVAL);
            self.handle_input();
            self.draw();
        });

    },

    update: function(elapsed_time) {
        //update sprite

        

        this.player.update(elapsed_time);

        this.input.begin_new_frame();

    },

    handle_input: function() {

        if (this.input.is_key_held(KEY.RIGHT) && this.input.is_key_held(KEY.LEFT)) {
            this.player.stop_moving_horizontally();
        }
        else if (this.input.is_key_held(KEY.RIGHT)) {
            this.player.move_right();
        }
        else if (this.input.is_key_held(KEY.LEFT)){
            this.player.move_left();
        }
        else if (!this.input.is_key_held(KEY.RIGHT) && !this.input.is_key_held(KEY.LEFT)){
            this.player.stop_moving_horizontally();
        }

        if (this.input.is_key_held(KEY.UP) && this.input.is_key_held(KEY.DOWN)) {
            this.player.stop_moving_vertically();
        }
        else if (this.input.is_key_held(KEY.UP)) {
            this.player.move_up();
        }
        else if (this.input.is_key_held(KEY.DOWN)){
            this.player.move_down();
        }
        else if (!this.input.is_key_held(KEY.UP) && !this.input.is_key_held(KEY.DOWN)){
            this.player.stop_moving_vertically();
        }

        if (this.input.was_key_pressed(KEY.SPACE)){
            console.log('fire!');
        }
    },

    draw: function() {
        this.clear();
        this.player.draw(this.context);
    },

    clear: function() {
        this.context.clearRect(0,0,
        this.canvas.width,this.canvas.height);
    }


};


function run() {
    Core.init();
}


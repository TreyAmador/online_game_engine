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

var MAX_VEL_MAG = 0.2;

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



function Pos2D(x,y) {
    this.x = x;
    this.y = y;
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


Vec2D.prototype.normalize = function(factor) {
    var magnitude = this.magnitude();
    factor /= magnitude;
    this.x *= factor;
    this.y *= factor;
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

    // pass accel and vel vector to get vel
    velocity_delta_2d: function(a,v,t) {
        v.x += (a.x * t);
        v.y += (a.y * t);
        return v;
    },

    kinematics: function(a,v,x,t) {
        return (a/2)*t*t + v*t + x;
    },

    kinematics_2d: function(a,v,p,t) {
        p.x = ((a.x/2) * t * t + v.x * t + p.x);
        p.y = ((a.y/2) * t * t + v.y * t + p.y);
        return p;
    },

    friction: function(f,x) {
        return f*x;
    },

    friction_2d: function(f,p) {
        p.x *= f;
        p.y *= f;
        return p;
    }

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


// pass different functions for src and dest dimensions
Sprite.prototype.draw = function(context,x,y) {
    context.drawImage(this.img,
        this.body.x,this.body.y,
        this.body.w,this.body.h,x,y,
        this.size_width*this.body.w,
        this.size_height*this.body.h);
}



function Background(x,y,w,h) {
    this.rect = new Rectangle(x,y,w,h);
    this.scroll = new Vec2D(0,0);
}


Background.prototype.set_size = function(w,h) {
    this.rect.w = w;
    this.rect.h = h;
}


Background.prototype.init_img = function(filepath,manager) {
    this.img = new Image();
    this.img.src = manager.load(filepath);
}


Background.prototype.scroll_speed = function(x,y) {
    this.scroll.x = x;
    this.scroll.y = y;
}


Background.prototype.update = function(elapsed_time) {
    this.rect.x += this.scroll.x * elapsed_time;
    this.rect.y += this.scroll.y * elapsed_time;
}


Background.prototype.draw = function(context,canvas) {
    context.drawImage(this.img,
        this.rect.x,this.rect.y,
        this.rect.w,this.rect.h,
        0,0,canvas.width,canvas.height);
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
    //this.x = x;
    //this.y = y;
    

    this.pos = new Pos2D(x,y);
    this.vel = new Vec2D(0,0);
    this.accel = new Vec2D(0,0);


    // represents collision skeleton
    this.rect = new Rectangle(x,y,w,h);

}


Player.prototype.init_sprite = function(filepath,x,y,w,h) {
    this.sprite = new Sprite(x,y,w,h);
    this.sprite.init(filepath,MediaManager);
}


Player.prototype.move_up = function() {
    this.accel.y = ACCEL_FORWARD;
}


Player.prototype.move_down = function() {
    this.accel.y = ACCEL_BACK;
}


Player.prototype.move_right = function() {
    this.accel.x = ACCEL_RIGHT;
}


Player.prototype.move_left = function() {
    this.accel.x = ACCEL_LEFT;
}


Player.prototype.stop_moving_horizontally = function() {
    this.accel.x = ACCEL_STOP;
}


Player.prototype.stop_moving_vertically = function() {
    this.accel.y = ACCEL_STOP;
}


Player.prototype.update = function(elapsed_time) {

    /*
    this.vel.x = Physics.velocity_delta(this.accel.x,this.vel.x,elapsed_time);
    this.vel.y = Physics.velocity_delta(this.accel.y,this.vel.y,elapsed_time);

    if (this.vel.magnitude() > MAX_VEL_MAG)
        this.vel.normalize(MAX_VEL_MAG);

    this.pos.x = Physics.kinematics(this.accel.x,this.vel.x,this.pos.x,elapsed_time);
    this.pos.y = Physics.kinematics(this.accel.y,this.vel.y,this.pos.y,elapsed_time);

    this.vel.x = Physics.friction(FRICTION,this.vel.x);
    this.vel.y = Physics.friction(FRICTION,this.vel.y);
    */



    //this.vel.x = Physics.velocity_delta(this.accel.x,this.vel.x,elapsed_time);
    //this.vel.y = Physics.velocity_delta(this.accel.y,this.vel.y,elapsed_time);

    this.vel = Physics.velocity_delta_2d(this.accel,this.vel,elapsed_time);

    if (this.vel.magnitude() > MAX_VEL_MAG)
        this.vel.normalize(MAX_VEL_MAG);

    //this.pos.x = Physics.kinematics(this.accel.x,this.vel.x,this.pos.x,elapsed_time);
    //this.pos.y = Physics.kinematics(this.accel.y,this.vel.y,this.pos.y,elapsed_time);

    this.pos = Physics.kinematics_2d(this.accel,this.vel,this.pos,elapsed_time);

    //this.vel.x = Physics.friction(FRICTION,this.vel.x);
    //this.vel.y = Physics.friction(FRICTION,this.vel.y);

    this.vel = Physics.friction_2d(FRICTION,this.vel);

}


Player.prototype.draw = function(context) {
    this.sprite.draw(context,this.pos.x,this.pos.y);
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

        //this.background = new Background(0,0,this.canvas.width,this.canvas.height);
        //this.background.init_img('img/level1Background (1).png',MediaManager);

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
        //this.background.update();

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
        else if (this.input.is_key_held(KEY.DOWN)) {
            this.player.move_down();
        }
        else if (!this.input.is_key_held(KEY.UP) && !this.input.is_key_held(KEY.DOWN)) {
            this.player.stop_moving_vertically();
        }

        if (this.input.was_key_pressed(KEY.SPACE)) {
            console.log('fire!');
        }
    },

    draw: function() {
        this.clear();
        this.player.draw(this.context);
        //this.background.draw(this.context,this.canvas);
    },

    clear: function() {
        this.context.clearRect(0,0,
        this.canvas.width,this.canvas.height);
    }


};


function run() {
    Core.init();
}


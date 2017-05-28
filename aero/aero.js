// aerofighters clone


// TODO BIG IDEAS
//
//      to each organism:
//      add object of frames....
//          a frame is:
//              animated sprite array
//              collision shape array
//                  collision shape inherited by body
//              frame_no index which indicates frame
//



//function Enemy(x,y,w,h) {
    // TODO give certain enemies action_string
    //      a string representing a sequence of actions
    //      to preform... gives illusion of AI
//    this.action_string = 'abcdefg';
//}



var MSEC_PER_SEC = 1000;
var FRAMES_PER_SEC = 30;
var TIME_INTERVAL = MSEC_PER_SEC / FRAMES_PER_SEC;
var CANVAS_WIDTH = 800;
var CANVAS_HEIGHT = 600;

var ACCEL_START = 0.005;
var ACCEL_STOP = 0.0;
var MAX_VEL_MAG = 0.5;
var FRICTION = 0.9;

var STAR_COUNT = 25;
var MAX_STAR_VEL = 0.3;

var LASER_WIDTH = 2;
var LASER_HEIGHT = 10; 
var LASER_VELOCITY = 0.7;


var KEY = Object({
    UP:38,
    DOWN:40,
    RIGHT:39,
    LEFT:37,
    SPACE:32
});


var PLAYER_STATE = Object.freeze({
    FLY:0
});



// TODO implement enemy action enum
//      corresponds to action strings
//      enemeis do action here
//      ex.  fly in certain direction
//          fly towards player
//          fire missle somewhere
//          fire missle at player
//          rotate in player's direction
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
    this.released_keys[event.keyCode] = this.timer.getTime();
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



function Rectangle(x,y,w,h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
}



function Circle(x,y,r) {
    this.x = x;
    this.y = y;
    this.r = r;
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
        p.x = a.x/2*t*t + v.x*t + p.x;
        p.y = a.y/2*t*t + v.y*t + p.y;
    },


    kinematics_delta_2d: function(a,v,t) {
        var delta = new Pos2D(
            a.x/2*t*t + v.x*t,
            a.y/2*t*t + v.y*t);
        return delta;
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



var Calculator = {


    rand_range: function(min,max) {
        //min = Math.ceil(min);
        //max = Math.floor(max);
        return Math.floor(Math.random()*(max-min)) + min;
    },


    area: function(circle) {
        return Math.PI * cirle.r * circle.r;
    },


    circumference: function(circle) {
        return Math.PI * 2 * circle.r;
    },


};



/*

// TODO add offset to sprite itself
function Sprite(x,y,w,h) {
    this.body = new Rectangle(x,y,w,h);
    this.height_scale = 1;
    this.width_scale = 1;
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
        this.width_scale*this.body.w,
        this.height_scale*this.body.h);

}

*/


// TODO add a timer to entire entity
//      such as player or enemy
function Sprite() {
    this.frames = [];
    this.frame_no = 0;
}


// TODO allow user to add a single sprite 
//      animation from multiple filepaths
Sprite.prototype.init = function(filepath,manager) {
    this.img = manager.load(filepath);
}


Sprite.prototype.single_frame_rect = function(frame) {
    this.frames.push(frame);
}


Sprite.prototype.clear = function() {
    this.frames = [];
    this.frame_no = 0;
}


// this must be updated to be more versatile
Sprite.prototype.update = function(elapsed_time) {
    //this.frame_no = ++this.frame_no % this.frames.length;
}


Sprite.prototype.draw = function(context,frame_no,x,y) {
    var rect = this.frames[frame_no];
    context.drawImage(this.img,
        rect.x,rect.y,rect.w,rect.h,
        x,y,rect.w,rect.h);
}





function StarRand(x,y) {
    this.pos = new Pos2D(
        Calculator.rand_range(0,CANVAS_WIDTH), y);
    this.vel = new Vec2D(0, Math.random() % MAX_STAR_VEL);
}



// TODO add a file reader
//      xml files will be loaded to position enemies
//      enemies descend the screen
//      updated offscreen with velocity * elapsed time
//      but only drawn once they enter the screen
//
// TODO add item to introduce sprite for background planets
//      which will be read by filereader
//      then will have velocity
//      a celestial body, if you will
function World(count) {
    this.init_stars(count);
    this.size = 1;
    this.color = '#e6e6fa';
}


World.prototype.init_stars = function(count) {
    this.stars = [];
    for (var i = 0; i < count; ++i) {
        this.stars.push(new StarRand(
            0,Calculator.rand_range(0,CANVAS_WIDTH)));
    }
}



// TODO init map here
//      pass in this.enemies from core
//      and add new enemies
//      have filereader in World func
//      pass out file that was read
//      and add here, with pos and vel
World.prototype.init_enemy_layout = function(enemies,layout) {



}


World.prototype.update = function(elapsed_time) {
    var len = this.stars.length;
    for (var i = 0; i < len; ++i) {
        this.stars[i].pos.y += this.stars[i].vel.y * elapsed_time;
        if (this.stars[i].pos.y > CANVAS_HEIGHT) {
            this.stars[i].pos.x = Calculator.rand_range(0,CANVAS_WIDTH);
            this.stars[i].pos.y = 0;
        }
    }
}



// TODO update this to draw sprite, not circles ?
World.prototype.draw = function(context) {
    var len = this.stars.length;
    for (var i = 0; i < len; ++i) {
        context.beginPath();
        context.arc(this.stars[i].pos.x,this.stars[i].pos.y,
            1,0,Math.PI*2);
        context.fillStyle = this.color;
        context.fill();
    }
}




// TODO add sprite to this class
//      perhaps just pass it at draw?
function Laser(x,y,w,h,vel_y) {
    this.body = new Rectangle(x,y,w,h);
    this.vel = new Vec2D(0,vel_y);
}


Laser.prototype.update = function(elapsed_time) {
    this.body.y -= this.vel.y * elapsed_time;
}


Laser.prototype.draw = function(context) {
    context.fillRect(
        this.body.x,this.body.y,
        this.body.w,this.body.h);
}



function Cannon() {
    this.lasers = [];
    this.w = LASER_WIDTH;
    this.h = LASER_HEIGHT;
    this.vel = LASER_VELOCITY;
    this.color = '#ffffff';
    this.released = true;
    this.x_offset = 0;
}


Cannon.prototype.set_exit_point = function(w_ship,h_ship) {
    this.x_offset = w_ship/2 - this.w/2;
}


Cannon.prototype.set_size = function(w,h) {
    this.w = w;
    this.h = h;
}


Cannon.prototype.set_color = function(color) {
    this.color = color;
}


// make more injections in Cannon class
Cannon.prototype.fire = function(x,y) {
    if (this.released) {
        this.lasers.push(new Laser(
            this.x_offset+x,y,
            this.w,this.h,this.vel));
        this.released = false;
    }
}


Cannon.prototype.release = function() {
    this.released = true;
}


Cannon.prototype.update = function(elapsed_time) {
    for (var i = 0; i < this.lasers.length; ++i) {
        this.lasers[i].update(elapsed_time);
        if (this.lasers[i].body.y+this.h < 0) {
            this.lasers.splice(i--,1);
        }
    }
}


// TODO add a sprite for this class
Cannon.prototype.draw = function(context) {
    context.fillStyle = this.color;
    var len = this.lasers.length;
    for (var i = 0; i < len; ++i) {
        this.lasers[i].draw(context);
    }
}



// TODO make a list of super classes to inherit from
//      and set sub prototype to each index
function InheritFrom(Super,Sub) {
    for (var i in Super) {
        if (Super.hasOwnProperty(i)) {
            Sub.prototype[i] = Super[i];
        }
    }
}




// TODO create circle class that will embody asteroids
//      and can be shot and bounce off from laser




function Anatomy() {
    this.sprites = new Sprite();
    this.collisions = [];
    this.frame_no = 0;
}


Anatomy.prototype.init = function(filepath,manager) {
    this.sprites.init(filepath,manager);
}


// TODO check index of collisions to ensure it not out of index
Anatomy.prototype.add_frames_rect = function(frames,collisions) {
    var len = frames.length;
    for (var i = 0; i < len; ++i) {
        this.sprites.single_frame_rect(frames[i]);
        this.collisions.push(collisions[i]);
    }
}


// probably not necessary now
Anatomy.prototype.rectify_collision = function(collisions,pos) {
    var len = collisions.length;
    for (var i = 0; i < len; ++i) {
        collisions[i].x += pos.x;
        collisions[i].y += pos.y;
    }
}


Anatomy.prototype.move_body = function(pos) {

}

// REMEMBER! collision rects are offsets from sprite
// this will also be the case with physics calculations
// TODO make collision rects absolute in world space (?)
Anatomy.prototype.detect_collisions = function(pos) {
    var clsn_rect = this.collisions[this.frame_no];
    console.log(clsn_rect.x+pos.x,clsn_rect.y+pos.y);
}


Anatomy.prototype.get_collision_frame = function(pos) {
    var rect = this.collisions[this.frame_no];
    var clsn = new Rectangle(
        rect.x+pos.x,rect.y+pos.y,
        rect.w,rect.h);
    return clsn;
}


// TODO reviese this to be less error prone
//      use something other than this.collisions.lenght;
Anatomy.prototype.update = function(elapsed_time) {
    this.frame_no = ++this.frame_no % this.collisions.length;
    this.sprites.update(elapsed_time);
}


Anatomy.prototype.draw = function(context,x,y) {
    this.sprites.draw(context,this.frame_no,x,y);
}


Anatomy.prototype.draw_collision = function(context,x,y) {

    var col = this.collisions[this.frame_no];
    context.strokeStyle = '#ffffff';
    context.strokeRect(col.x+x,col.y+y,col.w,col.h);
    
}






function Player(x,y) {

    //this.sprites = {};
    //this.collisions = [];
    this.anatomy = {};
    this.state = PLAYER_STATE.FLY;
    this.init_vectors(x,y);

    //console.log(this.pos,this.vel,this.accel);
    
    this.invincible = false;
    this.in_motion = false;
    this.cannon = new Cannon();

}


Player.prototype.init_vectors = function(x,y) {
    this.pos = new Pos2D(x,y);
    this.vel = new Vec2D(0,0);
    this.accel = new Vec2D(0,0);
    //console.log(this.pos,this.vec,this.accel);
}


Player.prototype.add_frame = function(filepath,state,sprites,collisions) {
    var anatomy = new Anatomy();
    anatomy.init(filepath,MediaManager);
    anatomy.add_frames_rect(sprites,collisions);
    this.anatomy[state] = anatomy;
}


Player.prototype.set_state = function(state) {
    this.state = state;
}


Player.prototype.set_pos = function(x,y) {
    this.pos.x = x;
    this.pos.y = y;
}


Player.prototype.move_body = function(delta) {
    //this.anatomy[this.state].move_body(delta);
    this.pos.x += delta.x;
    this.pos.y += delta.y;
}


Player.prototype.move_up = function() {
    this.accel.y = -ACCEL_START;
}


Player.prototype.move_down = function() {
    this.accel.y = ACCEL_START;
}


Player.prototype.move_right = function() {
    this.accel.x = ACCEL_START;
}


Player.prototype.move_left = function() {
    this.accel.x = -ACCEL_START;
}


Player.prototype.stop_moving_horizontally = function() {
    this.accel.x = ACCEL_STOP;
}


Player.prototype.stop_moving_vertically = function() {
    this.accel.y = ACCEL_STOP;
}


Player.prototype.fire = function() {
    this.cannon.fire(this.pos.x,this.pos.y);
}


Player.prototype.release_trigger = function() {
    this.cannon.release();
}


Player.prototype.set_laser_dimension = function(w,h) {
    this.cannon.w = w;
    this.cannon.h = h;
}


Player.prototype.update = function(elapsed_time) {

    this.vel = Physics.velocity_delta_2d(this.accel,this.vel,elapsed_time);
    this.vel = Physics.friction_2d(FRICTION,this.vel);

    if (this.vel.magnitude() > MAX_VEL_MAG)
        this.vel.normalize(MAX_VEL_MAG);

    var delta = Physics.kinematics_delta_2d(this.accel,this.vel,elapsed_time);
    this.move_body(delta);

    this.cannon.update(elapsed_time);

}


Player.prototype.draw = function(context) {
    this.cannon.draw(context);
    this.anatomy[this.state].draw(context,this.pos.x,this.pos.y);
}


Player.prototype.draw_collision = function(context) {
    this.anatomy[this.state].draw_collision(context,this.pos.x,this.pos.y);
}



// TODO current enemy should inherit single rect

function Enemy(x,y) {
    
    this.sprites = {};
    this.collisions = [];
    this.state = PLAYER_STATE.FLY;
    this.def_velocity = 0.1;
    this.init_vectors(x,y);
    
}


Enemy.prototype.update = function(elapsed_time) {
    var delta = new Pos2D(0,this.def_velocity * elapsed_time);
    this.move_body(delta);
}


Enemy.prototype.draw = function(context) {
    this.sprites[this.state].draw(context,this.pos.x,this.pos.y);    
}




function Enemies(layout) {

    this.enemies = [];

}



var Core = {


    init: function() {
        
        this.canvas = document.createElement('canvas');
        this.canvas.width = CANVAS_WIDTH;
        this.canvas.height = CANVAS_HEIGHT;
        this.context = this.canvas.getContext('2d');
        
        var game_port = document.getElementById('game-port');
        game_port.textContent = '';
        game_port.appendChild(this.canvas);


        //this.init_inheritance();

        this.input = new Input();


        this.world = new World(STAR_COUNT);
        
        this.player = new Player(300,500);
        this.player.set_state(PLAYER_STATE.FLY);
        this.player.add_frame('img/ship3 (3).png',PLAYER_STATE.FLY,
            [new Rectangle(0,0,104,81)],[new Rectangle(20,16,64,58)]);
        this.player.cannon.set_exit_point(104,81);


        //this.player.add_sprite('img/ship3 (3).png',
        //    PLAYER_STATE.FLY,0,0,104,81);
        //this.player.add_collision(20,16,10,58);
        //this.player.add_collision(74,16,10,58);
        //this.player.add_collision(30,26,44,16);
        //this.player.add_collision(42,10,20,16);
        //this.player.cannon.set_exit_point(104,81);


        //this.enemy = new Enemy(400,-100);
        //this.enemy.set_state(PLAYER_STATE.FLY);
        //this.enemy.add_sprite('img/kit2ship2flipped.png',
        //    PLAYER_STATE.FLY,0,0,88,110);
        //this.enemy.add_collision(24,10,40,90);
        

        //var world = new World(STAR_COUNT);



        // TODO add a filereader that inputs xml files for level loading
        //      including enemy placement and landmarks


        var self = this;
        setInterval(function(){
            self.handle_input();
            self.update(TIME_INTERVAL);
            self.draw();
        },TIME_INTERVAL);

    },


    init_inheritance: function() {

        InheritFrom(Body,Player);
        InheritFrom(MultiRectBody,Player);
        InheritFrom(Body,Enemy);
        InheritFrom(MultiRectBody,Enemy);

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
            this.player.fire();
        } else if (this.input.was_key_released(KEY.SPACE)) {
            this.player.release_trigger();
        }

        this.input.begin_new_frame();

    },


    update: function(elapsed_time) {
        this.world.update(elapsed_time);
        //this.enemy.update(elapsed_time);
        this.player.update(elapsed_time);
    },


    draw: function() {
        this.clear();
        this.world.draw(this.context);
        //this.enemy.draw(this.context);
        this.player.draw(this.context);
        this.player.draw_collision(this.context);
        //this.enemy.draw_collision(this.context,'#ff00ff');
    },


    clear: function() {
        this.context.clearRect(0,0,
            this.canvas.width,this.canvas.height);
    },


};



function run() {
    Core.init();
}




// aerofighters clone
//
//
// TODO BIG IDEAS
//
//      add object of frames to each organism
//          a frame is:
//              animated sprite array
//              collision shape array
//                  collision shape inherited by body
//              frame_no index which indicates frame
//
//      fix the controls
//          they are wonky
//
//      give enemies a string of commands they execute
//          like a Turing machine, almost
//          this simulates artificial intelligence
//
//      a map reader
//          letter represents enemy/landmark
//          variable to lookup action in table
//          coordinates
//
//      make more accurate main loop timing
//
//
//



var MSEC_PER_SEC = 1000;
var FRAMES_PER_SEC = 30;
var TIME_INTERVAL = MSEC_PER_SEC / FRAMES_PER_SEC;
var CANVAS_WIDTH = 720;
var CANVAS_HEIGHT = 540;

var ACCEL_START = 0.005;
var ACCEL_STOP = 0.0;
var MAX_VEL_MAG = 0.5;
var WIND_RESISTANCE = 0.9;

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


var GAME_STATE = Object.freeze({
    PLAY:0,
    PAUSE:1,
    QUIT:2
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

    this.held_keys = {};
    this.pressed_keys = {};
    this.released_keys = {};
    this.timer = new Date();

    var self = this;
    window.addEventListener('keyup',function(event) { 
        self.key_up_event(event); 
    });
    
    window.addEventListener('keydown',function(event) {
        self.key_down_event(event);
    });
    
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


    wind_resistance: function(f,x) {
        return f*x;
    },


    wind_resistance_2d: function(f,p) {
        p.x *= f;
        p.y *= f;
        return p;
    }


};



var Calculator = {


    rand_range: function(min,max) {
        return Math.floor(Math.random()*(max-min)) + min;
    },


    area: function(circle) {
        return Math.PI * cirle.r * circle.r;
    },


    circumference: function(circle) {
        return Math.PI * 2 * circle.r;
    },


};



function BodyRect() {
    this.collisions = [];
    this.frame_no = 0;
}


BodyRect.prototype.add_collision = function(collision) {
    this.collisions.push(collision);
}


BodyRect.prototype.detect_collision = function() {

}


BodyRect.prototype.detect_point_collision = function(rect,pos) {

    if ((rect.x < pos.x && pos.x < rect.x+rect.w) &&
        (rect.y < pos.y && pos.y < rect.y+rect.h)) 
        {
            console.log('Collision detected at (',pos.x,'x',pos.y,')');
        }

}


// pass in position
BodyRect.prototype.get_normalized_collision = function(pos) {
    var rect = this.collisions[this.frame_no];
    return new Rectangle(rect.x+pos.x,rect.y+pos.y,rect.w,rect.h);
}


BodyRect.prototype.set_frame_no = function(frame_no) {
    this.frame_no = frame_no;
}


BodyRect.prototype.size = function() {
    return this.collisions.length;
}


BodyRect.prototype.update = function(elapsed_time) {
    this.frame_no = ++this.frame_no % this.collisions.length;
}


BodyRect.prototype.draw_collision = function(context,x,y) {
    context.strokeStyle = '#ffffff';
    var rect = this.collisions[this.frame_no];
    context.strokeRect(
        rect.x+x,rect.y+y,
        rect.w,rect.h);
}



function BodyCirc(x,y) {
    this.collision = [];
    this.frame_no = 0;
}


BodyCirc.prototype.add_collision = function(collision) {
    this.collision.push(collision);
}


BodyCirc.prototype.detect_collision = function() {
    // TODO implement collision detection
    //      this can take a laser point and calc trigonometric distance 
    //      between point and centeroid, if distance smaller than radius
    //      then you have a collision
}


BodyCirc.prototype.set_frame_no = function(frame_no) {
    this.frame_no = frame_no;
}


BodyCirc.prototype.size = function() {
    return this.collision.length;
}


// TODO perhaps make frame counter a member variable
//      and update frame counter here
BodyCirc.prototype.update = function(elapsed_time) {
    this.frame_no = ++this.frame_no % this.collision.length;
}


BodyCirc.prototype.draw_collision = function(context,x,y) {
    var rect = this.collision[this.frame_no];
    context.strokeStyle = '#ffffff';
    context.beginPath();
    context.arc(
        rect.x+x,rect.y+y,
        rect.r,0,Math.PI*2);
    context.stroke();
}



function BodyMultiRect() {
    this.collision = [];
    this.frame_no = 0;
}


BodyMultiRect.prototype.add_collision = function(collision) {
    var clsn = [];
    var len = collision.length;
    for (var i = 0; i < len; ++i) {
        clsn.push(collision[i]);
    }
    this.collision.push(clsn);
}


BodyMultiRect.prototype.detect_collision = function(x,y) {

}


BodyMultiRect.prototype.size = function() {
    return this.collision.length;
}


BodyMultiRect.prototype.set_frame_no = function(frame_no) {
    this.frame_no = frame_no;
}


BodyMultiRect.prototype.update = function(elapsed_time) {
    this.frame_no = ++this.frame_no % this.collision.length;
}


BodyMultiRect.prototype.draw_collision = function(context,x,y) {

    var len = this.collision[this.frame_no].length;
    for (var i = 0; i < len; ++i) {
        var clsn = this.collision[this.frame_no][i];
        context.strokeStyle = '#ffffff';
        context.strokeRect(clsn.x+x,clsn.y+y,clsn.w,clsn.h);
    }

}



// TODO return a vector representing accel
//      that will indicate 'recoil' accel
//      or just return if collided
//      then return recoil based on other parameters
var CollisionDetector = {

    
    point_rectangle: function(pos,rect) {

        if ((rect.x < pos.x && pos.x < rect.x+rect.w) &&
            (rect.y < pos.y && pos.y < rect.y+rect.h)) 
            {
                console.log('Collision detected!\n',pos);
            }

    },


    point_circle: function(pos,circ) {



    },


};



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


Sprite.prototype.set_frame_no = function(frame_no) {
    this.frame_no = frame_no;
}


Sprite.prototype.clear = function() {
    this.frames = [];
    this.frame_no = 0;
}


// this must be updated to be more versatile
Sprite.prototype.update = function(elapsed_time) {
    this.frame_no = ++this.frame_no % this.frames.length;
}


Sprite.prototype.draw = function(context,x,y) {
    var rect = this.frames[this.frame_no];
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
//      NOTE: reading local files may not work...
//      xml files will be loaded to position enemies
//      enemies descend the screen
//      updated offscreen with velocity * elapsed time
//      but only drawn once they enter the screen
//
// TODO add item to introduce sprite for background planets
//      which will be read by filereader
//      then will have velocity
//      a celestial body, if you will



// a struct represeting the attributes of an enemy
// this.enemy could store the uninitialized enemy object?
function EnemyAttr(enemy,x,y,action) {
    this.enemy = enemy;
    this.coord = new Pos2D(x,y);
    this.action = action;
}



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
World.prototype.init_map = function(enemies,layout) {

    var map01 = [
        
    ];

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
        if (this.lasers[i].body.y+this.h < 0) {
            this.lasers.splice(i--,1);
        } else {
            this.lasers[i].update(elapsed_time);
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



function Anatomy(Body) {
    this.sprites = new Sprite();
    this.collisions = new Body();
    this.Body = Body;
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
        this.collisions.add_collision(collisions[i]);
    }
}


Anatomy.prototype.set_frame_no = function(frame_no) {
    this.sprites.set_frame_no(frame_no);
    this.collisions.set_frame_no(frame_no);
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


Anatomy.prototype.detect_point_collision = function(rect,pos) {
    //this.collisions[this.frame_no].detect_point_collision(rect,pos);
    this.collisions.detect_point_collision(rect,pos);
}


// TODO return the collision or series of collisions
//      by having function in the body classes
Anatomy.prototype.get_collision_frame = function(pos) {
    return this.collisions.get_normalized_collision(pos);
}


// TODO reviese this to be less error prone
//      use something other than this.collisions.length;

// the frame number really doesn't need to be here
// can put one in collisions and one in sprite
Anatomy.prototype.update = function(elapsed_time) {
    this.sprites.update(elapsed_time);
    this.collisions.update(elapsed_time);
}


Anatomy.prototype.draw = function(context,x,y) {
    this.sprites.draw(context,x,y);
}


Anatomy.prototype.draw_collision = function(context,x,y) {
    this.collisions.draw_collision(context,x,y);
}



function Player(x,y) {

    this.anatomy = {};
    this.state = PLAYER_STATE.FLY;
    this.init_vectors(x,y);
    
    this.invincible = false;
    this.in_motion = false;
    this.cannon = new Cannon();

}


Player.prototype.init_vectors = function(x,y) {
    this.pos = new Pos2D(x,y);
    this.vel = new Vec2D(0,0);
    this.accel = new Vec2D(0,0);
}


// TODO pass in collision shape here
//      init it when adding frames
Player.prototype.add_frame = function(Body,filepath,state,sprites,collisions) {
    var anatomy = new Anatomy(Body);
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


Player.prototype.get_lasers = function() {
    return this.cannon.lasers;
}


Player.prototype.set_laser_dimension = function(w,h) {
    this.cannon.w = w;
    this.cannon.h = h;
}


Player.prototype.update = function(elapsed_time) {

    this.vel = Physics.velocity_delta_2d(this.accel,this.vel,elapsed_time);
    this.vel = Physics.wind_resistance_2d(WIND_RESISTANCE,this.vel);

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



function Carrier(x,y) {
    this.anatomy = {};
    this.state = 0;
    this.init_vectors(x,y);
}


Carrier.prototype.init_vectors = function(x,y) {
    this.pos = new Pos2D(x,y);
    this.vel = new Vec2D(0,0);
    this.accel = new Vec2D(0,0);
}


Carrier.prototype.set_state = function(state) {
    this.state = state;
}


Carrier.prototype.set_velocity = function(x,y) {
    this.vel.x = x;
    this.vel.y = y;
}


Carrier.prototype.add_frame = function(Body,filepath,state,sprites,collisions) {
    var anatomy = new Anatomy(Body);
    anatomy.init(filepath,MediaManager);
    anatomy.add_frames_rect(sprites,collisions);
    this.anatomy[state] = anatomy;
}


Carrier.prototype.detect_point_collision = function(clsn_pt) {
    var rect = this.anatomy[this.state].get_collision_frame(this.pos);
    this.anatomy[this.state].detect_point_collision(rect,clsn_pt);
    //this.anatomy[this.state]
}


Carrier.prototype.update = function(elapsed_time) {
    this.pos.y += this.vel.y * elapsed_time;
}


Carrier.prototype.draw = function(context) {
    this.anatomy[this.state].draw(context,this.pos.x,this.pos.y);
}


Carrier.prototype.draw_collision = function(context) {
    this.anatomy[this.state].draw_collision(context,this.pos.x,this.pos.y);
}



var ASTEROID_STATE = Object.freeze({
    TUMBLE: 0
});



function Asteroid(x,y) {
    this.anatomy = {};
    this.init_vectors(x,y);
}


Asteroid.prototype.init_vectors = function(x,y) {
    this.pos = new Pos2D(x,y);
    this.vel = new Vec2D(0,0);
    this.accel = new Vec2D(0,0);
}


Asteroid.prototype.set_velocity = function(x,y) {
    this.vel.x = x;
    this.vel.y = y;
}


Asteroid.prototype.set_state = function(state) {
    this.state = state;
}


Asteroid.prototype.add_frame = function(Body,filepath,state,sprites,collisions) {
    var anatomy = new Anatomy(Body);
    anatomy.init(filepath,MediaManager);
    anatomy.add_frames_rect(sprites,collisions);
    this.anatomy[state] = anatomy;
}


Asteroid.prototype.update = function(elapsed_time) {
    this.pos.y += this.vel.y * elapsed_time;
    this.pos.x += this.vel.x * elapsed_time;
    this.anatomy[this.state].update(elapsed_time);
}


Asteroid.prototype.draw = function(context) {
    this.anatomy[this.state].draw(context,this.pos.x,this.pos.y);
}


Asteroid.prototype.draw_collision = function(context) {
    this.anatomy[this.state].draw_collision(context,this.pos.x,this.pos.y);
}



var Core = {


    init: function() {
        
        this.canvas = document.createElement('canvas');
        this.canvas.width = CANVAS_WIDTH;
        this.canvas.height = CANVAS_HEIGHT;
        var canvas = document.createElement('canvas');
        this.canvas.style.backgroundColor = '#000000';
        this.context = this.canvas.getContext('2d');
        
        var game_port = document.getElementById('game-port');
        game_port.textContent = '';
        game_port.appendChild(this.canvas);

        this.input = new Input();

        // TODO add a filereader that inputs xml files for level loading
        //      including enemy placement and landmarks
        this.world = new World(STAR_COUNT);


        var sprite = [ new Rectangle(0,0,104,81) ];
        var collisions = [
            [
                new Rectangle(20,16,10,58),
                new Rectangle(74,16,10,58),
                new Rectangle(30,26,44,16),
                new Rectangle(42,10,20,16)
            ]
        ];

        this.player = new Player(300,400);
        this.player.set_state(PLAYER_STATE.FLY);
        this.player.add_frame(BodyMultiRect,
            'img/ship3 (3).png',PLAYER_STATE.FLY,
            sprite,collisions);
        this.player.cannon.set_exit_point(104,81);


        var carrier_sprite = [ new Rectangle(0,0,88,110) ];
        var carrier_collision = [ new Rectangle(24,10,40,90) ];

        this.carrier = new Carrier(200,-200);
        this.carrier.set_state(PLAYER_STATE.FLY);
        this.carrier.add_frame(BodyRect,
            'img/kit2ship2flipped.png',PLAYER_STATE.FLY,
            carrier_sprite,carrier_collision);
        this.carrier.set_velocity(0,0.1);


        var w = 128, h = 128;
        var dim = 128/2;
        var asteroid_sprite = [];
        var asteroid_collision = [];
        for (var r = 0; r < 4; ++r) {
            for (var c = 0; c < 8; ++c) {
                asteroid_sprite.push(new Rectangle(c*w,r*h,w,h));
                asteroid_collision.push(new Circle(dim,dim,dim-18));
            }
        }

        this.asteroid = new Asteroid(400,-200);
        this.asteroid.set_state(ASTEROID_STATE.TUMBLE);
        this.asteroid.set_velocity(0,0.1);
        this.asteroid.add_frame(BodyCirc,
            'img/asteroid_01.png',ASTEROID_STATE.TUMBLE,
            asteroid_sprite,asteroid_collision);


        // TODO create while loop
        //      setInterval is not consistent enough


        //window.requestAnimationFrame(this.loop);
        
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


    // TODO make this better
    //      this is not so good now
    loop: function(time_stamp) {

        

        window.requestAnimationFrame(loop);
    },


    // TODO find out way to prevent button nonresponsiveness ...!!!
    handle_input: function() {

        if (this.input.was_key_pressed(KEY.SPACE)) {
            this.player.fire();
        } 
        else if (this.input.was_key_released(KEY.SPACE)) {
            this.player.release_trigger();
        }

        if (this.input.is_key_held(KEY.DOWN) && this.input.is_key_held(KEY.UP)) {
            this.player.stop_moving_vertically();
        }
        else if (this.input.is_key_held(KEY.UP)) {
            this.player.move_up();
        }
        else if (this.input.is_key_held(KEY.DOWN)) {
            this.player.move_down();
        }        
        else if (!this.input.is_key_held(KEY.DOWN) && !this.input.is_key_held(KEY.UP)) {
            this.player.stop_moving_vertically();
        }

        if (this.input.is_key_held(KEY.RIGHT) && this.input.is_key_held(KEY.LEFT)) {
            this.player.stop_moving_horizontally();
        }
        else if (this.input.is_key_held(KEY.LEFT)){
            this.player.move_left();
        }
        else if (this.input.is_key_held(KEY.RIGHT)) {
            this.player.move_right();
        }
        else if (!this.input.is_key_held(KEY.RIGHT) && !this.input.is_key_held(KEY.LEFT)){
            this.player.stop_moving_horizontally();
        }

        this.input.begin_new_frame();

    },


    // TODO sprite dependency injections to world class
    //      and test for collisions in these methods
    update: function(elapsed_time) {


        // TODO move this elsewhere
        //      such as to world object

        var lasers = this.player.get_lasers();
        var len = lasers.length;
        for (var i = 0; i < len; ++i) {
            this.carrier.detect_point_collision(new Pos2D(
                lasers[i].body.x,lasers[i].body.x));
        }

        // move this elsewhere



        this.world.update(elapsed_time);
        this.carrier.update(elapsed_time);
        this.asteroid.update(elapsed_time);
        this.player.update(elapsed_time);

    },


    draw: function() {

        this.clear();
        this.world.draw(this.context);

        this.carrier.draw(this.context);
        this.carrier.draw_collision(this.context);

        this.asteroid.draw(this.context);
        this.asteroid.draw_collision(this.context);

        this.player.draw(this.context);
        this.player.draw_collision(this.context);

    },


    clear: function() {
        this.context.clearRect(0,0,
            this.canvas.width,this.canvas.height);
    },


};



window.addEventListener('load',function() {
    Core.init();
});



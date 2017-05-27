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

var ACCEL_START = 0.0006;
var ACCEL_STOP = 0.0;
var MAX_VEL_MAG = 0.2;
var FRICTION = 0.90;

var STAR_COUNT = 25;

var LASER_WIDTH = 2;
var LASER_HEIGHT = 10;
var LASER_VELOCITY = 0.3;


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


};



function Rectangle(x,y,w,h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
}



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



function Background(x,y) {

    // TODO add vel,acc vector to background
    //      this allow dynamic map movement

    this.sprites = [];
    this.sprite_no = 0;

    this.pos = new Pos2D(x,y);
    this.orig_pos = new Pos2D(x,y);
    this.vel = new Vec2D(0,0);

    this.spatiality = new Rectangle(0,0,0,0);
    this.loopable = false;

    // this is just a test, this is only a test
    this.curr = 0;
    this.next = 1;

}


Background.prototype.set_spatiality = function(x,y,w,h) {
    this.spatiality = new Rectangle(x,y,w,h);
}


Background.prototype.set_size = function(w,h) {
    //this.rect.w = w;
    //this.rect.h = h;
}


// TODO pass in x,y starting pos, canvas width and canvas height
//      or just the entirety of the image and only
//      cut the image when you draw it
Background.prototype.add_sprite = function(x,y,w,h,filepath) {
    var sprite = new Sprite(x,y,w,h);
    sprite.init(filepath,MediaManager);
    this.sprites.push(sprite);
}


Background.prototype.set_scroll_speed = function(x,y) {
    this.vel.x = x;
    this.vel.y = y;
}


// this probably needs to be revised
Background.prototype.set_loopable = function(loopable) {
    this.loopable = loopable;
    if (this.loopable && this.sprites.length == 1) {
        this.sprites.push(this.sprites[0]);
    }
}


// TODO set acceleration that slows down at designated points
//      such as, slowing scroll when reach end of screen
Background.prototype.update = function(elapsed_time) {


    // TODO check movement of left to right as well
    // TODO put this on a 'treadmill' rather than reset

    
    // calling this.vel.y is prone to error
    if (this.loopable) {
        if (Math.ceil(this.pos.y) > 0) {
            var temp = this.curr;
            this.curr = this.next;
            this.next = temp;
            this.pos.y = this.orig_pos.y;
        } else {
            this.pos.x += this.vel.x * elapsed_time;
            this.pos.y += this.vel.y * elapsed_time;
        }
    }


}


Background.prototype.draw = function(context,canvas) {

    //context.drawImage(this.img,
    //    this.rect.x,this.rect.y,
    //    this.rect.w,this.rect.h,
    //    0,0,canvas.width,canvas.height);

    //this.sprites[this.sprite_no].draw(context,this.pos.x,this.pos.y);
    // should differentiate the draw here, as it should
    // not be wider than the canvas element

    //context.drawImage(this.sprites[this.sprite_no],
    //    this.rect.x,this.rect.y,
    //    this.rect.w,this.rect.h,
    //    0,0,canvas.width,canvas.height);


    // there is just an ever-so-slight jump ...
    if (this.loopable) {
        //console.log(this.curr);
        var h = this.sprites[this.curr].body.h;
        this.sprites[this.curr].draw(context,this.pos.x,this.pos.y);
        this.sprites[this.next].draw(context,this.pos.x,this.pos.y+h);
    }


}



function StarRand(x,y) {
    this.pos = new Pos2D(
        Calculator.rand_range(0,CANVAS_WIDTH), y);
    this.vel = new Vec2D(0, Math.random() % 0.1 + 0.001);
}



function Stars(count) {
    this.init_stars(count);
    this.size = 1;
    this.color = '#e6e6fa';
}



Stars.prototype.init_stars = function(count) {
    this.stars = [];
    for (var i = 0; i < count; ++i) {
        this.stars.push(new StarRand(
            0,Calculator.rand_range(0,CANVAS_WIDTH)));
    }
}


Stars.prototype.update = function(elapsed_time) {
    var len = this.stars.length;
    for (var i = 0; i < len; ++i) {
        this.stars[i].pos.y += this.stars[i].vel.y * elapsed_time;
        if (this.stars[i].pos.y > CANVAS_HEIGHT) {
            this.stars[i].pos.x = Calculator.rand_range(0,CANVAS_WIDTH);
            this.stars[i].pos.y = 0;
        }
    }
}


Stars.prototype.draw = function(context) {
    
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
            this.w,this.h,
            this.vel));
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



var Body = {


    init_vectors: function(x,y) {
        this.pos = new Pos2D(x,y);
        this.vel = new Vec2D(0,0);
        this.accel = new Vec2D(0,0);
    },


    init_pos: function(x,y) {
        this.pos = new Pos2D(x,y);
    },


    init_vel: function() {
        this.vel = new Vec2D(0,0);
    },


    init_accel: function() {
        this.accel = new Vec2D(0,0);
    },


    set_pos: function(pos) {
        this.pos.x = pos.x;
        this.pos.y = pos.y;
    },


    set_state: function(state) {
        this.state = state;
    },


    add_sprite: function(filepath,state,x,y,w,h) {
        this.sprites[state] = new Sprite(x,y,w,h);
        this.sprites[state].init(filepath,MediaManager);
    },


};



var RectBody = {


    init_collision: function(x,y,w,h) {
        this.collision = new Rectangle(
            this.pos.x+x,this.pos.y+y,w,h);
    },


    init_collision_offset: function(left,right,top,bottom) {
        // TODO implement this function (?)
    },


    move_body: function(offset) {
        this.pos.x += offset.x;
        this.pos.y += offset.y;
        this.collision.x += offset.x;
        this.collision.y += offset.y;
    },


    draw_collision: function(context,color) {

        context.strokeStyle = color;
        context.strokeRect(
            this.collision.x,
            this.collision.y,
            this.collision.w,
            this.collision.h);

    },


};



var MultiRectBody = {


    collisions:[],


    add_collision: function(x,y,w,h) {
        
        this.collisions.push(new Rectangle(
            this.pos.x+x,this.pos.y+y,w,h));
    },


    move_body: function(offset) {

        this.pos.x += offset.x;
        this.pos.y += offset.y;
        var len = this.collisions.length;
        for (var i = 0; i < len; ++i) {
            this.collisions[i].x += offset.x;
            this.collisions[i].y += offset.y;
        }

    },


    draw_collision: function(context,color) {

        context.strokeStyle = color;

        var len = this.collisions.length;
        for (var i = 0; i < len; ++i) {
            context.strokeRect(
                this.collisions[i].x,
                this.collisions[i].y,
                this.collisions[i].w,
                this.collisions[i].h);
        }

    },


};



function Player(x,y) {
    //this.inherit_from(BaseBody);
    //inherit_from(BaseBody,this);
    this.init_vectors(x,y);
    this.sprites = {};
    this.invincible = false;
    this.in_motion = false;
    this.cannon = new Cannon();
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
    this.sprites[this.state].draw(context,this.pos.x,this.pos.y);
}



function Enemy(x,y) {
    
    this.sprites = {};
    this.state = PLAYER_STATE.FLY;
    this.init_vectors(x,y);
    
}


Enemy.prototype.update = function(elapsed_time) {
    this.pos.y += elapsed_time * 0.01;
}


Enemy.prototype.draw = function(context) {
    this.sprites[this.state].draw(context,this.pos.x,this.pos.y);    
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


        this.input = new Input();

        this.init_inheritance();


        //this.player = new Player(RectBody);
        //this.player.set_state(PLAYER_STATE.FLY);
        //this.player.add_sprite('img/ship3 (3).png',
        //    PLAYER_STATE.FLY,0,0,104,81);
        //this.player.init_pos(300,200);
        //this.player.init_collision(20,10,64,61);
        

        this.player = new Player(300,500);
        this.player.set_state(PLAYER_STATE.FLY);
        this.player.add_sprite('img/ship3 (3).png',
            PLAYER_STATE.FLY,0,0,104,81);
        //this.player.init_pos(300,500);
        this.player.add_collision(20,16,10,58);
        this.player.add_collision(74,16,10,58);
        this.player.add_collision(30,26,44,16);
        this.player.add_collision(42,10,20,16);

        this.player.cannon.set_exit_point(104,81);


        this.enemy = new Enemy(400,-100);
        this.enemy.add_sprite(
            'img/kit2ship2flipped.png',
            PLAYER_STATE.FLY,0,0,88,110);
        

        this.stars = new Stars(STAR_COUNT);
        var stars = new Stars(STAR_COUNT);


        //this.background = new Background(-1200,this.canvas.height-5120);
        //this.background.set_spatiality(0,0,2880,5120);
        //this.background.add_sprite(0,0,
        //    this.background.spatiality.w,
        //    this.background.spatiality.h,
        //    'img/carina-nebulae-ref.png');
        //this.background.set_scroll_speed(0,0.01);
        //this.background.set_if_loopable(false);
        

        //this.background = new Background(0,-600);
        //this.background.set_spatiality(0,0,800,1200);
        //this.background.add_sprite(0,0,
        //    this.background.spatiality.w,
        //    this.background.spatiality.h,
        //    'img/level1Background.png');
        //this.background.set_scroll_speed(0,0.01);
        //this.background.set_loopable(true);


        // TODO add a filereader that inputs xml files for level loading
        //      including enemy placement and landmarks


        var self = this;
        setInterval(function(){
            self.handle_input();
            self.update(TIME_INTERVAL);
            self.draw();
        });

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

    },


    update: function(elapsed_time) {
        this.player.update(elapsed_time);
        //this.background.update(elapsed_time);
        this.enemy.update(elapsed_time);
        this.stars.update(elapsed_time);
        this.input.begin_new_frame();
    },


    draw: function() {
        this.clear();
        //this.background.draw(this.context,this.canvas);
        this.stars.draw(this.context);
        this.player.draw(this.context);
        //this.player.draw_collision(this.context,'#ffffff');

        this.enemy.draw(this.context);

    },


    clear: function() {
        this.context.clearRect(0,0,
        this.canvas.width,this.canvas.height);
    },


};



function run() {
    Core.init();
}



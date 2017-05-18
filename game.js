/*
    online game engine!
*/

/*

function Player(x,y,w,h,img) {
    var self = this;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.vx = 0;
    this.vy = 0;
    this.ax = 0;
    this.ay = 0;
    this.on_ground = false;
    //this.img = img;

    this.move_right = function() {
        self.ax += WALK_ACCEL;
        console.log(self.ax);        
    }

    this.move_left = function() {
        self.ax -= WALK_ACCEL;
        console.log(self.ax);
    }

    this.jump = function() {
        self.vy = -JUMP_VEL;
        console.log(self.vy);
    }

}

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
    this.img = new Image();
    this.img.src = path;

    this.increment = function() {
        self.frame_no = ++self.frame_no % self.x.length;
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
    this.w = w;
    this.h = h;
    this.sprites = new Object();
    this.state = PLAYER_STATES.STILL_RIGHT;

    this.init = function() {
        self.add_sprite(PLAYER_STATES.WALK_LEFT,[0,1,0,2],0);
        self.add_sprite(PLAYER_STATES.WALK_RIGHT,[0,1,0,2],1);
        self.add_sprite(PLAYER_STATES.STILL_LEFT,[0],0);
        self.add_sprite(PLAYER_STATES.STILL_RIGHT,[0],1);
    }

    this.add_sprite = function(state,x,y) {
        self.sprites[state] = new Sprite(x,y,32,32,'img/MyChar.bmp');
    }

    this.move_left = function() {
        self.state = PLAYER_STATES.WALK_LEFT;
    }

    this.move_right = function() {
        self.state = PLAYER_STATES.WALK_RIGHT;
    }

    this.update = function() {
        self.sprites[self.state].increment();
    }

    this.jump = function() {

    }

    this.stop_moving = function() {
        if (self.state === PLAYER_STATES.WALK_RIGHT) {
            self.state = PLAYER_STATES.STILL_RIGHT;
        }
        if (self.state === PLAYER_STATES.WALK_LEFT) {
            self.state = PLAYER_STATES.STILL_LEFT;
        }
    }

    this.draw = function(ctx) {
        self.sprites[self.state].draw(ctx,self.x,self.y);
    }

}


function Core() {

    var self = this;
    this.canvas = document.createElement('canvas');
    this.canvas.width = 480;
    this.canvas.height = 270;
    this.context = this.canvas.getContext('2d');
    document.body.appendChild(this.canvas);

    this.input = new Input();
    this.player = new Player(0,0,32,32);

    this.initialize = function() {
        setInterval(self.iteration,80);
        self.player.init();
    }

    this.iteration = function() {
        self.update();
        self.draw();
    }

    this.update = function() {
        self.clear();

        if (self.input.is_down(KEY.RIGHT) && self.input.is_down(KEY.LEFT)) {
            self.player.stop_moving();
        }
        else if (self.input.is_down(KEY.RIGHT)) {
            self.player.move_right();
        }
        else if (self.input.is_down(KEY.LEFT)) {
            self.player.move_left();
        }
        else if (!self.input.is_down(KEY.RIGHT) && !self.input.is_down(KEY.LEFT)) {
            self.player.stop_moving();
        }

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


/*

function Input() {
    var self = this;
    this.held_keys = [];
    this.pressed_keys = [];
    this.released_keys = [];
    this.begin_new_frame = function() {
        self.pressed_keys = [];
        self.released_keys = [];
    }
    this.key_down_event = function(evnt) {
        self.pressed_keys[evnt.keyCode] = true;
        self.held_keys[evnt.keyCode] = true;
    }
    this.key_up_event = function(evnt) {
        self.released_keys[evnt.keyCode] = true;
        self.held_keys[evnt.keyCode] = false;
    }
    this.was_key_pressed = function(key) {
        return self.pressed_keys[key];
    }
    this.was_key_released = function(key) {
        return self.released_keys[key];
    }
    this.is_key_held = function(key) {
        return self.held_keys[key];
    }
}

*/

/*

function Player(x,y,w,h,img) {
    var self = this;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.vx = 0;
    this.vy = 0;
    this.ax = 0;
    this.ay = 0;
    this.on_ground = false;
    this.img = img;
    this.input = new Input();

    this.initialize = function() {
        // init sprite here
        $(document).keydown(function(evnt) {
            self.input.key_down_event(evnt);
        });
        $(document).keyup(function(evnt) {
            self.input.key_up_event(evnt);
        });
    }
        
    this.update = function() {
        if (self.input.is_key_held(KEY.LEFT) && 
            self.input.is_key_held(KEY.RIGHT))
            self.stop_moving();
        else if (self.input.is_key_held(KEY.LEFT))
            self.move_left();
        else if (self.input.is_key_held(KEY.RIGHT))
            self.move_right();
        else
            self.stop_moving();
        if (self.input.was_key_pressed(KEY.JUMP)) {
            if (self.on_ground) {
                self.jump();
                self.on_ground = false;
            }
        }
        self.vx += self.ax*FRAME_TIME;
        if (Math.abs(self.vx) > MAX_VEL_X)
            self.vx = Math.sign(self.vx)*MAX_VEL_X;
        self.x += self.vx*FRAME_TIME;
        self.vx *= FRICTION;
        self.vy += GRAVITY*FRAME_TIME;
        self.y += self.vy*FRAME_TIME;
        
        // fix this hack!
        if (this.y > 200) {
            this.y = 200;
            this.vy = 0;
            this.on_ground = true;
        }
    }

    this.move_left = function() {
        self.ax = -WALK_ACCEL;
        console.log(self.ax);
    }

    this.move_right = function() {
        self.ax = WALK_ACCEL;
        console.log(self.ax);
    }

    this.stop_moving = function() {
        self.ax = 0.0;
        //console.log('stop moving');
    }

    this.jump = function() {
        self.vy = -JUMP_VEL;
        console.log(self.y);
    }

}

*/


/*
// this works
function Rectangle(x,y,w,h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
}

function Player(x,y,w,h,img) {
    this.pos = null;
    this.initialize = function(x,y,w,h) {
        this.pos = new Rectangle(x,y,w,h);
    }
    this.update = function(){
        console.log(this.pos.x,this.pos.y);        
    }
}

function run() {
    var Player = new Player(0,0,0,0,'');
    Player.initialize(50,20,10,10,'');
    Player.update();
}

*/


/*

// canvas structure
var Context = {
    canvas: null,
    context: null,
    create: function(canvas_tag_id) {
        this.canvas = document.getElementById(canvas_tag_id);
        this.context = this.canvas.getContext('2d');
        return this.context;
    }
};


var Player = function(filename,is_pattern) {
    
    // construct
    this.image = null;
    this.pattern = null;
    this.TO_RADIANS = Math.PI/180;

    if (filename != undefined && filename != '' && filename != null) {
        this.image = new Image();
        this.image.src = filename;
        if (is_pattern) {
            this.pattern = Context.context.createPattern(this.image,'repeat');
        }
    } else {
        console.log('unable to load Player.');
    }

    this.draw = function(x,y,w,h) {
        // pattern?
        if (this.pattern != null) {
            // if is a pattern
            Context.context.fillStyle = this.pattern;
            Context.context.fillRect(x,y,w,h); 
        } else {
            // if is an image
            if (w == undefined || h == undefined) {
                Context.context.drawImage(
                    this.image,x,y,this.image.width,this.image.height);
            } else {
                // stretched picture
                Context.context.drawImage(this.image,x,y,w,h);
            }
        }
    }

    this.rotate = function(x,y,angle) {
        Context.context.save();
        Context.context.translate(x,y);
        Context.context.rotate(angle * this.TO_RADIANS);
        Context.context.drawImage(
            this.image,
            -(this.image.width/2),
            -(this.image.height/2));
        Context.context.restore();
    }

};



// initialize game
$(document).ready(function() {
    Context.create('canvas');

    var WALL = 'img/brick.png';
    var CRATE = 'img/crate.png';

    var image = new Player(WALL,false);
    var image2 = new Player(CRATE,false);

    var pattern = new Player(CRATE,true);
    var angle = 0;

    setInterval(function() {

        Context.context.fillStyle = '#000000';
        Context.context.fillRect(0,0,800,800);

        image.draw(0,0,64,64);
        image.draw(0,74,256,32);
        pattern.draw(160,160,256,180);

        image.rotate(115,160, angle += 4.0);
        image2.rotate(115,260,-angle/2);


    },25);


    //Context.context.beginPath();
    //Context.context.rect(0,0,640,480);
    //Context.context.fillStyle = 'black';
    //Context.context.fill();
    

});

*/


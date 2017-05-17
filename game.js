/*
    online game engine!
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


function MediaManager() {
    var self = this;
    this.media = {};
    this.add_sprite = function() {
        
    }
}


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


function GameCore() {
    var self = this;
    this.canvas = document.createElement('canvas');
    this.initialize = function() {
        self.canvas.width = 480;
        self.canvas.height = 270;
        self.context = this.canvas.getContext('2d');
        document.body.insertBefore(this.canvas,document.body.childNodes[0]);
        self.frameNo = 0;
        self.interval = setInterval(this.update,20);
        self.player = new Player(50,60,0,0,'');
        self.player.initialize();
    }
    this.clear = function(){
        self.context.clearRect(0,0,self.canvas.width,self.canvas.height);
    }
    this.update = function() {
        self.player.update();
    }
}


function run() {
    var core = new GameCore();
    core.initialize();
}







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


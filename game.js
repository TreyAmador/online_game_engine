/*
    online game engine!
*/

/*

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


// pass an array of frames
function Sprite(x,y,w,h,frames,filepath) {

    var self = this;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.frames = frames;
    this.frame_no = 0;

    this.img = new Image();
    this.img.src = filepath;

    this.update_frame = function() {
        self.frame_no = ++self.frame_no % frames.length;
        self.x = self.frame_no * self.width;
    }

    this.draw = function(context,x,y,w,h) {
        context.drawImage(self.img,
            self.x,self.y,self.w,self.h,
            x,y,self.w,self.h);
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
    //this.img = img;

    this.initialize = function() {
        // init sprite here
        
    }
        
    this.update = function() {
        
    }

    this.draw = function(context) {
        
    }

    this.move_right = function() {
        self.ax += WALK_ACCEL;
        console.log(self.ax);        
    }

    this.move_left = function() {
        self.ax -= WALK_ACCEL;
        console.log(self.ax);
    }

    this.duck = function() {
        // duck animation
    }

    this.jump = function() {
        self.vy = -JUMP_VEL;
        console.log(self.vy);
    }

}


function GameCore() {
    var self = this;
    this.canvas = document.createElement('canvas');
    
    this.initialize = function() {
        self.canvas.width = 480;
        self.canvas.height = 270;
        self.context = self.canvas.getContext('2d');
        document.body.appendChild(self.canvas);
        self.frameNo = 0;
        self.interval = setInterval(self.update,20);
        self.input = new Input();
        self.player = new Player(50,60,0,0,'');
        self.player.initialize();
    }
    
    this.clear = function(){
        self.context.clearRect(0,0,self.canvas.width,self.canvas.height);
    }

    this.draw = function() {

        self.player.draw(self.context);

    }

    this.update = function() {
        
        if (self.input.is_down(KEY.RIGHT)) {
            self.player.move_right();
        }
        if (self.input.is_down(KEY.LEFT)) {
            self.player.move_left();
        }
        if (self.input.is_down(KEY.JUMP)) {
            // add on ground fxn
            self.player.jump();
        }            
        
        self.player.update();

    }
}

*/



function Sprite(x,y,w,h,path) {

    var self = this;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;

    this.path = path;
    this.img = new Image();
    this.img.src = path;

    this.add_img = function(path) {
        // check if media manager has image
    }

    this.draw = function(ctx,src_x,src_y,dest_x,dest_y) {
        // img = media[self.path] pass to draw image
        ctx.drawImage(self.img,
            src_x,src_y,self.w,self.h,
            dest_x,dest_y,self.w,self.h);
    }

}


function Core() {

    var self = this;
    this.canvas = document.createElement('canvas');
    this.canvas.width = 480;
    this.canvas.height = 270;
    this.context = this.canvas.getContext('2d');
    document.body.appendChild(this.canvas);

    this.sprite = new Sprite(0,0,80,80,'img/rainbow-5.png');
    

    this.initialize = function() {
        setInterval(self.update,20);
    }

    this.update = function() {
        self.sprite.draw(self.context,
            self.sprite.x,self.sprite.y,0,0);
    }

}


function run() {
    var core = new Core;
    core.initialize();
}



/*

function Rectangle(x,y,w,h) {

    var self = this;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;

    this.dimensions = function() {
        return [self.w, self.h];
    }

    this.area = function() {
        return self.w * self.h;
    }
}


function Square(x,y,s) {
    
    var self = this;

    Rectangle.call(this,x,y,s,s);

    //this.x = x;
    //this.y = y;
    //this.s = s;

    this.dimensions = function() {
        //return [self.s];
        //Rectangle.prototype.dimensions.call(self);
        return Rectangle.prototype.dimensions;
    }

    this.area = function() {
        //Rectangle.call(self);
        //return self.s * self.s;
        return self.w * self.h;
    }

}




Square.prototype = Object.create(Rectangle.prototype);


//Square.prototype = new Rectangle;
//Square.prototype.constructor = Square;


function run() {
    var rect = new Rectangle(5,6,3,8);
    console.log('rect dimns',rect.dimensions());
    var squr = new Square(3,2,6);
    console.log('squr dimns',squr.dimensions());
}

*/





/*
// this works for drawing images
function run() {
    var self = this;
    this.canvas = document.createElement('canvas');
    this.canvas.width = 480;
    this.canvas.height = 270;
    this.context = this.canvas.getContext('2d');
    document.body.appendChild(this.canvas);
    this.img = new Image;
    this.img.src = 'img/rainbow-5.png';
    this.upper = function() {
        self.context.drawImage(img,0,0);
    }  
    setInterval(upper,20);
}
*/


/*

// a still image
function Sprite(x,y,w,h,filepath) {

    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;

    this.img = new Image();
    this.img.src = filepath;

    // pass in body coordinates
    this.draw = function(context,x,y,w,h) {
        context.drawImage(self.img,x,y)
    }
}



function TestCore() {
    
    var self = this;
    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');
    this.canvas.width = 480;
    this.canvas.height = 270;
    document.body.appendChild(self.canvas);
    
    this.sprite = new Sprite(0,0,80,80,'img/rainbow-5.png');
    
    this.initialize = function() {
        self.frameNo = 0;
        self.interval = setInterval(self.update,20);
        //self.sprite = new Sprite(0,0,80,80,[0,1,2,3,4,3,2,1],'img/rainbow-5.png');
    }
    
    this.update = function() {
        self.draw();
    }

    this.draw = function() {
        // passing arbitrary pos and size vars
        self.sprite.draw(self.context,100,100,80,80);
    }

}



//function run() {
    //var core = new GameCore();
    //core.initialize();    
//}




function run() {
    var test_core = new TestCore();
    test_core.initialize();
}


*/






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


/*  */


var TIME_INTERVAL = 50;
var CANVAS_WIDTH = 640;
var CANVAS_HEIGHT = 480;


var KEY = Object({
    UP:38,
    DOWN:40,
    RIGHT:39,
    LEFT:37,
    SPACE:32
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



function Rectangle(x,y,w,h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
}



function Sprite(x,y,w,h) {
    this.body = new Rectangle(x,y,w,h);
    this.sizing = 1;
}


Sprite.prototype.init = function(filepath,manager) {
    this.img = manager.load(filepath);
}


Sprite.prototype.shrink_width = function(factor) {
    
}


Sprite.prototype.shrink_height = function(factor) {

}


Sprite.prototype.shrink = function(factor) {

}


Sprite.prototype.update = function(elapsed_time) {

}


Sprite.prototype.draw = function(context,x,y) {
    context.drawImage(this.img,
        this.body.x,this.body.y,this.body.w,this.body.h,
        x,y,this.body.w/this.sizing,this.body.h/this.sizing);
}


// TODO modify this to be a player superclass
function Body(x,y,w,h) {

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

        this.sprite = new Sprite(0,0,180,275);
        this.sprite.init('img/flashtestship_0.png',MediaManager);

        var self = this;
        setInterval(function(){
            self.update(TIME_INTERVAL);
            self.handle_input();
            self.draw();
        });

    },

    update: function() {
        //update sprite

    },

    handle_input: function() {

    },

    draw: function() {
        this.clear();
        this.sprite.draw(this.context,0,0);
    },

    clear: function() {
        this.context.clearRect(0,0,
        this.context.width,
        this.context.height);
    }


};


function run() {
    Core.init();
}


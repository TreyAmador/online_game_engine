/**
 *  main game core for runner!
 * 
 */


var FRAME_PER_SEC = 30;
var MSEC_PER_SEC = 1000;
var FRAME_RATE = MSEC_PER_SEC / FRAME_PER_SEC;


var WINDOW = Object.freeze({
    WIDTH: 1280,
    HEIGHT: 720
});


var MediaManager = {

    files: {},

    load: function(filepath) {

        if (!this.files[filepath]) {
            var img = new Image();
            img.src = filepath;
            this.files[filepath] = img;
        }
        
        return this.files[filepath];

    }

}


function Point2D(x, y) {
    this.x = x;
    this.y = y;
}


function Sprite(filepath, frames, width, height) {

    this.frames = frames;
    this.f = -1;

    this.w = width;
    this.h = height;

    this.image = MediaManager.load(filepath);

}


Sprite.prototype.update = function(elapsed_time) {

}


Sprite.prototype.draw = function(context, x, y) {
    
    this.f = (++this.f) % this.frames.length;
    context.drawImage(this.image,
        this.frames[this.f].x*this.w,
        this.frames[this.f].y*this.h,
        this.w, this.h,
        x, y, this.w, this.h);

}


function Core() {

    this.canvas = this.createCanvas('.game-latch');
    this.context = this.canvas.getContext('2d');

}


Core.prototype.createCanvas = function(tag) {
    
    var canvas = $('<canvas />', {
        class: 'game-canvas',
        id: 'game-canvas'
    }).prop({
        width: WINDOW.WIDTH,
        height: WINDOW.HEIGHT,
    });

    $(tag).append(canvas);
    return document.getElementById('game-canvas');
    
}


Core.prototype.run = function() {

    this.sprite = new Sprite(
        'img/cavestorysprite.bmp', 
        [
            new Point2D(0, 0), 
            new Point2D(1, 0), 
            new Point2D(0, 0), 
            new Point2D(2, 0), 
        ], 
        32, 32);

    // TODO remove this rate
    FRAME_RATE = 100;

    var self = this;
    setInterval(function() {
        self.update(FRAME_RATE);
        self.draw(self.context);
    }, FRAME_RATE);

}


Core.prototype.update = function(elapsed_time) {
    this.sprite.update(elapsed_time);
}


Core.prototype.draw = function(context) {
    this.sprite.draw(context, 0, 0);
}


$(window).on('load', function() {
    var core = new Core();
    core.run();
});


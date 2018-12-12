/**
 *  main game core for runner!
 * 
 */


var FRAME_PER_SEC = 30;
var MSEC_PER_SEC = 1000;
var FRAME_RATE = MSEC_PER_SEC / FRAME_PER_SEC;

var WINDOW_HEIGHT = 720;
var WINDOW_WIDTH = 1280;




/*

function testDraw() {

    var sprite = new Image();
    sprite.src = "img/frame-sprite-animation.png";

    var canvas = document.getElementById('game-canvas');
    var context = canvas.getContext('2d');

    var i = 0;
    var frames = 5;
    var w = 80;
    var h = 80;

    setInterval(function() {
        context.drawImage(sprite, 
            i*w, 0, w, h,
            0, 0, w, h);
        i = (++i) % frames;
    }, 500);

}

*/


function Point2D(x, y) {
    this.x = x;
    this.y = y;
}


function Sprite(path, frames, width, height) {

    this.frames = frames;
    this.f = -1;

    //this.x = 0;
    //this.y = 0;
    this.w = width;
    this.h = height;
    
    this.image = new Image();
    this.image.src = path;

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
        width: WINDOW_WIDTH,
        height: WINDOW_HEIGHT,
    });

    $(tag).append(canvas);
    return document.getElementById('game-canvas');
    
}


Core.prototype.run = function() {

    this.sprite = new Sprite(
        'img/frame-sprite-animation.png', 
        [
            new Point2D(0, 0), 
            new Point2D(1, 0), 
            new Point2D(2, 0), 
            new Point2D(3, 0), 
            new Point2D(4, 0), 
        ], 
        80, 80);

    // TODO remove this rate
    FRAME_RATE = 1000;

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


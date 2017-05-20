// rectangle is each frame
// init sprite into rectangle?



// initial size of sprite
// could also pass in function that is executed
// with each iteration...?
// could be different for different frames, for example
// could perhaps pass sprite if simple 
function Sprite() {
    //this.clear_frames();
    this.frames = [];
    this.frame_no = 0;
}


Sprite.prototype.init_single = function(x,y,w,h) {
    this.clear_frames();
    this.frames.push(new Rectangle(x,y,w,h));
}


// first arg row of ints indicating tile of sprites
// second arg is row number
Sprite.prototype.init_row_frames = function(x,y,w,h) {
    this.clear_frames();
    var len = x.length;
    for (var i = 0; i < len; ++i)
        this.frames.push(new Rectangle(x*(w+i),y*h,w,h));
}


// second arg col of ints indi
Sprite.prototype.init_col_frames = function(x,y,w,h) {
    this.clear_frames();
    var len = y.length;
    for (var i = 0; i < len; ++i)
        this.frames.push(new Rectangle(x*w,y*(h+i),w,h));
}


// array of frames of 2d vectors with equal width and height
Sprite.prototype.init_coord_frames = function(frames,w,h) {
    this.clear_frames();
    var len = frames.length;
    for (var i = 0; i < len; ++i)
        this.frames.push(new Rectangle(
            frames[i].x*w,frames[i].y*h,w,h));
}


// array of rects for variable pos and width
Sprite.prototype.init_frame_rects = function(frames) {
    this.clear_frames();
    var len = frames.length;
    for (var i = 0; i < len; ++i)
        this.frames.push(frames[i]);
}


// should be a array of number pairs
// the frames should refer to tile of the sprite
// frames will be multiplied by width and height
// can pass pixels, with an array of rectangles


// pass media manager here later
Sprite.prototype.init_img = function(filepath,manager) {
    this.img = manager.load(filepath);
}


Sprite.prototype.frame_update_rate = function(rate) {
    
    //this.timer = new Timer(rate);

    
}


// this needs to be tailored a bit....
Sprite.prototype.rotate = function(context,deg) {

    var radians = deg * Math.PI / 180;
    var rect = this.frames[this.frame_no];

    //context.save();
    //context.translate(rect.x,rect.y);
    //context.translate(rect.w/2,rect.h/2);
    //context.rotate(radians);
    //context.drawImage();
    //this.draw(context,)
    //context.restore();

}


Sprite.prototype.flip_hrz = function(context) {
    // eh, this doesn't work...
    //context.scale(-1,1);
}


Sprite.prototype.flip_vrt = function(context) {
    // this doesn't even exist yet, haha
}


Sprite.prototype.clear_frames = function() {
    this.frames = [];
    this.frame_no = 0;
}


Sprite.prototype.update = function(time,interval,func) {
    if (func)
        this.frame_no = func(time);
    else
        this.frame_no = ++this.frame_no % this.frames.length;
}


Sprite.prototype.draw = function(context,x,y) {
    var rect = this.frames[this.frame_no];
    context.drawImage(this.img,
        rect.x,rect.y,rect.w,rect.h,
        x,y,rect.w,rect.h);
}



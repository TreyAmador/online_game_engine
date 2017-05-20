// rectangle is each frame
// init sprite into rectangle?





// initial size of sprite
// could also pass in function that is executed
// with each iteration...?
// could be different for different frames, for example
// could perhaps pass sprite if simple 
function Sprite() {
    this.frames = [];
    this.frame_no = 0;
}


Sprite.prototype.init_single = function(x,y,w,h) {
    this.frames.push(new Rectangle(x,y,w,h));
}


// first arg row of ints indicating tile of sprites
// second arg is row number
Sprite.prototype.init_row_frames = function(x,y,w,h) {
    var len = x.length;
    for (var i = 0; i < len; ++i)
        this.frames.push(new Rectangle(x*w+x*i,y*h,w,h));
}


// second arg col of ints indi
Sprite.prototype.init_col_frames = function(x,y,w,h) {
    var len = y.length;
    for (var i = 0; i < len; ++i)
        this.frames.push(new Rectangle(x*w,y*h+y*i,w,h));
}


// array of frames of 2d vectors with equal width and height
Sprite.prototype.init_coord_frames = function(frames,w,h) {
    var len = frames.length;
    for (var i = 0; i < len; ++i)
        this.frames.push(new Rectangle(
            frames[i].x*w,frames[i].y*h,w,h
        ));
}


// array of rects for variable pos and width
Sprite.prototype.init_frame_rects = function(frames) {
    var len = frames.length;
    for (var i = 0; i < len; ++i)
        this.frames.push(frames[i]);
}


// should be a array of number pairs
// the frames should refer to tile of the sprite
// frames will be multiplied by width and height
// can pass pixels, with an array of rectangles


// pass media manager here later
Sprite.prototype.init_img = function(filepath) {
    this.img = new Image();
    this.img.src = filepath;
}



Sprite.prototype.rotate = function(context,deg) {

}


Sprite.prototype.flip_hrz = function() {

}


Sprite.prototype.flip_vrt = function() {

}


Sprite.prototype.update = function(time,func) {
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



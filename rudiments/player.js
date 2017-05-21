// the player class


// the body has a sprite
// physics calculations handled here



function inherits_from(SuperClass,BaseClass,members) {
    SuperClass.prototype = new BaseClass();
    SuperClass.prototype.constructor = BaseClass;
    BaseClass.call(SuperClass);
}


function Body(x,y) {
    this.x = x;
    this.y = y;
}


Body.prototype.update = function(elapsed_time) {

}


Body.prototype.draw = function(context) {

}



// the player class will inherit this or something like it
function Quadrangle(x,y,w,h) {
    inherits_from(this,Body);
    this.w = w;
    this.h = h;
}



// a player class
function Player(BaseBody) {
    inherits_from(this,BaseBody);
    this.sprite = new Sprite();
}


Player.prototype.add_coord_sprite = function(filepath,frames,w,h) {
    this.sprite.init_img(filepath,MediaManager);
    this.sprite.init_coord_frames(frames,w,h);
}


Player.prototype.add_row_sprite = function() {
    
}



Player.prototype.get_sprite = function() {
    return this.sprite.img;
}


Player.prototype.draw = function(context,x,y) {
    this.sprite.draw(context,x,y);
}


Player.prototype.update = function(elapsed_time) {
    this.sprite.update(elapsed_time);
}



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


function Quadrangle(x,y,w,h) {
    inherits_from(this,Body);
    this.w = w;
    this.h = h;
}


function Player(BaseBody) {
    inherits_from(this,BaseBody);
}


Player.prototype.initialize = function() {
    
}


Player.prototype.init_sprite = function() {

}


Player.prototype.print = function() {
    
}


Player.prototype.draw = function(context,x,y) {
    
}


Player.prototype.update = function(elapsed_time) {

}





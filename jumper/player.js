// player is here for player purposes



var MAX_VEL_X = 0.3,
    MAX_VEL_Y = 0.3;

var MOVE_ACCEL = 0.3,
    JUMP_ACCEL = 0.5;



function Player(x,y,w,h) {
    this.body = new Rectangle(x,y,w,h);
    
    this.color = '#ff0000';
}


Player.prototype.update = function(elapsed_time) {
    
}


Player.prototype.draw = function(context) {
    context.fillStyle = this.color;
    context.fillRect(this.body.x,this.body.y,this.body.w,this.body.h);
}




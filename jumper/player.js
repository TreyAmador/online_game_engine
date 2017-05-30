// player is here for player purposes



var MAX_VEL_X = 0.5,
    MAX_VEL_Y = 0.3;

var MOVE_ACCEL = 0.3,
    JUMP_ACCEL = 0.5;

var WALK_ACCEL_START = 0.005,
    WALK_ACCEL_STOP = 0.0,
    MAX_VEL = 0.5,
    FRICTION = 0.8;




function Player(x,y,w,h) {
    this.body = new Rectangle(x,y,w,h);
    this.vel = new Vec2D(0,0);
    this.accel = new Vec2D(0,0);
    this.color = '#ff0000';
}


Player.prototype.move_up = function() {
    this.accel.y = -WALK_ACCEL_START;
}


Player.prototype.move_down = function() {
    this.accel.y = WALK_ACCEL_START;
}


Player.prototype.move_left = function() {
    this.accel.x = -WALK_ACCEL_START;
}


Player.prototype.move_right = function() {
    this.accel.x = WALK_ACCEL_START;
}


Player.prototype.stop_moving = function() {
    this.accel.x = 0;
}


Player.prototype.update = function(elapsed_time) {
    
    this.vel = Physics.velocity_delta_2d(this.accel,this.vel,elapsed_time);
    this.vel = Physics.friction_2d(FRICTION,this.vel);

    if (Math.abs(this.vel.x) > MAX_VEL_X) {
        this.vel.x = Math.sign(this.vel.x)*MAX_VEL_X;
        this.accel.x = 0.0;
    }

    var pos = Physics.kinematics_delta_2d(this.accel,this.vel,elapsed_time);
    this.body.x += pos.x;
    this.body.y += pos.y;

}


Player.prototype.draw = function(context) {
    context.fillStyle = this.color;
    context.fillRect(
        this.body.x,this.body.y,
        this.body.w,this.body.h);
}




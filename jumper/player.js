// player is here for player purposes




var WALK_ACCEL_START = 0.005,
    WALK_ACCEL_STOP = 0.0,
    JUMP_ACCEL = 0.05,
    JUMP_VEL = 0.7;

var MAX_VEL_X = 0.5,
    MAX_VEL_Y = 0.3;

var FRICTION = 0.8,
    GRAVITY = 0.001;


function Player(x,y,w,h) {
    this.body = new Rectangle(x,y,w,h);
    this.vel = new Vec2D(0,0);
    this.accel = new Vec2D(0,0);
    this.color = '#ff0000';
    this.on_ground = false;
    this.rebound = true;
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


Player.prototype.jump = function() {
    if (this.on_ground && this.rebound) {
        this.vel.y = -JUMP_VEL;
        this.on_ground = false;
        this.rebound = false;
    } else {
        this.on_ground = false;
        this.rebound = false;
    }
}



Player.prototype.recover_jump = function() {
    if (this.on_ground) {
        this.rebound = true;
    }
}



// TODO perhaps replace the 2D kinematics with 1D
//      more efficient, which is good to do
Player.prototype.update = function(elapsed_time) {
    
    this.vel.x += Physics.velocity_delta(this.accel.x,elapsed_time);
    this.vel.x = Physics.friction(FRICTION,this.vel.x);

    if (Math.abs(this.vel.x) > MAX_VEL_X) {
        this.vel.x = Math.sign(this.vel.x)*MAX_VEL_X;
        this.accel.x = 0.0;
    }
    
    var delta_x = Physics.kinematics_delta(this.accel.x,this.vel.x,elapsed_time);
    this.body.x += delta_x;

    this.vel.y += Physics.velocity_delta(GRAVITY,elapsed_time);
    var delta_y = Physics.gravity_delta(GRAVITY,this.vel.y,elapsed_time);
    this.body.y += delta_y;

    // TODO remove this hack
    if (this.body.y >= 400) {
        this.body.y = 400;
        this.on_ground = true;
    } else {
        this.on_ground = false;
    }

}


Player.prototype.draw = function(context) {
    context.fillStyle = this.color;
    context.fillRect(
        this.body.x,this.body.y,
        this.body.w,this.body.h);
}




// player is here for player purposes




var WALK_ACCEL_START = 0.005,
    WALK_ACCEL_STOP = 0.0,
    JUMP_ACCEL = 0.05,
    JUMP_VEL = 0.5;

var MAX_VEL_X = 0.5,
    MAX_VEL_Y = 0.3;

var FRICTION = 0.8,
    GRAVITY = 0.02;


function Player(x,y,w,h) {
    this.body = new Rectangle(x,y,w,h);
    this.vel = new Vec2D(0,0);
    this.accel = new Vec2D(0,0);
    this.color = '#ff0000';
    this.on_ground = false;
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
    if (this.on_ground) {
        //this.accel.y = -JUMP_ACCEL;
        //this.on_ground = false;
        this.vel.y = JUMP_VEL;
        this.on_ground = false;
    } else {
        this.on_ground = 0;
    }
}


// TODO perhaps replace the 2D kinematics with 1D
//      more efficient, which is good to do
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


    //var y = Physics.gravity_delta(GRAVITY,this.vel.y,elapsed_time);
    //this.body.y += y;

    // TODO add gravity calculations to Physics class
    this.vel.y += GRAVITY*elapsed_time;
    var delta_y = this.vel.y*elapsed_time;
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




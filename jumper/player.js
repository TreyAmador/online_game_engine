// player is here for player purposes




function Surface() {
    this.on_ground = false;
    this.rebounded = true;
    this.on_left_wall = false;
    this.on_right_wall = false;
    this.on_ceiling = false;
    this.in_air = true;
};



var WALK_ACCEL_START = 0.005,
    WALK_ACCEL_STOP = 0.0,
    JUMP_VEL = 0.8
    JUMP_ACCEL_START = 0.002;

var MAX_VEL_X = 0.8;

var FRICTION = 0.8,
    WIND_RESISTANCE = 0.90,
    GRAVITY = 0.002;



function Player(x,y,w,h) {

    this.body = new Rectangle(x,y,w,h);
    this.vel = new Vec2D(0,0);
    this.accel = new Vec2D(0,0);
    this.color = '#ff0000';
    this.on_ground = false;
    this.rebound = true;

    this.surface = new Surface;

}


Player.prototype.move_by_offset = function(delta) {
    this.body.x += delta.x;
    this.body.y += delta.y;
}


Player.prototype.move_up = function() {
    this.accel.y = -WALK_ACCEL_START;
}


Player.prototype.move_down = function() {
    this.accel.y = WALK_ACCEL_START;
}


Player.prototype.move_left = function() {
    if (this.on_ground) {
        this.accel.x = -WALK_ACCEL_START;
    } else {
        this.accel.x = -JUMP_ACCEL_START;
    }
}


Player.prototype.move_right = function() {
    if (this.on_ground) {
        this.accel.x = WALK_ACCEL_START;
    } else {
        this.accel.x = JUMP_ACCEL_START;
    }
}


Player.prototype.stop_moving = function() {
    this.accel.x = 0;
}


Player.prototype.get_collision_rect = function() {
    return this.body;
}


Player.prototype.jump = function() {
    if (this.on_ground && this.rebound) {
        this.vel.y = -JUMP_VEL;
        this.on_ground = this.rebound = false;
    } else {
        this.on_ground = this.rebound = false;
    }
}



Player.prototype.recover_jump = function() {

    // TODO implement conditional which 'dampens' jump
    //      when the button is released
    if (this.on_ground) {
        this.rebound = true;
    }

}



Player.prototype.calculate_delta_x = function(elapsed_time) {

    this.vel.x += Physics.velocity_delta(this.accel.x,elapsed_time);

    if (this.on_ground) {
        this.vel.x = Physics.friction(FRICTION,this.vel.x);
    } else {
        this.vel.x = Physics.wind_resistance(WIND_RESISTANCE,this.vel.x);
    }
    
    if (Math.abs(this.vel.x) > MAX_VEL_X) {
        this.vel.x = Math.sign(this.vel.x)*MAX_VEL_X;
        this.accel.x = 0.0;
    }

    var delta_x = Physics.kinematics_delta(this.accel.x,this.vel.x,elapsed_time);

    return delta_x;

}


Player.prototype.calculate_delta_y = function(elapsed_time) {
    this.vel.y += Physics.velocity_delta(GRAVITY,elapsed_time);
    var delta_y = Physics.gravity_delta(GRAVITY,this.vel.y,elapsed_time);
    return delta_y;
}


Player.prototype.position_delta = function(elapsed_time) {
    return new Pos2D(
        this.calculate_delta_x(elapsed_time),
        this.calculate_delta_y(elapsed_time));
}


// TODO perhaps replace the 2D kinematics with 1D
//      more efficient, which is good to do
//
// TODO pass the revised delta here then update 
//      position passed here
//
Player.prototype.update = function(elapsed_time) {

    // prevents jumping while falling
    if (this.vel.y > 0.01) {
        this.on_ground = false;
    }

    // this is a bit of a hack
    // remove ???
    if (this.body.y > 800) {
        this.body.x = 300;
        this.body.y = -200;
        this.vel.y = 0;
        this.vel.x = 0;
        this.on_ground = false;
    }

}


Player.prototype.draw = function(context) {
    context.fillStyle = this.color;
    context.fillRect(
        this.body.x,this.body.y,
        this.body.w,this.body.h);
}



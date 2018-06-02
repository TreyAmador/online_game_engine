// player is here for player purposes


function Surface() {
    
    this.on_ground = false;
    this.ground_rebound = true;

    this.on_left_wall = false;
    this.left_wall_rebound = true;
    
    this.on_right_wall = false;
    this.right_wall_rebound = true;

    this.on_ceiling = false;
    this.in_air = true;

};



var WALK_ACCEL_START = 0.005,
    WALK_ACCEL_STOP = 0.0,
    JUMP_VEL = 0.8,
    JUMP_DAMPEN = 0.3,
    WALL_JUMP_VEL = 0.5,
    JUMP_ACCEL_START = 0.002;

var MAX_VEL_X = 0.8,
    MAX_VEL_Y = 1.5;

var FRICTION = 0.8,
    WIND_RESISTANCE = 0.90,
    GRAVITY = 0.002;

var NUMBER_PARTICLES = 50;



function Player(x,y,w,h) {
    this.body = new Rectangle(x,y,w,h);
    this.vel = new Vec2D(0,0);
    this.accel = new Vec2D(0,0);
    this.color = '#ff0000';
    this.surface = new Surface;


    //this.kaleidoscope = false;
    //this.init_particle(NUMBER_PARTICLES);

}


Player.prototype.init_frame = function() {
    this.surface.on_ground = 
        this.surface.on_left_wall = 
        this.surface.on_right_wall = false;
}


Player.prototype.init_particle = function(ptcs) {

    this.particle = new Kaleidoscope(
        this.body.x,this.body.y,
        this.body.w,this.body.h);
    this.particle.set_num_particles(ptcs);

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
    if (this.surface.on_ground) {
        this.accel.x = -WALK_ACCEL_START;
    } else {
        this.accel.x = -JUMP_ACCEL_START;
    }
}


Player.prototype.move_right = function() {
    if (this.surface.on_ground) {
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

    if (this.surface.on_ground && this.surface.ground_rebound) {
        this.initiate_jump(this.vel.x,-JUMP_VEL);
    } else {
        if (this.surface.on_left_wall && this.surface.left_wall_rebound) {
            this.initiate_jump(WALL_JUMP_VEL,-JUMP_VEL);
        }
        if (this.surface.on_right_wall && this.surface.right_wall_rebound) {
            this.initiate_jump(-WALL_JUMP_VEL,-JUMP_VEL);
        }
    }

}


Player.prototype.recover_jump = function() {

    // TODO implement conditional which 'dampens' jump
    //      when the button is released
    if (this.surface.on_ground) {
        this.surface.ground_rebound = true;
    }
    if (this.surface.on_left_wall) {
        this.surface.left_wall_rebound = true;
    }
    if (this.surface.on_right_wall) {
        this.surface.right_wall_rebound = true;
    }

    // dampens jump
    if (this.vel.y < -JUMP_DAMPEN && this.vel.y >= -JUMP_VEL) {
        this.vel.y = -JUMP_DAMPEN;
    }

}


Player.prototype.initiate_jump = function(vel_x,vel_y) {

    this.vel.x = vel_x;
    this.vel.y = vel_y;

    this.surface.on_ground = 
        this.surface.ground_rebound = 
        this.surface.on_left_wall = 
        this.surface.left_wall_rebound = 
        this.surface.on_right_wall = 
        this.surface.right_wall_rebound = false;

}


Player.prototype.calculate_delta_x = function(elapsed_time) {

    this.vel.x += Physics.velocity_delta(this.accel.x,elapsed_time);

    if (this.surface.on_ground) {
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


Player.prototype.get_pos = function() {
    return new Pos2D(this.body.x,this.body.y);
}


// TODO perhaps replace the 2D kinematics with 1D
//      more efficient, which is good to do
// TODO pass the revised delta here then update 
//      position passed here
Player.prototype.update = function(elapsed_time) {

    this.init_frame();

    // this is a bit of a hack
    if (this.body.y > 800) {
        this.body.x = 320;
        this.body.y = -40;
        this.vel.y = 0;
        this.vel.x = 0;
        this.surface.on_ground = false;
    }

    if (this.vel.y > MAX_VEL_Y) {
        this.vel.y = MAX_VEL_Y;
        this.accel.y = 0;
    }

    // particle update
    //this.particle.update(elapsed_time);

}


Player.prototype.draw = function(context,x,y) {

    context.fillStyle = this.color;
    context.fillRect(x,y,
        this.body.w,this.body.h);

    // particle draw    
    //this.particle.draw(context);

}



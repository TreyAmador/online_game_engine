// the player class


class Player {
    constructor(w,h,x,y,sprite) {
        this.width = w;
        this.height = h;
        this.x = x;
        this.y = y;
        this.sprite = sprite;
        this.vel_x = 0.0;
        this.vel_y = 0.0;
        this.accel_x = 0.0;
        this.accel_y = 0.0;
        this.on_ground = false;
    }
    move_left() {
        //this.x -= 1;
        this.accel_x = -WALK_ACCEL;
    }
    move_right() {
        //this.x += 1;
        this.accel_x = WALK_ACCEL;
    }
    stop_moving() {
        this.accel_x = 0.0;
    }
    jump() {
        this.vel_y = -JUMP_VEL;
    }
    update() {
        var ctx = GameCore.context;
        ctx.fillStyle = this.sprite;
        ctx.fillRect(
            this.x,this.y,
            this.width,this.height);
        if (input.is_key_held(KEY.LEFT) && 
            input.is_key_held(KEY.RIGHT))
            this.stop_moving();
        else if (input.is_key_held(KEY.LEFT))
            this.move_left();
        else if (input.is_key_held(KEY.RIGHT))
            this.move_right();
        else
            this.stop_moving();
        if (input.was_key_pressed(KEY.JUMP)) {
            if (this.on_ground) {
                this.jump();
                this.on_ground = false;
            }
        }
        this.vel_x += this.accel_x*FRAME_TIME;
        if (Math.abs(this.vel_x) > MAX_VEL_X)
            this.vel_x = Math.sign(this.vel_x)*MAX_VEL_X;
        this.x += this.vel_x*FRAME_TIME;
        this.vel_x *= FRICTION;
        this.vel_y += GRAVITY*FRAME_TIME;
        this.y += this.vel_y*FRAME_TIME;
        
        /*
        // fix this hack!
        if (this.y > 200) {
            this.y = 200;
            this.vel_y = 0;
            this.on_ground = true;
        }
        */
        
    }
}

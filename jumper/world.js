// the world class, an imaginary wonder-world


function World() {
    this.platforms = [];
}


World.prototype.create_platforms = function(platforms) {

    // TODO make this more functional/modular
    //this.platforms.push(new Platform(150,300,50,50));
    //this.platforms.push(new Platform(500,300,50,50));
    this.platforms.push(new Platform(0,400,800,50));

}


// TODO perhaps determine which collisions to test  
//      first based if on ground or on wall
//          if on ground, test x then y
//          if on wall, test y then x


// TODO pass in player so vars for on_ground and vel.y can be set...
World.prototype.detect_collision = function(body,delta) {

    var len = this.platforms.length;
    for (var i = 0; i < len; ++i) {
        var platform = this.platforms[i].get_collision_rect();

        if (delta.x >= 0) {
            delta.x = this.collision_right(platform,body,delta.x);
            delta.x = this.collision_left(platform,body,delta.x);
        } else {
            delta.x = this.collision_left(platform,body,delta.x);
            delta.x = this.collision_right(platform,body,delta.x);
        }
        if (delta.y >= 0) {
            delta.y = this.collision_below(platform,body,delta.y);
            delta.y = this.collision_above(platform,body,delta.y);
        } else {
            delta.y = this.collision_above(platform,body,delta.y);
            delta.y = this.collision_below(platform,body,delta.y);
        }
        
    }

    return delta;

}


// collisions below successfully implemented!
World.prototype.collision_below = function(rect,player,delta_y) {

    var body = player.body;
    if ((body.y+body.h+delta_y > rect.y) &&
        (body.y+delta_y < rect.y+rect.h) &&
        (body.x+body.w > rect.x) &&
        (body.x < rect.x+rect.w))
    {
        delta_y = rect.y - (body.y + body.h);
        player.vel.y = 0;
        player.accel.y = 0;
        player.on_ground = true;
    }
    
    return delta_y;

}


World.prototype.collision_above = function(rect,player,delta_y) {

    var body = player.body;
    if ((body.y+delta_y < rect.y+rect.h) &&
        (body.y+body.h+delta_y > rect.y) && 
        (body.x+body.w > rect.x) &&
        (body.x < rect.x+rect.w)) 
    {
        delta_y = (rect.y+rect.h) - body.y;
        player.vel.y = 0;
        player.accel.y = 0;
        player.on_ground = false;
    }
    
    return delta_y;

}


World.prototype.collision_right = function(rect,player,delta_x) {

    var body = player.body;
    if ((body.x+body.w+delta_x > rect.x) &&
        (body.x+delta_x < rect.x) &&
        (body.y < rect.y+rect.h) &&
        (body.y+body.h > rect.y))
    {
        delta_x = rect.x-(body.x+body.w);
        //player.vel.x = 0;
        //player.accel.x = 0;
    }

    return delta_x;

}


World.prototype.collision_left = function(rect,player,delta_x) {

    var body = player.body;
    if ((body.x+delta_x < rect.x+rect.w) &&
        (body.x+body.w+delta_x > rect.x+rect.w) &&
        (body.y < rect.y+rect.h) &&
        (body.y+body.h > rect.y)) 
    {
        delta_x = (rect.x+rect.w)-(body.x);
        //player.vel.x = 0;
        //player.accel.x = 0;
    }

    return delta_x;

}


World.prototype.update = function(player,elapsed_time) {

    for (var i = 0; i < this.platforms.length; ++i){
        this.platforms[i].update(elapsed_time);
    }

    var delta = player.position_delta(elapsed_time);
    delta = this.detect_collision(player,delta);
    player.move_by_offset(delta);

}


World.prototype.draw = function(context) {
    for (var i = 0; i < this.platforms.length; ++i) {
        this.platforms[i].draw(context);
    }
}







function World() {
    this.platforms = [];
}


World.prototype.create_platforms = function(platforms) {

    // TODO make this more functional/modular
    this.platforms.push(new Platform(500,400,50,50));
    this.platforms.push(new Platform(200,400,50,50));
    this.platforms.push(new Platform(300,400,100,50));

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
            this.collision_right(platform,delta.x);
            this.collision_left(platform,delta.x);
        } else {
            this.collision_left(platform,delta.x);
            this.collision_right(platform,delta.x);
        }
        if (delta.y >= 0) {
            this.collision_below(platform,body,delta.y);
            this.collision_above(platform,body,delta.y);
        } else {
            this.collision_above(platform,body,delta.y);
            this.collision_below(platform,body,delta.y);
        }
        
    }

}


// collisions below successfully implemented!
World.prototype.collision_below = function(rect,body,delta_y) {

    // THIS WORKS!!!!
    if ((body.y+body.h+delta_y > rect.y) && 
        (body.y+delta_y < rect.y+rect.h) &&
        (body.x+body.w > rect.x) && 
        (body.x < rect.x+rect.w)) 
    {
        delta_y = rect.y - (body.y+body.h);
    }
    body.y += delta_y;
}


World.prototype.collision_above = function(rect,body,delta_y) {





    return delta_y;
}


World.prototype.collision_right = function(rect,delta_x) {


    return delta_x;
}


World.prototype.collision_left = function(rect,delta_x) {


    return delta_x;
}


World.prototype.update = function(elapsed_time) {
    for (var i = 0; i < this.platforms.length; ++i){
        this.platforms[i].update(elapsed_time);
    }



}


World.prototype.draw = function(context) {
    for (var i = 0; i < this.platforms.length; ++i) {
        this.platforms[i].draw(context);
    }
}



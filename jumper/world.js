



function World() {
    this.platforms = [];
}


World.prototype.create_platforms = function(platforms) {

    // TODO make this more functional/modular
    this.platforms.push(new Platform(200,400,200,50));

}


// TODO perhaps determine which collisions to test  
//      first based if on ground or on wall
//          if on ground, test x then y
//          if on wall, test y then x
World.prototype.detect_collision = function(pos,delta) {

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
            delta.y = this.collision_below(platform,delta.y);
            delta.y = this.collision_above(platform,delta.y);
        } else {
            delta.y = this.collision_above(platform,delta.y);
            delta.y = this.collision_below(platform,delta.y);
        }
        
    }

}


World.prototype.collision_below = function(rect,delta_y) {


    


    return delta_y;
}


World.prototype.collision_above = function(rect,delta_y) {





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



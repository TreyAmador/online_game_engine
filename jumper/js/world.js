// the world class, an imaginary wonder-world



var FIRST_LEVEL = 'world-1',
    WORLD_WRAPPER_ID = 'worlds',
    LEVEL_PREFIX = 'world-';



// platform on which to jump
function Platform(x,y,w,h) {
    this.body = new Rectangle(x,y,w,h);
    this.color = '#000000';
}


Platform.prototype.get_collision_rect = function() {
    return this.body;
}


Platform.prototype.set_color = function(color) {
    this.color = color;
}


Platform.prototype.update = function(elapsed_time) {
    // TODO implement movement here
    //      have a velocity for the platform
    
}


Platform.prototype.draw = function(context) {
    context.fillStyle = this.color;
    context.fillRect(
        this.body.x,this.body.y,
        this.body.w,this.body.h);
}





function World() {
    this.platforms = [];
}


World.prototype.init = function() {
    this.set_level_html_invisible();
    this.current_level = document.getElementById(FIRST_LEVEL);
}


World.prototype.set_level_html_invisible = function() {
    var p_lvl = document.getElementById(WORLD_WRAPPER_ID).firstElementChild;
    while (p_lvl != null) {
        p_lvl.style.display = 'none';
        p_lvl = p_lvl.nextElementSibling;
    }
}


World.prototype.next_level = function() {
    if (this.current_level.nextElementSibling != null) {
        this.current_level = this.current_level.nextElementSibling;
    }
}


World.prototype.load_level = function() {
    this.platforms = [];
    var p_plt = this.current_level.firstElementChild;
    while (p_plt != null) {
        this.add_platform(p_plt);
        p_plt = p_plt.nextElementSibling;
    }
}


World.prototype.add_platform = function(node) {
    var coordinates = node.innerHTML.split(',')
        .map(function(x) {
            return parseInt(x);
        });
    this.platforms.push(new Platform(
        coordinates[0],coordinates[1],
        coordinates[2],coordinates[3]
    ));
}


// TODO perhaps determine which collisions to test
//      first based if on ground or on wall
//          if on ground, test x then y
//          if on wall, test y then x
//
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
        player.surface.on_ground = true;
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
        player.surface.on_ground = false;
        player.surface.on_left_wall = false;
        player.surface.on_right_wall = false;
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
        player.surface.on_right_wall = true;
        player.vel.x = 0;
        player.accel.x = 0;
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
        player.surface.on_left_wall = true;
        player.vel.x = 0;
        player.accel.x = 0;
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



// a camera class



function Camera(x,y,w,h) {
    this.view = new Rectangle(x,y,w,h);
    this.centered = true;
}


Camera.prototype.center_camera = function(elapsed_time,player) {

    var plyr_x = player.body.x + player.body.w/2;
    var plyr_y = player.body.y + player.body.h/2;
    
    var camera_x = plyr_x - this.view.w/2;
    var camera_y = plyr_y - this.view.h/2;

    this.view.x = camera_x;
    this.view.y = camera_y;

}


Camera.prototype.update = function(elapsed_time,player) {

    if (this.centered) {
        
        this.center_camera(elapsed_time,player);
    }

}


Camera.prototype.capture = function(context,body) {

    // call the draw function from here calculate the offset
    // ex. body.x - view.x and body.y - view.y
    var pos = body.get_pos();
    var x = this.view.x + pos.x;
    var y = this.view.y + pos.y;

    body.draw(context,x,y);

}


Camera.prototype.capture_world = function(context,world) {
    var platforms = world.get_platforms();
    var len = platforms.length;
    for (var i = 0; i < len; ++i) {
        var pos = platforms[i].get_pos();
        var x = this.view.x + pos.x;
        var y = this.view.y + pos.y;
        platforms[i].draw(context,x,y);
    }
}



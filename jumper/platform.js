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



// platform on which to jump


function Platform(x,y,w,h) {
    this.body = new Rectangle(x,y,w,h);
    this.color = '#000000';
}


Platform.prototype.set_color = function(color) {
    this.color = color;
}


Platform.prototype.update = function(elapsed_time) {

}


Platform.prototype.draw = function(context) {

}



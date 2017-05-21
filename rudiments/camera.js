// a camera class which puts everything to the screen


function Camera(x,y,w,h) {

    // is there any real need for an x and y?
    this.x = x;
    this.y = y;

    this.canvas = document.createElement('canvas');
    this.canvas.width = w;
    this.canvas.height = h;
    this.context = this.canvas.getContext('2d');
    document.body.appendChild(this.canvas);

}


Camera.prototype.capture = function(body,x,y) {
    // calculate offset here
    body.sprite.draw(this.context,x,y);
}


Camera.prototype.recalibrate = function() {
    this.context.clearRect(this.x,this.y,
        this.canvas.width,this.canvas.height);
}


Camera.prototype.adjust = function() {

}



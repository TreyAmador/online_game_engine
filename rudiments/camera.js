// a camera class which puts everything to the screen



function Camera(x,y,w,h) {

    // is there any real need for an x and y?
    this.x = x;
    this.y = y;

    this.canvas = document.createElement('canvas');
    this.canvas.width = w;
    this.canvas.height = h;
    this.context = this.canvas.getContext('2d');
    
    var game_port = document.getElementById('game-port');
    game_port.textContent = '';
    game_port.appendChild(this.canvas);

}


Camera.prototype.capture = function(body) {


    // it would be better to do something like this
    // return current body sprite

    //var rect = body.sprite.area();
    //this.context.drawImage(body.sprite.img,
    //    rect.x,rect.y,rect.w,rect.h,
    //    body.x,body.y,rect.w,rect.h);


    // calculate offset of objects here
    body.draw(this.context,body.x,body.y);

}


Camera.prototype.recalibrate = function() {
    this.context.clearRect(this.x,this.y,
        this.canvas.width,this.canvas.height);
}


Camera.prototype.adjust_offset = function() {

}



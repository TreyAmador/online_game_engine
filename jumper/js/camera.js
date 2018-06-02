// a camera class


function Camera(x,y,w,h) {
    this.view = new Rectangle(x,y,w,h);
    this.offset = new Vec2D(0,0);
    this.centered = true;
}


Camera.prototype.init_frame = function(subject) {
    this.calc_offset(subject.body)
}


Camera.prototype.calc_offset = function(body) {
    this.view.x = (body.x + body.w / 2) - this.view.w / 2;
    this.view.y = (body.y + body.h / 2) - this.view.h / 2;
}


Camera.prototype.update = function(elapsed_time,delta) {
    this.offset.x = 0;
    this.offset.y = 0;
    this.offset.x = delta.x;
    this.offset.y = delta.y;
}


Camera.prototype.capture = function(context,subject) {
    var x = subject.body.x - this.view.x;
    var y = subject.body.y - this.view.y;
    subject.draw(context,x,y);
}


Camera.prototype.capture_list = function(context, list) {
    var elems = list.get_elems();
    var len = elems.length;
    for (var i = 0; i < len; ++i)
        this.capture(context, elems[i]);
}



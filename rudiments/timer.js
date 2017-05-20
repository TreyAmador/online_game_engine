// set the rate of some occurence



function Timer(rate) {
    this.time = new Date();
    this.set_frame_update(rate);
    this.prev = 0;
    this.span = 0;
}


Timer.prototype.frames_elapsed = function() {
    return ++this.span >= this.rate ? !(this.span = 0) : false;
}


Timer.prototype.set_frame_update = function(rate) {
    this.rate = rate;
}



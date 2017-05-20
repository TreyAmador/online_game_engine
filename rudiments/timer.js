// set the rate of some occurence



function Timer(rate) {
    this.time = new Date();
    this.rate = rate;
    this.prev = 0;
    this.span = 0;
}


//Timer.prototype.current = function() {
//    return this.time.getTime();
//}


//Timer.prototype.init = function() {
//    this.prev = this.time.getTime();
//}


//Timer.prototype.end = function() {
//    var delta = this.time.getTime() - this.prev;
//    return delta;
//}


Timer.prototype.initialize = function() {
    this.prev = this.time.getTime();
    this.span = 0;
}


//Timer.prototype.init_span = function() {
//    this.span = 0;
//}


Timer.prototype.interval = function() {
    var curr = this.time.getTime();
    var delta = curr - this.prev;
    this.prev = curr;
    return delta;
}


Timer.prototype.frames_elapsed = function() {
    return 
        ++this.span >= this.rate ? 
        !(this.span = 0) : false;
}


Timer.prototype.set_rate = function(rate) {
    this.rate = rate;
}



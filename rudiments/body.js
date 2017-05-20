// body superclass


function Body(x,y) {
    this.x = x;
    this.y = y;
}


Body.prototype.move = function(delta_x,delta_y) {
    this.x += delta_x;
    this.y += delta_y;
}


Body.prototype.print = function() {
    console.log('(',this.x,'x',this.y,')');
}


Square.prototype = new Body();
Square.prototype.constructor = Body;


function Square(x,y,s) {
    Body.call(this,x,y);
    this.s = s;
}


Square.prototype.dimensions = function() {
    console.log(this.x,this.y);
}


Square.prototype.print = function() {
    Body.prototype.print.call(this);
}


var sqr = new Square(2,3,7);
sqr.print();




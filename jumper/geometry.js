// simple geometries for game!



function Pos2D(x,y) {
    this.x = x;
    this.y = y;
}


function Vec2D(x,y) {
    this.x = x;
    this.y = y;
}


Vec2D.prototype.magnitude = function() {
    return Math.sqrt(
        this.x * this.x +
        this.y * this.y);
}


Vec2D.prototype.normalize = function(factor) {
    var magnitude = this.magnitude();
    factor /= magnitude;
    this.x *= factor;
    this.y *= factor;
}


// TODO test this the radians and degrees functions
Vec2D.prototype.radians = function() {
    return Math.atan2(this.y/this.x);
}


Vec2D.prototype.degrees = function() {
    return Math.atan(this.y/this.x);
}



function Rectangle(x,y,w,h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
}


function Circle(x,y,r) {
    this.x = x;
    this.y = y;
    this.r = r;
}



// TODO add more physics!
var Physics = {

    
    velocity_delta: function(a,t) {
        return a*t;
    },


    // pass accel and vel vector to get vel
    velocity_delta_2d: function(a,v,t) {
        v.x += (a.x * t);
        v.y += (a.y * t);
        return v;
    },


    kinematics: function(a,v,x,t) {
        return (a/2)*t*t + v*t + x;
    },


    kinematics_2d: function(a,v,p,t) {
        p.x = a.x/2*t*t + v.x*t + p.x;
        p.y = a.y/2*t*t + v.y*t + p.y;
    },


    kinematics_delta: function(a,v,t) {
        return (a/2)*t*t + v*t;
    },


    kinematics_delta_2d: function(a,v,t) {
        var delta = new Pos2D(
            a.x/2*t*t + v.x*t,
            a.y/2*t*t + v.y*t);
        return delta;
    },


    friction: function(f,v) {
        return f*v;
    },


    friction_2d: function(f,v) {
        v.x *= f;
        v.y *= f;
        return v;
    },


    gravity_delta: function(g,v,t) {
        return (g/2)*t*t + v*t;
    },


};


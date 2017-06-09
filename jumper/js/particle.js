// a particle engine for particles
// like superpower
// fountains
// sparkley sparkles



function KaleidoscopeParticle(x,y,w,h,) {
    this.particle = new Rectangle(x,y,w,h);
    this.vel = new Vec2D(0,0);
    this.color = '#ff0000';
    this.transparency = 1;
}


KaleidoscopeParticle.prototype.set_color = function(color) {
    this.color = color;
}


KaleidoscopeParticle.prototype.set_transparency = function(transparency) {
    this.transparency = transparency;
}


KaleidoscopeParticle.prototype.set_velocity = function(x,y) {
    this.vel.x = x;
    this.vel.y = y;
}


KaleidoscopeParticle.prototype.update = function(elapsed_time) {
    this.particle.x += this.vel.x * elapsed_time;
    this.particle.y += this.vel.y * elapsed_time;
}


KaleidoscopeParticle.prototype.draw = function(context) {
    context.fillStyle = '#ff00ff';
    context.fillRect(
        this.particle.x,this.particle.y,
        this.particle.w,this.particle.h);
}




function Kaleidoscope(x,y,w,h) {
    this.particles = [];
    this.centroid = new Rectangle(x,y,w,h);
    this.num = 0;
}


Kaleidoscope.prototype.set_num_particles = function(num) {
    this.num = num;
}


Kaleidoscope.prototype.pos_on_player = function(player) {
    this.centroid.x = player.body.x;
    this.centroid.y = player.body.y;
    this.centroid.w = player.body.w;
    this.centroid.h = player.body.h;
}


Kaleidoscope.prototype.update = function(elapsed_time) {

    if (this.particles.length < this.num) {
        var kaleidoscope_particle = new KaleidoscopeParticle(
            this.centroid.x,this.centroid.y,
            this.centroid.w,this.centroid.h);
        kaleidoscope_particle.set_velocity(
            Math.random()-0.5,
            Math.random()-0.5);
        this.particles.push(kaleidoscope_particle);
    }

    for (var i = 0; i < this.particles.length; ++i) {
        this.particles[i].update(elapsed_time);
    }

}


Kaleidoscope.prototype.draw = function(context) {

    for (var i = 0; i < this.particles.length; ++i) {
        this.particles[i].draw(context);
    }

}



function ParticleEngine() {

    this.particle_stream = [];

}


ParticleEngine.prototype.init = function() {



}


ParticleEngine.prototype.create_kaleidoscope = function() {

    this.kaleidoscope = [];
    

}




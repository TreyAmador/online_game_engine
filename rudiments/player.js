// the player class



// TODO add sprite to body
// TODO add width and height to body
//      bodies have physical properties... 
// TODO physics calculations handled in Body offspring



// there should be a sprite drawn here
var Body = {
    
    sprites: {},
    state:0,
    in_motion:false,

    add_coord_sprite: function(filepath,frames,w,h,state) {
        this.sprites[state] = new Sprite();
        this.sprites[state].init_img(filepath,MediaManager);
        this.sprites[state].init_coord_frames(frames,w,h);
    },

    add_row_sprite: function() {
        
    },
    
    set_state: function(state) {
        this.state = state;
    },
    
    set_spatiality: function(x,y,w,h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    },

    set_pos: function(x,y) {
        this.x = x;
        this.y = y;
    },

    set_dimension: function(w,h) {
        this.w = w;
        this.h = h;
    },

    set_velocity: function(vx,vy) {
        this.vx = vx;
        this.vy = vy;
    },

    set_acceleration: function(ax,ay) {
        this.ax = ax;
        this.ay = ay;
    },

};


var Quadrangle = {

    apply_physics: function(physics,elapsed_time) {
        console.log('inside the physics class');
    }

};


// pass args through ctor
Player.prototype.inherit_from = function(BaseBody) {
    for (var i in Body)
        BaseBody[i] = Body[i];
    for (var i in BaseBody)
        this[i] = BaseBody[i];
}




function Player(BaseBody) {
    this.inherit_from(BaseBody);

}








Player.prototype.draw = function(context,x,y) {
    this.sprites[this.state].draw(context,x,y);
}


Player.prototype.update = function(elapsed_time) {
    this.sprites[this.state].update(elapsed_time);
}



// the player class



// TODO add sprite to body
// TODO add width and height to body
//      bodies have physical properties... 
// TODO physics calculations handled in Body offspring



// there should be a sprite drawn here
var Body = {

    sprites: {},

    state:0,

    on_ground: false,

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


var RectSkeleton = {

    // add a rectangle struct to move offset automatically ?
    skeletons: {},

    // TODO pass skeleton offset for each frame
    // pass the offsets here
    init_skeleton_offset: function(left,right,top,bottom) {
        
        // TODO error check offset larger than body
        
        this.qx = this.x + left;
        this.qw = this.w - (left+right);
        this.qy = this.y + top;
        this.qh = this.h - (top+bottom);
    },

    init_skeleton_pos: function(x,y,w,h) {
        this.qx = x;
        this.qy = y;
        this.qw = w;
        this.qh = h;
    },

    add_skeleton_offset: function(left,right,top,bottom,state) {
        var len = this.sprites[state].frames.length;
        this.skeletons[state] = [];
        for (var i = 0; i < len; ++i) {
            this.skeletons[state].push(new Rectangle(
                this.x + left, this.y + top,
                this.w - (left+right), this.h - (top+bottom)));
        }
    },

    move_skeleton: function(x,y) {
        // TODO move the skeleton by an offset
    },

    apply_physics: function(physics,elapsed_time) {
        // TODO apply the physics calculations here
    },

    draw_skeleton: function(context) {
        //context.strokeStyle = '#ff0000';
        //context.strokeRect(this.qx,this.qy,this.qw,this.qh);


        // TODO skeleton more closely to sprite 


        context.strokeStyle = '#ff0000';
        var rect = this.skeletons[this.state][this.sprites[this.state].frame_no];
        context.strokeRect(rect.x,rect.y,rect.w,rect.h);
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
    this.in_motion = false;


}








Player.prototype.draw = function(context,x,y) {
    this.sprites[this.state].draw(context,x,y);
}


Player.prototype.update = function(elapsed_time) {
    this.sprites[this.state].update(elapsed_time);
}



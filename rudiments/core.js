// test core



var KEY = Object({
    UP:38,
    DOWN:40,
    RIGHT:39,
    LEFT:37,
    SPACE:32
});


var PLAYERSTATE = Object.freeze({
    RIGHT_RUN:0
});



const MSEC_PER_SEC = 1000;
const FRAME_PER_SEC = 15;   // this doesn't seem to work?
const MSEC_PER_FRAME = MSEC_PER_SEC / FRAME_PER_SEC;



function Core() {
    this.input = new Input();
    this.camera = new Camera(0,0,640,480);
}


Core.prototype.initialize = function() {

    this.player = new Player(Quadrangle);
    this.player.set_state(PLAYERSTATE.RIGHT_RUN);
    this.player.add_coord_sprite('img/ambig-right.png',[
        new Vec2D(4,0), new Vec2D(5,0),new Vec2D(6,0), new Vec2D(7,0),
        new Vec2D(0,1), new Vec2D(1,1),new Vec2D(2,1), new Vec2D(3,1)
        ],64,64,PLAYERSTATE.RIGHT_RUN);
    

    this.player.set_spatiality(128,256,64,64);


    var self = this;
    setInterval(function() {
        self.update(50);
        self.handle_input();
        self.draw();
    },MSEC_PER_FRAME);

}


Core.prototype.set_keys = function(action,exch) {
    
    var keys = Object.keys(exch);
    
}


Core.prototype.handle_input = function() {

    if (this.input.is_key_held(KEY.RIGHT) && this.input.is_key_held(KEY.LEFT)) {

    }
    else if (this.input.is_key_held(KEY.RIGHT)) {
        console.log('right');
    }
    else if (this.input.is_key_held(KEY.LEFT)){
        console.log('left');
    }
    else if (!this.input.is_key_held(KEY.RIGHT) && !this.input.is_key_held(KEY.LEFT)){

    }

    if (this.input.was_key_pressed(KEY.SPACE)){
        
    }

    this.input.begin_new_frame();

}


Core.prototype.update = function(elapsed_time) {
    this.player.update(elapsed_time);
}


Core.prototype.draw = function() {
    this.camera.recalibrate();
    this.camera.capture(this.player);
}


function run() {
    var core = new Core;
    core.initialize();
}



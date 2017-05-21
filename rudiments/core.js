// test core



var KEY = Object({
    UP:38,
    DOWN:40,
    RIGHT:39,
    LEFT:37,
    SPACE:32
});


var ACTION = Object({

});


const MSEC_PER_SEC = 1000;
const FRAME_PER_SEC = 15;   // this doesn't seem to work?
const MSEC_PER_FRAME = MSEC_PER_SEC / FRAME_PER_SEC;



// a camera class should have the context....

function Core() {

    this.canvas = document.createElement('canvas');
    this.canvas.width = 640;
    this.canvas.height = 480;
    this.context = this.canvas.getContext('2d');
    document.body.appendChild(this.canvas);

    this.input = new Input();

}


Core.prototype.initialize = function() {

    this.sprite = new Sprite();
    this.sprite.init_img('img/ambig-right.png',MediaManager);
    this.sprite.init_coord_frames([
        new Vec2D(4,0),
        new Vec2D(5,0),
        new Vec2D(6,0),
        new Vec2D(7,0),
        new Vec2D(0,1),
        new Vec2D(1,1),
        new Vec2D(2,1),
        new Vec2D(3,1)
    ],64,64);

    var self = this;
    setInterval(function() {
        self.update(50);
        self.clear();
        self.draw();
    },MSEC_PER_FRAME);

    //this.set_keys({
    //    'left':21,
    //    'right':22,
    //    'up':23,
    //    'down':24
    //});

    var player = new Player(Quadrangle);
    player.print();

}


Core.prototype.set_keys = function(action,exch) {
    
    var keys = Object.keys(exch);
    
}


Core.prototype.update = function(time) {

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

    this.sprite.update(time);

}


Core.prototype.draw = function() {
    this.sprite.draw(this.context,64,64);
}


Core.prototype.clear = function() {
    this.context.clearRect(
        0,0,this.canvas.width,this.canvas.height);
}



function run() {
    var core = new Core;
    core.initialize();
}



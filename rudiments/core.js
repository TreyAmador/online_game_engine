// test core



var KEY = Object.freeze({
    UP: 38,
    DOWN: 40,
    RIGHT: 39,
    LEFT: 37,
    JUMP: 32
});



const MSEC_PER_SEC = 1000;
const FRAME_PER_SEC = 15;   // this doesn't seem to work?
const MSEC_PER_FRAME = MSEC_PER_SEC / FRAME_PER_SEC;



function Core() {

    var self = this;

    this.canvas = document.createElement('canvas');
    this.canvas.width = 640;
    this.canvas.height = 480;
    this.context = this.canvas.getContext('2d');
    document.body.appendChild(this.canvas);


    // initialize input class
    this.input = new Input();
    this.input.init();


    this.initialize = function() {

        self.sprite_right = new Sprite();
        self.sprite_right.init_img('img/ambig-right.png',MediaManager);
        self.sprite_right.init_coord_frames([
                new Vec2D(4,0),
                new Vec2D(5,0),
                new Vec2D(6,0),
                new Vec2D(7,0),
                new Vec2D(0,1),
                new Vec2D(1,1),
                new Vec2D(2,1),
                new Vec2D(3,1)
            ],64,64);

        self.sprite_left = new Sprite();
        self.sprite_left.init_img('img/ambig-left.png',MediaManager);
        self.sprite_left.init_coord_frames([
                new Vec2D(3,0),
                new Vec2D(2,0),
                new Vec2D(1,0),
                new Vec2D(0,0),
                new Vec2D(7,1),
                new Vec2D(6,1),
                new Vec2D(5,1),
                new Vec2D(4,1)
            ],64,64);

        setInterval(function() {
            self.update(50);
            self.clear();
            self.draw();
        },MSEC_PER_FRAME);

    }

    this.update = function(time) {

        if (self.input.is_key_held(KEY.RIGHT) && self.input.is_key_held(KEY.LEFT)) {

        }
        else if (self.input.is_key_held(KEY.RIGHT)) {

        }
        else if (self.input.is_key_held(KEY.LEFT)){
            
        }
        else if (!self.input.is_key_held(KEY.RIGHT) && !self.input.is_key_held(KEY.LEFT)){

        }

        if (self.input.was_key_pressed(KEY.JUMP)){
            
        }

        self.input.begin_new_frame();

        self.sprite_right.update(time);
        self.sprite_left.update(time);
    }

    this.draw = function() {
        self.sprite_right.draw(self.context,64,64);
        self.sprite_left.draw(self.context,128,64);
    }

    this.clear = function(){
        self.context.clearRect(
            0,0,self.canvas.width,self.canvas.height);
    }

}


function run() {
    var core = new Core;
    core.clear();
    core.initialize();
}



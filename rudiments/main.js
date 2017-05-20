// test core


function Core() {

    var self = this;

    this.canvas = document.createElement('canvas');
    this.canvas.width = 640;
    this.canvas.height = 480;
    this.context = this.canvas.getContext('2d');
    document.body.appendChild(this.canvas);

    this.initialize = function() {
        
        self.sprite = new Sprite();
        self.sprite.init_img('img/ambig-right.png', MediaManager);

        self.sprite.init_coord_frames([
                new Vec2D(4,0),
                new Vec2D(5,0),
                new Vec2D(6,0),
                new Vec2D(7,0),
                new Vec2D(0,1),
                new Vec2D(1,1),
                new Vec2D(2,1),
                new Vec2D(3,1)
            ],64,64);

        //self.timer = new Timer(1);
        //self.timer.initialize();
        
        setInterval(function() {

            self.update(50);
            self.clear();
            self.draw();

            //if (self.timer.frames_elapsed()) {
            //    console.log('passed!')
            //} else {
            //    console.log('not passed....');
            //}

        },60);
    }

    this.update = function(time) {
        //if (self.timer.frames_elapsed())
            self.sprite.update(time);
    }

    this.draw = function() {
        self.sprite.draw(self.context,64,64);
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


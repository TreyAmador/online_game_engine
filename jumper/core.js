// a jumper platforming game
//
//
// TODO Big Ideas
//
//      implement game clock
//          while loop with frameanimation or similar fxn
//
//      make a jumper block
//
//      make platforms
//          they should move around
//          gravity flips based on timer
//
//
//


var MSEC_PER_SEC = 1000,
    FRAME_PER_SEC = 30;
var FRAME_RATE = MSEC_PER_SEC / FRAME_PER_SEC;


var CANVAS_WIDTH = 720,
    CANVAS_HEIGHT = 540;



function Core() {
    this.canvas = document.createElement('canvas');
    this.canvas.width = CANVAS_WIDTH;
    this.canvas.height = CANVAS_HEIGHT;
    this.canvas.style.backgroundColor = '#eeeeee';
    //this.canvas.style.border = '1px solid #000000';
    this.context = this.canvas.getContext('2d');

    Input.init();
}


Core.prototype.append_port = function() {
    var game_port = document.getElementById('game-port');
    game_port.textContent = '';
    game_port.appendChild(this.canvas);
}


// TODO add player, enemies, backgrounds, platforms, etc... here
Core.prototype.init_entities = function() {
    this.player = new Player(200,200,50,50);
}


Core.prototype.run = function() {
    var self = this;
    setInterval(function() {
        self.clear();
        self.handle_input();
        self.update();
        self.draw();
    },FRAME_RATE);
}


Core.prototype.handle_input = function() {

    if (Input.is_down(KEY.LEFT) && Input.is_down(KEY.RIGHT)) {
        this.player.stop_moving();
    } else if (Input.is_down(KEY.LEFT)) {
        this.player.move_left();
    } else if (Input.is_down(KEY.RIGHT)) {
        this.player.move_right();
    } else if (!Input.is_down(KEY.LEFT) && !Input.is_down(KEY.RIGHT)) {
        this.player.stop_moving();
    }

}


Core.prototype.update = function() {
    this.player.update(FRAME_RATE);
}


Core.prototype.draw = function() {
    this.player.draw(this.context);
}


Core.prototype.clear = function(context) {
    this.context.clearRect(0,0,
        this.canvas.width,this.canvas.height);
}


window.addEventListener('load',function() {
    var core = new Core();
    core.append_port();
    core.init_entities();
    core.run();
});



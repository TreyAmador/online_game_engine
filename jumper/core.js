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
    this.canvas.style.border = '1px solid #000000';
    this.context = this.canvas.getContext('2d');
}


Core.prototype.append_port = function() {
    var game_port = document.getElementById('game-port');
    game_port.textContent = '';
    game_port.appendChild(this.canvas);
}


// TODO add player, enemies, backgrounds, platforms, etc... here
Core.prototype.add_entities = function() {
    this.player = new Player(200,200,50,50);
}


Core.prototype.run = function() {
    var self = this;
    setInterval(function() {
        self.update(FRAME_RATE);
        self.draw(self.context);
    },FRAME_RATE);
}


Core.prototype.update = function(elapsed_time) {
    this.player.update(elapsed_time);
}


Core.prototype.draw = function(context) {
    this.player.draw(context);
}



window.addEventListener('load',function() {
    var core = new Core();
    core.append_port();
    core.add_entities();
    core.run();
});



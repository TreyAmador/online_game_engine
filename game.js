/*
    Game engine in javascript
*/


var STATE = Object.freeze({
    PLAY: 1,
    PAUSE: 2,
    QUIT: 3
});


var KEY = Object.freeze({
    UP: 38,
    DOWN: 40,
    RIGHT: 39,
    LEFT: 37
});


function Player(x,y) {
    this.x = x;
    this.y = y;
    this.controller = $(document).keydown(function(e){
        if (e.keyCode == KEY.UP) {
            console.log('up');
        }
        if (e.keyCode == KEY.DOWN) {
            console.log('down');
        }
        if (e.keyCode == KEY.RIGHT) {
            console.log('right');
        }
        if (e.keyCode == KEY.LEFT) {
            console.log('left');
        }
    });
}

/*
Player.controller = $(document).keydown(function(e){
    if (e.keyCode == KEY.UP) {
        console.log('up');
    }
    if (e.keyCode == KEY.DOWN) {
        console.log('down');
    }
    if (e.keyCode == KEY.RIGHT) {
        console.log('right');
    }
    if (e.keyCode == KEY.LEFT) {
        console.log('left');
    }
});
*/


(function(){
    var player = new Player(0,0);
})


/*

function Player(x,y) {
    this.pos_x = x;
    this.pos_y = y;

    this.move_up = function () {
        console.log('up');
    }
    this.move_down = function() {
        console.log('down');
    }
    this.move_left = function() {
        console.log('left');
    }
    this.move_right = function() {
        console.log('right');
    }

    this.controller = $(document).keydown(function(e){
        if (e.keyCode == KEY.UP) {
            this.move_up();
        }
        if (e.keyCode == KEY.DOWN) {
            this.move_down();
        }
        if (e.keyCode == KEY.RIGHT) {
            this.move_right();
        }
        if (e.keyCode == KEY.LEFT) {
            this.move_left();
        }
    });
    
}


(function(){
    var player = new Player(0,0);
})();

*/



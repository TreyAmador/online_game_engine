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


class Player {
    constructor(x,y) {
        this.x = x;
        this.y = y;
    }
    move_up(delta) {
        this.y -= delta;
    }
    move_down(delta) {
        this.y += delta;
    }
    move_left(delta) {
        this.x -= delta;
    }
    move_right(delta) {
        this.x += delta;
    }
    coordinates() {
        console.log(this.x+' '+this.y);
    }
    controller(e) {
        if (e.keyCode == KEY.UP)
            player.move_up(1);
        if (e.keyCode == KEY.DOWN)
            player.move_down(1);
        if (e.keyCode == KEY.RIGHT)
            player.move_right(1);
        if (e.keyCode == KEY.LEFT)
            player.move_left(1);
        player.coordinates();
    }
}


function begin() {
    return new Player(0,0);
}
var player = begin();


$(document).keydown(function(e){
    player.controller(e);
});




var KEY = Object.freeze({
    UP:38,
    DOWN:40,
    LEFT:37,
    RIGHT:39
});


var Input = {

    pressed:{},

    is_down: function(keyCode) {
        return this.pressed[keyCode];
    },

    on_key_down: function(event) {
        this.pressed[event.keyCode] = true;
    },

    on_key_up: function(event) {
        delete this.pressed[event.keyCode];
    },

    init: function() {
        window.addEventListener('keyup',function(event) {
            Input.on_key_up(event);
        });
        window.addEventListener('keydown',function(event) {
            Input.on_key_down(event);
        });
    }

};



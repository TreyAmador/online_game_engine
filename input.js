

class Input {
    constructor() {
        this.held_keys = [];
        this.pressed_keys = [];
        this.released_keys = [];
    }
    begin_new_frame() {
        this.pressed_keys = [];
        this.released_keys = [];
    }
    key_down_event(evnt) {
        this.pressed_keys[evnt.keyCode] = true;
        this.held_keys[evnt.keyCode] = true;
    }
    key_up_event(evnt) {
        this.released_keys[evnt.keyCode] = true;
        this.held_keys[evnt.keyCode] = false;
    }
    was_key_pressed(key) {
        return this.pressed_keys[key];
    }
    was_key_released(key) {
        return this.released_keys[key];
    }
    is_key_held(key) {
        return this.held_keys[key];
    }
}



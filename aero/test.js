// this is a testing sheet
// used to test objects
// and units


function run_map() {

    document.addEventListener('load',function(event) {
        var files = event.target.files;
        for (var i = 0, f; f = files[i]; ++i) {
            var reader = new FileReader();
            reader.onload = function(evnt) {
                var contents = evnt.target.result;
                var lines = contents.split('\n');
                console.log(contents);
            };
            reader.readAsText(f);
        }
    });

}



function uploader() {
    var preview = document.querySelector('img');
    var file = document.querySelector('input[type=file]').files[0];
    var reader = new FileReader();

    reader.addEventListener('load',function() {
        preview.src = reader.result;
    },false);

    if (file) {
        reader.readAsDataURL(file);
    }
}



var Body = {

    init_vectors: function(x,y) {
        this.pos = new Pos2D(x,y);
        this.vel = new Vec2D(0,0);
        this.accel = new Vec2D(0,0);
    },

    init_pos: function(x,y) {
        this.pos = new Pos2D(x,y);
    },

    init_vel: function() {
        this.vel = new Vec2D(0,0);
    },

    init_accel: function() {
        this.accel = new Vec2D(0,0);
    },

    set_pos: function(pos) {
        this.pos.x = pos.x;
        this.pos.y = pos.y;
    },

    set_state: function(state) {
        this.state = state;
    },

    add_sprite: function(filepath,state,x,y,w,h) {
        this.sprites[state] = new Sprite(x,y,w,h);
        this.sprites[state].init(filepath,MediaManager);
    },

};



var ASTEROID_STATE = Object.freeze({
    ROLL: 0
});



// TODO write asteroid class with various sprites
//      and various 'skeleton configs'
//      create a frame class which holds both sprite and skeleton
//      then refactor to understand new body and circle class


var RectBody = {


    init_collision: function(x,y,w,h) {
        this.collision = new Rectangle(
            this.pos.x+x,this.pos.y+y,w,h);
    },


    init_collision_offset: function(left,right,top,bottom) {
        // TODO implement this function (?)
    },


    move_body: function(offset) {
        this.pos.x += offset.x;
        this.pos.y += offset.y;
        this.collision.x += offset.x;
        this.collision.y += offset.y;
    },


    draw_collision: function(context,color) {

        context.strokeStyle = color;
        context.strokeRect(
            this.collision.x,
            this.collision.y,
            this.collision.w,
            this.collision.h);

    },

};



var MultiRectBody = {

    add_collision: function(x,y,w,h) {        
        this.collisions.push(new Rectangle(
            this.pos.x+x,this.pos.y+y,w,h));
    },

    move_body: function(offset) {

        this.pos.x += offset.x;
        this.pos.y += offset.y;
        var len = this.collisions.length;
        for (var i = 0; i < len; ++i) {
            this.collisions[i].x += offset.x;
            this.collisions[i].y += offset.y;
        }

    },

    draw_collision: function(context,color) {

        context.strokeStyle = color;
        var len = this.collisions.length;
        for (var i = 0; i < len; ++i) {
            context.strokeRect(
                this.collisions[i].x,
                this.collisions[i].y,
                this.collisions[i].w,
                this.collisions[i].h);
        }

    },

};



// TODO add a timer to entire entity
//      such as player or enemy
function Sprite() {
    this.frames = [];
    this.frame_no = 0;
}


// TODO allow user to add a single sprite 
//      animation from multiple filepaths
Sprite.prototype.init = function(filepath,manager) {
    this.img = manager.load(filepath);
}


Sprite.prototype.single_frame_rect = function(frame) {
    this.frames.push(frame);
}


Sprite.prototype.clear = function() {
    this.frames = [];
    this.frame_no = 0;
}


// this must be updated to be more versatile
Sprite.prototype.update = function(elapsed_time) {
    //this.frame_no = ++this.frame_no % this.frames.length;
}


Sprite.prototype.draw = function(context,frame_no,x,y) {
    var rect = this.frames[frame_no];
    context.drawImage(this.img,
        rect.x,rect.y,rect.w,rect.h,
        x,y,rect.w,rect.h);
}



function Anatomy() {
    this.sprites = new Sprite();
    this.collisions = [];
    this.frame_no = 0;
}


Anatomy.prototype.init = function(filepath,manager) {
    this.sprites.init(filepath,manager);
}


// TODO check index of collisions to ensure it not out of index
Anatomy.prototype.add_frames_rect = function(frames,collisions) {
    var len = frames.length;
    for (var i = 0; i < len; ++i) {
        this.sprites.single_frame_rect(frames[i]);
        this.collisions.push(collisions[i]);
    }
}


// probably not necessary now
Anatomy.prototype.rectify_collision = function(collisions,pos) {
    var len = collisions.length;
    for (var i = 0; i < len; ++i) {
        collisions[i].x += pos.x;
        collisions[i].y += pos.y;
    }
}


// REMEMBER! collision rects are offsets from sprite
// this will also be the case with physics calculations
// TODO make collision rects absolute in world space (?)
Anatomy.prototype.detect_collisions = function(pos) {
    var clsn_rect = this.collisions[this.frame_no];
    console.log(clsn_rect.x+pos.x,clsn_rect.y+pos.y);
}


Anatomy.prototype.get_collision_frame = function(pos) {
    var rect = this.collisions[this.frame_no];
    var clsn = new Rectangle(
        rect.x+pos.x,rect.y+pos.y,
        rect.w,rect.h);
    return clsn;
}


// TODO reviese this to be less error prone
//      use something other than this.collisions.lenght;
Anatomy.prototype.update = function(elapsed_time) {
    this.frame_no = ++this.frame_no % this.collisions.length;
    this.sprites.update(elapsed_time);
}


Anatomy.prototype.draw = function(context,x,y) {
    this.sprites.draw(context,this.frame_no,x,y);
}


Anatomy.prototype.draw_collision = function(context,pos) {
    var col = this.collisions[this.frame_no];
    context.strokeStyle = '#ffffff';
    context.strokeRect(col.x+pos.x,col.y+pos.y,col.w,col.h);
}



var ASTR = Object.freeze({
    FLY: 0,
});



function Asteroid(x,y) {

    this.anatomy = {};
    this.state = ASTR.FLY;
    this.pos = new Pos2D(x,y);

}


Asteroid.prototype.set_pos = function(x,y) {
    this.pos.x = x;
    this.pos.y = y;
}


Asteroid.prototype.add_frame = function(filepath,state,sprites,collisions) {

    var anatomy = new Anatomy();
    anatomy.init(filepath,MediaManager);
    anatomy.add_frames_rect(sprites,collisions);
    this.anatomy[state] = anatomy;

}


Asteroid.prototype.move = function(delta) {

}


Asteroid.prototype.update = function(elapsed_time) {
    // TODO will update position and velocity and acceleration
    this.anatomy[this.state].update(elapsed_time);
}


Asteroid.prototype.draw = function(context) {
    this.anatomy[this.state].draw(context,this.pos.x,this.pos.y);
}


Asteroid.prototype.draw_collision = function(context) {
    this.anatomy[this.state].draw_collision(context,this.pos);
}



function Background(x,y) {

    // TODO add vel,acc vector to background
    //      this allow dynamic map movement

    this.sprites = [];
    this.sprite_no = 0;

    this.pos = new Pos2D(x,y);
    this.orig_pos = new Pos2D(x,y);
    this.vel = new Vec2D(0,0);

    this.spatiality = new Rectangle(0,0,0,0);
    this.loopable = false;

    // this is just a test, this is only a test
    this.curr = 0;
    this.next = 1;

}


Background.prototype.set_spatiality = function(x,y,w,h) {
    this.spatiality = new Rectangle(x,y,w,h);
}


Background.prototype.set_size = function(w,h) {
    //this.rect.w = w;
    //this.rect.h = h;
}


// TODO pass in x,y starting pos, canvas width and canvas height
//      or just the entirety of the image and only
//      cut the image when you draw it
Background.prototype.add_sprite = function(x,y,w,h,filepath) {
    var sprite = new Sprite(x,y,w,h);
    sprite.init(filepath,MediaManager);
    this.sprites.push(sprite);
}


Background.prototype.set_scroll_speed = function(x,y) {
    this.vel.x = x;
    this.vel.y = y;
}


// this probably needs to be revised
Background.prototype.set_loopable = function(loopable) {
    this.loopable = loopable;
    if (this.loopable && this.sprites.length == 1) {
        this.sprites.push(this.sprites[0]);
    }
}


// TODO set acceleration that slows down at designated points
//      such as, slowing scroll when reach end of screen
Background.prototype.update = function(elapsed_time) {


    // TODO check movement of left to right as well
    // TODO put this on a 'treadmill' rather than reset

    
    // calling this.vel.y is prone to error
    if (this.loopable) {
        if (Math.ceil(this.pos.y) > 0) {
            var temp = this.curr;
            this.curr = this.next;
            this.next = temp;
            this.pos.y = this.orig_pos.y;
        } else {
            this.pos.x += this.vel.x * elapsed_time;
            this.pos.y += this.vel.y * elapsed_time;
        }
    }


}


Background.prototype.draw = function(context,canvas) {

    //context.drawImage(this.img,
    //    this.rect.x,this.rect.y,
    //    this.rect.w,this.rect.h,
    //    0,0,canvas.width,canvas.height);

    //this.sprites[this.sprite_no].draw(context,this.pos.x,this.pos.y);
    // should differentiate the draw here, as it should
    // not be wider than the canvas element

    //context.drawImage(this.sprites[this.sprite_no],
    //    this.rect.x,this.rect.y,
    //    this.rect.w,this.rect.h,
    //    0,0,canvas.width,canvas.height);


    // there is just an ever-so-slight jump ...
    if (this.loopable) {
        //console.log(this.curr);
        var h = this.sprites[this.curr].body.h;
        this.sprites[this.curr].draw(context,this.pos.x,this.pos.y);
        this.sprites[this.next].draw(context,this.pos.x,this.pos.y+h);
    }


}





function run_core() {

    var CANVAS_WIDTH = 800;
    var CANVAS_HEIGHT = 600;


    this.canvas = document.createElement('canvas');
    this.canvas.width = CANVAS_WIDTH;
    this.canvas.height = CANVAS_HEIGHT;
    this.context = this.canvas.getContext('2d');
    
    var game_port = document.getElementById('game-port');
    game_port.textContent = '';
    game_port.appendChild(this.canvas);


    //this.background = new Background(-1200,this.canvas.height-5120);
    //this.background.set_spatiality(0,0,2880,5120);
    //this.background.add_sprite(0,0,
    //    this.background.spatiality.w,
    //    this.background.spatiality.h,
    //    'img/carina-nebulae-ref.png');
    //this.background.set_scroll_speed(0,0.01);
    //this.background.set_if_loopable(false);


    var w = 128;
    var h = 128;
    var sprites = [];
    var collisions = [];
    for (var r = 0; r < 4; ++r) {
        for (var c = 0; c < 8; ++c) {
            sprites.push(new Rectangle(c*w,r*h,w,h));
            collisions.push(new Rectangle(20,20,w-40,h-40));
        }
    }


    var asteroids = new Asteroid(100,100);
    asteroids.add_frame('img/asteroid_01.png',ASTR.FLY,sprites,collisions);


    var self = this;
    setInterval(function(){
        self.context.clearRect(0,0,
            self.canvas.width,self.canvas.height);
        asteroids.update(0);
        asteroids.draw(self.context,0,0);
        asteroids.draw_collision(self.context);
    },1000/30);


}



function run() {
    //run_core();

    run_map();

}


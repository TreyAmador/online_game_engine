// this is a testing sheet
// used to test objects
// and units



// TODO add a timer to entire entity
//      such as player or enemy
function AnimatedSprite() {
    this.frames = [];
    this.frame_no = 0;
}


// TODO allow user to add a single sprite 
//      animation from multiple filepaths
AnimatedSprite.prototype.init = function(filepath,manager) {
    this.img = manager.load(filepath);
}


AnimatedSprite.prototype.single_frame_rect = function(frame) {
    this.frames.push(frame);
}


AnimatedSprite.prototype.clear = function() {
    this.frames = [];
    //this.frame_no = 0;
}


// this must be updated to be more versatile
AnimatedSprite.prototype.update = function(elapsed_time) {
    //this.frame_no = ++this.frame_no % this.frames.length;
}


AnimatedSprite.prototype.draw = function(context,frame_no,x,y) {
    var rect = this.frames[frame_no];
    context.drawImage(this.img,
        rect.x,rect.y,rect.w,rect.h,
        x,y,rect.w,rect.h);
}



function Anatomy() {
    this.sprites = new AnimatedSprite();
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



// TODO reviese this to be less error prone
//      use something other than this.collisions.lenght;
Anatomy.prototype.update = function(elapsed_time) {
    this.frame_no = ++this.frame_no % this.collisions.length;
    this.sprites.update(elapsed_time);
}


Anatomy.prototype.draw = function(context,x,y) {
    this.sprites.draw(context,this.frame_no,x,y);
}


Anatomy.prototype.draw_collision = function(context) {
    var col = this.collisions[this.frame_no];
    context.strokeStyle = '#ffffff';
    context.strokeRect(col.x,col.y,col.w,col.h);
}



/*

function Anatomy() {
    this.sprites = [];
    this.collision = [];
    this.index_no = 0;
}


// TODO pass array of sprite coords and collision coords
//      the sprite is always rect-like, offset of spritesheet
//      the collision shape is part of inheritance hierarchy
//          calls some sort of init function which returns to collision array
Anatomy.prototype.add_frame = function(filepath,state,sprites,collisions) {
    var len = sprites.length;
    for (var i = 0; i < len; ++i) {
        var sprite = sprites[i];
        this.add_sprite(filepath,
            sprite.x,sprite.y,sprite.w,sprite.h);
        var collision = collisions[i];
        this.add_collision(state,
            collision.x,collision.y,collision.w,collision.h);
    }
}


Anatomy.prototype.add_sprite = function(filepath,x,y,w,h) {
    var sprite = new Sprite(x,y,w,h);
    sprite.init(filepath,MediaManager);
    this.sprites.push(sprite);
}


// pass the collision itself
Anatomy.prototype.add_collision = function(state,x,y,w,h) {
    var rect = new Rectangle(x,y,w,h);
    this.collision.push(rect);
}


Anatomy.prototype.update = function(elapsed_time) {
    this.index_no = ++this.index_no % this.sprites.length;
}


Anatomy.prototype.draw = function(context,x,y) {

    var sprite = this.sprites[this.index_no];
    sprite.draw(context,x,y);

    var coll = this.collision[this.index_no];
    context.strokeStyle = '#ffffff';
    context.strokeRect(
        coll.x, coll.y,
        coll.w, coll.h);

}

*/



function Asteroid(x,y) {

    // sprites should be object of arrays
    this.sprites = {};

    // the frames should be cirlces
    //this.frames = [];

    this.frames = {};

    this.pos = new Pos2D(x,y);
    this.vec = new Vec2D(0,0);
    this.accel = new Vec2D(0,0);
    this.state = ASTEROID_STATE.ROLL;

}


Asteroid.prototype.add_frame = function(filepath,state,x,y,r) {

}


Asteroid.prototype.add_sprite = function(filepath,state,x,y,w,h) {
    
}


// this would be in the circle class, not body
Asteroid.prototype.add_collision = function(x,y,r) {

}


Asteroid.prototype.update = function(elapsed_time) {
    // TODO will update position and velocity and acceleration
}


Asteroid.prototype.draw = function(context) {

}




function testing() {


    this.canvas = document.createElement('canvas');
    this.canvas.width = CANVAS_WIDTH;
    this.canvas.height = CANVAS_HEIGHT;
    this.context = this.canvas.getContext('2d');
    
    var game_port = document.getElementById('game-port');
    game_port.textContent = '';
    game_port.appendChild(this.canvas);


    var w = 128;
    var h = 128;
    var sprites = [];
    var collisions = [];
    for (var r = 0; r < 4; ++r) {
        for (var c = 0; c < 8; ++c) {
            sprites.push(new Rectangle(c*w,r*h,w,h));
            collisions.push(new Rectangle(10,10,w-20,h-20));
        }
    }

    var anatomy = new Anatomy();
    anatomy.init('img/asteroid_01.png',MediaManager);
    anatomy.add_frames_rect(sprites,collisions);




    //var animated = new AnimatedSprite();
    //animated.init('img/asteroid_01.png',MediaManager);

    //var rects = [];
    //for (var r = 0; r < 4; ++r) {
    //    for (var c = 0; c < 8; ++c) {
    //        rects.push(new Rectangle(c*w,r*h,w,h));
    //    }
    //}
    //animated.init_frames_rects(rects);


    /*

    var anatomy = new Anatomy();
    var sprite = new Rectangle(0,0,104,81);

    var sprites = [];
    var colls = [];
    var w = 128;
    var h = 128;
    for (var r = 4; r < 8; ++r) {
        for (var c = 0; c < 8; ++c) {
            sprites.push(new Rectangle(c*w,r*h,w,h));
            colls.push(new Rectangle(14,14,100,100));
        }
    }

    var collision = new Rectangle(20,16,64,58);

    anatomy.add_frame('img/asteroid_01.png',
            ASTEROID_STATE.ROLL,sprites,colls);

    */


    var self = this;
    setInterval(function(){
        self.context.clearRect(0,0,
            self.canvas.width,self.canvas.height);
        anatomy.update(0);
        anatomy.draw(self.context,0,0);
        anatomy.draw_collision(self.context);
        
    },1000/30);


}













/*

function output(vec,ans) {
    if (vec === ans)
        console.log(vec,'correct.');
    else
        console.log(vec,'incorrect');
}


function test_vec2d() {
    var a = new Vec2D(3,4);
    //output(a.magnitude(),5);

    //var max = 3;
    //var mag = a.magnitude();
    //console.log(mag);
    //a.normalize(3/5);
    //console.log(a.magnitude());
    
    var max = 4;
    //var b = new Vec2D(6,9);
    //var mag = b.magnitude();
    //b.normalize(max/mag);
    //output(b.magnitude(),max);

    var c = new Vec2D(-9,2);
    console.log(c.x,c.y);
    c.normalize(max);
    console.log(c.x,c.y);
    output(c.magnitude(),max);

    
}

//test_vec2d();


*/


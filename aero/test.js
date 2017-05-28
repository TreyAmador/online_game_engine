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
    this.frame_no = 0;
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



function Pos2D(x,y) {
    this.x = x;
    this.y = y;
}



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
    //this.pos.y += 1;
    this.anatomy[this.state].update(elapsed_time);
}


Asteroid.prototype.draw = function(context) {
    this.anatomy[this.state].draw(context,this.pos.x,this.pos.y);
}


Asteroid.prototype.draw_collision = function(context) {
    this.anatomy[this.state].draw_collision(context,this.pos);
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


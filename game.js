/*
    online game engine!
*/


function Rectangle(x,y,w,h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;    
}


function Sprite(x,y,w,h,img) {
    this.pos = new Rectangle(x,y,w,h);
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.img = img;
    this.update = function() {
        console.log('player update');
    }
}


function GameCore() {
    var self = this;
    this.canvas = document.createElement('canvas');
    this.start = function() {
        this.canvas.width = 480;
        this.canvas.height = 270;
        this.context = this.canvas.getContext('2d');
        document.body.insertBefore(this.canvas,document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(this.update,20);
        this.player = new Sprite(50,60,0,0,'');
    }
    this.clear = function(){
        this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
    }
    this.update = function() {
        //var self = this;
        //obj.player.update();
        //this.player.update();
        self.player.update();
    }
}


//function update() {
//    console.log('main update function');
//}


function run() {
    var core = new GameCore();
    core.start();
    
}








/*
// this works
function Rectangle(x,y,w,h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
}

function Sprite(x,y,w,h,img) {
    this.pos = null;
    this.initialize = function(x,y,w,h) {
        this.pos = new Rectangle(x,y,w,h);
    }
    this.update = function(){
        console.log(this.pos.x,this.pos.y);        
    }
}

function run() {
    var sprite = new Sprite(0,0,0,0,'');
    sprite.initialize(50,20,10,10,'');
    sprite.update();
}

*/




/*

// canvas structure
var Context = {
    canvas: null,
    context: null,
    create: function(canvas_tag_id) {
        this.canvas = document.getElementById(canvas_tag_id);
        this.context = this.canvas.getContext('2d');
        return this.context;
    }
};


var Sprite = function(filename,is_pattern) {
    
    // construct
    this.image = null;
    this.pattern = null;
    this.TO_RADIANS = Math.PI/180;

    if (filename != undefined && filename != '' && filename != null) {
        this.image = new Image();
        this.image.src = filename;
        if (is_pattern) {
            this.pattern = Context.context.createPattern(this.image,'repeat');
        }
    } else {
        console.log('unable to load sprite.');
    }

    this.draw = function(x,y,w,h) {
        // pattern?
        if (this.pattern != null) {
            // if is a pattern
            Context.context.fillStyle = this.pattern;
            Context.context.fillRect(x,y,w,h); 
        } else {
            // if is an image
            if (w == undefined || h == undefined) {
                Context.context.drawImage(
                    this.image,x,y,this.image.width,this.image.height);
            } else {
                // stretched picture
                Context.context.drawImage(this.image,x,y,w,h);
            }
        }
    }

    this.rotate = function(x,y,angle) {
        Context.context.save();
        Context.context.translate(x,y);
        Context.context.rotate(angle * this.TO_RADIANS);
        Context.context.drawImage(
            this.image,
            -(this.image.width/2),
            -(this.image.height/2));
        Context.context.restore();
    }

};



// initialize game
$(document).ready(function() {
    Context.create('canvas');

    var WALL = 'img/brick.png';
    var CRATE = 'img/crate.png';

    var image = new Sprite(WALL,false);
    var image2 = new Sprite(CRATE,false);

    var pattern = new Sprite(CRATE,true);
    var angle = 0;

    setInterval(function() {

        Context.context.fillStyle = '#000000';
        Context.context.fillRect(0,0,800,800);

        image.draw(0,0,64,64);
        image.draw(0,74,256,32);
        pattern.draw(160,160,256,180);

        image.rotate(115,160, angle += 4.0);
        image2.rotate(115,260,-angle/2);


    },25);


    //Context.context.beginPath();
    //Context.context.rect(0,0,640,480);
    //Context.context.fillStyle = 'black';
    //Context.context.fill();
    

});

*/


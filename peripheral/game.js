



var Sprite = function(x,y,w,h,bmp) {

    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.bmp = bmp;

    this.update = function(context) {
        var ctx = context;
        ctx.fillStyle = this.bmp;
        ctx.fillRect(this.x,this.y,this.w,this.h);
    }

}


var Core = function() {

    this.canvas = document.createElement('canvas');
    
    this.initialize = function(){   
        this.canvas.width = 480;
        this.canvas.height = 270;
        this.context = this.canvas.getContext('2d');
        document.body.insertBefore(
            this.canvas,document.body.childNodes[0]);
        this.frameNo = 0;
        this.player = new Sprite(10,120,30,30,'red');
        this.interval = setInterval(this.update,20);
    }

    this.clear = function() {
        this.context.clearRect(
            0,0,this.canvas.width,this.canvas.height);
    }

    this.update = function() {
        this.player.update(this.context);
        console.log('hey');
    }

    


}



function start() {
    core = new Core();
    //core.initialize();
}










/*

//var player;



class Sprite {
    constructor(x,y,w,h,bmp) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.bmp = bmp;
    }
    update(context) {
        var ctx = context;
        ctx.fillStyle = this.bmp;
        ctx.fillRect(this.x,this.y,this.w,this.h);
    }
}




class Core {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.canvas.width = 480;
        this.canvas.height = 270;
        document.body.insertBefore(
            this.canvas,document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(this.update,20);
        this.context = this.canvas.getContext('2d');
        this.player = new Sprite(10,120,30,30,'red');
    }
    clear() {
        this.context.clearRect(
            0,0,this.canvas.width,this.canvas.height);
    }
    update() {
        this.clear();
        this.player.update(this.context);
        
    }
}



function start() {
    core = new Core();

}

*/


/*

function Sprite(x,y,w,h,bmp) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.bmp = bmp;
}


Sprite.prototype.update = function(context) {
    var ctx = context;
    ctx.fillStyle = this.bmp;
    ctx.fillRect(this.x,this.y,this.w,this.h);
}




function Core() {
    this.canvas = document.createElement('canvas');
}


Core.prototype.initialize = function() {
    // game loop here
    // init player, sprite, map, etc
    
    this.canvas.width = 480;
    this.canvas.height = 270;
    context = this.canvas.getContext('2d');
    document.body.insertBefore(
        this.canvas,document.body.childNodes[0]);
    this.frameNo = 0;
    this.interval = setInterval(this.update,20);

    //this.player = new Sprite(10,120,30,30,'red');
    player = new Sprite(10,120,30,30,'red');
    console.log(player);

}


Core.prototype.clear = function() {
    this.context.clearRect(
        0,0,this.canvas.width,this.canvas.height);
}


Core.prototype.update = function() {
    
    player.update(context);

    //console.log('update');
    // sprite.update(this);
    //this.player.update(this.context);
    //player.update(this.context);

}


function start() {
    core = new Core();
    //var core = new Core();
    core.initialize();
}

*/






/*
function Sprite(x,y,w,h,bmp) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.bmp = bmp;

    this.update = function(context) {
        var ctx = context;
        ctx.fillStyle = this.bmp;
        ctx.fillRect(this.x,this.y,this.w,this.h);
    }
}




function Core() {

    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');
    //this.player;
    this.player = new Sprite(10,120,30,30,'red');

    this.initialize = function() {
        this.canvas.width = 480;
        this.canvas.height = 270;
        //this.context = this.canvas.getContext('2d');
        document.body.insertBefore(
            this.canvas,document.body.childNodes[0]);
        this.frameNo = 0;
        this.player = new Sprite(10,120,30,30,'red');
        
        this.interval = setInterval(this.update,20);
        //console.log(this.player);
    }

    this.clear = function() {
        this.context.clearRect(
            0,0,this.canvas.width,this.canvas.height);
    }

    this.update = function() {
        //console.log(canvas.width)
        //this.player.update(this.context);
        console.log(this.prototype.player);
    }


}



function start() {
    core = new Core();
    //var core = new Core();
    core.initialize();
}

*/




/*

var core;
var player;


function Sprite(x,y,w,h,bmp) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.bmp = bmp;
}


Sprite.prototype.update = function(context) {
    var ctx = context;
    ctx.fillStyle = this.bmp;
    ctx.fillRect(this.x,this.y,this.w,this.h);
}




function Core() {
    this.canvas = document.createElement('canvas');
}


Core.prototype.initialize = function() {
    // game loop here
    // init player, sprite, map, etc
    
    this.canvas.width = 480;
    this.canvas.height = 270;
    this.context = this.canvas.getContext('2d');
    document.body.insertBefore(
        this.canvas,document.body.childNodes[0]);
    this.frameNo = 0;
    this.interval = setInterval(this.update,20);

    //this.player = new Sprite(10,120,30,30,'red');
    player = new Sprite(10,120,30,30,'red');
    console.log(player);

}


Core.prototype.clear = function() {
    this.context.clearRect(
        0,0,this.canvas.width,this.canvas.height);
}


Core.prototype.update = function() {
    
    console.log();

    //console.log('update');
    // sprite.update(this);
    //this.player.update(this.context);
    //player.update(this.context);

}


function start() {
    core = new Core();
    //var core = new Core();
    core.initialize();
}

*/





/*

var imageRepository = new function() {
    this.background = new Image();
    this.background.src = 'imgs/bg.png';
}


function Drawable() {
    this.init = function(x,y) {
        this.x = x;
        this.y = y;
    }
    this.speed = 0;
    this.canvasWidth = 0;
    this.canvasHeight = 0;
    this.draw = function() {

    }
}


function Background() {
    this.speed = 1;
    this.draw = function() {
        this.y += this.speed;
        this.context.drawImage(imageRepository.background,this.x,this.y);
        this.context.drawImage(imageRepository.background,this.x,this.y-this.canvasHeight);
        if (this.y >= this.canvasHeight) {
            this.y = 0;
        }
    }
}


Background.prototype = new Drawable();


function Game() {
    this.init = function() {
        this.bgCanvas = document.getElementById('background');
        if (this.bgCanvas.getContext) {
            this.bgCanvas = this.bgCanvas.getContext('2d');
            Background.prototype.context = this.bgContext;
            Background.prototype.canvasWidth = this.bgCanvas.width;
            Background.prototype.canvasHeight = this.bgCanvas.height;
            this.background = new Background();
            this.background.init(0,0);
            return true;
        } else {
            return false;
        }
    }
    this.start = function() {
        animate();
    }
}


function animate() {
    requestAnimationFrame(animate);
    game.background.draw();
}


window.requestAnimationFrame = (function() {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function
})();

*/

/*
    new game!
*/


var imageRepository = new function() {
    this.background = new Image();
    this.spaceship = new Image();
    this.bullet = new Image();
    var numImages = 3;
    var numLoaded = 0;
    function imageLoaded() {
        numLoaded++;
        if (numLoaded == numImages) {
            window.init();
        }
    }
    this.background.onload = function() {
        imageLoaded();
    }
    this.spaceship.onload = function() {
        imageLoaded();
    }
    this.bullet.onload = function() {
        imageLoaded();
    }
    this.background.src = 'imgs/bg.png';
    this.spaceship.src = 'imgs/ship.png';
    this.bullet.src = 'imgs/bullet.png';
}


function Drawable() {
    this.init = function(x,y,width,height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    this.speed = 0;
    this.canvasWidth = 0;
    this.canvasHeight = 0;
    this.draw = function() {
        // abstract function
    }
}


function Background() {
    this.speed = 1;
    this.draw = function() {
        this.y += this.speed;
        this.context.drawImage(imageRepository.background,this.x,this.y);
        this.context.drawImage(imageRepository.background,this.x,this.y - this.canvasHeight);
        if (this.y >= this.canvasHeight) {
            this.y = 0;
        }
    }
}

Background.prototype = new Drawable();



window.requestAnimFrame = (function() {
    return  window.requestAnimationFrame   ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame    ||
		window.oRequestAnimationFrame      ||
		window.msRequestAnimationFrame     ||
		function(/* function */ callback, /* DOMElement */ element){
			window.setTimeout(callback, 1000 / 60);
		};
})();


function animate() {
    requestAnimFrame(animate);
    game.background.draw();
}


// does this work?

function Pool(maxSize) {
    var size = maxSize;
    var pool = [];
    this.init = function() {
        for (var i = 0; i < size; i++) {
            var bullet = new Bullet();
            bullet.init(0,0,imageRepository.bullet.width,
                imageRepository.bullet.height);
            pool[i] = bullet;
        }
    }

    this.get = function(x,y,speed) {
        if(!pool[size-1].alive) {
            pool[size-1].spawn(x,y,speed);
            pool.unshift(pool.pop());
        }
    }

    this.getTwo = function(x1,y1,speed1,x2,y2,speed2) {
        if (!pool[size-1].alive &&
            !pool[size-2].alive) {
                this.get(x1,y1,speed1);
                this.get(x2,y2,speed2);
            }
    }

    this.animate = function() {
		for (var i = 0; i < size; i++) {
			// Only draw until we find a bullet that is not alive
			if (pool[i].alive) {
				if (pool[i].draw()) {
					pool[i].clear();
					pool.push((pool.splice(i,1))[0]);
				}
			}
			else
				break;
		}
	};

}



function Game() {
    this.init = function() {
        this.bgCanvas = document.getElementById('background');
        if (this.bgCanvas.getContext) {
            this.bgContext = this.bgCanvas.getContext('2d');
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


var game = new Game();
function init() {
    if (game.init()) {
        game.start();
    }
}



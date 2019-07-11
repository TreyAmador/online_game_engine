const MSEC_PER_SEC = 1000;
const FRAME_PER_SEC = 15;
const FRAME_RATE = MSEC_PER_SEC / FRAME_PER_SEC;

const CANVAS_WIDTH = 720;
const CANVAS_HEIGHT = 540;

class Media {
  constructor() {
    // TODO: init as map based on efficiency requirements?
    this.imgs = {};
  }

  load(filepath) {
    if (!this.imgs[filepath]) {
      this.imgs[filepath] = new Image();
      this.imgs[filepath].src = filepath;
    }
    return this.imgs[filepath];
  }
};

class Sprite {
  constructor(media, filepath, x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.img = media.load(filepath);
  }

  draw(context, posX, posY) {
    // TODO: implement scaling of image
    context.drawImage(
      this.img,
      this.x, this.y,
      this.w, this.h,
      posX, posY,
      this.w, this.h
    );
  }
}

class AnimatedSprite {
  constructor(media, filepath, poses, w, h) {
    this.sprites = poses.map((pose) => (
      new Sprite(media, filepath, pose.x * w, pose.y * h, w, h)
    ));
    this.pose = 0;
  }
  
  update() {
    this.pose = ++this.pose % this.sprites.length;
  }

  draw(context, x, y) {
    this.sprites[this.pose].draw(context, x, y);
  }
}

class Game {
  constructor() {
    this.initCanvas();
    this.initSprites();
  }

  initCanvas() {
    this.canvas = document.createElement('canvas');
    this.canvas.width = CANVAS_WIDTH;
    this.canvas.height = CANVAS_HEIGHT;
    this.canvas.style.backgroundColor = '#fafafa';
    this.context = this.canvas.getContext('2d');
    let port = document.getElementById('game-port');
    port.textContent = '';
    port.appendChild(this.canvas);
  }

  initSprites() {
    this.media = new Media();
    // this.sprite = new Sprite(this.media, 'img/player.bmp', 0, 0, 32, 32);
    this.sprite = new AnimatedSprite(
      this.media,
      'img/player.bmp',
      [
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 0, y: 0 },
        { x: 2, y: 0 },
      ],
      32, 32
    );
  }

  clear() {
    this.context.clearRect(0, 0,
      this.canvas.width, this.canvas.height);
  }

  run() {
    let self = this;
    setInterval(() => {
      self.clear();
      self.update();
      self.draw();
    }, FRAME_RATE);

  }

  update() {
    // move each frame here
    this.sprite.update();
  }

  draw() {
    let x = 0;
    let y = 0;
    this.sprite.draw(this.context, x, y);
  }
}

window.addEventListener('load',function() {
  let game = new Game();
  game.run();
});

/**
 * a very fun platforming engine for a very fun platforming game
 */

const MSEC_PER_SEC = 1000;
const FRAME_PER_SEC = 30;
const FRAME_RATE = MSEC_PER_SEC / FRAME_PER_SEC;

const KEY = Object.freeze({
  UP: 38,
  DOWN: 40,
  LEFT: 37,
  RIGHT: 39,
  SPACE: 32
});

const TILE_SIZE = 32;

// TODO reduce number of tiles
const TILE_ROWS = 40;
const TILE_COLS = 200;

const CANVAS_ROWS = 18;
const CANVAS_COLS = 25;

const CANVAS_WIDTH = TILE_SIZE * CANVAS_COLS;
const CANVAS_HEIGHT = TILE_SIZE * CANVAS_ROWS;

const GRAVITY_ACCEL = 0.0015;

const MOVE_HORIZ_ACCEL = 0.0045;
const MOVE_HORIZ_FRICTION = 0.75;
const STOP_HORIZ_ACCEL = 0.0;
const MAX_HORIZ_ACCEL = 0.02;

const JUMP_HORIZ_ACCEL = 0.0035;
const JUMP_VEL = -0.8;

const STATES = {
  HORIZONTAL: {
    RIGHT: 'right',
    LEFT: 'left',
  },
  VERTICAL: {
    UP: 'up',
    FORWARD: 'forward',
    DOWN: 'down',
  },
  MOVEMENT: {
    IDLE: 'idle',
    WALKING: 'walking',
    RISING: 'rising',
    FALLING: 'falling',
  },
};

function Vec2D(x,y) {
  this.x = x;
  this.y = y;
}

class Rectangle {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  left() {
    return this.x;
  }

  right() {
    return (this.x + this.w);
  }

  top() {
    return this.y;
  }

  bottom() {
    return (this.y + this.h);
  }

  width() {
    return this.w;
  }

  height() {
    return this.h;
  }
}

class PhysicsEngine {
  position(x, v, a, t) {
    return 0.5 * a * t * t + v * t;
  }

  velocity(v, a, t) {
    return a * t;
  }
};

const Physics = new PhysicsEngine();

class Input {
  constructor() {
    this.pressed = {};
    this.init();
  }

  init() {
    window.addEventListener('keyup', (event) => {
      this.onKeyUp(event);
    });
    window.addEventListener('keydown', (event) => {
      this.onKeyDown(event);
    });
  }

  isDown(keyCode) {
      return this.pressed[keyCode];
  }

  onKeyDown(event) {
      this.pressed[event.keyCode] = true;
  }

  onKeyUp(event) {
      delete this.pressed[event.keyCode];
  }
};

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

  draw(context, x, y) {
    this.pose = ++this.pose % this.sprites.length;
    this.sprites[this.pose].draw(context, x, y);
  }
}

class PlayerState {
  constructor() {
    this.horizontal = STATES.HORIZONTAL.RIGHT;
    this.vertical = STATES.VERTICAL.FORWARD;
    this.movement = STATES.MOVEMENT.IDLE;
  }

  key(horizontal, vertical, movement) {
    return `${horizontal} ${vertical} ${movement}`;
  }

  get() {
    return this.key(this.horizontal, this.vertical, this.movement);
  }
}

class Player {
  constructor(media, x, y) {
    this.x = x;
    this.y = y;
    this.w = TILE_SIZE;
    this.h = TILE_SIZE;
    this.vx = 0;
    this.vy = 0;
    this.ax = 0;
    this.ay = 0;

    this.collisionX = new Rectangle(6, 10, 20, 12);
    this.collisionY = new Rectangle(10, 2, 12, 30);

    const { MOVEMENT: { IDLE, WALKING, RISING, FALLING } } = STATES;
    const { HORIZONTAL: { RIGHT, LEFT } } = STATES;
    const { VERTICAL: { UP, FORWARD, DOWN } } = STATES;
    this.state = new PlayerState();
    
    this.sprites = {};
    this.addState(media, this.state.key(RIGHT, FORWARD, IDLE), [{ x: 0, y: 1 }]);
    this.addState(media, this.state.key(LEFT, FORWARD, IDLE), [{ x: 0, y: 0 }]);
    this.addState(media, this.state.key(RIGHT, UP, IDLE), [{ x: 3, y: 1 }]);
    this.addState(media, this.state.key(LEFT, UP, IDLE), [{ x: 3, y: 0 }]);

    this.addState(media,
      this.state.key(RIGHT, FORWARD, WALKING),
      [
        { x: 0, y: 1 },
        { x: 1, y: 1 },
        { x: 0, y: 1 },
        { x: 2, y: 1 },
      ]
    );
    this.addState(media,
      this.state.key(LEFT, FORWARD, WALKING),
      [
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 0, y: 0 },
        { x: 2, y: 0 },
      ]
    );
    this.addState(media,
      this.state.key(RIGHT, UP, WALKING),
      [
        { x: 3, y: 1 },
        { x: 4, y: 1 },
        { x: 3, y: 1 },
        { x: 5, y: 1 },
      ]
    );
    this.addState(media,
      this.state.key(LEFT, UP, WALKING),
      [
        { x: 3, y: 0 },
        { x: 4, y: 0 },
        { x: 3, y: 0 },
        { x: 5, y: 0 },
      ]
    );

    this.addState(media, this.state.key(RIGHT, UP, RISING), [{ x: 4, y: 1 }]);
    this.addState(media, this.state.key(LEFT, UP, RISING), [{ x: 4, y: 0 }]);
    this.addState(media, this.state.key(RIGHT, FORWARD, RISING), [{ x: 1, y: 1 }]);
    this.addState(media, this.state.key(LEFT, FORWARD, RISING), [{ x: 1, y: 0 }]);

    this.addState(media, this.state.key(RIGHT, UP, FALLING), [{ x: 4, y: 1 }]);
    this.addState(media, this.state.key(LEFT, UP, FALLING), [{ x: 4, y: 0 }]);
    this.addState(media, this.state.key(RIGHT, FORWARD, FALLING), [{ x: 1, y: 1 }]);
    this.addState(media, this.state.key(LEFT, FORWARD, FALLING), [{ x: 1, y: 0 }]);

    this.grounded = false;
    this.recovered = false;

    this.input = new Input();
  }

  addState(media, state, pose) {
    this.sprites[state] = new AnimatedSprite(
      media, 'img/playertransparent.gif',
      pose, TILE_SIZE, TILE_SIZE
    );
  }

  moveLeft() {
    if (this.grounded) {
      this.ax = -MOVE_HORIZ_ACCEL;
      this.state.movement = STATES.MOVEMENT.WALKING;
    } else {
      this.ax = -JUMP_HORIZ_ACCEL;
    }
    this.state.horizontal = STATES.HORIZONTAL.LEFT;
  }

  moveRight() {
    if (this.grounded) {
      this.ax = MOVE_HORIZ_ACCEL;
      this.state.movement = STATES.MOVEMENT.WALKING;
    } else {
      this.ax = JUMP_HORIZ_ACCEL;
    }
    this.state.horizontal = STATES.HORIZONTAL.RIGHT;
  }

  stopMoving() {
    this.ax = STOP_HORIZ_ACCEL;
    this.state.movement = STATES.MOVEMENT.IDLE;
  }

  lookUp() {
    if (this.grounded) {
      this.state.vertical = STATES.VERTICAL.UP;
    }
  }

  lookForward() {
    if (this.grounded) {
      this.state.vertical = STATES.VERTICAL.FORWARD;
    }
  }

  jump() {
    if (this.grounded && this.recovered) {
      this.vy = JUMP_VEL;
    }
    this.recovered = false;
  }

  regainJump() {
    if (this.grounded) {
      this.recovered = true;
    }
  }

  topCollision(delta) {
    let rect = null;
    if (delta <= 0) {
      rect = new Rectangle(
        this.x + this.collisionY.left(),
        this.y + this.collisionY.top() + delta,
        this.collisionY.width(),
        this.collisionY.height() / 2 - delta
      );
    }
    return rect;
  }

  bottomCollision(delta) {
    let rect = null;
    if (delta >= 0) {
      rect = new Rectangle(
        this.x + this.collisionY.left(),
        this.y + this.collisionY.top() + this.collisionY.height() / 2,
        this.collisionY.width(),
        this.collisionY.height() / 2 + delta
      );
    }
    return rect;
  }

  leftCollision(delta) {
    let rect = null;
    if (delta <= 0) {
      rect = new Rectangle(
        this.x + this.collisionX.left() + delta,
        this.y + this.collisionX.top(),
        this.collisionX.width() / 2 - delta,
        this.collisionX.height()
      );
    }
    return rect;
  }

  rightCollision(delta) {
    let rect = null;
    if (delta >= 0) {
      rect = new Rectangle(
        this.x + this.collisionX.left() + this.collisionX.width() / 2,
        this.y + this.collisionX.top(),
        this.collisionX.width() / 2 + delta,
        this.collisionX.height()
      );
    }
    return rect;
  }

  updateState() {
    if (!this.grounded) {
      if (this.vy <= 0) {
        this.state.movement = STATES.MOVEMENT.RISING;
      } else {
        this.state.movement = STATES.MOVEMENT.FALLING;
      }
    }
  }

  updateX(updateTime, map) {
    this.vx += Physics.velocity(this.vx, this.ax, updateTime);
    this.vx *= MOVE_HORIZ_FRICTION;

    let delta = Physics.position(this.x, this.vx, this.ax, updateTime);
    if (delta > 0) {
      let tile = map.collidingTiles(this.rightCollision(delta));
      if (tile) {
        this.x = tile.x - this.collisionX.right();
        this.vx = 0.0;
      } else {
        this.x += delta;
      }
      tile = map.collidingTiles(this.leftCollision(0));
      if (tile) {
        this.x = tile.x + this.collisionX.right();
      }
    } else {
      let tile = map.collidingTiles(this.leftCollision(delta));
      if (tile) {
        this.x = tile.x + this.collisionX.right();        
        this.vx = 0.0;
      } else {
        this.x += delta;
      }
      tile = map.collidingTiles(this.rightCollision(0));
      if (tile) {
        this.x = tile.x - this.collisionX.right();
      }
    }
  }

  updateY(updateTime, map) {
    this.vy += Physics.velocity(this.vy, GRAVITY_ACCEL, updateTime);

    let delta = Physics.position(this.y, this.vy, this.ay, updateTime);
    if (delta > 0) {
      let tile = map.collidingTiles(this.bottomCollision(delta));
      if (tile) {
        this.y = tile.y - this.collisionY.bottom();
        this.vy = 0.0;
        this.grounded = true;
      } else {
        this.y += delta;
        this.grounded = false;
      }
      tile = map.collidingTiles(this.topCollision(0));
      if (tile) {
        this.y = tile.y + this.collisionY.height();
      }
    } else {
      let tile = map.collidingTiles(this.topCollision(delta));
      if (tile) {
        this.y = tile.y + this.collisionY.height();
        this.vy = 0.0;
      } else {
        this.y += delta;
        this.grounded = false;
      }
      tile = map.collidingTiles(this.bottomCollision(0));
      if (tile) {
        this.y = tile.y - this.collisionY.bottom();
        this.grounded = true;
      }
    }
  }

  update(updateTime, map) {
    if (this.input.isDown(KEY.LEFT) && this.input.isDown(KEY.RIGHT)) {
      this.stopMoving();
    } else if (this.input.isDown(KEY.LEFT)) {
      this.moveLeft();
    } else if (this.input.isDown(KEY.RIGHT)) {
      this.moveRight();
    } else {
      this.stopMoving();
    }
    if (this.input.isDown(KEY.UP)) {
      this.lookUp();
    } else {
      this.lookForward();
    }
    if (this.input.isDown(KEY.SPACE)) {
      this.jump();
    } else {
      this.regainJump();
    }

    this.updateX(updateTime, map);
    this.updateY(updateTime, map);
    this.updateState();

    // TODO: generate map to have barriers
    if (this.x <= TILE_SIZE) {
      this.x = TILE_SIZE;
      this.vx = 0.0;
    }
    if (this.x >= TILE_SIZE * TILE_COLS - 2 * TILE_SIZE) {
      this.x = TILE_SIZE * TILE_COLS - 2 * TILE_SIZE;
      this.vx = 0.0;
    }
  }

  draw(context, x, y) {
    this.sprites[this.state.get()].draw(context, x, y);
  }
}

class Tile {
  constructor(x, y, w, h, color = null, collidable = false) {
    this.rect = new Rectangle(x, y, w, h);
    this.color = color;
    this.collidable = collidable;
  }

  draw(context, x, y) {
    if (this.color) {
      context.rectStyle = this.color;
      context.fillRect(x, y, this.rect.w, this.rect.h);
    }
  }
}

class Map {
  constructor() {
    this.rows = TILE_ROWS;
    this.cols = TILE_COLS;
    this.tiles = new Array(this.rows);
    for (let r = 0; r < this.rows; ++r) {
      this.tiles[r] = new Array(this.cols);
    }
  }

  createTestMap() {
    for (let r = 0; r < this.rows; ++r) {
      for (let c = 0; c < this.cols; ++c) {
        if (r == 16) {
          this.tiles[r][c] = new Tile(c * TILE_SIZE, r * TILE_SIZE, TILE_SIZE, TILE_SIZE, '#f0f0f0', true);
        } else {
          this.tiles[r][c] = new Tile(c * TILE_SIZE, r * TILE_SIZE, TILE_SIZE, TILE_SIZE);
        }
      }
    }
    this.tiles[11][10] = new Tile(10 * TILE_SIZE, 11 * TILE_SIZE, TILE_SIZE, TILE_SIZE, '#f0f0f0', true);
    this.tiles[11][17] = new Tile(17 * TILE_SIZE, 11 * TILE_SIZE, TILE_SIZE, TILE_SIZE, '#f0f0f0', true);
  }

  collidingTiles(rect) {
    let iRow = Math.floor(rect.top() / TILE_SIZE);
    let fRow = Math.floor(rect.bottom() / TILE_SIZE);
    let iCol = Math.floor(rect.left() / TILE_SIZE);
    let fCol = Math.floor(rect.right() / TILE_SIZE);

    for (let r = iRow; r <= fRow; ++r) {
      for (let c = iCol; c <= fCol; ++c) {
        if (this.tiles[r][c].collidable) {
          return this.tiles[r][c].rect;
        }
      }
    }
    return null;
  }

  draw(context, x, y) {
    for (let row of this.tiles) {
      for (let tile of row) {
        tile.draw(context, x, y);
      }
    }
  }
}

class Camera {
  constructor(x, y) {
    this.view = new Rectangle(x, y, CANVAS_WIDTH, CANVAS_HEIGHT);
    this.initCanvas();
  }

  initCanvas() {
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.view.w;
    this.canvas.height = this.view.h;
    this.canvas.style.backgroundColor = '#f0f0f0';
    this.context = this.canvas.getContext('2d');

    let port = document.getElementById('game-port');
    port.textContent = '';
    port.appendChild(this.canvas);
  }

  clear() {
    this.context.clearRect(0, 0, this.view.w, this.view.h);
  }

  center(body) {
    this.view.x = (body.x + body.w / 2) - this.view.w / 2;
    this.view.y = (body.y + body.h / 2) - this.view.h / 2;
  }

  capture(subject) {
    let x = subject.x - this.view.x;
    let y = subject.y - this.view.y;
    subject.draw(this.context, x, y);
  }

  captureMap(map) {
    for (let row of map.tiles) {
      for (let tile of row) {
        var x = tile.rect.x - this.view.x;
        var y = tile.rect.y - this.view.y;
        tile.draw(this.context, x, y);
      }
    }
  }
}

class Game {
  constructor() {
    this.initMap();
    this.initPlayer();
    this.initCamera();
  }

  initPlayer() {
    this.media = new Media();
    this.player = new Player(this.media, TILE_SIZE, 0);    
  }

  initMap() {
    this.map = new Map();
    this.map.createTestMap();
  }

  initCamera() {
    this.camera = new Camera(0, 0);
  }

  clear() {
    this.camera.clear();
  }

  run() {
    let self = this;
    setInterval(() => {
      self.clear();
      self.update(FRAME_RATE);
      self.draw();
    }, FRAME_RATE);

  }

  update(updateTime) {
    this.camera.center(this.player);
    this.player.update(updateTime, this.map);
  }

  draw() {
    this.camera.capture(this.player);
    this.camera.captureMap(this.map);
  }
}

window.addEventListener('load',function() {
  let game = new Game();
  game.run();
});

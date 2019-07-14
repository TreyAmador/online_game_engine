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

const CANVAS_ROWS = 18;
const CANVAS_COLS = 25;
const TILE_SIZE = 32;

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
  position(v, a, t) {
    return 0.5 * a * t * t + v * t;
  }

  velocity(a, t) {
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
    this.grounded = false;
    this.rebounded = false;
  }

  key(horizontal, vertical, movement) {
    return `${horizontal} ${vertical} ${movement}`;
  }

  get() {
    return this.key(this.horizontal, this.vertical, this.movement);
  }
}

class Player {
  constructor(media, x, y, w = TILE_SIZE, h = TILE_SIZE) {
    this.body = new Rectangle(x, y, w, h);
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

    this.input = new Input();
  }

  addState(media, state, pose) {
    this.sprites[state] = new AnimatedSprite(
      media, 'img/playertransparent.gif',
      pose, TILE_SIZE, TILE_SIZE
    );
  }

  moveLeft() {
    if (this.state.grounded) {
      this.ax = -MOVE_HORIZ_ACCEL;
      this.state.movement = STATES.MOVEMENT.WALKING;
    } else {
      this.ax = -JUMP_HORIZ_ACCEL;
    }
    this.state.horizontal = STATES.HORIZONTAL.LEFT;
  }

  moveRight() {
    if (this.state.grounded) {
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
    this.state.vertical = STATES.VERTICAL.UP;
  }

  lookForward() {
    this.state.vertical = STATES.VERTICAL.FORWARD;
  }

  jump() {
    if (this.state.grounded && this.state.rebounded) {
      this.vy = JUMP_VEL;
    }
    this.state.rebounded = false;
  }

  regainJump() {
    if (this.state.grounded) {
      this.state.rebounded = true;
    }
  }

  topCollision(delta) {
    let rect = null;
    if (delta <= 0) {
      rect = new Rectangle(
        this.x() + this.collisionY.left(),
        this.y() + this.collisionY.top() + delta,
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
        this.x() + this.collisionY.left(),
        this.y() + this.collisionY.top() + this.collisionY.height() / 2,
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
        this.x() + this.collisionX.left() + delta,
        this.y() + this.collisionX.top(),
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
        this.x() + this.collisionX.left() + this.collisionX.width() / 2,
        this.y() + this.collisionX.top(),
        this.collisionX.width() / 2 + delta,
        this.collisionX.height()
      );
    }
    return rect;
  }

  boundryCollision(map) {
    if (map.outOfBounds(this.body)) {
      this.body.x = map.checkpoint.x;
      this.body.y = map.checkpoint.y;
      this.vx = 0.0;
      this.vy = 0.0;
      this.ax = 0.0;
      this.ay = 0.0;
      this.state.grounded = false;
      this.state.rebounded = false;
    }
  }

  reachGoal(map) {
    const { rowi, rowf, coli, colf } = map.intersection(this.body);
    for (let r = rowi; r <= rowf; ++r) {
      for (let c = coli; c <= colf; ++c) {
        if (map.endpoint.c === c && map.endpoint.r === r) {
          map.load();
        }
      }
    }
  }

  x() {
    return this.body.x;
  }

  y() {
    return this.body.y;
  }

  w() {
    return this.body.w;
  }

  h() {
    return this.body.h;
  }

  updateState() {
    if (!this.state.grounded) {
      if (this.vy <= 0) {
        this.state.movement = STATES.MOVEMENT.RISING;
      } else {
        this.state.movement = STATES.MOVEMENT.FALLING;
      }
    }
  }

  updateX(updateTime, map) {
    this.vx += Physics.velocity(this.ax, updateTime);
    this.vx *= MOVE_HORIZ_FRICTION;

    let delta = Physics.position(this.vx, this.ax, updateTime);
    if (delta > 0) {
      let tile = map.collidingTiles(this.rightCollision(delta));
      if (tile) {
        this.body.x = tile.x - this.collisionX.right();
        this.vx = 0.0;
      } else {
        this.body.x += delta;
      }
      tile = map.collidingTiles(this.leftCollision(0));
      if (tile) {
        this.body.x = tile.x + this.collisionX.right();
      }
    } else {
      let tile = map.collidingTiles(this.leftCollision(delta));
      if (tile) {
        this.body.x = tile.x + this.collisionX.right();        
        this.vx = 0.0;
      } else {
        this.body.x += delta;
      }
      tile = map.collidingTiles(this.rightCollision(0));
      if (tile) {
        this.body.x = tile.x - this.collisionX.right();
      }
    }
  }

  updateY(updateTime, map) {
    this.vy += Physics.velocity(GRAVITY_ACCEL, updateTime);

    let delta = Physics.position(this.vy, this.ay, updateTime);
    if (delta > 0) {
      let tile = map.collidingTiles(this.bottomCollision(delta));
      if (tile) {
        this.body.y = tile.y - this.collisionY.bottom();
        this.vy = 0.0;
        this.state.grounded = true;
      } else {
        this.body.y += delta;
        this.state.grounded = false;
      }
      tile = map.collidingTiles(this.topCollision(0));
      if (tile) {
        this.body.y = tile.y + this.collisionY.height();
      }
    } else {
      let tile = map.collidingTiles(this.topCollision(delta));
      if (tile) {
        this.body.y = tile.y + this.collisionY.height();
        this.vy = 0.0;
      } else {
        this.body.y += delta;
        this.state.grounded = false;
      }
      tile = map.collidingTiles(this.bottomCollision(0));
      if (tile) {
        this.body.y = tile.y - this.collisionY.bottom();
        this.state.grounded = true;
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

    this.boundryCollision(map);
    this.reachGoal(map);
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
    this.key = 'map-0';
  }

  load() {
    let num = parseInt(this.key.split('-').pop());
    this.key = 'map-'+ (++num);
    this.read(this.key);
  }

  read(key) {
    const map = document.getElementById(key);
    if (!map) {
      return;
    }

    const size = this.cell(map);
    this.tiles = new Array(size.r);
    for (let r = 0; r < this.rows(); ++r) {
      this.tiles[r] = new Array(size.c);
      for (let c = 0; c < this.cols(); ++c) {
        this.tiles[r][c] = null;
      }
    }

    for (let elem of map.getElementsByTagName('tile')) {
      const { r, c } = this.cell(elem);
      this.tiles[r][c] = new Tile(
        TILE_SIZE * c,
        TILE_SIZE * r,
        TILE_SIZE,
        TILE_SIZE,
        elem.getAttribute('color'),
        true
      );
    }

    for (let r = 0; r < this.tiles.length; ++r) {
      for (let c = 0; c < this.tiles[r].length; ++c) {
        if (!this.tiles[r][c]) {
          this.tiles[r][c] = new Tile(
            TILE_SIZE * c,
            TILE_SIZE * r,
            TILE_SIZE,
            TILE_SIZE
          );
        }
      }
    }

    this.checkpoint = this.coordinate(
      map.getElementsByTagName('start')[0]
    );
    this.endpoint = this.cell(
      map.getElementsByTagName('endpoint')[0]
    );
  }

  coordinate(elem) {
    const { r, c } = this.cell(elem);
    return {
      x: c * TILE_SIZE,
      y: r * TILE_SIZE,
    };
  }

  cell(elem) {
    return {
      r: parseInt(elem.getAttribute('y')),
      c: parseInt(elem.getAttribute('x')),
    };
  }

  intersection(rect) {
    return {
      rowi: Math.floor(rect.top() / TILE_SIZE),
      rowf: Math.floor(rect.bottom() / TILE_SIZE),
      coli: Math.floor(rect.left() / TILE_SIZE),
      colf: Math.floor(rect.right() / TILE_SIZE),
    };
  }

  collidingTiles(rect) {
    const { rowi, rowf, coli, colf } = this.intersection(rect);
    for (let r = rowi; r <= rowf; ++r) {
      for (let c = coli; c <= colf; ++c) {
        if (this.tiles[r][c].collidable) {
          return this.tiles[r][c].rect;
        }
      }
    }
    return null;
  }

  outOfBounds(rect) {
    const { rowi, rowf, coli, colf } = this.intersection(rect);
    return (
      rowi <= this.lowRowBound() ||
      rowf >= this.highRowBound() ||
      coli <= this.lowColBound() ||
      colf >= this.highColBound()
    );
  }

  resetCheckpoint(player) {
    player.body.x = this.checkpoint.x;
    player.body.y = this.checkpoint.y;
  }

  lowRowBound() {
    return 1;
  }

  highRowBound() {
    return this.rows() - 2;
  }

  lowColBound() {
    return 1;
  }

  highColBound() {
    return this.cols() - 2;
  }

  rows() {
    return this.tiles.length;
  }

  cols() {
    return this.tiles[0].length;
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

  center(subject) {
    this.view.x = (subject.body.x + subject.body.w / 2) - this.view.w / 2;
    this.view.y = (subject.body.y + subject.body.h / 2) - this.view.h / 2;
  }

  capture(subject) {
    let x = Math.round(subject.body.x - this.view.x);
    let y = Math.round(subject.body.y - this.view.y);
    subject.draw(this.context, x, y);
  }

  captureMap(map) {
    for (let row of map.tiles) {
      for (let tile of row) {
        var x = Math.round(tile.rect.x - this.view.x);
        var y = Math.round(tile.rect.y - this.view.y);
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
    this.player = new Player(this.media, this.map.checkpoint.x, this.map.checkpoint.y);    
  }

  initMap() {
    this.map = new Map();
    this.map.load();
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
    this.player.update(updateTime, this.map);
  }

  draw() {
    this.camera.center(this.player);
    this.camera.capture(this.player);
    this.camera.captureMap(this.map);
  }
}

window.addEventListener('load', () => {
  let game = new Game();
  game.run();
});

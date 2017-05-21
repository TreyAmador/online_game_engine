// the player class



// TODO add sprite to body
// TODO add width and height to body
//      bodies have physical properties... 
// TODO physics calculations handled here



function inherits_from(SuperClass,SubClass,members) {
    SubClass.prototype = new SuperClass();
    SubClass.prototype.constructor = SubClass;
    SuperClass.call(SubClass);
}



function Body(x,y,w,h) {
    
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;



}


Body.prototype.set_pos = function(x,y) {
    this.x = x;
    this.y = y;
}


Body.prototype.set_dimensions = function(w,h) {
    this.w = w;
    this.h = h;
}


Body.prototype.set_spatiality = function(x,y,w,h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
}


Body.prototype.update = function(elapsed_time) {

}


Body.prototype.draw = function(context) {

}


//inherits_from(Body,Quadrangle);



// the player class will inherit this or something like it
function Quadrangle(x,y,w,h) {
    //inherits_from(Body,this);
    //this.set_spatiality()
}

inherits_from(Body,Quadrangle);


//var BaseBody;
//console.log(BaseBody);


// a player class
function Player(BaseBody) {
    // TODO try to find a way to call from inside constructor
    

    //inherits_from(Body,Quadrangle);
    //inherits_from(Quadrangle,Player);
    
    //for (var i = 0; i < BaseBody.length; ++i) {
    //    console.log(BaseBody[i]);
    //}


    // append elements of superclass to subclass
    // by iterating through the superclass
    var quad = new Quadrangle();

    for (var i in quad) {
        console.log(i,quad[i]);
    }

    this.sprites = {};
    this.state = null;
    
}



//console.log(BaseBody);
// an inheritance method that sets the function
inherits_from(Quadrangle,Player);


Player.prototype.add_coord_sprite = function(filepath,frames,w,h,state) {
    this.sprites[state] = new Sprite();
    this.sprites[state].init_img(filepath,MediaManager);
    this.sprites[state].init_coord_frames(frames,w,h);
}


Player.prototype.add_row_sprite = function() {
    
}


Player.prototype.set_state = function(state) {
    this.state = state;
}


Player.prototype.draw = function(context,x,y) {
    this.sprites[this.state].draw(context,x,y);
}


Player.prototype.update = function(elapsed_time) {
    this.sprites[this.state].update(elapsed_time);
}










/*

// example of how to inheritance chains

function inherit_func(SuperClass,SubClass) {
    SubClass.prototype = new SuperClass();
    SubClass.prototype.constructor = SubClass;
    SuperClass.call(SubClass);
}

function SuperClass() {
    this.super_var = 'super var';
    console.log(this.super_var,'from super constructor');
}

SuperClass.prototype.super_func = function() {
    console.log(this.super_var,'from super_func');
}

function SubClass() {
    //inherit_func(SuperClass,this);
    this.sub_var = 'sub var';
    //console.log(this.sub_var,'from sub constructor');
    //console.log(this.super_var,'from sub constructor');
}

inherit_func(SuperClass,SubClass);

SubClass.prototype.sub_func = function() {
    console.log(this.sub_var,'from sub_func');
    console.log(this.super_var,'from sub_func');
}

function SubSubClass() {
    //inherit_func(SubClass,this);
    this.sub_sub_var = 'sub sub var';
}

inherit_func(SubClass,SubSubClass);

SubSubClass.prototype.sub_sub_func = function() {
    console.log(this.sub_sub_var,'from sub_sub_func');
    console.log(this.super_var,'from sub_sub_func');
}

var sub = new SubSubClass();
sub.super_func();
sub.sub_func();
sub.sub_sub_func();

*/




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
    

    // append elements of superclass to subclass
    // by iterating through the superclass
    //var quad = new Quadrangle();
    //for (var i in quad) {
    //    console.log(i,quad[i]);
    //}


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


// example of how to inheritance chains
//function inherit_func(SuperClass,SubClass) {
//    SubClass.prototype = new SuperClass();
//    SubClass.prototype.constructor = SubClass;
//    SuperClass.call(SubClass);
//}



/*

// an example of weird inheritance

function inherit_func(SuperClass,SubClass) {

    var super_class = new SuperClass();

    //console.log('SuperClass of inherit_from',SuperClass.prototype);
    //console.log('SubClass of inherit_from',SubClass.prototype);
    //console.log('super_class of inherit_from',super_class.constructor);
    
    //var func = function() {}
    
    //console.log('begin inherit',super_class.constructor);

    for (var i in super_class) {
        //console.log('inherit_func iter',i,super_class[i]);
        //console.log('inherit String!',i,super_class[i].toString());
        if (super_class[i] === SuperClass.prototype.constructor) {
            console.log('They are equal!');
        } else {
            console.log('They are NOT equal!');
            console.log(super_class.constructor);
            console.log(super_class[i]);
        }
        SubClass.prototype[i] = super_class[i];
    }

    //SubClass.prototype = super_class;
    SubClass.prototype.constructor = SubClass;
    SuperClass.call(SubClass);

    console.log('\n');
    console.log('\n');

}

function SuperClass() {
    this.super_var = 'super var';
}

SuperClass.prototype.super_func = function() {
    console.log(this.super_var,'super_func');
}

function SubClass() {
    this.sub_var = 'sub var';
}

inherit_func(SuperClass,SubClass);

SubClass.prototype.sub_func = function() {
    console.log(this.sub_var,'sub_func');
    console.log(this.super_var,'sub_func');
}

function SubSubClass() {
    this.sub_sub_var = 'sub sub var';
}

inherit_func(SubClass,SubSubClass);

SubSubClass.prototype.sub_sub_func = function() {

}

var sub = new SubClass();
//console.log('super func to be called');
//sub.super_func();
//sub.sub_func();
//console.log('Sub prototype',sub);

*/



/*

function inherit_iter(SuperClass,BaseClass) {

}

var SuperClass = {
    x:null,y:null,w:null,h:null,
    set_vars:function(x,y,w,h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    },
    super_func:function() {
        console.log('inside the super_func');
    },
    get_vars:function() {
        console.log(this.x,this.y,this.w,this.h);
    }
};

function BaseClass() {
    for (var i in SuperClass) {
        this[i] = SuperClass[i];
    }
}

BaseClass.prototype.sub_class = function() {
    console.log('from inside sub_class');
}

var base_class = new BaseClass();
base_class.set_vars(1,2,3,4);
base_class.super_func();
base_class.get_vars();
base_class.sub_class();


var base_class_next = new BaseClass();
base_class_next.set_vars(5,6,7,8);
base_class_next.get_vars();
base_class_next.sub_class();

*/


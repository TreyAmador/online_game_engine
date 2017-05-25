


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


var particleSystem = [];
var attractors = []; 
/*var awesomeSound;
function preload(){
    awesomeSound = loadSound('explosion.m4a');
}*/

//creates canvas, runs once per time screen is refreshed
function setup() {
    var canvas = createCanvas(windowWidth,windowHeight);
    frameRate(30);
    
    colorMode(HSB, 360, 100, 100, 100);
    background(0);
    
    for (var i=0; i<8; i++){
        var at = new Attractor(createVector((i+1)*(width/9), height/2), 2);
        attractors.push(at);
    };
}
   

//draw everything on the screen - makes screen happen to update at the specified rate
function draw(){
    background(0, 0, 0, 10);
    blendMode(SCREEN);
    
    for (var i=particleSystem.length-1; i>=0; i--){
        var p = particleSystem[i];
        if(p.areYouDeadYet()){
            //removes the particle from the array
            particleSystem.splice(i, 1);
            /*if(particleSystem.length<150 
               && p.getPos().x > 0
               && p.getPos().x < width 
               && p.getPos().y > 0 
               && p.getPos().y < height)
                createMightyParticles(p.getPos());*/
        }else{
            //updates and renders the particle
            p.update();
            p.draw();
            
        }
        
    }
   
    if(mouseIsPressed) {
        createMightyParticles();
    }
    
    attractors.forEach(function(at){
        at.draw();
    
    });
                      
}

//resize window and everything will happen inside screen
function windowResized(){
    resizeCanvas(windowWidth, windowHeight);

}

/*defines what a particle is, gets called everytime particle created
doesn't make particle until it gets called*/
var Particle = function(pp, vv, hue){
    this.getPos = function (){
        return pp.copy();
    }
    
    //what values the particle should have
    var initialLifeSpan = random(3000,10000);
    var pp = pp.copy();
    var vv = vv.copy();
    var acc = createVector(0, 0.4);
    var psize = random(3, 15);
    var lifeSpan = initialLifeSpan;
    var hue = random(hue-15, hue+15);
    
    //allows particle to update itself - change the values stored inside of that function
    this.update = function(){
        lifeSpan--; 
        vv = vv.add(acc);
        //take vv, make a copy, add the acceleration to it
        pp = pp.add(vv);  
        
        attractors.forEach(function(A){
            var att = p5.Vector.sub(A.getPos(), pp);
            var distanceSq = att.magSq();
            
            if(distanceSq > 1){
                att.div(distanceSq*psize);
               
                att.mult(25 * A.getStrength());
                acc.add(att);            
            }
        });
        
        vv.add(acc);
        pp.add(vv);
        acc.mult(0);
        vv.limit(8);
    }  
    
    
    this.draw = function(){
        var transparency = map(lifeSpan, 0, initialLifeSpan, 0, 100);
        stroke(hue, 100, 100, transparency);
        //line(pp.x, pp.y, pp.x - 3 * vv.x, pp.y - 3 * vv.y);    
        fill(hue, 100, 100, transparency);
        noStroke();
        ellipse(pp.x, 
                pp.y,
                psize,
                psize);
        
    }
    
    this.areYouDeadYet = function(){
        return lifeSpan <= 0;
    }
}

//create particle on mouse click
function createMightyParticles(focalPoint){
    //awesomeSound.play();
    var hue = random(20, 300);
    var pp;
    if(!focalPoint){
        pp = createVector(mouseX,mouseY);
    }else{
        pp = createVector(focalPoint.x, focalPoint.y);
    } 
    var numberOfParticles = random(10, 30);
    for(var i=0; i<numberOfParticles; i++){
        var vv = createVector(0, 1);
        vv.rotate(random(0, TWO_PI));
        vv.mult(random(1, 3));
        
        var newBorn = new Particle(pp, vv, hue);
        particleSystem.push(newBorn);   
    }
    
    /*var checkEdges = function(){
            if (pp.x > width){
                pp.x = width;
                vv.x *=-1;
            }else if (pp.x < 0){
                vv.x *=-1;
                pp.x = 0
            }
        
            if (pp.y > height){
                vv.y *=-1;
                pp.y = height;
            }
        }*/
    
    
}

function mouseClicked(){
    createMightyParticles();
}



var Attractor = function(pos, s){
    var pos = pos.copy();
    var strength = s;
    this.draw = function() {
        noStroke();
        fill(170, 100, 50);
        rect(pos.x, pos.y, 2, 100);
        
        /*ellipse(pos.x, pos.y,
                30, 30);*/
    }
    
    this.getStrength = function(){
        return strength;
    }
    this.getPos = function(){ //defining function here - telling it what getPos is
        return pos.copy();
    }
}
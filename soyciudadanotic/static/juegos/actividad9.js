var puntos = 0;

var w = 800;
var h = 600;
var game = null;

function crear_game(){
    game = new Phaser.Game(w, h, Phaser.AUTO, null, {
      preload: preload, create: create, update: update
    });
}

function iniciar(){
    game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, render: render });
var titulo_puntos = 'Puntos: '+puntos;
var arraySpaceShips;
var tutorial_off;
var tutorial_canvas;
var tutorial_text;
var tutorial_button;
var text_button;
function preload() {

   
    game.load.image('espacio', '../../static/img/espacio.jpg' )
    game.load.image('spaceship1', '../../static/img/nave1.png' )
    game.load.image('spaceship2', '../../static/img/nave2.png' )
    game.load.image('interfaz', '../../static/img/interfaz_canvas.png' )
    game.load.image('button', '../../static/img/button.png' )
    game.physics.startSystem(Phaser.Physics.ARCADE);

    
}

function create() {

    tutorial_off=false;
    //Metodó para bloquear el menú del clic derecho del mouse
    game.canvas.oncontextmenu = function (e) {e.preventDefault (); }
    game.stage.backgroundColor = '#943021';

    espacio = game.add.sprite(0, 0, 'espacio');
    espacio.inputEnabled = true;
    game.input.mouse.capture = true;



    arraySpaceShips = [];

    for (var i = 0; i < 10; i++) {
     
        image = game.add.sprite(0, 0, 'spaceship1');

        game.physics.enable(image, Phaser.Physics.ARCADE);
        image.scale.set(0.35,0.35);
        image.x = game.rnd.integerInRange(100, 700);
        
        image.y = game.rnd.integerInRange(100, 500);
        //  This gets it moving
        var vel=  20;
        var randomX = game.rnd.integerInRange(0, 100);
        var randomY = game.rnd.integerInRange(0, 100);
        var dirX=1;
        var dirY=1;
        if (randomX>50) {dirX=-1}
        if (randomY>50) {dirY=-1}
        image.body.velocity.setTo(dirX*vel,dirY*vel);
        
        //  This makes the game world bounce-able
        image.body.collideWorldBounds = true;
        image.inputEnabled = true;
        image.input.useHandCursor = true;
        image.events.onInputDown.add(click, this);
        
        //  This sets the image bounce energy for the horizontal 
        //  and vertical vectors. "1" is 100% energy return
        image.body.bounce.set(1);
        arraySpaceShips[i] = image;
     }
     for (var i = 0; i < 10; i++) {
     
        //image=game.add.button(0,0, 'spaceship2',clickIzq,i,2,1,0);
        image = game.add.sprite(0, 0, 'spaceship2');
        image.scale.set(0.35,0.35);
        game.physics.enable(image, Phaser.Physics.ARCADE);
        image.x = game.rnd.integerInRange(100, 700);
        image.y = game.rnd.integerInRange(100, 500);
        //  This gets it moving
        var vel=  game.rnd.integerInRange(50, 80);
        var randomX = game.rnd.integerInRange(0, 100);
        var randomY = game.rnd.integerInRange(0, 100);
        var dirX=1;
        var dirY=1;
        if (randomX>50) {dirX=-1}
        if (randomY>50) {dirY=-1}
        image.body.velocity.setTo(dirX*vel,dirY*vel);
        
        //  This makes the game world bounce-able
        image.body.collideWorldBounds = true;
        
        //  This sets the image bounce energy for the horizontal 
        //  and vertical vectors. "1" is 100% energy return
        image.body.bounce.set(1);
        image.inputEnabled = true;
        image.input.useHandCursor = true;
        image.events.onInputDown.add(click, this);
        arraySpaceShips[i+10] = image;
     }


     text_puntos = game.add.text(0, 0, titulo_puntos, {font: '50px Calibri'});
     text_puntos.addColor('#ffffff',0);
     tutorial_canvas = game.add.sprite(game.width*0.5,-game.height*0.5,"interfaz");
     tutorial_canvas.anchor.set(0.5,0.5);
     var nave1 = game.add.sprite(-tutorial_canvas.width*0.5,0,"spaceship1");
     nave1.scale.set(0.5,0.5);
     nave1.x+=nave1.width*0.5+25;
     nave1.y+=nave1.height*0.5;
     nave1.anchor.set(0.5,0.5);
     
     var nave2 = game.add.sprite(tutorial_canvas.width*0.5,0,"spaceship2");
     nave2.scale.set(0.5,0.5);
     nave2.x-=nave2.width*0.5+25;
     nave2.y+=nave2.height*0.5;
     nave2.anchor.set(0.5,0.5);
     
    tutorial_text = game.add.text(0,-tutorial_canvas.height*0.25,"En esta actividad obtendras puntos cada vez que elimines una nave.\n Puede dar click a las naves para eliminarlas",{font:"bold 30px Calibri", align:"CENTER", wordWrapWidth: tutorial_canvas.width*0.85,  wordWrap:true, });
    tutorial_text.addColor('#1E3077',0);
    tutorial_text.anchor.set(0.5,0.5);
    tutorial_canvas.addChild(nave1);
    tutorial_canvas.addChild(nave2);
    tutorial_canvas.addChild(tutorial_text);
    //tutorial_canvas.visible=false;
    tutorial_text = game.add.text(nave1.x,nave1.y+nave1.height*0.5+5,"Click izquierdo",{font:"bold 30px Calibri", align:"CENTER", wordWrapWidth: nave1.width*0.85,  wordWrap:true, });
    tutorial_text.y+=tutorial_text.height*0.5;
    tutorial_text.addColor('#1E3077',0);
    tutorial_text.anchor.set(0.5,0.5);
    tutorial_canvas.addChild(tutorial_text);


    tutorial_text = game.add.text(nave2.x,nave2.y+nave2.height*0.5+5,"Click derecho",{font:"bold 30px Calibri", align:"CENTER", wordWrapWidth: nave2.width*0.85,  wordWrap:true, });
    tutorial_text.y+=tutorial_text.height*0.5;
    tutorial_text.addColor('#1E3077',0);
    tutorial_text.anchor.set(0.5,0.5);
    tutorial_canvas.addChild(tutorial_text);


    tutorial_button = game.add.button(0,tutorial_canvas.height*0.25,"button",startGame,this);
    tutorial_button.scale.set(0.5,0.5);
    tutorial_button.anchor.set(0.5,0.5);
    tutorial_canvas.addChild(tutorial_button);

    text_button = game.add.text(0,0,"Continuar",{font:"bold 60px Calibri", align:"CENTER", wordWrapWidth: tutorial_button.width*0.85,  wordWrap:true, });
    text_button.addColor('#1E3077',0);
    text_button.anchor.set(0.5,0.5);
    tutorial_button.addChild(text_button);


    var tween = game.add.tween(tutorial_canvas);

    //  The object defines the properties to tween.
    //  In this case it will move to x 800
    //  The 5000 is the duration in ms - 5000ms = 5 seconds
    tween.to({ y: game.height*0.5 }, 1000, 'Linear', true, 0);
    //  This creates a simple sprite that is using our loaded image and
    //  displays it on-screen
    //  and assign it to a variable
   


}
function startGame()
{
    tutorial_off=true;
    tutorial_canvas.visible=false;
}
function click(sprite,pointer)
{
    if (tutorial_off)
    {

        var index; 
        if (pointer.leftButton.isDown)
         {
            index = arraySpaceShips.indexOf(sprite);
            if (index<10)
            {
                
                sprite.destroy();
                puntos = puntos + 5;
                text_puntos.text = 'Puntos:'+puntos;
            }

         }
         else if (pointer.rightButton.isDown) 
         {
            index = arraySpaceShips.indexOf(sprite);
            if (index>=10) 
            {
                sprite.destroy();
                puntos = puntos + 5;
                text_puntos.text = 'Puntos:'+puntos;
            }
         }



    }
    if(puntos == 100){
        tutorial_canvas.destroy();
        tutorial_button.destroy();
        text_button.destroy();
        tutorial_text.destroy();
        tutorial_canvas = game.add.sprite(game.width*0.5,-game.height*0.5,"interfaz");
        tutorial_canvas.anchor.set(0.5,0.5);
        tutorial_text = game.add.text(0,-tutorial_canvas.height*0.25,"Felicidades actividad terminada \n recuerde dar clic en el botón enviar \n que esta al lado izquierdo, para guardar la puntuación",{font:"bold 30px Calibri", align:"CENTER", wordWrapWidth: tutorial_canvas.width*0.85,  wordWrap:true, });
        tutorial_text.addColor('#1E3077',0);
        tutorial_text.y = 0;
        tutorial_text.anchor.set(0.5,0.5);
        tutorial_canvas.addChild(tutorial_text);
        var tween = game.add.tween(tutorial_canvas);
        tween.to({ y: game.height*0.5 }, 1000, 'Linear', true, 0)
           
    }

    
}
function update(){

}

function render() {
    
}
    
            
}



function get_puntos(){
    return puntos;
}

function reiniciar(){
    game.destroy();

    puntos = 0;

    game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, render: render });
var titulo_puntos = 'Puntos: '+puntos;
var arraySpaceShips;
var tutorial_off;
var tutorial_canvas;
var tutorial_text;
var tutorial_button;
var text_button;
function preload() {

   
    game.load.image('espacio', '../../static/img/espacio.jpg' )
    game.load.image('spaceship1', '../../static/img/nave1.png' )
    game.load.image('spaceship2', '../../static/img/nave2.png' )
    game.load.image('interfaz', '../../static/img/interfaz_canvas.png' )
    game.load.image('button', '../../static/img/button.png' )
    game.physics.startSystem(Phaser.Physics.ARCADE);

    
}

function create() {

    tutorial_off=false;
    //Metodó para bloquear el menú del clic derecho del mouse
    game.canvas.oncontextmenu = function (e) {e.preventDefault (); }
    game.stage.backgroundColor = '#943021';

    espacio = game.add.sprite(0, 0, 'espacio');
    espacio.inputEnabled = true;
    game.input.mouse.capture = true;



    arraySpaceShips = [];

    for (var i = 0; i < 10; i++) {
     
        image = game.add.sprite(0, 0, 'spaceship1');

        game.physics.enable(image, Phaser.Physics.ARCADE);
        image.scale.set(0.35,0.35);
        image.x = game.rnd.integerInRange(100, 700);
        
        image.y = game.rnd.integerInRange(100, 500);
        //  This gets it moving
        var vel=  50;
        var randomX = game.rnd.integerInRange(0, 100);
        var randomY = game.rnd.integerInRange(0, 100);
        var dirX=1;
        var dirY=1;
        if (randomX>50) {dirX=-1}
        if (randomY>50) {dirY=-1}
        image.body.velocity.setTo(dirX*vel,dirY*vel);
        
        //  This makes the game world bounce-able
        image.body.collideWorldBounds = true;
        image.inputEnabled = true;
        image.input.useHandCursor = true;
        image.events.onInputDown.add(click, this);
        
        //  This sets the image bounce energy for the horizontal 
        //  and vertical vectors. "1" is 100% energy return
        image.body.bounce.set(1);
        arraySpaceShips[i] = image;
     }
     for (var i = 0; i < 10; i++) {
     
        //image=game.add.button(0,0, 'spaceship2',clickIzq,i,2,1,0);
        image = game.add.sprite(0, 0, 'spaceship2');
        image.scale.set(0.35,0.35);
        game.physics.enable(image, Phaser.Physics.ARCADE);
        image.x = game.rnd.integerInRange(100, 700);
        image.y = game.rnd.integerInRange(100, 500);
        //  This gets it moving
        var vel=  game.rnd.integerInRange(50, 80);
        var randomX = game.rnd.integerInRange(0, 100);
        var randomY = game.rnd.integerInRange(0, 100);
        var dirX=1;
        var dirY=1;
        if (randomX>50) {dirX=-1}
        if (randomY>50) {dirY=-1}
        image.body.velocity.setTo(dirX*vel,dirY*vel);
        
        //  This makes the game world bounce-able
        image.body.collideWorldBounds = true;
        
        //  This sets the image bounce energy for the horizontal 
        //  and vertical vectors. "1" is 100% energy return
        image.body.bounce.set(1);
        image.inputEnabled = true;
        image.input.useHandCursor = true;
        image.events.onInputDown.add(click, this);
        arraySpaceShips[i+10] = image;
     }


     text_puntos = game.add.text(0, 0, titulo_puntos, {font: '50px Calibri'});
     text_puntos.addColor('#ffffff',0);
     tutorial_canvas = game.add.sprite(game.width*0.5,-game.height*0.5,"interfaz");
     tutorial_canvas.anchor.set(0.5,0.5);
     var nave1 = game.add.sprite(-tutorial_canvas.width*0.5,0,"spaceship1");
     nave1.scale.set(0.5,0.5);
     nave1.x+=nave1.width*0.5+25;
     nave1.y+=nave1.height*0.5;
     nave1.anchor.set(0.5,0.5);
     
     var nave2 = game.add.sprite(tutorial_canvas.width*0.5,0,"spaceship2");
     nave2.scale.set(0.5,0.5);
     nave2.x-=nave2.width*0.5+25;
     nave2.y+=nave2.height*0.5;
     nave2.anchor.set(0.5,0.5);
     
    tutorial_text = game.add.text(0,-tutorial_canvas.height*0.25,"En esta actividad obtendras puntos cada vez que elimines una nave.\n Puede dar click a las naves para eliminarlas",{font:"bold 30px Calibri", align:"CENTER", wordWrapWidth: tutorial_canvas.width*0.85,  wordWrap:true, });
    tutorial_text.addColor('#1E3077',0);
    tutorial_text.anchor.set(0.5,0.5);
    tutorial_canvas.addChild(nave1);
    tutorial_canvas.addChild(nave2);
    tutorial_canvas.addChild(tutorial_text);
    //tutorial_canvas.visible=false;
    tutorial_text = game.add.text(nave1.x,nave1.y+nave1.height*0.5+5,"Click izquierdo",{font:"bold 30px Calibri", align:"CENTER", wordWrapWidth: nave1.width*0.85,  wordWrap:true, });
    tutorial_text.y+=tutorial_text.height*0.5;
    tutorial_text.addColor('#1E3077',0);
    tutorial_text.anchor.set(0.5,0.5);
    tutorial_canvas.addChild(tutorial_text);


    tutorial_text = game.add.text(nave2.x,nave2.y+nave2.height*0.5+5,"Click derecho",{font:"bold 30px Calibri", align:"CENTER", wordWrapWidth: nave2.width*0.85,  wordWrap:true, });
    tutorial_text.y+=tutorial_text.height*0.5;
    tutorial_text.addColor('#1E3077',0);
    tutorial_text.anchor.set(0.5,0.5);
    tutorial_canvas.addChild(tutorial_text);


    tutorial_button = game.add.button(0,tutorial_canvas.height*0.25,"button",startGame,this);
    tutorial_button.scale.set(0.5,0.5);
    tutorial_button.anchor.set(0.5,0.5);
    tutorial_canvas.addChild(tutorial_button);

    text_button = game.add.text(0,0,"Continuar",{font:"bold 60px Calibri", align:"CENTER", wordWrapWidth: tutorial_button.width*0.85,  wordWrap:true, });
    text_button.addColor('#1E3077',0);
    text_button.anchor.set(0.5,0.5);
    tutorial_button.addChild(text_button);


    var tween = game.add.tween(tutorial_canvas);

    //  The object defines the properties to tween.
    //  In this case it will move to x 800
    //  The 5000 is the duration in ms - 5000ms = 5 seconds
    tween.to({ y: game.height*0.5 }, 1000, 'Linear', true, 0);
    //  This creates a simple sprite that is using our loaded image and
    //  displays it on-screen
    //  and assign it to a variable
   


}
function startGame()
{
    tutorial_off=true;
    tutorial_canvas.visible=false;
}
function click(sprite,pointer)
{
    if (tutorial_off)
    {

        var index; 
        if (pointer.leftButton.isDown)
         {
            index = arraySpaceShips.indexOf(sprite);
            if (index<10)
            {
                
                sprite.destroy();
                puntos = puntos + 5;
                text_puntos.text = 'Puntos:'+puntos;
            }

         }
         else if (pointer.rightButton.isDown) 
         {
            index = arraySpaceShips.indexOf(sprite);
            if (index>=10) 
            {
                sprite.destroy();
                puntos = puntos + 5;
                text_puntos.text = 'Puntos:'+puntos;
            }
         }



    }
    if(puntos == 100){
        tutorial_canvas.destroy();
        tutorial_button.destroy();
        text_button.destroy();
        tutorial_text.destroy();
        tutorial_canvas = game.add.sprite(game.width*0.5,-game.height*0.5,"interfaz");
        tutorial_canvas.anchor.set(0.5,0.5);
        tutorial_text = game.add.text(0,-tutorial_canvas.height*0.25,"Felicidades actividad terminada \n recuerde dar clic en el botón enviar \n que esta al lado izquierdo, para guardar la puntuación",{font:"bold 30px Calibri", align:"CENTER", wordWrapWidth: tutorial_canvas.width*0.85,  wordWrap:true, });
        tutorial_text.addColor('#1E3077',0);
        tutorial_text.y = 0;
        tutorial_text.anchor.set(0.5,0.5);
        tutorial_canvas.addChild(tutorial_text);
        var tween = game.add.tween(tutorial_canvas);
        tween.to({ y: game.height*0.5 }, 1000, 'Linear', true, 0)
           
    }

    
}
function update(){

}

function render() {
    
}

}    

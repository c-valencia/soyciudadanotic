var puntos = 0;

var w = 800;
var h = 600;
var game = null;

function iniciar(){
    var game = new Phaser.Game(w, h, Phaser.AUTO, null, {
      preload: preload, create: create, update: update
    });
     
   
    var pantalla;
    var torre;
    var teclado;
    var raton;
    var text_puntos;

    var mesa_base;
    var pantalla_base;
    var torre_base;
    var teclado_base;
    var raton_base;
    var titulo_puntos = 'Puntos: '+puntos;
    var text_piesa;

    var tutorial_canvas;
    var tutorial_text;
    var tutorial_button;
    var text_button;

    function preload() {
        //Configuración para escalar el script al tamaño de pantalla
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        //game.scale.pageAlignHorizontally = true;
        //game.scale.pageAlignVertically = true;
        game.stage.backgroundColor = '#eee';
        
        game.load.image('mesa_base', '../../static/img/mesa.png');
        game.load.image('pantalla_base', '../../static/img/pantalla.png');
        game.load.image('torre_base', '../../static/img/torre.png');
        game.load.image('teclado_base', '../../static/img/teclado.png');
        game.load.image('raton_base', '../../static/img/raton.png');
        game.load.image('pantalla', '../../static/img/pantalla.png');
        game.load.image('torre', '../../static/img/torre.png');
        game.load.image('teclado', '../../static/img/teclado.png');
        game.load.image('raton', '../../static/img/raton.png');
        game.load.image('interfaz', '../../static/img/interfaz_canvas.png' )
        game.load.image('button', '../../static/img/button.png' )
        

    }
    function create() {
        mesa_base = game.add.sprite(100, 80, 'mesa_base');
        pantalla_base = game.add.sprite(350, 80, 'pantalla_base');
        text_piesa = game.add.text(pantalla_base.x + 20, pantalla_base.y + pantalla_base.height*0.5 - 20,"Pantalla");
        torre_base = game.add.sprite(550, 120, 'torre_base');
        text_piesa = game.add.text(torre_base.x, torre_base.y + torre_base.height*0.5 - 20,"Torre");
        teclado_base = game.add.sprite(350 - 25, pantalla_base.y + pantalla_base.height -10, 'teclado_base');
        text_piesa = game.add.text(teclado_base.x + 20, teclado_base.y + teclado_base.height*0.5 - 20,"Teclado");
        raton_base = game.add.sprite(480, pantalla_base.y + pantalla_base.height, 'raton_base');
        text_piesa = game.add.text(raton_base.x, raton_base.y + raton_base.height*0.5 - 15,"Raton");
        pantalla = game.add.sprite(0, 120, 'pantalla');
        pantalla.inputEnabled = true;
        pantalla.input.enableDrag();
        torre = game.add.sprite(20, pantalla.y + pantalla.height + 5, 'torre');
        torre.inputEnabled = true;
        torre.input.enableDrag();
        teclado = game.add.sprite(0, torre.y + torre.height + 5, 'teclado');
        teclado.inputEnabled = true;
        teclado.input.enableDrag();
        raton = game.add.sprite(39, teclado.y + teclado.height + 5, 'raton');
        raton.inputEnabled = true;
        raton.input.enableDrag();
        pantalla_base.alpha = 0.0;
        torre_base.alpha = 0.0;
        teclado_base.alpha = 0.0;
        raton_base.alpha = 0.0;
        text_puntos = game.add.text(0, 5, titulo_puntos, {font: '50px Calibri'});
        game.input.onUp.add(onDragStop, this);

         //________________________________________________________________________________    
    tutorial_canvas = game.add.sprite(game.width*0.5,-game.height*0.5,"interfaz");
     tutorial_canvas.anchor.set(0.5,0.5);
     
     
    tutorial_text = game.add.text(0,-tutorial_canvas.height*0.25,"En esta actividad obtendrás puntos cada vez que ubiques una imagen sobre \n el texto que le corresponde.",{font:"bold 30px Calibri", align:"CENTER", wordWrapWidth: tutorial_canvas.width*0.85,  wordWrap:true, });
    tutorial_text.addColor('#1E3077',0);
    tutorial_text.anchor.set(0.5,0.5);
    tutorial_canvas.addChild(tutorial_text);
    //tutorial_canvas.visible=false;
    


    tutorial_button = game.add.button(0,tutorial_canvas.height*0.25,"button",cerrar_tutorial,this);
    tutorial_button.scale.set(0.5,0.5);
    tutorial_button.anchor.set(0.5,0.5);
    tutorial_canvas.addChild(tutorial_button);

    text_button = game.add.text(0,0,"Continuar",{font:"bold 60px Calibri", align:"CENTER", wordWrapWidth: tutorial_button.width*0.85,  wordWrap:true, });
    text_button.addColor('#1E3077',0);
    text_button.anchor.set(0.5,0.5);
    tutorial_button.addChild(text_button);


    var tween = game.add.tween(tutorial_canvas);
    tween.to({ y: game.height*0.5 }, 1000, 'Linear', true, 0);
    }

    function update() {
    }

    function checkOverlap(spriteA, spriteB) {
        var boundsA = spriteA.getBounds();
        var boundsB = spriteB.getBounds();
        return Phaser.Rectangle.intersects(boundsA, boundsB) && spriteA.inputEnabled == true;
    }

    function onDragStop() {
        moveSpriteToSprite(pantalla, pantalla_base);
        moveSpriteToSprite(torre, torre_base);
        moveSpriteToSprite(teclado, teclado_base);
        moveSpriteToSprite(raton, raton_base);
    }

    function moveSpriteToSprite(spriteA, spriteB){
        if (checkOverlap(spriteA, spriteB))
        {
            puntos = puntos + 25;
            text_puntos.text = 'Puntos: '+puntos;
            spriteA.inputEnabled=false;
            spriteA.enableDrag = false;
            tween = game.add.tween(spriteA).to( { y: spriteB.y, x: spriteB.x}, 500, Phaser.Easing.Bounce.Out, true);
            if(puntos == 100){
                tutorial_canvas.visible=true;
                tutorial_text.text = "Felicidades actividad terminada \n recuerde dar clic en el botón enviar \n que esta al lado izquierdo, para guardar la puntuación";
                tutorial_text.y = 0;
                tutorial_button.destroy();
                text_button.destroy();
            }
        }


    }

    function cerrar_tutorial()
    {
    
        tutorial_canvas.visible=false;
    }
    
            
}



function get_puntos(){
    return puntos;
}

function reiniciar(){
    game.destroy();

    puntos = 0;

    var game = new Phaser.Game(w, h, Phaser.AUTO, null, {
      preload: preload, create: create, update: update
    });
     
   
    var pantalla;
    var torre;
    var teclado;
    var raton;
    var text_puntos;

    var mesa_base;
    var pantalla_base;
    var torre_base;
    var teclado_base;
    var raton_base;
    var titulo_puntos = 'Puntos: '+puntos;
    var text_piesa;

    var tutorial_canvas;
    var tutorial_text;
    var tutorial_button;
    var text_button;

    function preload() {
        //Configuración para escalar el script al tamaño de pantalla
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        //game.scale.pageAlignHorizontally = true;
        //game.scale.pageAlignVertically = true;
        game.stage.backgroundColor = '#eee';
        
        game.load.image('mesa_base', '../../static/img/mesa.png');
        game.load.image('pantalla_base', '../../static/img/pantalla.png');
        game.load.image('torre_base', '../../static/img/torre.png');
        game.load.image('teclado_base', '../../static/img/teclado.png');
        game.load.image('raton_base', '../../static/img/raton.png');
        game.load.image('pantalla', '../../static/img/pantalla.png');
        game.load.image('torre', '../../static/img/torre.png');
        game.load.image('teclado', '../../static/img/teclado.png');
        game.load.image('raton', '../../static/img/raton.png');
        game.load.image('interfaz', '../../static/img/interfaz_canvas.png' )
        game.load.image('button', '../../static/img/button.png' )
        

    }
    function create() {
        mesa_base = game.add.sprite(100, 80, 'mesa_base');
        pantalla_base = game.add.sprite(350, 80, 'pantalla_base');
        text_piesa = game.add.text(pantalla_base.x + 20, pantalla_base.y + pantalla_base.height*0.5 - 20,"Pantalla");
        torre_base = game.add.sprite(550, 120, 'torre_base');
        text_piesa = game.add.text(torre_base.x, torre_base.y + torre_base.height*0.5 - 20,"Torre");
        teclado_base = game.add.sprite(350 - 25, pantalla_base.y + pantalla_base.height -10, 'teclado_base');
        text_piesa = game.add.text(teclado_base.x + 20, teclado_base.y + teclado_base.height*0.5 - 20,"Teclado");
        raton_base = game.add.sprite(480, pantalla_base.y + pantalla_base.height, 'raton_base');
        text_piesa = game.add.text(raton_base.x, raton_base.y + raton_base.height*0.5 - 15,"Raton", {font: "bold 20px Calibri"});
        pantalla = game.add.sprite(0, 120, 'pantalla');
        pantalla.inputEnabled = true;
        pantalla.input.enableDrag();
        torre = game.add.sprite(20, pantalla.y + pantalla.height + 5, 'torre');
        torre.inputEnabled = true;
        torre.input.enableDrag();
        teclado = game.add.sprite(0, torre.y + torre.height + 5, 'teclado');
        teclado.inputEnabled = true;
        teclado.input.enableDrag();
        raton = game.add.sprite(39, teclado.y + teclado.height + 5, 'raton');
        raton.inputEnabled = true;
        raton.input.enableDrag();
        pantalla_base.alpha = 0.0;
        torre_base.alpha = 0.0;
        teclado_base.alpha = 0.0;
        raton_base.alpha = 0.0;
        text_puntos = game.add.text(0, 5, titulo_puntos, {font: '50px Calibri'});
        game.input.onUp.add(onDragStop, this);

         //________________________________________________________________________________    
    tutorial_canvas = game.add.sprite(game.width*0.5,-game.height*0.5,"interfaz");
     tutorial_canvas.anchor.set(0.5,0.5);
     
     
    tutorial_text = game.add.text(0,-tutorial_canvas.height*0.25,"En esta actividad obtendrás puntos cada vez que ubiques una imagen sobre \n el texto que le corresponde.",{font:"bold 30px Calibri", align:"CENTER", wordWrapWidth: tutorial_canvas.width*0.85,  wordWrap:true, });
    tutorial_text.addColor('#1E3077',0);
    tutorial_text.anchor.set(0.5,0.5);
    tutorial_canvas.addChild(tutorial_text);
    //tutorial_canvas.visible=false;
    


    tutorial_button = game.add.button(0,tutorial_canvas.height*0.25,"button",cerrar_tutorial,this);
    tutorial_button.scale.set(0.5,0.5);
    tutorial_button.anchor.set(0.5,0.5);
    tutorial_canvas.addChild(tutorial_button);

    text_button = game.add.text(0,0,"Continuar",{font:"bold 60px Calibri", align:"CENTER", wordWrapWidth: tutorial_button.width*0.85,  wordWrap:true, });
    text_button.addColor('#1E3077',0);
    text_button.anchor.set(0.5,0.5);
    tutorial_button.addChild(text_button);


    var tween = game.add.tween(tutorial_canvas);
    tween.to({ y: game.height*0.5 }, 1000, 'Linear', true, 0);
    }

    function update() {
    }

    function checkOverlap(spriteA, spriteB) {
        var boundsA = spriteA.getBounds();
        var boundsB = spriteB.getBounds();
        return Phaser.Rectangle.intersects(boundsA, boundsB) && spriteA.inputEnabled == true;
    }

    function onDragStop() {
        moveSpriteToSprite(pantalla, pantalla_base);
        moveSpriteToSprite(torre, torre_base);
        moveSpriteToSprite(teclado, teclado_base);
        moveSpriteToSprite(raton, raton_base);
    }

    function moveSpriteToSprite(spriteA, spriteB){
        if (checkOverlap(spriteA, spriteB))
        {
            puntos = puntos + 25;
            text_puntos.text = 'Puntos: '+puntos;
            spriteA.inputEnabled=false;
            spriteA.enableDrag = false;
            tween = game.add.tween(spriteA).to( { y: spriteB.y, x: spriteB.x}, 500, Phaser.Easing.Bounce.Out, true);
            if(puntos == 100){
                tutorial_canvas.visible=true;
                tutorial_text.text = "Felicidades actividad terminada \n recuerde dar clic en el botón enviar \n que esta al lado izquierdo, para guardar la puntuación";
                tutorial_text.y = 0;
                tutorial_button.destroy();
                text_button.destroy();
            }
        }


    }

    function cerrar_tutorial()
    {
    
        tutorial_canvas.visible=false;
    }

}    

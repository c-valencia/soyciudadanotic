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
    game = new Phaser.Game(w, h, Phaser.AUTO, null, {
      preload: preload, create: create, update: update
    });
     
   
    var disco_duro;
    var procesador;
    var tarjeta_madre;
    var memoria_ram;
    var titulo_puntos = 'Puntos: '+puntos;
    var text_piesa;

    var fondo_pc;
    var disco_duro_base;
    var procesador_base;
    var tarjeta_madre_base;
    var memoria_ram_base;

    var tutorial_canvas;
    var tutorial_text;
    var tutorial_button;
    var text_button;

    function preload() {
        //Configuración para escalar el script al tamaño de disco_duro
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;
        game.stage.backgroundColor = '#eee';
        game.load.image('fondo_pc', '../../static/img/fondo_pc.png');
        game.load.image('disco_duro_base', '../../static/img/disco_duro.png');
        game.load.image('procesador_base', '../../static/img/procesador.png');
        game.load.image('tarjeta_madre_base', '../../static/img/tarjeta_madre.png');
        game.load.image('memoria_ram_base', '../../static/img/memoria_ram.png');
        game.load.image('disco_duro', '../../static/img/disco_duro.png');
        game.load.image('procesador', '../../static/img/procesador.png');
        game.load.image('tarjeta_madre', '../../static/img/tarjeta_madre.png');
        game.load.image('memoria_ram', '../../static/img/memoria_ram.png');
       
        game.load.image('interfaz', '../../static/img/interfaz_canvas.png' )
        game.load.image('button', '../../static/img/button.png' )
    }
    function create() {
        fondo_pc = game.add.sprite(280, 0, 'fondo_pc');
        //fondo_pc.scale.set(0.40,0.40);
        disco_duro_base = game.add.sprite(290, 155 - 75, 'disco_duro_base');
        disco_duro_base.scale.set(0.87,0.87);
        text_piesa = game.add.text(disco_duro_base.x + disco_duro_base.width*0.5, disco_duro_base.y + disco_duro_base.height*0.5,"Disco duro", {align:"CENTER", wordWrapWidth: disco_duro_base.width*0.8,  wordWrap:true});
        text_piesa.anchor.set(0.5, 0.5);
        
        procesador_base = game.add.sprite(470, 95 - 80, 'procesador_base');
        procesador_base.scale.set(0.98,0.98);
        text_piesa = game.add.text(procesador_base.x + procesador_base.width*0.5, procesador_base.y + procesador_base.height*0.5,"Procesador", {font:"bold 30px Calibri", align:"CENTER", wordWrapWidth: procesador_base.width*0.8,  wordWrap:true});
        text_piesa.anchor.set(0.5, 0.5);
        
        tarjeta_madre_base = game.add.sprite(490, disco_duro_base.y + 105, 'tarjeta_madre_base');

        text_piesa = game.add.text(tarjeta_madre_base.x + tarjeta_madre_base.width*0.5, tarjeta_madre_base.y + tarjeta_madre_base.height*0.5,"Tarjeta madre", {align:"CENTER", wordWrapWidth: tarjeta_madre_base.width*0.8,  wordWrap:true});
        text_piesa.anchor.set(0.5, 0.5);
        memoria_ram_base = game.add.sprite(297, disco_duro_base.y + disco_duro_base.height + 70, 'memoria_ram_base');
        text_piesa = game.add.text(memoria_ram_base.x + memoria_ram_base.width*0.5, memoria_ram_base.y + memoria_ram_base.height*0.5,"Memoria ram", {align:"CENTER", wordWrapWidth: memoria_ram_base.width*0.8,  wordWrap:true});
        text_piesa.anchor.set(0.5, 0.5);
        

        disco_duro = game.add.sprite(100, 0, 'disco_duro');
        disco_duro.scale.set(0.87,0.87);
        disco_duro.inputEnabled = true;
        disco_duro.input.enableDrag();

        procesador = game.add.sprite(0, disco_duro.height + 10, 'procesador');
        procesador.x = w/2 - procesador.width/2 - 30;
        procesador.y = h - procesador.height;
        procesador.scale.set(0.98,0.98);
        procesador.inputEnabled = true;
        procesador.input.enableDrag();

        tarjeta_madre = game.add.sprite(0, disco_duro.height + 5 + procesador.height + 10, 'tarjeta_madre');
        tarjeta_madre.x = procesador.x - tarjeta_madre.width - 40;
        tarjeta_madre.y = h - tarjeta_madre.height;
        tarjeta_madre.inputEnabled = true;
        
        tarjeta_madre.input.enableDrag();
        memoria_ram = game.add.sprite(480, 530, 'memoria_ram');
        //memoria_ram.scale.set(0.40,0.40);
        memoria_ram.inputEnabled = true;
        memoria_ram.input.enableDrag();

        disco_duro.x = tarjeta_madre.x;
        disco_duro.y = h - tarjeta_madre.y + 50;


        disco_duro_base.alpha = 0.0;
        procesador_base.alpha = 0.0;
        tarjeta_madre_base.alpha = 0.0;
        memoria_ram_base.alpha = 0.0;

        text_puntos = game.add.text(30, 5, titulo_puntos, {font: '50px Calibri'});
        game.input.onUp.add(onDragStop, this);

        tutorial_canvas = game.add.sprite(game.width*0.5,-game.height*0.5,"interfaz");
        tutorial_canvas.anchor.set(0.5,0.5);
         
         
        tutorial_text = game.add.text(0,-tutorial_canvas.height*0.25,"En esta actividad obtendrás puntos cada vez que ubiques una imagen sobre \n el texto que le corresponde.",{font:"bold 30px Calibri", align:"CENTER", wordWrapWidth: tutorial_canvas.width*0.85,  wordWrap:true, });
        tutorial_text.addColor('#1E3077',0);
        tutorial_text.anchor.set(0.5,0.5);
        tutorial_canvas.addChild(tutorial_text);
        
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

        moveSpriteToSprite(disco_duro, disco_duro_base);
        moveSpriteToSprite(procesador, procesador_base);
        moveSpriteToSprite(tarjeta_madre, tarjeta_madre_base);
        moveSpriteToSprite(memoria_ram, memoria_ram_base);


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
    game = new Phaser.Game(w, h, Phaser.AUTO, null, {
      preload: preload, create: create, update: update
    });
     
   
    var disco_duro;
    var procesador;
    var tarjeta_madre;
    var memoria_ram;
    var titulo_puntos = 'Puntos: '+puntos;
    var text_piesa;

    var fondo_pc;
    var disco_duro_base;
    var procesador_base;
    var tarjeta_madre_base;
    var memoria_ram_base;

    var tutorial_canvas;
    var tutorial_text;
    var tutorial_button;
    var text_button;

    function preload() {
        //Configuración para escalar el script al tamaño de disco_duro
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;
        game.stage.backgroundColor = '#eee';
        game.load.image('fondo_pc', '../../static/img/fondo_pc.png');
        game.load.image('disco_duro_base', '../../static/img/disco_duro.png');
        game.load.image('procesador_base', '../../static/img/procesador.png');
        game.load.image('tarjeta_madre_base', '../../static/img/tarjeta_madre.png');
        game.load.image('memoria_ram_base', '../../static/img/memoria_ram.png');
        game.load.image('disco_duro', '../../static/img/disco_duro.png');
        game.load.image('procesador', '../../static/img/procesador.png');
        game.load.image('tarjeta_madre', '../../static/img/tarjeta_madre.png');
        game.load.image('memoria_ram', '../../static/img/memoria_ram.png');
       
        game.load.image('interfaz', '../../static/img/interfaz_canvas.png' )
        game.load.image('button', '../../static/img/button.png' )
    }
    function create() {
        fondo_pc = game.add.sprite(280, 0, 'fondo_pc');
        //fondo_pc.scale.set(0.40,0.40);
        disco_duro_base = game.add.sprite(290, 155 - 75, 'disco_duro_base');
        disco_duro_base.scale.set(0.87,0.87);
        text_piesa = game.add.text(disco_duro_base.x + disco_duro_base.width*0.5, disco_duro_base.y + disco_duro_base.height*0.5,"Disco duro", {align:"CENTER", wordWrapWidth: disco_duro_base.width*0.8,  wordWrap:true});
        text_piesa.anchor.set(0.5, 0.5);
        
        procesador_base = game.add.sprite(470, 95 - 80, 'procesador_base');
        procesador_base.scale.set(0.98,0.98);
        text_piesa = game.add.text(procesador_base.x + procesador_base.width*0.5, procesador_base.y + procesador_base.height*0.5,"Procesador", {font:"bold 30px Calibri", align:"CENTER", wordWrapWidth: procesador_base.width*0.8,  wordWrap:true});
        text_piesa.anchor.set(0.5, 0.5);
        
        tarjeta_madre_base = game.add.sprite(490, disco_duro_base.y + 105, 'tarjeta_madre_base');

        text_piesa = game.add.text(tarjeta_madre_base.x + tarjeta_madre_base.width*0.5, tarjeta_madre_base.y + tarjeta_madre_base.height*0.5,"Tarjeta madre", {align:"CENTER", wordWrapWidth: tarjeta_madre_base.width*0.8,  wordWrap:true});
        text_piesa.anchor.set(0.5, 0.5);
        memoria_ram_base = game.add.sprite(297, disco_duro_base.y + disco_duro_base.height + 70, 'memoria_ram_base');
        text_piesa = game.add.text(memoria_ram_base.x + memoria_ram_base.width*0.5, memoria_ram_base.y + memoria_ram_base.height*0.5,"Memoria ram", {align:"CENTER", wordWrapWidth: memoria_ram_base.width*0.8,  wordWrap:true});
        text_piesa.anchor.set(0.5, 0.5);
        

        disco_duro = game.add.sprite(100, 0, 'disco_duro');
        disco_duro.scale.set(0.87,0.87);
        disco_duro.inputEnabled = true;
        disco_duro.input.enableDrag();

        procesador = game.add.sprite(0, disco_duro.height + 10, 'procesador');
        procesador.x = w/2 - procesador.width/2 - 30;
        procesador.y = h - procesador.height;
        procesador.scale.set(0.98,0.98);
        procesador.inputEnabled = true;
        procesador.input.enableDrag();

        tarjeta_madre = game.add.sprite(0, disco_duro.height + 5 + procesador.height + 10, 'tarjeta_madre');
        tarjeta_madre.x = procesador.x - tarjeta_madre.width - 40;
        tarjeta_madre.y = h - tarjeta_madre.height;
        tarjeta_madre.inputEnabled = true;
        
        tarjeta_madre.input.enableDrag();
        memoria_ram = game.add.sprite(480, 530, 'memoria_ram');
        //memoria_ram.scale.set(0.40,0.40);
        memoria_ram.inputEnabled = true;
        memoria_ram.input.enableDrag();

        disco_duro.x = tarjeta_madre.x;
        disco_duro.y = h - tarjeta_madre.y + 50;


        disco_duro_base.alpha = 0.0;
        procesador_base.alpha = 0.0;
        tarjeta_madre_base.alpha = 0.0;
        memoria_ram_base.alpha = 0.0;

        text_puntos = game.add.text(30, 5, titulo_puntos, {font: '50px Calibri'});
        game.input.onUp.add(onDragStop, this);

        tutorial_canvas = game.add.sprite(game.width*0.5,-game.height*0.5,"interfaz");
        tutorial_canvas.anchor.set(0.5,0.5);
         
         
        tutorial_text = game.add.text(0,-tutorial_canvas.height*0.25,"En esta actividad obtendrás puntos cada vez que ubiques una imagen sobre \n el texto que le corresponde.",{font:"bold 30px Calibri", align:"CENTER", wordWrapWidth: tutorial_canvas.width*0.85,  wordWrap:true, });
        tutorial_text.addColor('#1E3077',0);
        tutorial_text.anchor.set(0.5,0.5);
        tutorial_canvas.addChild(tutorial_text);
        
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

        moveSpriteToSprite(disco_duro, disco_duro_base);
        moveSpriteToSprite(procesador, procesador_base);
        moveSpriteToSprite(tarjeta_madre, tarjeta_madre_base);
        moveSpriteToSprite(memoria_ram, memoria_ram_base);


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

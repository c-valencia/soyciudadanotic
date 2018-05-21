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

    var pantalla;
    var torre;
    var smartphone;
    var tableta;
    //var medalla1;
    //var medalla2;
    //var medalla3;
    var barra_inferior;

    var text_opcion1;
    var text_opcion2;
    var text_opcion3;
    var text_pregunta;
    var text_puntos;

    var pregunta1 = 'Oprima en el teclado el número debajo de la imagen,'+'\n'+'¿Cuál corresponde al computadora de escritorio?';
    var pregunta2 = 'Oprima en el teclado el número debajo de la imagen,'+'\n'+'¿Cuál corresponde al celular inteligente?';
    var pregunta3 = 'Oprima en el teclado el número debajo de la imagen,'+'\n'+'¿Cuál corresponde a la tableta?';
    var pregunta = pregunta1;
    var indicador_pregunta = 1;
    
    
    var titulo_puntos = 'Puntos: '+puntos;

    var tutorial_canvas;
    var tutorial_text;
    var tutorial_button;
    var text_button;


   
    
    function preload() {
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        //game.scale.pageAlignHorizontally = true;
        //game.scale.pageAlignVertically = true;
        game.stage.backgroundColor = '#efebe9';
        //game.load.image('pantalla', 'img/pantalla.png');
        game.load.image('pantalla', '../../static/img/pantalla.png');
        game.load.image('torre', '../../static/img/torre.png');
        game.load.image('smartphone', '../../static/img/smartphone.png');
        game.load.image('tableta', '../../static/img/tableta.png');
        //game.load.image('medalla', '../../static/img/medalla.png')
        game.load.image('barra_inferior', '../../static/img/barra_inferior2.png');
        game.load.image('interfaz', '../../static/img/interfaz_canvas.png' )
        game.load.image('button', '../../static/img/button.png' )
       
    }
    function create() {
        
        torre = game.add.sprite(220, 150, 'torre');
        pantalla = game.add.sprite(50, 150, 'pantalla');
        smartphone = game.add.sprite(400, 175, 'smartphone');
        tableta = game.add.sprite(600, 175, 'tableta');
        barra_inferior = game.add.sprite(5, h-200, 'barra_inferior');
        text_opcion1 = game.add.text(torre.x, torre.y + 150, '1', {font: '60px Calibri', backgroundColor: '#FCB622'});
        text_opcion1.addColor("#1E3077", 0);
        text_opcion1.x -=50;
        text_opcion2 = game.add.text(smartphone.x, smartphone.y + 125, '2', {font: '60px Calibri', backgroundColor: '#FCB622'});
        text_opcion2.addColor("#1E3077", 0);
        text_opcion2.x +=20;
        text_opcion3 = game.add.text(tableta.x, tableta.y + 125, '3', {font: '60px Calibri', backgroundColor: '#FCB622'});
        text_opcion3.addColor("#1E3077", 0);
        text_opcion3.x +=50;
        text_pregunta = game.add.text(w/2, h-120, pregunta, {font: 'bold 30px Calibri', align: 'center'});
        text_pregunta.addColor("#1E3077", 0);
        text_pregunta.anchor.setTo(0.5, 0.5);
        text_puntos = game.add.text(30, 5, titulo_puntos, {font: '50px Calibri'});

    //________________________________________________________________________________    
    tutorial_canvas = game.add.sprite(game.width*0.5,-game.height*0.5,"interfaz");
     tutorial_canvas.anchor.set(0.5,0.5);
     
     
    tutorial_text = game.add.text(0,-tutorial_canvas.height*0.25,"En esta actividad obtendrás puntos cada vez que oprimas el número que \n representa la imagen del dispositivo TIC por el que se pregunta.",{font:"bold 30px Calibri", align:"CENTER", wordWrapWidth: tutorial_canvas.width*0.85,  wordWrap:true, });
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
        if(game.input.keyboard.downDuration(Phaser.Keyboard.ONE, 50) && indicador_pregunta == 1){
            puntos = puntos + 25;
            torre.destroy();
            pantalla.destroy();
            text_opcion1.destroy();
            indicador_pregunta++;
            text_pregunta.text= pregunta2;
            text_puntos.text = 'Puntos:'+puntos;
            //medalla1 = game.add.sprite(500,5, 'medalla');    

        }

        if(game.input.keyboard.downDuration(Phaser.Keyboard.TWO, 50) && indicador_pregunta == 2){
            puntos = puntos + 25;
            smartphone.destroy();
            text_opcion2.destroy();
            indicador_pregunta++;
            text_pregunta.text= pregunta3;
            text_puntos.text = 'Puntos: '+puntos;
            //medalla2 = game.add.sprite(600,5, 'medalla'); 
        }

        if(game.input.keyboard.downDuration(Phaser.Keyboard.THREE, 50) && indicador_pregunta == 3){
            puntos = puntos + 25;
            tableta.destroy();
            text_opcion3.destroy();
            indicador_pregunta++;
            text_puntos.text = 'Puntos: '+puntos;
            
            //alert("Felicidades actividad terminada");

        }
        if(puntos == 75){
            tutorial_canvas.visible=true;
            tutorial_button.destroy();
            tutorial_text.text = "Felicidades actividad terminada \n recuerde dar clic en el botón enviar \n que esta al lado izquierdo, para guardar la puntuación";
            tutorial_text.y = 0;
            text_pregunta.destroy();

        }
    }

    function cerrar_tutorial()
    {
        
        tutorial_canvas.visible=false;

        /*if(text_button.text == "Terminar"){
             game.destroy();
             alert(puntos);
        }*/
        
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

    var pantalla;
    var torre;
    var smartphone;
    var tableta;
    //var medalla1;
    //var medalla2;
    //var medalla3;
    var barra_inferior;

    var text_opcion1;
    var text_opcion2;
    var text_opcion3;
    var text_pregunta;
    var text_puntos;

    var pregunta1 = 'Oprima en el teclado el número debajo de la imagen,'+'\n'+'¿Cuál corresponde al computadora de escritorio?';
    var pregunta2 = 'Oprima en el teclado el número debajo de la imagen,'+'\n'+'¿Cuál corresponde al celular inteligente?';
    var pregunta3 = 'Oprima en el teclado el número debajo de la imagen,'+'\n'+'¿Cuál corresponde a la tableta?';
    var pregunta = pregunta1;
    var indicador_pregunta = 1;
    
    
    var titulo_puntos = 'Puntos: '+puntos;

    var tutorial_canvas;
    var tutorial_text;
    var tutorial_button;
    var text_button;


   
    
    function preload() {
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        //game.scale.pageAlignHorizontally = true;
        //game.scale.pageAlignVertically = true;
        game.stage.backgroundColor = '#eee';
        //game.load.image('pantalla', 'img/pantalla.png');
        game.load.image('pantalla', '../../static/img/pantalla.png');
        game.load.image('torre', '../../static/img/torre.png');
        game.load.image('smartphone', '../../static/img/smartphone.png');
        game.load.image('tableta', '../../static/img/tableta.png');
        //game.load.image('medalla', '../../static/img/medalla.png')
        game.load.image('barra_inferior', '../../static/img/barra_inferior2.png');
        game.load.image('interfaz', '../../static/img/interfaz_canvas.png' )
        game.load.image('button', '../../static/img/button.png' )
       
    }
    function create() {
        
        torre = game.add.sprite(220, 150, 'torre');
        pantalla = game.add.sprite(50, 150, 'pantalla');
        smartphone = game.add.sprite(400, 175, 'smartphone');
        tableta = game.add.sprite(600, 175, 'tableta');
        barra_inferior = game.add.sprite(5, h-200, 'barra_inferior');
        text_opcion1 = game.add.text(torre.x, torre.y + 150, '1', {font: '60px Calibri', backgroundColor: '#FCB622'});
        text_opcion1.addColor("#1E3077", 0);
        text_opcion1.x -=50;
        text_opcion2 = game.add.text(smartphone.x, smartphone.y + 125, '2', {font: '60px Calibri', backgroundColor: '#FCB622'});
        text_opcion2.addColor("#1E3077", 0);
        text_opcion2.x +=20;
        text_opcion3 = game.add.text(tableta.x, tableta.y + 125, '3', {font: '60px Calibri', backgroundColor: '#FCB622'});
        text_opcion3.addColor("#1E3077", 0);
        text_opcion3.x +=50;
        text_pregunta = game.add.text(w/2, h-120, pregunta, {font: 'bold 30px Calibri', align: 'center'});
        text_pregunta.addColor("#1E3077", 0);
        text_pregunta.anchor.setTo(0.5, 0.5);
        text_puntos = game.add.text(30, 5, titulo_puntos, {font: '50px Calibri'});

    //________________________________________________________________________________    
    tutorial_canvas = game.add.sprite(game.width*0.5,-game.height*0.5,"interfaz");
     tutorial_canvas.anchor.set(0.5,0.5);
     
     
    tutorial_text = game.add.text(0,-tutorial_canvas.height*0.25,"En esta actividad obtendrás puntos cada vez que oprimas el número que \n representa la imagen del dispositivo TIC por el que se pregunta.",{font:"bold 30px Calibri", align:"CENTER", wordWrapWidth: tutorial_canvas.width*0.85,  wordWrap:true, });
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
        if(game.input.keyboard.downDuration(Phaser.Keyboard.ONE, 50) && indicador_pregunta == 1){
            puntos = puntos + 25;
            torre.destroy();
            pantalla.destroy();
            text_opcion1.destroy();
            indicador_pregunta++;
            text_pregunta.text= pregunta2;
            text_puntos.text = 'Puntos:'+puntos;
            //medalla1 = game.add.sprite(500,5, 'medalla');    

        }

        if(game.input.keyboard.downDuration(Phaser.Keyboard.TWO, 50) && indicador_pregunta == 2){
            puntos = puntos + 25;
            smartphone.destroy();
            text_opcion2.destroy();
            indicador_pregunta++;
            text_pregunta.text= pregunta3;
            text_puntos.text = 'Puntos: '+puntos;
            //medalla2 = game.add.sprite(600,5, 'medalla'); 
        }

        if(game.input.keyboard.downDuration(Phaser.Keyboard.THREE, 50) && indicador_pregunta == 3){
            puntos = puntos + 25;
            tableta.destroy();
            text_opcion3.destroy();
            indicador_pregunta++;
            text_puntos.text = 'Puntos: '+puntos;
            
            //alert("Felicidades actividad terminada");

        }
        if(puntos == 75){
            tutorial_canvas.visible=true;
            tutorial_button.destroy();
            tutorial_text.text = "Felicidades actividad terminada \n recuerde dar clic en el botón enviar \n que esta al lado izquierdo, para guardar la puntuación";
            tutorial_text.y = 0;
            text_pregunta.destroy();

        }
    }

    function cerrar_tutorial()
    {
        
        tutorial_canvas.visible=false;

        /*if(text_button.text == "Terminar"){
             game.destroy();
             alert(puntos);
        }*/
        
    }
}
        

          
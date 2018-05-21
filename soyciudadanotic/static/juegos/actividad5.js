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
    var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, render: render });
var titulo_puntos = 'Puntos: '+puntos;

var tutorial_canvas;
    var tutorial_text;
    var tutorial_button;
    var text_button;

function preload() {
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.stage.backgroundColor = '#eee';
    game.load.image('interfaz', '../../static/img/interfaz_canvas.png' )
    game.load.image('button', '../../static/img/button.png' )
    game.load.image('interfaz2', '../../static/img/interfaz_canvas2.png' )
    game.load.spritesheet('button_option', '../../static/img/button_option.png', 700, 82, 2);
    game.physics.startSystem(Phaser.Physics.ARCADE);


    
}

var cuadro_pregunta;
var txt_pregunta;
var array_button_options=[];
var array_text_options=[];
var array_preguntas=
[
{ pregunta:"¿El software y aplicaciones en un computador son?" ,opciones:[{opcion:"Completamente virtuales", puntaje:1},{opcion:"Completamente físicas", puntaje:0},{opcion:"Invisibles", puntaje:0},{opcion:"Difíciles de encontrar", puntaje:0}]}
,
{ pregunta:"¿Las maquinas a través de la historia han necesitado de algún sistema para poder operarlas?" ,opciones:[{opcion:"Siempre se necesita una interfaz para usarlas", puntaje:1},{opcion:"Nunca", puntaje:0},{opcion:"Algunas máquinas otras no", puntaje:0},{opcion:"Las maquinas se operan por si solas", puntaje:0}]}
,
{ pregunta:"¿Cuál es la principal función del sistema operativo?" ,opciones:[{opcion:"Permitir al usuario administrar el computador y hacer uso de él", puntaje:1},{opcion:"Guardar información", puntaje:0},{opcion:"Hacer una tarea determinada.", puntaje:0},{opcion:"Escuchar música", puntaje:0}]}
,
{ pregunta:"¿Qué es un programa?" ,opciones:[{opcion:"Una herramienta que permite hacer una tarea específica", puntaje:1},{opcion:"Escuchar música", puntaje:0},{opcion:"Hacer cartas", puntaje:0},{opcion:"Navegar en Internet", puntaje:0}]}

];
var pregunta_actual={};
var preguntas_index_shuffle=[];
function create() {

    cuadro_pregunta = game.add.sprite(game.world.width*0.5,game.world.height*0.15 + 50,'interfaz2');
    //cuadro_pregunta.scale.set(1,0.5)
    cuadro_pregunta.anchor.set(0.5,0.5);

    txt_pregunta = game.add.text(0,0,"hola",{font:"bold 30px Calibri", align:"CENTER", wordWrapWidth: cuadro_pregunta.width*0.85,  wordWrap:true, });
    txt_pregunta.addColor('#1E3077',0);
    txt_pregunta.anchor.set(0.5,0.5);
    cuadro_pregunta.addChild(txt_pregunta);


    var txt_option;
    var bt_option;
    var initialX= game.world.width*0.5;
    var initialY= game.world.height*0.45;
    var sepY= 90;
   
    for (var i = 0; i <  4; i++) {
    
        bt_option = game.add.button(initialX,initialY+sepY*i,'button_option',onClickButton,this);
        bt_option.anchor.set(0.5,0.5);
        bt_option.animations.add("normal",[0],1,false);
        bt_option.animations.add("correcto",[1],1,false);
        bt_option.animations.play("normal");

        array_button_options.push(bt_option);

        txt_option = game.add.text(0,0,"opcion"+ (i+1),{font: "30px Arial", fill: "#000000", align: "center", wordWrapWidth: bt_option.width*0.85,wordWrap:true}); 
        bt_option.addChild(txt_option);
        txt_option.anchor.set(0.5,0.5);
        array_text_options.push(txt_option);
    }
    var temp_index=[0,1,2,3];
    var rando;
    var temp;
    for (var i = 0; i <  8; i++) 
    {
         rando =  game.rnd.integerInRange(0, temp_index.length-1);
         temp = temp_index[0];
         temp_index[0]= temp_index[rando];
         temp_index[rando]=temp;

    }

    preguntas_index_shuffle= temp_index;

    cargarPregunta();
    text_puntos = game.add.text(0, 0, titulo_puntos, {font: '50px Calibri'});

    //________________________________________________________________________________    
    tutorial_canvas = game.add.sprite(game.width*0.5,-game.height*0.5,"interfaz");
     tutorial_canvas.anchor.set(0.5,0.5);
     
     
    tutorial_text = game.add.text(0,-tutorial_canvas.height*0.25,"En esta actividad obtendrás puntos cada vez que selecciones la respuesta correcta con clic izquierdo.",{font:"bold 30px Calibri", align:"CENTER", wordWrapWidth: tutorial_canvas.width*0.85,  wordWrap:true, });
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

function cargarPregunta()
{
    if (preguntas_index_shuffle.length>0)
    {
        for (var i = 0; i < array_button_options.length; i++) {
        array_button_options[i].animations.play("normal");
        array_button_options[i].visible=true;
        }
        var indexPregunta = preguntas_index_shuffle[0];
        preguntas_index_shuffle.shift();
        pregunta_actual = array_preguntas[indexPregunta];

        pregunta_actual = shuffleOptions(pregunta_actual);
        console.log(pregunta_actual);
        txt_pregunta.text = pregunta_actual.pregunta;

        for (var i = 0; i < pregunta_actual.opciones.length; i++) {
            array_text_options[i].text=pregunta_actual.opciones[i].opcion;
        }
    }
    else
    {   
        cuadro_pregunta.destroy();
        txt_pregunta.destroy();
        tutorial_canvas.visible=true;
        tutorial_button.destroy();
        tutorial_text.text = "Felicidades actividad terminada \n recuerde dar clic en el botón enviar \n que esta al lado izquierdo, para guardar la puntuación";
        tutorial_text.y = 0;
        console.log("termino cuestionario");
    }

   



}
function shuffleOptions(pregunta)
{

    var opciones_shuffle = pregunta.opciones;
    var temp;
    var rando;
    for (var i = 0; i <  8; i++) 
    {
             rando =  game.rnd.integerInRange(0, opciones_shuffle.length-1);
             temp = opciones_shuffle[0];
             opciones_shuffle[0]= opciones_shuffle[rando];
             opciones_shuffle[rando]=temp;

    }
 

    pregunta.opciones=opciones_shuffle;
    return pregunta; 
}
function onClickButton(button)
{
    console.log("yo soy un boton");

    var index = array_button_options.indexOf(button);

    if (pregunta_actual.opciones[index].puntaje==1) 
    {
        array_button_options[index].animations.play("correcto");
        puntos = puntos + 25;
        text_puntos.text = 'Puntos:'+puntos;
        function temp()
        {
            cargarPregunta();
        }
        game.time.events.add(Phaser.Timer.SECOND * 2, temp, this);
    }
    else
    {
        array_button_options[index].visible=false;
    }
    //button.animations.play("correcto");
}

function update(){

}

function render() {
    
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

    var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, render: render });
var titulo_puntos = 'Puntos: '+puntos;

var tutorial_canvas;
    var tutorial_text;
    var tutorial_button;
    var text_button;

function preload() {
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.stage.backgroundColor = '#eee';
    game.load.image('interfaz', '../../static/img/interfaz_canvas.png' )
    game.load.image('button', '../../static/img/button.png' )
    game.load.image('interfaz2', '../../static/img/interfaz_canvas2.png' )
    game.load.spritesheet('button_option', '../../static/img/button_option.png', 700, 82, 2);
    game.physics.startSystem(Phaser.Physics.ARCADE);


    
}

var cuadro_pregunta;
var txt_pregunta;
var array_button_options=[];
var array_text_options=[];
var array_preguntas=
[
{ pregunta:"¿El software y aplicaciones en un computador son?" ,opciones:[{opcion:"Completamente virtuales", puntaje:1},{opcion:"Completamente físicas", puntaje:0},{opcion:"Invisibles", puntaje:0},{opcion:"Difíciles de encontrar", puntaje:0}]}
,
{ pregunta:"¿Las maquinas a través de la historia han necesitado de algún sistema para poder operarlas?" ,opciones:[{opcion:"Siempre se necesita una interfaz para usarlas", puntaje:1},{opcion:"Nunca", puntaje:0},{opcion:"Algunas máquinas otras no", puntaje:0},{opcion:"Las maquinas se operan por si solas", puntaje:0}]}
,
{ pregunta:"¿Cuál es la principal función del sistema operativo?" ,opciones:[{opcion:"Permitir al usuario administrar el computador y hacer uso de él", puntaje:1},{opcion:"Guardar información", puntaje:0},{opcion:"Hacer una tarea determinada.", puntaje:0},{opcion:"Escuchar música", puntaje:0}]}
,
{ pregunta:"¿Qué es un programa?" ,opciones:[{opcion:"Una herramienta que permite hacer una tarea específica", puntaje:1},{opcion:"Escuchar música", puntaje:0},{opcion:"Hacer cartas", puntaje:0},{opcion:"Navegar en Internet", puntaje:0}]}

];
var pregunta_actual={};
var preguntas_index_shuffle=[];
function create() {

    cuadro_pregunta = game.add.sprite(game.world.width*0.5,game.world.height*0.15 + 50,'interfaz2');
    //cuadro_pregunta.scale.set(1,0.5)
    cuadro_pregunta.anchor.set(0.5,0.5);

    txt_pregunta = game.add.text(0,0,"hola",{font:"bold 30px Calibri", align:"CENTER", wordWrapWidth: cuadro_pregunta.width*0.85,  wordWrap:true, });
    txt_pregunta.addColor('#1E3077',0);
    txt_pregunta.anchor.set(0.5,0.5);
    cuadro_pregunta.addChild(txt_pregunta);


    var txt_option;
    var bt_option;
    var initialX= game.world.width*0.5;
    var initialY= game.world.height*0.45;
    var sepY= 90;
   
    for (var i = 0; i <  4; i++) {
    
        bt_option = game.add.button(initialX,initialY+sepY*i,'button_option',onClickButton,this);
        bt_option.anchor.set(0.5,0.5);
        bt_option.animations.add("normal",[0],1,false);
        bt_option.animations.add("correcto",[1],1,false);
        bt_option.animations.play("normal");

        array_button_options.push(bt_option);

        txt_option = game.add.text(0,0,"opcion"+ (i+1),{font: "30px Arial", fill: "#000000", align: "center", wordWrapWidth: bt_option.width*0.85,wordWrap:true}); 
        bt_option.addChild(txt_option);
        txt_option.anchor.set(0.5,0.5);
        array_text_options.push(txt_option);
    }
    var temp_index=[0,1,2,3];
    var rando;
    var temp;
    for (var i = 0; i <  8; i++) 
    {
         rando =  game.rnd.integerInRange(0, temp_index.length-1);
         temp = temp_index[0];
         temp_index[0]= temp_index[rando];
         temp_index[rando]=temp;

    }

    preguntas_index_shuffle= temp_index;

    cargarPregunta();
    text_puntos = game.add.text(0, 0, titulo_puntos, {font: '50px Calibri'});

    //________________________________________________________________________________    
    tutorial_canvas = game.add.sprite(game.width*0.5,-game.height*0.5,"interfaz");
     tutorial_canvas.anchor.set(0.5,0.5);
     
     
    tutorial_text = game.add.text(0,-tutorial_canvas.height*0.25,"En esta actividad obtendrás puntos cada vez que selecciones la respuesta correcta con clic izquierdo.",{font:"bold 30px Calibri", align:"CENTER", wordWrapWidth: tutorial_canvas.width*0.85,  wordWrap:true, });
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

function cargarPregunta()
{
    if (preguntas_index_shuffle.length>0)
    {
        for (var i = 0; i < array_button_options.length; i++) {
        array_button_options[i].animations.play("normal");
        array_button_options[i].visible=true;
        }
        var indexPregunta = preguntas_index_shuffle[0];
        preguntas_index_shuffle.shift();
        pregunta_actual = array_preguntas[indexPregunta];

        pregunta_actual = shuffleOptions(pregunta_actual);
        console.log(pregunta_actual);
        txt_pregunta.text = pregunta_actual.pregunta;

        for (var i = 0; i < pregunta_actual.opciones.length; i++) {
            array_text_options[i].text=pregunta_actual.opciones[i].opcion;
        }
    }
    else
    {   
        cuadro_pregunta.destroy();
        txt_pregunta.destroy();
        tutorial_canvas.visible=true;
        tutorial_button.destroy();
        tutorial_text.text = "Felicidades actividad terminada \n recuerde dar clic en el botón enviar \n que esta al lado izquierdo, para guardar la puntuación";
        tutorial_text.y = 0;
        console.log("termino cuestionario");
    }

   



}
function shuffleOptions(pregunta)
{

    var opciones_shuffle = pregunta.opciones;
    var temp;
    var rando;
    for (var i = 0; i <  8; i++) 
    {
             rando =  game.rnd.integerInRange(0, opciones_shuffle.length-1);
             temp = opciones_shuffle[0];
             opciones_shuffle[0]= opciones_shuffle[rando];
             opciones_shuffle[rando]=temp;

    }
 

    pregunta.opciones=opciones_shuffle;
    return pregunta; 
}
function onClickButton(button)
{
    console.log("yo soy un boton");

    var index = array_button_options.indexOf(button);

    if (pregunta_actual.opciones[index].puntaje==1) 
    {
        array_button_options[index].animations.play("correcto");
        puntos = puntos + 25;
        text_puntos.text = 'Puntos:'+puntos;
        function temp()
        {
            cargarPregunta();
        }
        game.time.events.add(Phaser.Timer.SECOND * 2, temp, this);
    }
    else
    {
        array_button_options[index].visible=false;
    }
    //button.animations.play("correcto");
}

function update(){

}

function render() {
    
}

function cerrar_tutorial()
{
    tutorial_canvas.visible=false;
} 

}    

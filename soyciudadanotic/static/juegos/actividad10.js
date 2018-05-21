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
    game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload:preload, create: create });


var dictionary_words=
[
    "56+93=69",
    "\"(hola)\"",
    "¿Que?",
    "Hábia",
    "pregunta:",
    "#34 & -21",
    "cr@mail.com",
    "¡¡Ay!! 28%",
    "[arreglo]",
    "{llaves}",
    "fruta_2000",
    "Corazón",
    "el $ bajó",
    "el $ subió",
    "23*4/3=?",
    "3.1462,00", 
];
var correctWord=[];
var array_index_words=[];
var word="";
var numero_palabras =5;
var text_word;
var titulo_puntos = 'Puntos: '+puntos;
var text_button;    
var tutorial_canvas;
var tutorial_text;
var tutorial_button;
var text_button;

function preload() {
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        //game.scale.pageAlignHorizontally = true;
        //game.scale.pageAlignVertically = true;
        game.stage.backgroundColor = '#eee';
        game.load.image('interfaz', '../../static/img/interfaz_canvas.png' )
        game.load.image('button', '../../static/img/button.png' )
}

function create() {

   
    


    game.input.keyboard.addCallbacks(this, null, null, keyPress);

    var array_indexes=[];

    // realizamos n arreglo alterno para sacar elementos al azar sin repetir
    for (var i = 0 ; i <dictionary_words.length; i++) {
        
        array_indexes[i]=i;
    }

    //sacamos los elementos random del arreglo de los indices
    var r_index;
    var init;
    for (var i = 0; i<numero_palabras; i++) {

        r_index= game.rnd.integerInRange(0, array_indexes.length-1);
        array_index_words[i]=array_indexes[r_index];

        init = array_indexes[0];
        array_indexes[0] = array_indexes[r_index];
        array_indexes[r_index]=init;

         console.log("value: "+ array_index_words[i]);
        //array_indexes.splice(r_index,1);
       
        array_indexes.shift();

       
    }

    createWord();
    text_puntos = game.add.text(30, 5, titulo_puntos, {font: '50px Calibri'});

    //_________________________________________________________________________________-
    //________________________________________________________________________________    
    tutorial_canvas = game.add.sprite(game.width*0.5,-game.height*0.5,"interfaz");
     tutorial_canvas.anchor.set(0.5,0.5);
     
     
    tutorial_text = game.add.text(0,-tutorial_canvas.height*0.25,"En esta actividad obtendrás puntos cada vez que termines de escribir \n una cadena de caracteres completa con el teclado.",{font:"bold 30px Calibri", align:"CENTER", wordWrapWidth: tutorial_canvas.width*0.85,  wordWrap:true, });
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
function createWord()
{
    if (array_index_words.length>0)
    { //quitamos el primer elemento del arreglo de indices
        var index = array_index_words[0];
        array_index_words.shift();
        console.log(array_index_words+"index:"+index);
        word = dictionary_words[index]+"";

        if (text_word!=null) 
        {
            text_word.destroy();
        }
        var style = { font: "100px Arial", fill: "#1E3077", align: "center" };

        text_word = game.add.text(game.world.centerX, game.world.centerY, "", style);

        text_word.anchor.set(0.5);
        text_word.text=word+"";
        text_word.addColor("#1E3077",1,word.length);
        correctWord=[];
        for (var i = 0; i < word.length; i++) {
            
            if (word[i]==" ") 
            {

                 correctWord[i]=true;
            }
            else
            {
                correctWord[i]=false;
            }
           

        }
    }
    else
    {
        game.input.keyboard.removeCallbacks(this, null, null, keyPress);
        text_word.destroy();
        tutorial_canvas.visible=true;
            
            tutorial_button.destroy();
            tutorial_text.text = "Felicidades actividad terminada \n recuerde dar clic en el botón enviar \n que esta al lado izquierdo, para guardar la puntuación";
            tutorial_text.y = 0;
            text_pregunta.destroy();
         console.log("juego terminado");
    }
}
function keyPress(char)
{

    var index = word.indexOf(char);
   
    if (index!=-1)
    { 


        for (var i = 0; i < word.length; i++) {
           if (word[i]==char) 
           {
            correctWord[i]=true;
           
           }
          }

        console.log("hola yo pulse la tecla: " + char)
       
        var cont=0;
       for (var i = 0; i < correctWord.length; i++) {
     
           if (correctWord[i]==true)
            {
                cont++;
                text_word.addColor("#00FF55",i,1);

            }
            else
            {
                text_word.addColor("#1E3077",i,1);
            }
          
       }



       if (cont==word.length) 
       {
         puntos = puntos + 20;
        text_puntos.text = 'Puntos:'+puntos;
        console.log("hoa cree una nueva numero_palabras");
        createWord();

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

    game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload:preload, create: create });


var dictionary_words=
[
    "56+93=69",
    "\"(hola)\"",
    "¿Que?",
    "Hábia",
    "pregunta:",
    "#34 & -21",
    "cr@mail.com",
    "¡¡Ay!! 28%",
    "[arreglo]",
    "{llaves}",
    "fruta_2000",
    "pingüino",
    "el $ bajó",
    "el $ subió",
    "23*4/3=?",
    "3.1462,00", 
];
var correctWord=[];
var array_index_words=[];
var word="";
var numero_palabras =5;
var text_word;
var titulo_puntos = 'Puntos: '+puntos;
var text_button;    
var tutorial_canvas;
var tutorial_text;
var tutorial_button;
var text_button;

function preload() {
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        //game.scale.pageAlignHorizontally = true;
        //game.scale.pageAlignVertically = true;
        game.stage.backgroundColor = '#eee';
        game.load.image('interfaz', '../../static/img/interfaz_canvas.png' )
        game.load.image('button', '../../static/img/button.png' )
}

function create() {

   
    


    game.input.keyboard.addCallbacks(this, null, null, keyPress);

    var array_indexes=[];

    // realizamos n arreglo alterno para sacar elementos al azar sin repetir
    for (var i = 0 ; i <dictionary_words.length; i++) {
        
        array_indexes[i]=i;
    }

    //sacamos los elementos random del arreglo de los indices
    var r_index;
    var init;
    for (var i = 0; i<numero_palabras; i++) {

        r_index= game.rnd.integerInRange(0, array_indexes.length-1);
        array_index_words[i]=array_indexes[r_index];

        init = array_indexes[0];
        array_indexes[0] = array_indexes[r_index];
        array_indexes[r_index]=init;

         console.log("value: "+ array_index_words[i]);
        //array_indexes.splice(r_index,1);
       
        array_indexes.shift();

       
    }

    createWord();
    text_puntos = game.add.text(30, 5, titulo_puntos, {font: '50px Calibri'});

    //_________________________________________________________________________________-
    //________________________________________________________________________________    
    tutorial_canvas = game.add.sprite(game.width*0.5,-game.height*0.5,"interfaz");
     tutorial_canvas.anchor.set(0.5,0.5);
     
     
    tutorial_text = game.add.text(0,-tutorial_canvas.height*0.25,"En esta actividad obtendrás puntos cada vez que termines de escribir \n una cadena de caracteres completa con el teclado.",{font:"bold 30px Calibri", align:"CENTER", wordWrapWidth: tutorial_canvas.width*0.85,  wordWrap:true, });
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
function createWord()
{
    if (array_index_words.length>0)
    { //quitamos el primer elemento del arreglo de indices
        var index = array_index_words[0];
        array_index_words.shift();
        console.log(array_index_words+"index:"+index);
        word = dictionary_words[index]+"";

        if (text_word!=null) 
        {
            text_word.destroy();
        }
        var style = { font: "100px Arial", fill: "#1E3077", align: "center" };

        text_word = game.add.text(game.world.centerX, game.world.centerY, "", style);

        text_word.anchor.set(0.5);
        text_word.text=word+"";
        text_word.addColor("#1E3077",1,word.length);
        correctWord=[];
        for (var i = 0; i < word.length; i++) {
            
            if (word[i]==" ") 
            {

                 correctWord[i]=true;
            }
            else
            {
                correctWord[i]=false;
            }
           

        }
    }
    else
    {
        game.input.keyboard.removeCallbacks(this, null, null, keyPress);
        text_word.destroy();
        tutorial_canvas.visible=true;
            
            tutorial_button.destroy();
            tutorial_text.text = "Felicidades actividad terminada \n recuerde dar clic en el botón enviar \n que esta al lado izquierdo, para guardar la puntuación";
            tutorial_text.y = 0;
            text_pregunta.destroy();
         console.log("juego terminado");
    }
}
function keyPress(char)
{

    var index = word.indexOf(char);
   
    if (index!=-1)
    { 


        for (var i = 0; i < word.length; i++) {
           if (word[i]==char) 
           {
            correctWord[i]=true;
           
           }
          }

        console.log("hola yo pulse la tecla: " + char)
       
        var cont=0;
       for (var i = 0; i < correctWord.length; i++) {
     
           if (correctWord[i]==true)
            {
                cont++;
                text_word.addColor("#00FF55",i,1);

            }
            else
            {
                text_word.addColor("#1E3077",i,1);
            }
          
       }



       if (cont==word.length) 
       {
         puntos = puntos + 20;
        text_puntos.text = 'Puntos:'+puntos;
        console.log("hoa cree una nueva numero_palabras");
        createWord();

       }


    }



}

function cerrar_tutorial()
{
    tutorial_canvas.visible=false;
}    

}    

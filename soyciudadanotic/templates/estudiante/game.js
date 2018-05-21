var gameOptions = {
           
            gameWidth: 800,
            gameHeight: 600,
           
        }
        var game;

        window.onload = function(){
        var gameConfig = {
        type: Phaser.CANVAS,
        width: gameOptions.gameWidth,
        height: gameOptions.gameHeight,
       
    };

    game = new Phaser.Game(gameConfig);
    resize();
    window.addEventListener("resize", resize, false);
    }


        
        var pantalla;
        var torre;
        var smartphone;
        var tableta;
        var text_opcion1;
        var text_opcion2;
        var text_opcion3;
        var text_pregunta;

        var pregunta1 = 'computador de escritorio';
        var pregunta2 = 'celular inteligente';
        var pregunta3 = 'tableta';
        var pregunta = pregunta1;
        var indicador_pregunta = 1;

        

        function preload() {
            game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            game.scale.pageAlignHorizontally = true;
            game.scale.pageAlignVertically = true;
            game.stage.backgroundColor = '#eee';
            game.load.image('pantalla', 'img/pantalla.png');
            game.load.image('torre', 'img/torre.png');
            game.load.image('smartphone', 'img/smartphone.png');
            game.load.image('tableta', 'img/tableta.png');

        }
        function create() {
            
            torre = game.add.sprite(220, 50, 'torre');
            pantalla = game.add.sprite(50, 50, 'pantalla');
            smartphone = game.add.sprite(400, 75, 'smartphone');
            tableta = game.add.sprite(600, 75, 'tableta');
            text_opcion1 = game.add.text(torre.x, torre.y + 150, '1', {font: '60px Calibri'});
            text_opcion1.x -=50;
            text_opcion2 = game.add.text(smartphone.x, smartphone.y + 125, '2', {font: '60px Calibri'});
            text_opcion2.x +=20;
            text_opcion3 = game.add.text(tableta.x, tableta.y + 125, '3', {font: '60px Calibri'});
            text_opcion3.x +=50;
            text_pregunta = game.add.text(w/2, h-150, pregunta, {font: '60px Calibri', align: 'center'});
            text_pregunta.anchor.setTo(0.5, 0.5);
        }

        function update() {
            if(game.input.keyboard.downDuration(Phaser.Keyboard.ONE, 50) && indicador_pregunta == 1){
                torre.destroy();
                pantalla.destroy();
                text_opcion1.destroy();
                indicador_pregunta++;
                text_pregunta.text= pregunta2;
            }

            if(game.input.keyboard.downDuration(Phaser.Keyboard.TWO, 50) && indicador_pregunta == 2){
                smartphone.destroy();
                text_opcion2.destroy();
                indicador_pregunta++;
                text_pregunta.text= pregunta3;
            }

            if(game.input.keyboard.downDuration(Phaser.Keyboard.THREE, 50) && indicador_pregunta == 3){
                tableta.destroy();
                text_opcion3.destroy();
                indicador_pregunta++;
                text_pregunta.text= 'BUEN TRABAJO';
                alert("Felicidades actividad terminada");
            }
        }

        
        function checkOverlap(spriteA, spriteB) {

            var boundsA = spriteA.getBounds();
            var boundsB = spriteB.getBounds();

            return Phaser.Rectangle.intersects(boundsA, boundsB);

        }
        
        function resize() {
    var canvas = document.querySelector("canvas");
    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight;
    var windowRatio = windowWidth / windowHeight;
    var gameRatio = game.config.width / game.config.height;
    if(windowRatio < gameRatio){
        canvas.style.width = windowWidth + "px";
        canvas.style.height = (windowWidth / gameRatio) + "px";
    }
    else{
        canvas.style.width = (windowHeight * gameRatio) + "px";
        canvas.style.height = windowHeight + "px";
    }
}
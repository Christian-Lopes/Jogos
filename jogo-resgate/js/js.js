function start() {
    $("#inicio").hide();
    $("#fundoGame").append("<div id='jogador' class='anima1'></div>");
    $("#fundoGame").append("<div id='inimigo1' class='anima2'></div>");
    $("#fundoGame").append("<div id='inimigo2'></div>");
    $("#fundoGame").append("<div id='amigo' class='anima3'></div>");
    $("#fundoGame").append("<div id='placar'></div>");
    $("#fundoGame").append("<div id='energia'></div>");

    var podeAtirar = true;
    var fimdejogo = false;
    energiaAtual = 3;
    var pontos = 0;
    var salvos = 0;
    var perdidos = 0;
    var jogo = {};
    var velocidade = 5;
    var posicaoY = parseInt(Math.random() * 334);
    var TECLA = {
        W: 87,
        S: 83,
        D: 68
    }

    //Variáveis do sons do jogo
    var somDisparo = document.getElementById("somDisparo");
    var somExplosao = document.getElementById("somExplosao");
    var musica = document.getElementById("musica");
    var somGameover = document.getElementById("somGameover");
    var somPerdido = document.getElementById("somPerdido");
    var somRegate = document.getElementById("somResgate");

    //Música de fundo em loop
    musica.addEventListener("ended", function(){
        musica.currentTime = 0;
    }, false);

    //Botões de movimento e tiro
    jogo.pressionou = [];
    $(document).keydown(function (e) {
        jogo.pressionou[e.which] = true;
    });

    $(document).keyup(function (e) {
        jogo.pressionou[e.which] = false;
    });

    //Loop do game
    jogo.timer = setInterval(loop, 30);
    function loop() {
        moveFundo();
        movejogador();
        moveInimigo1();
        moveInimigo2();
        moveAmigo();
        colisao();
        placar();
        energia();
        musica.play();
    }

    //Configura o movimento do fundo
    function moveFundo() {
        esquerda = parseInt($("#fundoGame").css("background-position"));
        $("#fundoGame").css("background-position", esquerda - 1);
    }

    //Área de movimentos de jogador, inimigos e amigos.
    function movejogador() {
        //Tecla de movimento para cima
        if (jogo.pressionou[TECLA.W]) {
            var topo = parseInt($("#jogador").css("top"));
            $("#jogador").css("top", topo - 10);

            if (topo <= 10) {
                $("#jogador").css("top", topo + 10);
            }
        }

        //Tecla de movimento para baixo
        if (jogo.pressionou[TECLA.S]) {
            var topo = parseInt($("#jogador").css("top"));
            $("#jogador").css("top", topo + 10);

            if (topo >= 434) {
                $("#jogador").css("top", topo - 10);
            }
        }

        //Tecla de disparo 
        if (jogo.pressionou[TECLA.D]) {
            disparo();
        }
    }

    //Configura o movimento do inimigo 1
    function moveInimigo1() {
        posicaoX = parseInt($("#inimigo1").css("left"));
        $("#inimigo1").css("left", posicaoX - velocidade);
        $("#inimigo1").css("top", posicaoY);

        if (posicaoX <= 0) {
            posicaoY = parseInt(Math.random() * 334);
            $("#inimigo1").css("left", 694); 1
            $("#inimigo").css("top", posicaoY);
        }
    }

    //Configura o movimento do inimigo 2
    function moveInimigo2() {
        posicaoX = parseInt($("#inimigo2").css("left"));
        $("#inimigo2").css("left", posicaoX - 3);

        if (posicaoX <= 0) {
            $("#inimigo2").css("left", 775);
        }
    }
    //Configura o movimento do amigo
    function moveAmigo() {
        posicaoX = parseInt($("#amigo").css("left"));
        $("#amigo").css("left", posicaoX + 1);

        if (posicaoX > 906) {
            $("#amigo").css("left", 0);
        }
    }

    //Área de disparo
    function disparo() {

        //Verifica se pode atirar
        if (podeAtirar == true) {
            somDisparo.play();
            podeAtirar = false;

            topo = parseInt($("#jogador").css("top"))
            posicaoX = parseInt($("#jogador").css("left"))
            tiroX = posicaoX + 190;
            topoTiro = topo + 55;
            $("#fundoGame").append("<div id='disparo'></div");
            $("#disparo").css("top", topoTiro);
            $("#disparo").css("left", tiroX);

            var tempoDisparo = window.setInterval(executaDisparo, 30);
        }

        //Executa o disparo
        function executaDisparo() {
            posicaoX = parseInt($("#disparo").css("left"));
            $("#disparo").css("left", posicaoX + 15);

            if (posicaoX > 900) {
                window.clearInterval(tempoDisparo);
                tempoDisparo = null;
                $("#disparo").remove();
                podeAtirar = true;
            }
        }
    }

    //Função de colisão
    function colisao() {
        //Variáveis com posivéis colisões
        var colisao1 = ($("#jogador").collision($("#inimigo1")));
        var colisao2 = ($("#jogador").collision($("#inimigo2")));
        var colisao3 = ($("#disparo").collision($("#inimigo1")));
        var colisao4 = ($("#disparo").collision($("#inimigo2")));
        var colisao5 = ($("#jogador").collision($("#amigo")));
        var colisao6 = ($("#inimigo2").collision($("#amigo")));

        //Explosão com colisão do jogador no inimigo 1
        if (colisao1.length > 0) {
            energiaAtual--;
            inimigo1X = parseInt($("#inimigo1").css("left"));
            inimigo1Y = parseInt($("#inimigo1").css("top"));
            explosao1(inimigo1X, inimigo1Y);

            posicaoY = parseInt(Math.random() * 334);
            $("#inimigo1").css("left", 694);
            $("#inimigo1").css("top", posicaoY);
        }

        //Explosão com colisão do jogador no inimigo 2 
        if (colisao2.length > 0) {
            energiaAtual--;
            inimigo2X = parseInt($("#inimigo2").css("left"));
            inimigo2Y = parseInt($("#inimigo2").css("top"));
            explosao2(inimigo2X, inimigo2Y);
            $("#inimigo2").remove();

            reposicionaInimigo2();
        }

        //Explosão com colisão de tiro no inimigo  1
        if (colisao3.length > 0) {
            velocidade = velocidade + 0.3;
            pontos = pontos + 100;
            inimigo1X = parseInt($("#inimigo1").css("left"));
            inimigo1Y = parseInt($("#inimigo1").css("top"));
            explosao1(inimigo1X, inimigo1Y);
            $("#disparo").css("left", 950);

            posicaoY = parseInt(Math.random() * 334);
            $("#inimigo1").css("left", 694);
            $("#inimigo1").css("top", posicaoY);
        }

        //Explosão com colisão de tiro no inimigo 2
        if (colisao4.length > 0) {
            pontos = pontos + 50;
            inimigo2X = parseInt($("#inimigo2").css("left"));
            inimigo2Y = parseInt($("#inimigo2").css("top"));
            $("#inimigo2").remove();
            explosao2(inimigo2X, inimigo2Y);
            $("#disparo").css("left", 950);

            reposicionaInimigo2();
        }

        //Colisão do jogador com o amigo 
        if (colisao5.length > 0) {
            salvos++;
            somRegate.play();
            reposicionaAmigo();
            $("#amigo").remove();
        }

        //Colisão do amigo com o inimigo 2
        if (colisao6.length > 0) {
            perdidos++;
            amigoX = parseInt($("#amigo").css("left"));
            amigoY = parseInt($("#amigo").css("top"));
            explosao3(amigoX, amigoY);
            $("#amigo").remove();

            reposicionaAmigo();
        }

        //Função da explosão jogador com inimigo 1
        function explosao1(inimigo1X, inimigo1Y) {
            somExplosao.play();
            $("#fundoGame").append("<div id='explosao1'></div");
            $("#explosao1").css("background-image", "url(imgs/explosao.png)");
            var div = $("#explosao1");
            div.css("top", inimigo1Y);
            div.css("left", inimigo1X);
            div.animate({ width: 200, opacity: 0 }, "slow");
            var tempoExplosao = window.setInterval(removeExplosao, 1000);

            function removeExplosao() {
                div.remove();
                window.clearInterval(tempoExplosao);
                tempoExplosao = null;
            }
        }

        //Função da explosão jogador com inimigo 2
        function explosao2(inimigo2X, inimigo2Y) {
            somExplosao.paly();
            $("#fundoGame").append("<div id='explosao2'></div");
            $("#explosao2").css("background-image", "url(imgs/explosao.png)");
            var div2 = $("#explosao2");
            div2.css("top", inimigo2Y);
            div2.css("left", inimigo2X);
            div2.animate({ width: 200, opacity: 0 }, "slow");
            var tempoExplosao2 = window.setInterval(removeExplosao2, 1000);

            function removeExplosao2() {
                div2.remove();
                window.clearInterval(tempoExplosao2);
                tempoExplosao2 = null;
            }
        }

        //Função da colisão do amigo com inimigo 2
        function explosao3(){
            somPerdido.play();
            $("#fundoGame").append("<div id='explosao3' class='anima4'></div>");
            $("#explosao3").css("top", amigoY);
            $("#explosao3").css("left", amigoX);
            var tempoExplosao3 = window.setInterval(resetaExlosao3, 1000);

            function resetaExlosao3(){
                $("#explosao3").remove();
                window.clearInterval(tempoExplosao3);
                tempoExplosao3 = null;
            }
        }

        //Funções de reposição de inimigo2
        function reposicionaInimigo2() {
            var tempoColisao4 = window.setInterval(reposiciona4, 5000);

            function reposiciona4() {
                window.clearInterval(tempoColisao4);
                tempoColisao4 = null;

                if (fimdejogo == false) {
                    $("#fundoGame").append("<div id=inimigo2></div");
                }
            }
        }

        //Reposição do amigo
        function reposicionaAmigo() {
            var tempoAmigo = window.setInterval(reposiciona6, 6000);

            function reposiciona6() {
                window.clearInterval(tempoAmigo);
                tempoAmigo = null;

                if (fimdejogo == false) {
                    $("#fundoGame").append("<div id='amigo' class='anima3'></div>");
                }
            }
        }

    }

    //Função de pontuação do jogo
    function placar(){
        $("#placar").html("<h2>Pontos: " + pontos + " Salvos: " + salvos + 
        " Perdidos: " + perdidos + "</h2>");
    }

    //Função de energia do jogador
    function energia(){
        if(energiaAtual == 3){
            $("#energia").css("background-image", "url(imgs/energia3.png)");
        }
        if(energiaAtual == 2){
            $("#energia").css("background-image", "url(imgs/energia2.png)");
        }
        if(energiaAtual == 1){
            $("#energia").css("background-image", "url(imgs/energia1.png)");
        }
        if(energiaAtual == 0){
            $("#energia").css("background-image", "url(imgs/energia0.png)");
        }
    }
}
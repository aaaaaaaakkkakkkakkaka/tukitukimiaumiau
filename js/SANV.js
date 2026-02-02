var numFiles = 4;
var numColumnes = 4;
var nomImatge = "img-2";
var extImatge = ".jpg";
var ampladaPeca, alcadaPeca;
var midaMarc = 600;

const soEncert = new Audio("sons/so3.mp3");

/* ===== MÚSICA FONDO ===== */
const musicaFondo = new Audio("sons/so1.mp3");
musicaFondo.loop = true;
let musicaActiva = true;

$(document).ready(function(){

    /* Botón música play / pause */
    $("#btn-musica").click(function(){
        if (musicaActiva) {
            musicaFondo.pause();
            $(this).attr("src", "imatges/musica-off.png");
        } else {
            musicaFondo.play();
            $(this).attr("src", "imatges/musica-on.png");
        }
        musicaActiva = !musicaActiva;
    });

    $("#btnPuzzle").click(function(){
        $("#main-container").hide();
        $("#form-menu").show();
    });

    $("#btnCollage").click(function(){
        $("#main-container").hide();
        $("#collage").show();
    });

    $("#volverMenu, #volverInicioPuzzle, #volverInicioDesdeJuego").click(function(){
        location.reload();
    });

    $("#jugar").click(function(){
        numFiles = Math.max(parseInt($("#files").val()), 4);
        numColumnes = Math.max(parseInt($("#columnes").val()), 4);

        $("#form-menu").hide();
        $("#form-joc").show();

        /* Fondo difuminado */
        $("#fondo-solucion").css({
            backgroundImage: "url(imatges/" + nomImatge + extImatge + ")",
            backgroundSize: midaMarc + "px " + midaMarc + "px",
            backgroundPosition: "0 0"
        });

        creaPuzzle();
    });
});

function creaPuzzle(){
    ampladaPeca = Math.floor(midaMarc / numColumnes);
    alcadaPeca = Math.floor(midaMarc / numFiles);

    $("#peces-puzzle").html(crearPeces());

    $(".peca").css({
        width: ampladaPeca,
        height: alcadaPeca,
        backgroundImage: "url(imatges/" + nomImatge + extImatge + ")",
        backgroundSize: midaMarc + "px " + midaMarc + "px",
        position: "absolute"
    });

    setImatgePosicioPeces();

    $(".peca")
        .draggable({ containment: "#marc-puzzle" })
        .on("mouseup", function(){
            posicionaPeca($(this));
            if (puzzleResolt()){
                $("#felicitacio").fadeIn(500).delay(1500).fadeOut(1000);
            }
        });
}

/* ===== CREAR PIEZAS ===== */
function crearPeces(){
    let html = "";
    for (let f = 0; f < numFiles; f++){
        for (let c = 0; c < numColumnes; c++){
            html += `<div id="f${f}c${c}" class="peca"></div>`;
        }
    }
    return html;
}

/* ===== POSICIÓN ALEATORIA ===== */
function setImatgePosicioPeces(){
    $(".peca").each(function(){
        let id = $(this).attr("id");
        let f = parseInt(id.charAt(1));
        let c = parseInt(id.charAt(3));

        $(this).css({
            backgroundPosition: `-${c * ampladaPeca}px -${f * alcadaPeca}px`,
            left: Math.random() * (midaMarc - ampladaPeca),
            top: Math.random() * (midaMarc - alcadaPeca)
        });
    });
}

/* ===== IMÁN + BLOQUEO ===== */
function posicionaPeca(peca){
    if (peca.hasClass("colocada")) return;

    let id = peca.attr("id");
    let fila = parseInt(id.charAt(1));
    let columna = parseInt(id.charAt(3));

    let posCorrecta = {
        top: fila * alcadaPeca,
        left: columna * ampladaPeca
    };

    let tolerancia = Math.min(ampladaPeca, alcadaPeca) * 0.25;

    let dx = peca.position().left - posCorrecta.left;
    let dy = peca.position().top - posCorrecta.top;

    if (Math.abs(dx) < tolerancia && Math.abs(dy) < tolerancia){
        peca.animate(posCorrecta, 150, function(){
            peca.addClass("colocada");
            peca.draggable("disable");
            peca.css({
                pointerEvents: "none",
                cursor: "default",
                zIndex: 1
            });
        });

        soEncert.play();

        peca.css("boxShadow", "0 0 15px rgba(255,105,180,0.9)");
        setTimeout(() => {
            peca.css("boxShadow", "none");
        }, 300);
    }
}

/* ===== COMPROBAR PUZZLE ===== */
function puzzleResolt(){
    let correcto = true;
    $(".peca").each(function(){
        if (!$(this).hasClass("colocada")){
            correcto = false;
            return false;
        }
    });
    return correcto;
}

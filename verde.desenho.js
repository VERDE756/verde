"use strict";

/* =========================================================
   VERDE - SISTEMA DE DESENHO
   ========================================================= */

const VERDE_DESENHO_STORAGE = "verde_desenhos";

let verdeCanvas = null;
let verdeContexto = null;
let verdeDesenhando = false;
let verdeBorracha = false;


/* =========================================================
   CONFIGURAÇÕES
   ========================================================= */

let verdeTamanhoPincel = 8;
let verdeCorPincel = "#39ff72";


/* =========================================================
   PEGAR CANVAS
   ========================================================= */

function verdeObterCanvas() {

    if (!verdeCanvas) {

        verdeCanvas =
            document.querySelector(
                "#canvasDesenho"
            );
    }

    if (
        verdeCanvas &&
        !verdeContexto
    ) {

        verdeContexto =
            verdeCanvas.getContext(
                "2d"
            );
    }

    return verdeCanvas;
}


/* =========================================================
   AJUSTAR CANVAS
   ========================================================= */

function verdePrepararCanvas() {

    const canvas =
        verdeObterCanvas();

    if (!canvas) {
        return;
    }

    canvas.width =
        canvas.clientWidth || 800;

    canvas.height =
        canvas.clientHeight || 500;

    verdeContexto.fillStyle =
        "#07140b";

    verdeContexto.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    verdeContexto.lineCap =
        "round";

    verdeContexto.lineJoin =
        "round";
}


/* =========================================================
   POSIÇÃO DO MOUSE
   ========================================================= */

function verdePosicaoMouse(
    evento
) {

    const canvas =
        verdeObterCanvas();

    const rect =
        canvas.getBoundingClientRect();

    return {

        x:
            evento.clientX -
            rect.left,

        y:
            evento.clientY -
            rect.top
    };
}


/* =========================================================
   INICIAR DESENHO
   ========================================================= */

function verdeComecarDesenho(
    evento
) {

    const canvas =
        verdeObterCanvas();

    if (!canvas) {
        return;
    }

    verdeDesenhando = true;

    const pos =
        verdePosicaoMouse(
            evento
        );

    verdeContexto.beginPath();

    verdeContexto.moveTo(
        pos.x,
        pos.y
    );
}


/* =========================================================
   DESENHAR
   ========================================================= */

function verdeDesenhar(
    evento
) {

    if (!verdeDesenhando) {
        return;
    }

    const pos =
        verdePosicaoMouse(
            evento
        );

    verdeContexto.lineWidth =
        verdeTamanhoPincel;

    if (verdeBorracha) {

        verdeContexto.globalCompositeOperation =
            "destination-out";

    } else {

        verdeContexto.globalCompositeOperation =
            "source-over";

        verdeContexto.strokeStyle =
            verdeCorPincel;
    }

    verdeContexto.lineTo(
        pos.x,
        pos.y
    );

    verdeContexto.stroke();
}


/* =========================================================
   PARAR DESENHO
   ========================================================= */

function verdePararDesenho() {

    verdeDesenhando = false;

    if (!verdeContexto) {
        return;
    }

    verdeContexto.closePath();

    verdeContexto.globalCompositeOperation =
        "source-over";
}


/* =========================================================
   TAMANHO DO PINCEL
   ========================================================= */

function verdeDefinirTamanhoDesenho(
    tamanho
) {

    tamanho =
        Number(tamanho);

    if (Number.isNaN(tamanho)) {
        return;
    }

    verdeTamanhoPincel =
        Math.max(
            1,
            Math.min(
                100,
                tamanho
            )
        );

    localStorage.setItem(
        "verde_pincel_tamanho",
        verdeTamanhoPincel
    );
}


/* =========================================================
   COR DO PINCEL
   ========================================================= */

function verdeDefinirCorDesenho(
    cor
) {

    if (!cor) {
        return;
    }

    verdeCorPincel =
        cor;

    localStorage.setItem(
        "verde_pincel_cor",
        cor
    );

    verdeBorracha =
        false;
}


/* =========================================================
   BORRACHA
   ========================================================= */

function verdeAtivarBorracha() {

    verdeBorracha =
        true;
}


/* =========================================================
   VOLTAR PARA PINCEL
   ========================================================= */

function verdeAtivarPincel() {

    verdeBorracha =
        false;
}


/* =========================================================
   LIMPAR CANVAS
   ========================================================= */

function verdeLimparDesenho() {

    const canvas =
        verdeObterCanvas();

    if (!canvas) {
        return;
    }

    verdeContexto.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    verdeContexto.fillStyle =
        "#07140b";

    verdeContexto.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    verdeContexto.fillStyle =
        verdeCorPincel;
}


/* =========================================================
   SALVAR DESENHO
   ========================================================= */

function verdeSalvarDesenho(
    nome = "Desenho"
) {

    const canvas =
        verdeObterCanvas();

    if (!canvas) {
        return null;
    }

    const desenhos =
        verdeLerDesenhos();

    const desenho = {

        id:
            Date.now().toString(),

        nome:
            nome,

        imagem:
            canvas.toDataURL(
                "image/png"
            ),

        criadoEm:
            new Date().toISOString()
    };

    desenhos.unshift(
        desenho
    );

    try {

        localStorage.setItem(
            VERDE_DESENHO_STORAGE,
            JSON.stringify(
                desenhos
            )
        );

        return desenho;

    } catch (erro) {

        console.error(
            "Não foi possível salvar o desenho:",
            erro
        );

        return null;
    }
}


/* =========================================================
   LER DESENHOS SALVOS
   ========================================================= */

function verdeLerDesenhos() {

    try {

        const dados =
            localStorage.getItem(
                VERDE_DESENHO_STORAGE
            );

        if (!dados) {
            return [];
        }

        const desenhos =
            JSON.parse(dados);

        return Array.isArray(desenhos)
            ? desenhos
            : [];

    } catch (erro) {

        console.error(
            "Erro ao carregar desenhos:",
            erro
        );

        return [];
    }
}


/* =========================================================
   EXCLUIR DESENHO
   ========================================================= */

function verdeExcluirDesenho(id) {

    const desenhos =
        verdeLerDesenhos();

    const novos =
        desenhos.filter(
            desenho =>
                desenho.id !== String(id)
        );

    localStorage.setItem(
        VERDE_DESENHO_STORAGE,
        JSON.stringify(novos)
    );
}


/* =========================================================
   DOWNLOAD
   ========================================================= */

function verdeBaixarDesenho(
    nome = "desenho-verde.png"
) {

    const canvas =
        verdeObterCanvas();

    if (!canvas) {
        return;
    }

    const link =
        document.createElement(
            "a"
        );

    link.download =
        nome;

    link.href =
        canvas.toDataURL(
            "image/png"
        );

    link.click();
}


/* =========================================================
   CARREGAR DESENHO
   ========================================================= */

function verdeCarregarDesenho(
    id
) {

    const desenhos =
        verdeLerDesenhos();

    const desenho =
        desenhos.find(
            item =>
                item.id === String(id)
        );

    if (!desenho) {
        return false;
    }

    const imagem =
        new Image();

    imagem.onload =
        function () {

            const canvas =
                verdeObterCanvas();

            verdeContexto.clearRect(
                0,
                0,
                canvas.width,
                canvas.height
            );

            verdeContexto.drawImage(
                imagem,
                0,
                0,
                canvas.width,
                canvas.height
            );
        };

    imagem.src =
        desenho.imagem;

    return true;
}


/* =========================================================
   EVENTOS DO CANVAS
   ========================================================= */

function verdeAtivarCanvas() {

    const canvas =
        verdeObterCanvas();

    if (!canvas) {
        return;
    }

    canvas.addEventListener(
        "pointerdown",
        verdeComecarDesenho
    );

    canvas.addEventListener(
        "pointermove",
        verdeDesenhar
    );

    canvas.addEventListener(
        "pointerup",
        verdePararDesenho
    );

    canvas.addEventListener(
        "pointercancel",
        verdePararDesenho
    );

    canvas.addEventListener(
        "pointerleave",
        verdePararDesenho
    );
}


/* =========================================================
   CONTROLES
   ========================================================= */

function verdeAtivarControlesDesenho() {

    const tamanho =
        document.querySelector(
            "#tamanhoPincel"
        );

    const cor =
        document.querySelector(
            "#corPincel"
        );

    const borracha =
        document.querySelector(
            "#borracha"
        );

    const limpar =
        document.querySelector(
            "#limparDesenho"
        );

    const baixar =
        document.querySelector(
            "#baixarDesenho"
        );

    const salvar =
        document.querySelector(
            "#salvarDesenho"
        );


    if (tamanho) {

        tamanho.value =
            verdeTamanhoPincel;

        tamanho.addEventListener(
            "input",
            () => {

                verdeDefinirTamanhoDesenho(
                    tamanho.value
                );
            }
        );
    }


    if (cor) {

        cor.value =
            verdeCorPincel;

        cor.addEventListener(
            "input",
            () => {

                verdeDefinirCorDesenho(
                    cor.value
                );
            }
        );
    }


    if (borracha) {

        borracha.addEventListener(
            "click",
            verdeAtivarBorracha
        );
    }


    if (limpar) {

        limpar.addEventListener(
            "click",
            verdeLimparDesenho
        );
    }


    if (baixar) {

        baixar.addEventListener(
            "click",
            () => {

                verdeBaixarDesenho();
            }
        );
    }


    if (salvar) {

        salvar.addEventListener(
            "click",
            () => {

                const desenho =
                    verdeSalvarDesenho();

                if (desenho) {

                    verdeMostrarStatusDesenho(
                        "Desenho salvo."
                    );
                }
            }
        );
    }
}


/* =========================================================
   STATUS
   ========================================================= */

function verdeMostrarStatusDesenho(
    mensagem
) {

    const status =
        document.querySelector(
            "#status"
        );

    if (!status) {
        return;
    }

    status.textContent =
        mensagem;

    setTimeout(
        () => {

            status.textContent =
                "";

        },
        2500
    );
}


/* =========================================================
   CARREGAR CONFIGURAÇÕES
   ========================================================= */

function verdeCarregarConfiguracoesDesenho() {

    const tamanho =
        Number(
            localStorage.getItem(
                "verde_pincel_tamanho"
            )
        );

    const cor =
        localStorage.getItem(
            "verde_pincel_cor"
        );

    if (
        !Number.isNaN(tamanho) &&
        tamanho > 0
    ) {

        verdeTamanhoPincel =
            tamanho;
    }

    if (cor) {

        verdeCorPincel =
            cor;
    }
}


/* =========================================================
   INICIALIZAÇÃO
   ========================================================= */

function iniciarDesenhoVerde() {

    verdeCarregarConfiguracoesDesenho();

    verdePrepararCanvas();

    verdeAtivarCanvas();

    verdeAtivarControlesDesenho();
}


/* =========================================================
   API
   ========================================================= */

window.verdeDesenho = {

    iniciar:
        iniciarDesenhoVerde,

    limpar:
        verdeLimparDesenho,

    salvar:
        verdeSalvarDesenho,

    baixar:
        verdeBaixarDesenho,

    carregar:
        verdeCarregarDesenho,

    excluir:
        verdeExcluirDesenho,

    listar:
        verdeLerDesenhos,

    tamanho:
        verdeDefinirTamanhoDesenho,

    cor:
        verdeDefinirCorDesenho,

    borracha:
        verdeAtivarBorracha,

    pincel:
        verdeAtivarPincel
};


/* =========================================================
   INICIAR
   ========================================================= */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        iniciarDesenhoVerde
    );

} else {

    iniciarDesenhoVerde();

}
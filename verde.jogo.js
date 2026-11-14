"use strict";

/* =========================================================
   VERDE - MINI JOGO
   ========================================================= */

const VERDE_JOGO_STORAGE = "verde_recorde_jogo";

let verdeJogoAtivo = false;
let verdePontos = 0;
let verdeRecorde = 0;
let verdeAlvo = null;
let verdeTimer = null;


/* =========================================================
   CARREGAR RECORDE
   ========================================================= */

function verdeCarregarRecorde() {

    const recorde =
        Number(
            localStorage.getItem(
                VERDE_JOGO_STORAGE
            )
        );

    verdeRecorde =
        Number.isNaN(recorde)
            ? 0
            : recorde;

    verdeAtualizarPlacar();
}


/* =========================================================
   SALVAR RECORDE
   ========================================================= */

function verdeSalvarRecorde() {

    localStorage.setItem(
        VERDE_JOGO_STORAGE,
        verdeRecorde
    );
}


/* =========================================================
   ATUALIZAR PLACAR
   ========================================================= */

function verdeAtualizarPlacar() {

    const pontos =
        document.querySelector(
            "#pontosJogo"
        );

    const recorde =
        document.querySelector(
            "#recordeJogo"
        );

    if (pontos) {
        pontos.textContent =
            verdePontos;
    }

    if (recorde) {
        recorde.textContent =
            verdeRecorde;
    }
}


/* =========================================================
   PEGAR ÁREA DO JOGO
   ========================================================= */

function verdeObterAreaJogo() {

    return document.querySelector(
        "#areaJogo"
    );
}


/* =========================================================
   CRIAR ALVO
   ========================================================= */

function verdeCriarAlvo() {

    const area =
        verdeObterAreaJogo();

    if (!area) {
        return;
    }

    if (verdeAlvo) {

        verdeAlvo.remove();

        verdeAlvo =
            null;
    }

    verdeAlvo =
        document.createElement(
            "button"
        );

    verdeAlvo.type =
        "button";

    verdeAlvo.className =
        "alvo-jogo";

    verdeAlvo.setAttribute(
        "aria-label",
        "Alvo"
    );

    const largura =
        Math.max(
            50,
            area.clientWidth
        );

    const altura =
        Math.max(
            50,
            area.clientHeight
        );

    const tamanho =
        Math.floor(
            Math.random() * 35
        ) + 35;

    const x =
        Math.floor(
            Math.random() *
            Math.max(
                1,
                largura - tamanho
            )
        );

    const y =
        Math.floor(
            Math.random() *
            Math.max(
                1,
                altura - tamanho
            )
        );

    verdeAlvo.style.width =
        `${tamanho}px`;

    verdeAlvo.style.height =
        `${tamanho}px`;

    verdeAlvo.style.left =
        `${x}px`;

    verdeAlvo.style.top =
        `${y}px`;

    verdeAlvo.addEventListener(
        "click",
        verdeAcertarAlvo
    );

    area.appendChild(
        verdeAlvo
    );
}


/* =========================================================
   ACERTAR ALVO
   ========================================================= */

function verdeAcertarAlvo() {

    if (!verdeJogoAtivo) {
        return;
    }

    verdePontos++;

    if (
        verdePontos >
        verdeRecorde
    ) {

        verdeRecorde =
            verdePontos;

        verdeSalvarRecorde();
    }

    verdeAtualizarPlacar();

    verdeCriarAlvo();
}


/* =========================================================
   INICIAR JOGO
   ========================================================= */

function verdeIniciarJogo() {

    verdeJogoAtivo =
        true;

    verdePontos =
        0;

    verdeAtualizarPlacar();

    verdeCriarAlvo();

    verdeMostrarStatusJogo(
        "Jogo iniciado."
    );
}


/* =========================================================
   PARAR JOGO
   ========================================================= */

function verdePararJogo() {

    verdeJogoAtivo =
        false;

    if (verdeAlvo) {

        verdeAlvo.remove();

        verdeAlvo =
            null;
    }

    clearTimeout(
        verdeTimer
    );

    verdeMostrarStatusJogo(
        "Jogo parado."
    );
}


/* =========================================================
   RESETAR RECORDE
   ========================================================= */

function verdeResetarRecorde() {

    verdeRecorde =
        0;

    verdeSalvarRecorde();

    verdeAtualizarPlacar();
}


/* =========================================================
   STATUS
   ========================================================= */

function verdeMostrarStatusJogo(
    mensagem
) {

    const status =
        document.querySelector(
            "#statusJogo"
        );

    if (!status) {
        return;
    }

    status.textContent =
        mensagem;

    clearTimeout(
        verdeMostrarStatusJogo.timer
    );

    verdeMostrarStatusJogo.timer =
        setTimeout(
            () => {

                status.textContent =
                    "";

            },
            2000
        );
}


/* =========================================================
   BOTÃO INICIAR
   ========================================================= */

function verdeAtivarBotaoJogo() {

    const botao =
        document.querySelector(
            "#iniciarJogo"
        );

    if (!botao) {
        return;
    }

    botao.addEventListener(
        "click",
        () => {

            if (
                verdeJogoAtivo
            ) {

                verdePararJogo();

            } else {

                verdeIniciarJogo();
            }
        }
    );
}


/* =========================================================
   BOTÃO RECORDE
   ========================================================= */

function verdeAtivarBotaoResetRecorde() {

    const botao =
        document.querySelector(
            "#resetarRecorde"
        );

    if (!botao) {
        return;
    }

    botao.addEventListener(
        "click",
        verdeResetarRecorde
    );
}


/* =========================================================
   REDIMENSIONAMENTO
   ========================================================= */

function verdeAjustarJogo() {

    if (!verdeJogoAtivo) {
        return;
    }

    verdeCriarAlvo();
}


/* =========================================================
   INICIALIZAÇÃO
   ========================================================= */

function iniciarJogoVerde() {

    verdeCarregarRecorde();

    verdeAtivarBotaoJogo();

    verdeAtivarBotaoResetRecorde();

    window.addEventListener(
        "resize",
        verdeAjustarJogo
    );
}


/* =========================================================
   API
   ========================================================= */

window.verdeJogo = {

    iniciar:
        verdeIniciarJogo,

    parar:
        verdePararJogo,

    recorde:
        verdeCarregarRecorde,

    resetarRecorde:
        verdeResetarRecorde,

    pontos:
        () => verdePontos
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
        iniciarJogoVerde
    );

} else {

    iniciarJogoVerde();

}
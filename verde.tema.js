/* =========================================================
   VERDE - verde.tema.js
   Sistema de tema, cores, fonte e fundo
   ========================================================= */

"use strict";

const VERDE_TEMA_STORAGE = "verde_tema";


/* =========================================================
   TEMAS
   ========================================================= */

const VERDE_TEMAS = {

    verde: {
        nome: "Verde",

        fundo: "#050a07",
        painel: "#0a160d",
        texto: "#d8ffe2",
        textoFraco: "#7ca889",
        borda: "#1e5c30",
        verde: "#39ff72",
        verdeClaro: "#8affaa"
    },

    escuro: {
        nome: "Escuro",

        fundo: "#080808",
        painel: "#111111",
        texto: "#eeeeee",
        textoFraco: "#999999",
        borda: "#333333",
        verde: "#39ff72",
        verdeClaro: "#8affaa"
    },

    claro: {
        nome: "Claro",

        fundo: "#eef7f0",
        painel: "#ffffff",
        texto: "#102016",
        textoFraco: "#52705b",
        borda: "#b8d8c0",
        verde: "#159447",
        verdeClaro: "#39c968"
    }
};


/* =========================================================
   PEGAR TEMA ATUAL
   ========================================================= */

function verdeTemaAtual() {

    return (
        localStorage.getItem(
            VERDE_TEMA_STORAGE
        ) || "verde"
    );
}


/* =========================================================
   APLICAR TEMA
   ========================================================= */

function verdeAplicarTema(nome) {

    const tema =
        VERDE_TEMAS[nome] ||
        VERDE_TEMAS.verde;

    const root =
        document.documentElement;

    root.style.setProperty(
        "--fundo",
        tema.fundo
    );

    root.style.setProperty(
        "--painel",
        tema.painel
    );

    root.style.setProperty(
        "--texto",
        tema.texto
    );

    root.style.setProperty(
        "--texto-fraco",
        tema.textoFraco
    );

    root.style.setProperty(
        "--borda",
        tema.borda
    );

    root.style.setProperty(
        "--verde",
        tema.verde
    );

    root.style.setProperty(
        "--verde-claro",
        tema.verdeClaro
    );

    document.body.dataset.tema =
        nome;
}


/* =========================================================
   ESCOLHER TEMA
   ========================================================= */

function verdeEscolherTema(nome) {

    if (!VERDE_TEMAS[nome]) {
        nome = "verde";
    }

    localStorage.setItem(
        VERDE_TEMA_STORAGE,
        nome
    );

    verdeAplicarTema(nome);
}


/* =========================================================
   COR PRINCIPAL
   ========================================================= */

function verdeDefinirCorPrincipal(cor) {

    if (!cor) return;

    document.documentElement.style.setProperty(
        "--verde",
        cor
    );

    localStorage.setItem(
        "verde_cor_principal",
        cor
    );
}


/* =========================================================
   CARREGAR COR PRINCIPAL
   ========================================================= */

function verdeCarregarCorPrincipal() {

    const cor =
        localStorage.getItem(
            "verde_cor_principal"
        );

    if (!cor) return;

    document.documentElement.style.setProperty(
        "--verde",
        cor
    );
}


/* =========================================================
   FONTE
   ========================================================= */

function verdeDefinirFonte(fonte) {

    if (!fonte) return;

    document.body.style.fontFamily =
        fonte;

    localStorage.setItem(
        "verde_fonte",
        fonte
    );
}


/* =========================================================
   CARREGAR FONTE
   ========================================================= */

function verdeCarregarFonte() {

    const fonte =
        localStorage.getItem(
            "verde_fonte"
        );

    if (!fonte) return;

    document.body.style.fontFamily =
        fonte;
}


/* =========================================================
   TAMANHO DA FONTE
   ========================================================= */

function verdeDefinirTamanhoFonte(
    tamanho
) {

    tamanho =
        Number(tamanho);

    if (Number.isNaN(tamanho)) {
        return;
    }

    tamanho =
        Math.max(
            10,
            Math.min(
                40,
                tamanho
            )
        );

    document.documentElement.style.setProperty(
        "--tamanho-fonte",
        `${tamanho}px`
    );

    localStorage.setItem(
        "verde_tamanho_fonte",
        tamanho
    );
}


/* =========================================================
   CARREGAR TAMANHO DA FONTE
   ========================================================= */

function verdeCarregarTamanhoFonte() {

    const tamanho =
        Number(
            localStorage.getItem(
                "verde_tamanho_fonte"
            )
        );

    if (
        !Number.isNaN(tamanho) &&
        tamanho > 0
    ) {

        document.documentElement.style.setProperty(
            "--tamanho-fonte",
            `${tamanho}px`
        );
    }
}


/* =========================================================
   FUNDO PERSONALIZADO
   ========================================================= */

function verdeDefinirFundo(imagem) {

    if (!imagem) return;

    localStorage.setItem(
        "verde_background",
        imagem
    );

    document.body.style.backgroundImage =
        `url("${imagem}")`;

    document.body.style.backgroundSize =
        "cover";

    document.body.style.backgroundPosition =
        "center";

    document.body.style.backgroundAttachment =
        "fixed";
}


/* =========================================================
   REMOVER FUNDO
   ========================================================= */

function verdeRemoverFundo() {

    localStorage.removeItem(
        "verde_background"
    );

    document.body.style.backgroundImage =
        "";
}


/* =========================================================
   CARREGAR FUNDO
   ========================================================= */

function verdeCarregarFundo() {

    const fundo =
        localStorage.getItem(
            "verde_background"
        );

    if (!fundo) return;

    document.body.style.backgroundImage =
        `url("${fundo}")`;

    document.body.style.backgroundSize =
        "cover";

    document.body.style.backgroundPosition =
        "center";

    document.body.style.backgroundAttachment =
        "fixed";
}


/* =========================================================
   INTENSIDADE DO FUNDO
   ========================================================= */

function verdeDefinirIntensidadeFundo(
    valor
) {

    valor =
        Number(valor);

    valor =
        Math.max(
            0,
            Math.min(
                100,
                valor
            )
        );

    localStorage.setItem(
        "verde_intensidade_fundo",
        valor
    );

    document.documentElement.style.setProperty(
        "--intensidade-fundo",
        `${valor / 100}`
    );
}


/* =========================================================
   REDUZIR ANIMAÇÕES
   ========================================================= */

function verdeDefinirAnimacoes(
    reduzir
) {

    localStorage.setItem(
        "verde_reduzir_animacoes",
        reduzir
            ? "true"
            : "false"
    );

    document.body.classList.toggle(
        "sem-animacoes",
        reduzir
    );
}


/* =========================================================
   INTERFACE GRANDE
   ========================================================= */

function verdeDefinirInterfaceGrande(
    ativar
) {

    localStorage.setItem(
        "verde_interface_grande",
        ativar
            ? "true"
            : "false"
    );

    document.body.classList.toggle(
        "interface-grande",
        ativar
    );
}


/* =========================================================
   ALTO CONTRASTE
   ========================================================= */

function verdeDefinirAltoContraste(
    ativar
) {

    localStorage.setItem(
        "verde_alto_contraste",
        ativar
            ? "true"
            : "false"
    );

    document.body.classList.toggle(
        "alto-contraste",
        ativar
    );
}


/* =========================================================
   EFEITOS
   ========================================================= */

function verdeDefinirEfeitos(
    ativar
) {

    localStorage.setItem(
        "verde_efeitos",
        ativar
            ? "true"
            : "false"
    );

    document.body.classList.toggle(
        "sem-efeitos",
        !ativar
    );
}


/* =========================================================
   CARREGAR ACESSIBILIDADE
   ========================================================= */

function verdeCarregarAcessibilidade() {

    const reduzir =
        localStorage.getItem(
            "verde_reduzir_animacoes"
        ) === "true";

    const grande =
        localStorage.getItem(
            "verde_interface_grande"
        ) === "true";

    const contraste =
        localStorage.getItem(
            "verde_alto_contraste"
        ) === "true";

    const efeitos =
        localStorage.getItem(
            "verde_efeitos"
        ) !== "false";


    document.body.classList.toggle(
        "sem-animacoes",
        reduzir
    );

    document.body.classList.toggle(
        "interface-grande",
        grande
    );

    document.body.classList.toggle(
        "alto-contraste",
        contraste
    );

    document.body.classList.toggle(
        "sem-efeitos",
        !efeitos
    );
}


/* =========================================================
   RESTAURAR TEMA
   ========================================================= */

function verdeRestaurarTema() {

    localStorage.removeItem(
        VERDE_TEMA_STORAGE
    );

    localStorage.removeItem(
        "verde_cor_principal"
    );

    localStorage.removeItem(
        "verde_fonte"
    );

    localStorage.removeItem(
        "verde_tamanho_fonte"
    );

    localStorage.removeItem(
        "verde_intensidade_fundo"
    );

    localStorage.removeItem(
        "verde_reduzir_animacoes"
    );

    localStorage.removeItem(
        "verde_interface_grande"
    );

    localStorage.removeItem(
        "verde_alto_contraste"
    );

    localStorage.removeItem(
        "verde_efeitos"
    );

    verdeAplicarTema(
        "verde"
    );

    verdeCarregarAcessibilidade();
}


/* =========================================================
   INICIALIZAÇÃO
   ========================================================= */

function iniciarTemaVerde() {

    verdeAplicarTema(
        verdeTemaAtual()
    );

    verdeCarregarCorPrincipal();

    verdeCarregarFonte();

    verdeCarregarTamanhoFonte();

    verdeCarregarFundo();

    verdeCarregarAcessibilidade();
}


/* =========================================================
   API
   ========================================================= */

window.verdeTema = {

    temas:
        VERDE_TEMAS,

    atual:
        verdeTemaAtual,

    escolher:
        verdeEscolherTema,

    aplicar:
        verdeAplicarTema,

    cor:
        verdeDefinirCorPrincipal,

    fonte:
        verdeDefinirFonte,

    tamanhoFonte:
        verdeDefinirTamanhoFonte,

    fundo:
        verdeDefinirFundo,

    removerFundo:
        verdeRemoverFundo,

    intensidadeFundo:
        verdeDefinirIntensidadeFundo,

    animacoes:
        verdeDefinirAnimacoes,

    interfaceGrande:
        verdeDefinirInterfaceGrande,

    contraste:
        verdeDefinirAltoContraste,

    efeitos:
        verdeDefinirEfeitos,

    restaurar:
        verdeRestaurarTema
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
        iniciarTemaVerde
    );

} else {

    iniciarTemaVerde();

}
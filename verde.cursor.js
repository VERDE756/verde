/* =========================================================
   VERDE - verde.cursor.js
   Sistema de cursores
   ========================================================= */

"use strict";

const VERDE_CURSOR_STORAGE = "verde_cursor";

const cursores = {
    padrao: {
        nome: "Cursor padrão",
        normal: null,
        clique: null
    },

    verde: {
        nome: "Cursor Verde",
        normal: "cursor-verde.png",
        clique: "cursor-mao.png"
    }
};


/* =========================================================
   PEGAR CURSOR SALVO
   ========================================================= */

function verdeCursorAtual() {
    return (
        localStorage.getItem(
            VERDE_CURSOR_STORAGE
        ) || "padrao"
    );
}


/* =========================================================
   APLICAR CURSOR
   ========================================================= */

function verdeAplicarCursor(tipo) {

    const cursor =
        cursores[tipo] ||
        cursores.padrao;

    const root =
        document.documentElement;

    if (!cursor.normal) {

        root.style.setProperty(
            "--cursor-normal",
            "auto"
        );

        root.style.setProperty(
            "--cursor-clique",
            "pointer"
        );

        return;
    }

    root.style.setProperty(
        "--cursor-normal",
        `url("${cursor.normal}") 0 0, auto`
    );

    root.style.setProperty(
        "--cursor-clique",
        `url("${cursor.clique}") 0 0, pointer`
    );
}


/* =========================================================
   ESCOLHER CURSOR
   ========================================================= */

function verdeEscolherCursor(tipo) {

    if (!cursores[tipo]) {
        tipo = "padrao";
    }

    localStorage.setItem(
        VERDE_CURSOR_STORAGE,
        tipo
    );

    verdeAplicarCursor(tipo);

    const seletor =
        document.querySelector(
            "#cursorSelecionado"
        );

    if (seletor) {
        seletor.value = tipo;
    }

    console.log(
        "Cursor selecionado:",
        cursores[tipo].nome
    );
}


/* =========================================================
   CURSOR PERSONALIZADO
   ========================================================= */

function verdeCursorPersonalizado(arquivo) {

    if (!arquivo) return;

    if (
        !arquivo.type.startsWith("image/")
    ) {
        alert(
            "Escolha uma imagem para o cursor."
        );

        return;
    }

    const leitor =
        new FileReader();

    leitor.onload = () => {

        const imagem =
            leitor.result;

        try {

            localStorage.setItem(
                "verde_cursor_custom",
                imagem
            );

            localStorage.setItem(
                VERDE_CURSOR_STORAGE,
                "personalizado"
            );

            document.documentElement.style.setProperty(
                "--cursor-normal",
                `url("${imagem}") 0 0, auto`
            );

            document.documentElement.style.setProperty(
                "--cursor-clique",
                `url("${imagem}") 0 0, pointer`
            );

            console.log(
                "Cursor personalizado aplicado."
            );

        } catch (erro) {

            console.error(
                "Erro ao salvar cursor:",
                erro
            );

            alert(
                "Não foi possível salvar esse cursor."
            );
        }
    };

    leitor.readAsDataURL(arquivo);
}


/* =========================================================
   APLICAR CURSOR PERSONALIZADO SALVO
   ========================================================= */

function verdeAplicarCursorPersonalizado() {

    const imagem =
        localStorage.getItem(
            "verde_cursor_custom"
        );

    if (!imagem) {
        return false;
    }

    document.documentElement.style.setProperty(
        "--cursor-normal",
        `url("${imagem}") 0 0, auto`
    );

    document.documentElement.style.setProperty(
        "--cursor-clique",
        `url("${imagem}") 0 0, pointer`
    );

    return true;
}


/* =========================================================
   RESTAURAR CURSOR
   ========================================================= */

function verdeRestaurarCursor() {

    localStorage.removeItem(
        VERDE_CURSOR_STORAGE
    );

    localStorage.removeItem(
        "verde_cursor_custom"
    );

    verdeAplicarCursor(
        "padrao"
    );

    const seletor =
        document.querySelector(
            "#cursorSelecionado"
        );

    if (seletor) {
        seletor.value = "padrao";
    }

    console.log(
        "Cursor padrão restaurado."
    );
}


/* =========================================================
   TAMANHO DO CURSOR
   ========================================================= */

function verdeDefinirTamanhoCursor(
    tamanho
) {

    tamanho =
        Number(tamanho);

    tamanho =
        Math.max(
            16,
            Math.min(
                128,
                tamanho
            )
        );

    localStorage.setItem(
        "verde_cursor_tamanho",
        tamanho
    );

    document.documentElement.style.setProperty(
        "--cursor-tamanho",
        `${tamanho}px`
    );
}


/* =========================================================
   PEGAR TAMANHO
   ========================================================= */

function verdeObterTamanhoCursor() {

    return Number(
        localStorage.getItem(
            "verde_cursor_tamanho"
        )
    ) || 32;
}


/* =========================================================
   CONFIGURAR TAMANHO SALVO
   ========================================================= */

function verdeCarregarTamanhoCursor() {

    const tamanho =
        verdeObterTamanhoCursor();

    document.documentElement.style.setProperty(
        "--cursor-tamanho",
        `${tamanho}px`
    );
}


/* =========================================================
   INICIALIZAR
   ========================================================= */

function iniciarCursorVerde() {

    verdeCarregarTamanhoCursor();

    const salvo =
        verdeCursorAtual();

    if (
        salvo === "personalizado"
    ) {

        const aplicado =
            verdeAplicarCursorPersonalizado();

        if (aplicado) {
            return;
        }

        verdeAplicarCursor(
            "padrao"
        );

        return;
    }

    verdeAplicarCursor(
        salvo
    );
}


/* =========================================================
   API DO CURSOR
   ========================================================= */

window.verdeCursor = {

    listar: () =>
        Object.keys(cursores),

    atual:
        verdeCursorAtual,

    escolher:
        verdeEscolherCursor,

    aplicar:
        verdeAplicarCursor,

    personalizado:
        verdeCursorPersonalizado,

    restaurar:
        verdeRestaurarCursor,

    tamanho:
        verdeDefinirTamanhoCursor,

    obterTamanho:
        verdeObterTamanhoCursor
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
        iniciarCursorVerde
    );

} else {

    iniciarCursorVerde();

}
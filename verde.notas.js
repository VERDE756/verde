"use strict";

/* =========================================================
   VERDE - SISTEMA DE ANOTAÇÕES
   ========================================================= */

const VERDE_NOTAS_STORAGE = "verde_notas";


/* =========================================================
   LER NOTAS
   ========================================================= */

function verdeLerNotas() {

    try {

        const dados =
            localStorage.getItem(
                VERDE_NOTAS_STORAGE
            );

        if (!dados) {
            return [];
        }

        const notas =
            JSON.parse(dados);

        return Array.isArray(notas)
            ? notas
            : [];

    } catch (erro) {

        console.error(
            "Erro ao carregar notas:",
            erro
        );

        return [];
    }
}


/* =========================================================
   SALVAR NOTAS
   ========================================================= */

function verdeSalvarNotas(notas) {

    localStorage.setItem(
        VERDE_NOTAS_STORAGE,
        JSON.stringify(notas)
    );
}


/* =========================================================
   CRIAR NOTA
   ========================================================= */

function verdeCriarNota(
    titulo = "Nova anotação",
    texto = ""
) {

    const notas =
        verdeLerNotas();

    const agora =
        new Date();

    const nota = {

        id:
            Date.now().toString(),

        titulo:
            titulo || "Nova anotação",

        texto:
            texto || "",

        criadaEm:
            agora.toISOString(),

        atualizadaEm:
            agora.toISOString()
    };

    notas.unshift(nota);

    verdeSalvarNotas(notas);

    return nota;
}


/* =========================================================
   PEGAR NOTA
   ========================================================= */

function verdeObterNota(id) {

    const notas =
        verdeLerNotas();

    return notas.find(
        nota =>
            nota.id === String(id)
    ) || null;
}


/* =========================================================
   EDITAR NOTA
   ========================================================= */

function verdeEditarNota(
    id,
    titulo,
    texto
) {

    const notas =
        verdeLerNotas();

    const indice =
        notas.findIndex(
            nota =>
                nota.id === String(id)
        );

    if (indice === -1) {
        return false;
    }

    notas[indice].titulo =
        titulo || "Sem título";

    notas[indice].texto =
        texto || "";

    notas[indice].atualizadaEm =
        new Date().toISOString();

    verdeSalvarNotas(notas);

    return true;
}


/* =========================================================
   EXCLUIR NOTA
   ========================================================= */

function verdeExcluirNota(id) {

    const notas =
        verdeLerNotas();

    const novasNotas =
        notas.filter(
            nota =>
                nota.id !== String(id)
        );

    if (
        novasNotas.length ===
        notas.length
    ) {
        return false;
    }

    verdeSalvarNotas(
        novasNotas
    );

    return true;
}


/* =========================================================
   PESQUISAR NOTAS
   ========================================================= */

function verdePesquisarNotas(
    pesquisa
) {

    const notas =
        verdeLerNotas();

    const termo =
        String(pesquisa || "")
            .trim()
            .toLowerCase();

    if (!termo) {
        return notas;
    }

    return notas.filter(
        nota =>
            nota.titulo
                .toLowerCase()
                .includes(termo) ||

            nota.texto
                .toLowerCase()
                .includes(termo)
    );
}


/* =========================================================
   APAGAR TODAS AS NOTAS
   ========================================================= */

function verdeApagarTodasNotas() {

    localStorage.removeItem(
        VERDE_NOTAS_STORAGE
    );
}


/* =========================================================
   CONTAGEM
   ========================================================= */

function verdeQuantidadeNotas() {

    return verdeLerNotas().length;
}


/* =========================================================
   FORMATAR DATA
   ========================================================= */

function verdeFormatarData(data) {

    if (!data) {
        return "";
    }

    const dataObj =
        new Date(data);

    if (
        Number.isNaN(
            dataObj.getTime()
        )
    ) {
        return "";
    }

    return dataObj.toLocaleString(
        "pt-BR",
        {
            dateStyle: "short",
            timeStyle: "short"
        }
    );
}


/* =========================================================
   RENDERIZAR LISTA DE NOTAS
   ========================================================= */

function verdeRenderizarNotas(
    notas = verdeLerNotas()
) {

    const lista =
        document.querySelector(
            "#listaAnotacoes"
        );

    if (!lista) {
        return;
    }

    lista.innerHTML = "";

    if (notas.length === 0) {

        lista.innerHTML = `
            <div class="nenhuma-nota">
                Nenhuma anotação encontrada.
            </div>
        `;

        return;
    }

    notas.forEach(nota => {

        const item =
            document.createElement(
                "div"
            );

        item.className =
            "item-anotacao";

        item.dataset.id =
            nota.id;

        item.innerHTML = `

            <div class="nota-lista-titulo">
                ${verdeEscaparHTML(
                    nota.titulo
                )}
            </div>

            <div class="nota-lista-texto">
                ${verdeEscaparHTML(
                    nota.texto
                        .replace(/\n/g, " ")
                        .slice(0, 100)
                )}
            </div>

            <div class="nota-lista-data">
                ${verdeFormatarData(
                    nota.atualizadaEm
                )}
            </div>

        `;

        item.addEventListener(
            "click",
            () => {

                verdeAbrirNota(
                    nota.id
                );

            }
        );

        lista.appendChild(
            item
        );
    });
}


/* =========================================================
   ABRIR NOTA NO EDITOR
   ========================================================= */

function verdeAbrirNota(id) {

    const nota =
        verdeObterNota(id);

    if (!nota) {
        return;
    }

    const campoTitulo =
        document.querySelector(
            "#tituloNota"
        );

    const campoTexto =
        document.querySelector(
            "#textoNota"
        );

    if (campoTitulo) {
        campoTitulo.value =
            nota.titulo;
    }

    if (campoTexto) {
        campoTexto.value =
            nota.texto;
    }

    const editor =
        document.querySelector(
            "#editorNota"
        );

    if (editor) {
        editor.dataset.notaId =
            nota.id;
    }

    window.verdeNotaAtual =
        nota.id;
}


/* =========================================================
   SALVAR PELO EDITOR
   ========================================================= */

function verdeSalvarNotaAtual() {

    const editor =
        document.querySelector(
            "#editorNota"
        );

    if (!editor) {
        return false;
    }

    const id =
        editor.dataset.notaId;

    if (!id) {
        return false;
    }

    const titulo =
        document.querySelector(
            "#tituloNota"
        );

    const texto =
        document.querySelector(
            "#textoNota"
        );

    const sucesso =
        verdeEditarNota(
            id,
            titulo
                ? titulo.value
                : "",
            texto
                ? texto.value
                : ""
        );

    if (sucesso) {

        verdeRenderizarNotas();

        verdeMostrarStatus(
            "Anotação salva."
        );
    }

    return sucesso;
}


/* =========================================================
   ESCAPAR HTML
   ========================================================= */

function verdeEscaparHTML(
    texto
) {

    const div =
        document.createElement(
            "div"
        );

    div.textContent =
        String(texto || "");

    return div.innerHTML;
}


/* =========================================================
   STATUS
   ========================================================= */

function verdeMostrarStatus(
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

    clearTimeout(
        verdeMostrarStatus.timer
    );

    verdeMostrarStatus.timer =
        setTimeout(
            () => {

                status.textContent =
                    "";

            },
            2500
        );
}


/* =========================================================
   PESQUISA DA INTERFACE
   ========================================================= */

function verdeAtivarPesquisaNotas() {

    const pesquisa =
        document.querySelector(
            "#buscaNotas"
        );

    if (!pesquisa) {
        return;
    }

    pesquisa.addEventListener(
        "input",
        () => {

            const notas =
                verdePesquisarNotas(
                    pesquisa.value
                );

            verdeRenderizarNotas(
                notas
            );
        }
    );
}


/* =========================================================
   BOTÃO SALVAR
   ========================================================= */

function verdeAtivarBotaoSalvar() {

    const botao =
        document.querySelector(
            "#salvarNota"
        );

    if (!botao) {
        return;
    }

    botao.addEventListener(
        "click",
        () => {

            verdeSalvarNotaAtual();

        }
    );
}


/* =========================================================
   BOTÃO EXCLUIR
   ========================================================= */

function verdeAtivarBotaoExcluir() {

    const botao =
        document.querySelector(
            "#excluirNota"
        );

    if (!botao) {
        return;
    }

    botao.addEventListener(
        "click",
        () => {

            const editor =
                document.querySelector(
                    "#editorNota"
                );

            if (!editor) {
                return;
            }

            const id =
                editor.dataset.notaId;

            if (!id) {
                return;
            }

            verdeExcluirNota(
                id
            );

            editor.dataset.notaId =
                "";

            const titulo =
                document.querySelector(
                    "#tituloNota"
                );

            const texto =
                document.querySelector(
                    "#textoNota"
                );

            if (titulo) {
                titulo.value = "";
            }

            if (texto) {
                texto.value = "";
            }

            verdeRenderizarNotas();

            verdeMostrarStatus(
                "Anotação excluída."
            );
        }
    );
}


/* =========================================================
   INICIALIZAÇÃO
   ========================================================= */

function iniciarNotasVerde() {

    verdeRenderizarNotas();

    verdeAtivarPesquisaNotas();

    verdeAtivarBotaoSalvar();

    verdeAtivarBotaoExcluir();
}


/* =========================================================
   API
   ========================================================= */

window.verdeNotas = {

    ler:
        verdeLerNotas,

    salvar:
        verdeSalvarNotas,

    criar:
        verdeCriarNota,

    obter:
        verdeObterNota,

    editar:
        verdeEditarNota,

    excluir:
        verdeExcluirNota,

    pesquisar:
        verdePesquisarNotas,

    apagarTodas:
        verdeApagarTodasNotas,

    quantidade:
        verdeQuantidadeNotas,

    renderizar:
        verdeRenderizarNotas,

    abrir:
        verdeAbrirNota,

    salvarAtual:
        verdeSalvarNotaAtual
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
        iniciarNotasVerde
    );

} else {

    iniciarNotasVerde();

}
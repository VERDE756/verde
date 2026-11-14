"use strict";

/* =========================================================
   VERDE - SISTEMA DE IMAGENS
   ========================================================= */

const VERDE_IMAGENS_STORAGE = "verde_imagens";


/* =========================================================
   LER IMAGENS
   ========================================================= */

function verdeLerImagens() {

    try {

        const dados =
            localStorage.getItem(
                VERDE_IMAGENS_STORAGE
            );

        if (!dados) {
            return [];
        }

        const imagens =
            JSON.parse(dados);

        return Array.isArray(imagens)
            ? imagens
            : [];

    } catch (erro) {

        console.error(
            "Erro ao carregar imagens:",
            erro
        );

        return [];
    }
}


/* =========================================================
   SALVAR IMAGENS
   ========================================================= */

function verdeSalvarImagens(imagens) {

    localStorage.setItem(
        VERDE_IMAGENS_STORAGE,
        JSON.stringify(imagens)
    );
}


/* =========================================================
   ADICIONAR IMAGEM
   ========================================================= */

function verdeAdicionarImagem(arquivo) {

    return new Promise(
        (resolve, reject) => {

            if (!arquivo) {
                reject(
                    new Error(
                        "Nenhum arquivo selecionado."
                    )
                );

                return;
            }

            if (
                !arquivo.type.startsWith(
                    "image/"
                )
            ) {

                reject(
                    new Error(
                        "O arquivo não é uma imagem."
                    )
                );

                return;
            }

            const leitor =
                new FileReader();

            leitor.onload =
                function () {

                    const imagens =
                        verdeLerImagens();

                    const imagem = {

                        id:
                            Date.now().toString(),

                        nome:
                            arquivo.name,

                        tipo:
                            arquivo.type,

                        tamanho:
                            arquivo.size,

                        data:
                            leitor.result,

                        criadaEm:
                            new Date()
                                .toISOString()
                    };

                    imagens.unshift(
                        imagem
                    );

                    try {

                        verdeSalvarImagens(
                            imagens
                        );

                        verdeRenderizarImagens();

                        resolve(imagem);

                    } catch (erro) {

                        reject(erro);
                    }
                };

            leitor.onerror =
                function () {

                    reject(
                        new Error(
                            "Não foi possível ler a imagem."
                        )
                    );
                };

            leitor.readAsDataURL(
                arquivo
            );
        }
    );
}


/* =========================================================
   PEGAR IMAGEM
   ========================================================= */

function verdeObterImagem(id) {

    const imagens =
        verdeLerImagens();

    return imagens.find(
        imagem =>
            imagem.id === String(id)
    ) || null;
}


/* =========================================================
   EXCLUIR IMAGEM
   ========================================================= */

function verdeExcluirImagem(id) {

    const imagens =
        verdeLerImagens();

    const novas =
        imagens.filter(
            imagem =>
                imagem.id !== String(id)
        );

    if (
        novas.length ===
        imagens.length
    ) {

        return false;
    }

    verdeSalvarImagens(
        novas
    );

    verdeRenderizarImagens();

    return true;
}


/* =========================================================
   APAGAR TODAS
   ========================================================= */

function verdeApagarTodasImagens() {

    localStorage.removeItem(
        VERDE_IMAGENS_STORAGE
    );

    verdeRenderizarImagens();
}


/* =========================================================
   FORMATAR TAMANHO
   ========================================================= */

function verdeFormatarTamanhoImagem(
    bytes
) {

    if (!bytes) {
        return "0 KB";
    }

    const unidades = [
        "B",
        "KB",
        "MB",
        "GB"
    ];

    const indice =
        Math.floor(
            Math.log(bytes) /
            Math.log(1024)
        );

    return (
        bytes /
        Math.pow(
            1024,
            indice
        )
    ).toFixed(2) +
    " " +
    unidades[indice];
}


/* =========================================================
   RENDERIZAR GALERIA
   ========================================================= */

function verdeRenderizarImagens() {

    const galeria =
        document.querySelector(
            "#galeriaImagens"
        );

    if (!galeria) {
        return;
    }

    const imagens =
        verdeLerImagens();

    galeria.innerHTML = "";

    if (imagens.length === 0) {

        galeria.innerHTML = `
            <div class="nenhuma-imagem">
                Nenhuma imagem adicionada.
            </div>
        `;

        return;
    }

    imagens.forEach(
        imagem => {

            const card =
                document.createElement(
                    "div"
                );

            card.className =
                "imagem-card";

            card.dataset.id =
                imagem.id;

            card.innerHTML = `

                <img
                    src="${imagem.data}"
                    alt="${verdeEscaparImagem(
                        imagem.nome
                    )}"
                    loading="lazy"
                >

                <div class="imagem-info">

                    <strong>
                        ${verdeEscaparImagem(
                            imagem.nome
                        )}
                    </strong>

                    <small>
                        ${verdeFormatarTamanhoImagem(
                            imagem.tamanho
                        )}
                    </small>

                </div>

                <div class="imagem-acoes">

                    <button
                        type="button"
                        class="abrir-imagem"
                    >
                        Abrir
                    </button>

                    <button
                        type="button"
                        class="excluir-imagem"
                    >
                        Excluir
                    </button>

                </div>
            `;

            const abrir =
                card.querySelector(
                    ".abrir-imagem"
                );

            const excluir =
                card.querySelector(
                    ".excluir-imagem"
                );

            abrir.addEventListener(
                "click",
                evento => {

                    evento.stopPropagation();

                    verdeAbrirImagem(
                        imagem.id
                    );
                }
            );

            excluir.addEventListener(
                "click",
                evento => {

                    evento.stopPropagation();

                    verdeExcluirImagem(
                        imagem.id
                    );
                }
            );

            card.addEventListener(
                "dblclick",
                () => {

                    verdeAbrirImagem(
                        imagem.id
                    );
                }
            );

            galeria.appendChild(
                card
            );
        }
    );
}


/* =========================================================
   ABRIR IMAGEM
   ========================================================= */

function verdeAbrirImagem(id) {

    const imagem =
        verdeObterImagem(id);

    if (!imagem) {
        return;
    }

    const modal =
        document.querySelector(
            "#modalImagem"
        );

    const visualizacao =
        document.querySelector(
            "#imagemVisualizacao"
        );

    if (
        !modal ||
        !visualizacao
    ) {
        return;
    }

    visualizacao.src =
        imagem.data;

    visualizacao.alt =
        imagem.nome;

    modal.classList.add(
        "ativo"
    );
}


/* =========================================================
   FECHAR VISUALIZADOR
   ========================================================= */

function verdeFecharImagem() {

    const modal =
        document.querySelector(
            "#modalImagem"
        );

    if (!modal) {
        return;
    }

    modal.classList.remove(
        "ativo"
    );
}


/* =========================================================
   INPUT DE IMAGEM
   ========================================================= */

function verdeAtivarUploadImagens() {

    const input =
        document.querySelector(
            "#inputImagem"
        );

    if (!input) {
        return;
    }

    input.addEventListener(
        "change",
        async function () {

            const arquivos =
                Array.from(
                    input.files
                );

            for (
                const arquivo of arquivos
            ) {

                try {

                    await verdeAdicionarImagem(
                        arquivo
                    );

                } catch (erro) {

                    console.error(
                        erro
                    );
                }
            }

            input.value = "";
        }
    );
}


/* =========================================================
   FECHAR MODAL
   ========================================================= */

function verdeAtivarFechamentoImagem() {

    const modal =
        document.querySelector(
            "#modalImagem"
        );

    if (!modal) {
        return;
    }

    const fechar =
        modal.querySelector(
            ".fechar"
        );

    if (fechar) {

        fechar.addEventListener(
            "click",
            verdeFecharImagem
        );
    }

    modal.addEventListener(
        "click",
        evento => {

            if (
                evento.target ===
                modal
            ) {

                verdeFecharImagem();
            }
        }
    );
}


/* =========================================================
   ESCAPAR HTML
   ========================================================= */

function verdeEscaparImagem(
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
   INICIALIZAÇÃO
   ========================================================= */

function iniciarImagensVerde() {

    verdeRenderizarImagens();

    verdeAtivarUploadImagens();

    verdeAtivarFechamentoImagem();
}


/* =========================================================
   API
   ========================================================= */

window.verdeImagens = {

    ler:
        verdeLerImagens,

    salvar:
        verdeSalvarImagens,

    adicionar:
        verdeAdicionarImagem,

    obter:
        verdeObterImagem,

    excluir:
        verdeExcluirImagem,

    apagarTodas:
        verdeApagarTodasImagens,

    renderizar:
        verdeRenderizarImagens,

    abrir:
        verdeAbrirImagem,

    fechar:
        verdeFecharImagem
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
        iniciarImagensVerde
    );

} else {

    iniciarImagensVerde();

}
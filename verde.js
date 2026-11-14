/* =========================================================
   VERDE - verde.js
   ========================================================= */

"use strict";

/* =========================================================
   CONFIGURAÇÕES
   ========================================================= */

const STORAGE = {
    notes: "verde_notes",
    images: "verde_images",
    background: "verde_background",
    cursor: "verde_cursor",
    gameRecord: "verde_game_record"
};


/* =========================================================
   ELEMENTOS
   ========================================================= */

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);


/* =========================================================
   STATUS
   ========================================================= */

function mostrarStatus(texto) {
    const status = $("#status");

    if (!status) return;

    status.textContent = texto;
    status.classList.add("visivel");

    clearTimeout(mostrarStatus.timer);

    mostrarStatus.timer = setTimeout(() => {
        status.classList.remove("visivel");
    }, 2500);
}


/* =========================================================
   NAVEGAÇÃO
   ========================================================= */

function abrirTela(nome) {
    $$(".tela").forEach((tela) => {
        tela.classList.remove("ativa");
    });

    const tela = document.getElementById(nome);

    if (tela) {
        tela.classList.add("ativa");
    }

    $$("[data-tela]").forEach((botao) => {
        botao.classList.remove("ativo");
    });

    $$(`[data-tela="${nome}"]`).forEach((botao) => {
        botao.classList.add("ativo");
    });

    window.scrollTo({
        top: 0,
        behavior: "auto"
    });
}


$$("[data-tela]").forEach((botao) => {
    botao.addEventListener("click", () => {
        abrirTela(botao.dataset.tela);
    });
});


/* =========================================================
   ANOTAÇÕES
   ========================================================= */

let notas = [];

function carregarNotas() {
    try {
        notas = JSON.parse(localStorage.getItem(STORAGE.notes)) || [];
    } catch {
        notas = [];
    }
}

function salvarNotasStorage() {
    localStorage.setItem(
        STORAGE.notes,
        JSON.stringify(notas)
    );
}

function gerarId() {
    return Date.now().toString() + Math.random().toString(16).slice(2);
}


const listaNotas = $("#listaNotas");
const tituloNota = $("#tituloNota");
const textoNota = $("#textoNota");
const btnSalvarNota = $("#salvarNota");
const btnExcluirNota = $("#excluirNota");

let notaAtual = null;


function renderizarNotas(filtro = "") {
    if (!listaNotas) return;

    listaNotas.innerHTML = "";

    const termo = filtro.toLowerCase().trim();

    const filtradas = notas.filter((nota) => {
        return (
            nota.titulo.toLowerCase().includes(termo) ||
            nota.texto.toLowerCase().includes(termo)
        );
    });

    if (filtradas.length === 0) {
        listaNotas.innerHTML = `
            <div class="vazio">
                Nenhuma anotação encontrada.
            </div>
        `;
        return;
    }

    filtradas.forEach((nota) => {
        const item = document.createElement("button");

        item.className = "item-anotacao";

        item.innerHTML = `
            <strong>${escaparHTML(nota.titulo || "Sem título")}</strong>
            <span>${escaparHTML(
                nota.texto
                    ? nota.texto.slice(0, 80)
                    : "Anotação vazia"
            )}</span>
        `;

        item.addEventListener("click", () => {
            abrirNota(nota.id);
        });

        listaNotas.appendChild(item);
    });
}


function abrirNota(id) {
    const nota = notas.find((item) => item.id === id);

    if (!nota) return;

    notaAtual = nota.id;

    if (tituloNota) {
        tituloNota.value = nota.titulo;
    }

    if (textoNota) {
        textoNota.value = nota.texto;
    }

    if (btnExcluirNota) {
        btnExcluirNota.disabled = false;
    }
}


function criarNota() {
    const nota = {
        id: gerarId(),
        titulo: "Nova anotação",
        texto: "",
        data: new Date().toISOString()
    };

    notas.unshift(nota);

    salvarNotasStorage();
    renderizarNotas();

    abrirNota(nota.id);

    abrirTela("anotacoes");

    setTimeout(() => {
        if (tituloNota) {
            tituloNota.focus();
            tituloNota.select();
        }
    }, 100);
}


function salvarNotaAtual() {
    if (!notaAtual) {
        mostrarStatus("Nenhuma anotação selecionada.");
        return;
    }

    const nota = notas.find((item) => item.id === notaAtual);

    if (!nota) return;

    nota.titulo = tituloNota?.value || "Sem título";
    nota.texto = textoNota?.value || "";
    nota.data = new Date().toISOString();

    salvarNotasStorage();
    renderizarNotas();

    mostrarStatus("Anotação salva.");
}


function excluirNotaAtual() {
    if (!notaAtual) return;

    const confirmar = confirm(
        "Excluir esta anotação?"
    );

    if (!confirmar) return;

    notas = notas.filter((nota) => nota.id !== notaAtual);

    notaAtual = null;

    if (tituloNota) tituloNota.value = "";
    if (textoNota) textoNota.value = "";

    if (btnExcluirNota) {
        btnExcluirNota.disabled = true;
    }

    salvarNotasStorage();
    renderizarNotas();

    mostrarStatus("Anotação excluída.");
}


btnSalvarNota?.addEventListener(
    "click",
    salvarNotaAtual
);

btnExcluirNota?.addEventListener(
    "click",
    excluirNotaAtual
);


$("#novaNota")?.addEventListener(
    "click",
    criarNota
);


$("#buscarNotas")?.addEventListener(
    "input",
    (evento) => {
        renderizarNotas(evento.target.value);
    }
);


/* =========================================================
   MODAL DE NOVA NOTA
   ========================================================= */

const modalNovaNota = $("#modalNovaNota");

function abrirModalNota() {
    modalNovaNota?.classList.add("aberto");
}

function fecharModalNota() {
    modalNovaNota?.classList.remove("aberto");
}

$("#abrirModalNota")?.addEventListener(
    "click",
    abrirModalNota
);

$("#fecharModalNota")?.addEventListener(
    "click",
    fecharModalNota
);

$("#cancelarNovaNota")?.addEventListener(
    "click",
    fecharModalNota
);

$("#confirmarNovaNota")?.addEventListener(
    "click",
    () => {
        fecharModalNota();
        criarNota();
    }
);


/* =========================================================
   DESENHO
   ========================================================= */

const canvas = $("#canvasDesenho");

let ctx = null;
let desenhando = false;

let ferramentaDesenho = "pincel";

let tamanhoPincel = 8;
let corPincel = "#39ff72";


function prepararCanvas() {
    if (!canvas) return;

    ctx = canvas.getContext("2d");

    const largura = canvas.clientWidth;
    const altura = canvas.clientHeight;

    if (!largura || !altura) return;

    const imagemAnterior = document.createElement("canvas");

    imagemAnterior.width = canvas.width || largura;
    imagemAnterior.height = canvas.height || altura;

    if (canvas.width && canvas.height) {
        imagemAnterior
            .getContext("2d")
            .drawImage(canvas, 0, 0);
    }

    canvas.width = largura;
    canvas.height = altura;

    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    if (imagemAnterior.width > 0 && imagemAnterior.height > 0) {
        try {
            ctx.drawImage(
                imagemAnterior,
                0,
                0,
                canvas.width,
                canvas.height
            );
        } catch {}
    }
}


function obterPosicaoMouse(evento) {
    const rect = canvas.getBoundingClientRect();

    return {
        x: evento.clientX - rect.left,
        y: evento.clientY - rect.top
    };
}


function iniciarDesenho(evento) {
    if (!canvas || !ctx) return;

    desenhando = true;

    const pos = obterPosicaoMouse(evento);

    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
}


function desenhar(evento) {
    if (!desenhando || !ctx) return;

    const pos = obterPosicaoMouse(evento);

    ctx.lineWidth = tamanhoPincel;

    if (ferramentaDesenho === "borracha") {
        ctx.globalCompositeOperation = "destination-out";
    } else {
        ctx.globalCompositeOperation = "source-over";
        ctx.strokeStyle = corPincel;
    }

    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
}


function pararDesenho() {
    desenhando = false;

    if (ctx) {
        ctx.closePath();
        ctx.globalCompositeOperation = "source-over";
    }
}


canvas?.addEventListener(
    "pointerdown",
    iniciarDesenho
);

canvas?.addEventListener(
    "pointermove",
    desenhar
);

canvas?.addEventListener(
    "pointerup",
    pararDesenho
);

canvas?.addEventListener(
    "pointerleave",
    pararDesenho
);


/* =========================================================
   PINCEL
   ========================================================= */

$("#tamanhoPincel")?.addEventListener(
    "input",
    (evento) => {
        tamanhoPincel = Number(evento.target.value);
    }
);


$("#corPincel")?.addEventListener(
    "input",
    (evento) => {
        corPincel = evento.target.value;
        ferramentaDesenho = "pincel";
    }
);


$("#borracha")?.addEventListener(
    "click",
    () => {
        ferramentaDesenho = "borracha";
        mostrarStatus("Borracha ativada.");
    }
);


$("#pincel")?.addEventListener(
    "click",
    () => {
        ferramentaDesenho = "pincel";
        mostrarStatus("Pincel ativado.");
    }
);


/* =========================================================
   CONTA-GOTAS
   ========================================================= */

$("#contaGotas")?.addEventListener(
    "click",
    () => {
        ferramentaDesenho = "conta-gotas";
        mostrarStatus("Clique no desenho para pegar uma cor.");
    }
);


canvas?.addEventListener(
    "click",
    (evento) => {
        if (ferramentaDesenho !== "conta-gotas") return;

        if (!ctx) return;

        const pos = obterPosicaoMouse(evento);

        const pixel = ctx.getImageData(
            Math.floor(pos.x),
            Math.floor(pos.y),
            1,
            1
        ).data;

        if (pixel[3] === 0) {
            mostrarStatus("Não encontrei uma cor aqui.");
            return;
        }

        const hex =
            "#" +
            [pixel[0], pixel[1], pixel[2]]
                .map((numero) =>
                    numero.toString(16).padStart(2, "0")
                )
                .join("");

        corPincel = hex;

        const inputCor = $("#corPincel");

        if (inputCor) {
            inputCor.value = hex;
        }

        ferramentaDesenho = "pincel";

        mostrarStatus(`Cor escolhida: ${hex}`);
    }
);


/* =========================================================
   LIMPAR DESENHO
   ========================================================= */

$("#limparDesenho")?.addEventListener(
    "click",
    () => {
        if (!ctx || !canvas) return;

        ctx.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        );

        mostrarStatus("Desenho limpo.");
    }
);


/* =========================================================
   BAIXAR DESENHO
   ========================================================= */

$("#baixarDesenho")?.addEventListener(
    "click",
    () => {
        if (!canvas) return;

        const link = document.createElement("a");

        link.download = "verde-desenho.png";
        link.href = canvas.toDataURL("image/png");

        link.click();

        mostrarStatus("Desenho baixado.");
    }
);


/* =========================================================
   IMAGENS
   ========================================================= */

let imagens = [];

function carregarImagens() {
    try {
        imagens =
            JSON.parse(
                localStorage.getItem(STORAGE.images)
            ) || [];
    } catch {
        imagens = [];
    }
}

function salvarImagens() {
    try {
        localStorage.setItem(
            STORAGE.images,
            JSON.stringify(imagens)
        );

        return true;
    } catch {
        mostrarStatus(
            "Não foi possível salvar a imagem."
        );

        return false;
    }
}


const galeria = $("#galeriaImagens");
const inputImagem = $("#inputImagem");


function renderizarImagens() {
    if (!galeria) return;

    galeria.innerHTML = "";

    if (imagens.length === 0) {
        galeria.innerHTML = `
            <div class="vazio">
                Nenhuma imagem adicionada.
            </div>
        `;

        return;
    }

    imagens.forEach((imagem) => {
        const card = document.createElement("div");

        card.className = "imagem-card";

        card.innerHTML = `
            <img
                src="${imagem.src}"
                alt="${escaparHTML(imagem.nome)}"
            >

            <div class="imagem-acoes">
                <button
                    type="button"
                    class="btn"
                    data-abrir-imagem="${imagem.id}"
                >
                    Abrir
                </button>

                <button
                    type="button"
                    class="btn perigo"
                    data-excluir-imagem="${imagem.id}"
                >
                    Excluir
                </button>
            </div>
        `;

        galeria.appendChild(card);
    });
}


inputImagem?.addEventListener(
    "change",
    (evento) => {
        const arquivos = Array.from(
            evento.target.files || []
        );

        arquivos.forEach((arquivo) => {
            if (!arquivo.type.startsWith("image/")) {
                return;
            }

            const leitor = new FileReader();

            leitor.onload = () => {
                imagens.unshift({
                    id: gerarId(),
                    nome: arquivo.name,
                    src: leitor.result,
                    data: new Date().toISOString()
                });

                if (salvarImagens()) {
                    renderizarImagens();
                    mostrarStatus("Imagem adicionada.");
                }
            };

            leitor.readAsDataURL(arquivo);
        });

        evento.target.value = "";
    }
);


galeria?.addEventListener(
    "click",
    (evento) => {
        const abrir = evento.target.closest(
            "[data-abrir-imagem]"
        );

        const excluir = evento.target.closest(
            "[data-excluir-imagem]"
        );

        if (abrir) {
            abrirImagem(
                abrir.dataset.abrirImagem
            );
        }

        if (excluir) {
            excluirImagem(
                excluir.dataset.excluirImagem
            );
        }
    }
);


function abrirImagem(id) {
    const imagem = imagens.find(
        (item) => item.id === id
    );

    if (!imagem) return;

    const modal = $("#modalImagem");
    const imagemModal = $("#imagemModal");

    if (!modal || !imagemModal) return;

    imagemModal.src = imagem.src;

    modal.classList.add("aberto");
}


function excluirImagem(id) {
    const confirmar = confirm(
        "Excluir esta imagem?"
    );

    if (!confirmar) return;

    imagens = imagens.filter(
        (imagem) => imagem.id !== id
    );

    salvarImagens();
    renderizarImagens();

    mostrarStatus("Imagem excluída.");
}


$("#fecharModalImagem")?.addEventListener(
    "click",
    () => {
        $("#modalImagem")?.classList.remove("aberto");
    }
);


/* =========================================================
   FUNDO PERSONALIZADO
   ========================================================= */

function aplicarFundo() {
    const fundo =
        localStorage.getItem(
            STORAGE.background
        );

    if (fundo) {
        document.body.style.backgroundImage =
            `url("${fundo}")`;

        document.body.classList.add(
            "fundo-personalizado"
        );
    } else {
        document.body.style.backgroundImage = "";
        document.body.classList.remove(
            "fundo-personalizado"
        );
    }
}


$("#inputFundo")?.addEventListener(
    "change",
    (evento) => {
        const arquivo =
            evento.target.files?.[0];

        if (!arquivo) return;

        if (!arquivo.type.startsWith("image/")) {
            mostrarStatus("Escolha uma imagem.");
            return;
        }

        const leitor = new FileReader();

        leitor.onload = () => {
            try {
                localStorage.setItem(
                    STORAGE.background,
                    leitor.result
                );

                aplicarFundo();

                mostrarStatus(
                    "Fundo alterado."
                );
            } catch {
                mostrarStatus(
                    "Imagem muito grande para salvar."
                );
            }
        };

        leitor.readAsDataURL(arquivo);
    }
);


$("#removerFundo")?.addEventListener(
    "click",
    () => {
        localStorage.removeItem(
            STORAGE.background
        );

        aplicarFundo();

        mostrarStatus(
            "Fundo restaurado."
        );
    }
);


/* =========================================================
   CURSOR
   ========================================================= */

const CURSORES = {
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


function aplicarCursor(tipo) {
    const configuracao =
        CURSORES[tipo] || CURSORES.padrao;

    if (!configuracao.normal) {
        document.documentElement.style.setProperty(
            "--cursor-normal",
            "auto"
        );

        document.documentElement.style.setProperty(
            "--cursor-clique",
            "pointer"
        );

        document.body.style.cursor = "auto";

        return;
    }

    document.documentElement.style.setProperty(
        "--cursor-normal",
        `url("${configuracao.normal}") 0 0, auto`
    );

    document.documentElement.style.setProperty(
        "--cursor-clique",
        `url("${configuracao.clique}") 0 0, pointer`
    );
}


function carregarCursor() {
    const cursorSalvo =
        localStorage.getItem(
            STORAGE.cursor
        ) || "padrao";

    aplicarCursor(cursorSalvo);

    const seletor =
        $("#cursorSelecionado");

    if (seletor) {
        seletor.value = cursorSalvo;
    }
}


function salvarCursor(tipo) {
    localStorage.setItem(
        STORAGE.cursor,
        tipo
    );

    aplicarCursor(tipo);

    mostrarStatus(
        `Cursor: ${CURSORES[tipo]?.nome || "Padrão"}`
    );
}


/* =========================================================
   CONTROLES DE CURSOR
   ========================================================= */

function criarConfiguracaoCursor() {
    const configuracoes =
        document.querySelector(
            ".configuracoes-cursor"
        );

    if (configuracoes) return;

    const telaConfiguracoes =
        document.getElementById(
            "configuracoes"
        );

    if (!telaConfiguracoes) return;

    const painel =
        telaConfiguracoes.querySelector(
            ".painel"
        );

    if (!painel) return;

    const bloco =
        document.createElement("div");

    bloco.className =
        "configuracoes-cursor painel";

    bloco.innerHTML = `
        <h3>Cursor</h3>

        <p>
            Escolha o cursor usado pelo VERDE.
        </p>

        <div class="campo">
            <label for="cursorSelecionado">
                Cursor
            </label>

            <select id="cursorSelecionado">
                <option value="padrao">
                    Cursor padrão
                </option>

                <option value="verde">
                    Cursor Verde
                </option>
            </select>
        </div>

        <div class="campo">
            <label for="cursorPersonalizado">
                Cursor personalizado
            </label>

            <input
                type="file"
                id="cursorPersonalizado"
                accept="image/png,image/webp,image/jpeg,image/svg+xml"
            >
        </div>

        <button
            type="button"
            class="btn"
            id="restaurarCursor"
        >
            Restaurar cursor padrão
        </button>
    `;

    painel.parentNode.insertBefore(
        bloco,
        painel.nextSibling
    );

    const seletor =
        $("#cursorSelecionado");

    seletor?.addEventListener(
        "change",
        () => {
            salvarCursor(
                seletor.value
            );
        }
    );

    $("#restaurarCursor")?.addEventListener(
        "click",
        () => {
            localStorage.removeItem(
                STORAGE.cursor
            );

            aplicarCursor("padrao");

            if (seletor) {
                seletor.value = "padrao";
            }

            mostrarStatus(
                "Cursor padrão restaurado."
            );
        }
    );

    $("#cursorPersonalizado")?.addEventListener(
        "change",
        (evento) => {
            const arquivo =
                evento.target.files?.[0];

            if (!arquivo) return;

            const leitor = new FileReader();

            leitor.onload = () => {
                try {
                    localStorage.setItem(
                        "verde_cursor_custom",
                        leitor.result
                    );

                    document.documentElement.style.setProperty(
                        "--cursor-normal",
                        `url("${leitor.result}") 0 0, auto`
                    );

                    document.documentElement.style.setProperty(
                        "--cursor-clique",
                        `url("${leitor.result}") 0 0, pointer`
                    );

                    localStorage.setItem(
                        STORAGE.cursor,
                        "personalizado"
                    );

                    mostrarStatus(
                        "Cursor personalizado aplicado."
                    );
                } catch {
                    mostrarStatus(
                        "Não foi possível salvar esse cursor."
                    );
                }
            };

            leitor.readAsDataURL(arquivo);
        }
    );
}


/* =========================================================
   CURSOR PERSONALIZADO SALVO
   ========================================================= */

function aplicarCursorPersonalizado() {
    const imagem =
        localStorage.getItem(
            "verde_cursor_custom"
        );

    if (!imagem) return false;

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
   MINI JOGO
   ========================================================= */

const areaJogo = $("#areaJogo");
const alvoJogo = $("#alvoJogo");
const pontosJogo = $("#pontosJogo");
const recordeJogo = $("#recordeJogo");
const iniciarJogo = $("#iniciarJogo");

let pontos = 0;
let jogoRodando = false;
let intervaloJogo = null;

let recorde =
    Number(
        localStorage.getItem(
            STORAGE.gameRecord
        )
    ) || 0;


function atualizarPlacar() {
    if (pontosJogo) {
        pontosJogo.textContent = pontos;
    }

    if (recordeJogo) {
        recordeJogo.textContent = recorde;
    }
}


function moverAlvo() {
    if (!areaJogo || !alvoJogo) return;

    const largura =
        areaJogo.clientWidth;

    const altura =
        areaJogo.clientHeight;

    const alvoLargura =
        alvoJogo.offsetWidth;

    const alvoAltura =
        alvoJogo.offsetHeight;

    const maxX =
        Math.max(0, largura - alvoLargura);

    const maxY =
        Math.max(0, altura - alvoAltura);

    const x =
        Math.floor(
            Math.random() * maxX
        );

    const y =
        Math.floor(
            Math.random() * maxY
        );

    alvoJogo.style.left =
        `${x}px`;

    alvoJogo.style.top =
        `${y}px`;

    alvoJogo.style.display =
        "block";
}


function iniciarMiniJogo() {
    if (!areaJogo || !alvoJogo) return;

    clearInterval(intervaloJogo);

    pontos = 0;
    jogoRodando = true;

    atualizarPlacar();

    areaJogo.classList.add(
        "jogo-rodando"
    );

    moverAlvo();

    intervaloJogo =
        setInterval(
            moverAlvo,
            900
        );

    mostrarStatus(
        "Jogo iniciado!"
    );
}


function terminarMiniJogo() {
    jogoRodando = false;

    clearInterval(intervaloJogo);

    intervaloJogo = null;

    alvoJogo.style.display =
        "none";

    areaJogo?.classList.remove(
        "jogo-rodando"
    );
}


iniciarJogo?.addEventListener(
    "click",
    iniciarMiniJogo
);


alvoJogo?.addEventListener(
    "click",
    () => {
        if (!jogoRodando) return;

        pontos++;

        if (pontos > recorde) {
            recorde = pontos;

            localStorage.setItem(
                STORAGE.gameRecord,
                recorde
            );
        }

        atualizarPlacar();

        moverAlvo();
    }
);


/* =========================================================
   APAGAR TODOS OS DADOS
   ========================================================= */

$("#apagarTudo")?.addEventListener(
    "click",
    () => {
        const confirmar = confirm(
            "Isso vai apagar todas as anotações e imagens. Continuar?"
        );

        if (!confirmar) return;

        localStorage.removeItem(
            STORAGE.notes
        );

        localStorage.removeItem(
            STORAGE.images
        );

        notas = [];
        imagens = [];

        notaAtual = null;

        if (tituloNota) {
            tituloNota.value = "";
        }

        if (textoNota) {
            textoNota.value = "";
        }

        if (btnExcluirNota) {
            btnExcluirNota.disabled = true;
        }

        renderizarNotas();
        renderizarImagens();

        mostrarStatus(
            "Dados apagados."
        );
    }
);


/* =========================================================
   RECENTES
   ========================================================= */

function renderizarRecentes() {
    const recentes =
        $("#recentes");

    if (!recentes) return;

    recentes.innerHTML = "";

    const itens = [];

    notas.slice(0, 5).forEach(
        (nota) => {
            itens.push({
                tipo: "Anotação",
                nome:
                    nota.titulo ||
                    "Sem título",
                data: nota.data,
                acao: () =>
                    abrirNota(nota.id)
            });
        }
    );

    imagens.slice(0, 5).forEach(
        (imagem) => {
            itens.push({
                tipo: "Imagem",
                nome:
                    imagem.nome ||
                    "Imagem",
                data: imagem.data,
                acao: () =>
                    abrirImagem(imagem.id)
            });
        }
    );

    itens.sort(
        (a, b) =>
            new Date(b.data) -
            new Date(a.data)
    );

    if (itens.length === 0) {
        recentes.innerHTML = `
            <div class="vazio">
                Nada recente.
            </div>
        `;

        return;
    }

    itens.slice(0, 8).forEach(
        (item) => {
            const botao =
                document.createElement("button");

            botao.className =
                "item-recente";

            botao.innerHTML = `
                <strong>
                    ${escaparHTML(item.nome)}
                </strong>

                <span>
                    ${item.tipo}
                </span>
            `;

            botao.addEventListener(
                "click",
                item.acao
            );

            recentes.appendChild(
                botao
            );
        }
    );
}


/* =========================================================
   ESCAPAR HTML
   ========================================================= */

function escaparHTML(texto) {
    const div =
        document.createElement("div");

    div.textContent =
        String(texto ?? "");

    return div.innerHTML;
}


/* =========================================================
   ESC
   ========================================================= */

document.addEventListener(
    "keydown",
    (evento) => {
        if (evento.key === "Escape") {
            $$(".modal.aberto").forEach(
                (modal) => {
                    modal.classList.remove(
                        "aberto"
                    );
                }
            );
        }

        if (
            (evento.ctrlKey ||
                evento.metaKey) &&
            evento.key.toLowerCase() === "s"
        ) {
            if (
                document.activeElement ===
                    tituloNota ||
                document.activeElement ===
                    textoNota
            ) {
                evento.preventDefault();
                salvarNotaAtual();
            }
        }
    }
);


/* =========================================================
   FECHAR MODAIS CLICANDO FORA
   ========================================================= */

$$(".modal").forEach(
    (modal) => {
        modal.addEventListener(
            "click",
            (evento) => {
                if (
                    evento.target ===
                    modal
                ) {
                    modal.classList.remove(
                        "aberto"
                    );
                }
            }
        );
    }
);


/* =========================================================
   BOTÕES DA HOME
   ========================================================= */

$("#acaoNovaNota")?.addEventListener(
    "click",
    () => {
        criarNota();
    }
);


$("#acaoDesenho")?.addEventListener(
    "click",
    () => {
        abrirTela("desenhos");

        setTimeout(
            prepararCanvas,
            100
        );
    }
);


$("#acaoImagens")?.addEventListener(
    "click",
    () => {
        abrirTela("imagens");
    }
);


$("#acaoJogo")?.addEventListener(
    "click",
    () => {
        abrirTela("jogo");
    }
);


/* =========================================================
   REDIMENSIONAMENTO DO CANVAS
   ========================================================= */

window.addEventListener(
    "resize",
    () => {
        if (
            document
                .getElementById("desenhos")
                ?.classList.contains("ativa")
        ) {
            prepararCanvas();
        }
    }
);


/* =========================================================
   INICIALIZAÇÃO
   ========================================================= */

function iniciarAplicacao() {
    carregarNotas();
    carregarImagens();

    renderizarNotas();
    renderizarImagens();
    renderizarRecentes();

    aplicarFundo();

    criarConfiguracaoCursor();

    const cursorSalvo =
        localStorage.getItem(
            STORAGE.cursor
        );

    if (
        cursorSalvo ===
        "personalizado"
    ) {
        aplicarCursorPersonalizado();
    } else {
        carregarCursor();
    }

    atualizarPlacar();

    if (canvas) {
        prepararCanvas();
    }

    abrirTela("inicio");
}


if (
    document.readyState ===
    "loading"
) {
    document.addEventListener(
        "DOMContentLoaded",
        iniciarAplicacao
    );
} else {
    iniciarAplicacao();
}
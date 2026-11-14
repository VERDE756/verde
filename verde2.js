"use strict";

/* =========================================================
   VERDE 2
   SISTEMA DE ANOTAÇÕES
========================================================= */

(function () {

    /* =====================================================
       CONFIGURAÇÃO
    ===================================================== */

    var CHAVE_STORAGE = "verde2_notas";

    var notas = [];
    var notaAtual = null;

    var alteracoesPendentes = false;

    var autoSaveTimer = null;


    /* =====================================================
       ELEMENTOS
    ===================================================== */

    function el(id) {
        return document.getElementById(id);
    }

    var titulo = el("titulo");
    var editor = el("editor");
    var lista = el("lista-notas");
    var pesquisa = el("pesquisa");

    var btnNova = el("nova-nota");
    var btnDuplicar = el("duplicar-nota");

    var btnAnexar = el("anexar");
    var btnSalvar = el("salvar");
    var btnExcluir = el("excluir");

    var inputImagem = el("input-imagem");

    var statusSalvar = el("status-salvar");

    var contadorPalavras = el("palavras");
    var contadorCaracteres = el("caracteres");
    var contadorImagens = el("imagens");


    /* =====================================================
       UTILIDADES
    ===================================================== */

    function agora() {
        return new Date().getTime();
    }


    function gerarId() {
        return String(
            agora() +
            Math.floor(Math.random() * 100000)
        );
    }


    function escaparHtml(texto) {

        return String(texto)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
    }


    function dataBonita(timestamp) {

        var data = new Date(timestamp);

        var dia = data.getDate();
        var mes = data.getMonth() + 1;

        var ano = data.getFullYear();

        var hora = data.getHours();
        var minuto = data.getMinutes();

        if (dia < 10) {
            dia = "0" + dia;
        }

        if (mes < 10) {
            mes = "0" + mes;
        }

        if (hora < 10) {
            hora = "0" + hora;
        }

        if (minuto < 10) {
            minuto = "0" + minuto;
        }

        return (
            dia + "/" +
            mes + "/" +
            ano + " " +
            hora + ":" +
            minuto
        );
    }


    function mostrarStatus(texto, verde) {

        statusSalvar.textContent = texto;

        if (verde) {

            statusSalvar.style.color =
                "#39ff72";

        } else {

            statusSalvar.style.color =
                "#69876f";
        }
    }


    /* =====================================================
       STORAGE
    ===================================================== */

    function carregarNotas() {

        try {

            var salvo =
                localStorage.getItem(
                    CHAVE_STORAGE
                );

            if (!salvo) {

                notas = [];

                return;
            }

            var dados =
                JSON.parse(salvo);

            if (
                Array.isArray(dados)
            ) {

                notas = dados;

            } else {

                notas = [];
            }

        } catch (erro) {

            console.error(
                "Erro ao carregar notas:",
                erro
            );

            notas = [];
        }
    }


    function salvarStorage() {

        try {

            localStorage.setItem(
                CHAVE_STORAGE,
                JSON.stringify(notas)
            );

            alteracoesPendentes =
                false;

            mostrarStatus(
                "Tudo salvo",
                true
            );

            atualizarLista();

            return true;

        } catch (erro) {

            console.error(
                "Erro ao salvar:",
                erro
            );

            mostrarStatus(
                "Não foi possível salvar",
                false
            );

            alert(
                "Não foi possível salvar esta anotação.\n\n" +
                "O navegador pode ter atingido o limite de armazenamento."
            );

            return false;
        }
    }


    /* =====================================================
       NOTAS
    ===================================================== */

    function encontrarNota(id) {

        var i;

        for (
            i = 0;
            i < notas.length;
            i++
        ) {

            if (
                String(notas[i].id) ===
                String(id)
            ) {

                return notas[i];
            }
        }

        return null;
    }


    function criarNotaVazia() {

        var tempo =
            agora();

        return {

            id:
                gerarId(),

            titulo:
                "Nova anotação",

            html:
                "<p></p>",

            criado:
                tempo,

            atualizado:
                tempo
        };
    }


    function salvarEstadoDaNotaAtual() {

        if (
            notaAtual === null
        ) {
            return;
        }

        var nota =
            encontrarNota(
                notaAtual
            );

        if (!nota) {
            return;
        }

        nota.titulo =
            titulo.value;

        nota.html =
            editor.innerHTML;

        nota.atualizado =
            agora();
    }


    function criarNovaNota() {

        salvarEstadoDaNotaAtual();

        var nova =
            criarNotaVazia();

        notas.unshift(
            nova
        );

        notaAtual =
            nova.id;

        titulo.value =
            nova.titulo;

        editor.innerHTML =
            nova.html;

        pesquisa.value =
            "";

        alteracoesPendentes =
            true;

        atualizarLista();
        atualizarContadores();

        mostrarStatus(
            "Nova anotação criada",
            true
        );

        titulo.focus();
        selecionarTudoTitulo();
    }


    function selecionarTudoTitulo() {

        try {

            titulo.select();

        } catch (erro) {}
    }


    function abrirNota(id) {

        salvarEstadoDaNotaAtual();

        var nota =
            encontrarNota(id);

        if (!nota) {
            return;
        }

        notaAtual =
            nota.id;

        titulo.value =
            nota.titulo || "";

        editor.innerHTML =
            nota.html || "<p></p>";

        alteracoesPendentes =
            false;

        atualizarLista();
        atualizarContadores();

        mostrarStatus(
            "Nota aberta",
            false
        );
    }


    function duplicarNota() {

        salvarEstadoDaNotaAtual();

        var original =
            encontrarNota(
                notaAtual
            );

        if (!original) {
            return;
        }

        var tempo =
            agora();

        var copia = {

            id:
                gerarId(),

            titulo:
                (
                    original.titulo ||
                    "Sem título"
                ) +
                " - cópia",

            html:
                original.html,

            criado:
                tempo,

            atualizado:
                tempo
        };

        notas.unshift(
            copia
        );

        notaAtual =
            copia.id;

        titulo.value =
            copia.titulo;

        editor.innerHTML =
            copia.html;

        alteracoesPendentes =
            true;

        atualizarLista();
        atualizarContadores();

        mostrarStatus(
            "Nota duplicada",
            true
        );
    }


    function excluirNota() {

        var nota =
            encontrarNota(
                notaAtual
            );

        if (!nota) {
            return;
        }

        var nome =
            nota.titulo ||
            "Sem título";

        var confirmado =
            window.confirm(
                "Excluir \"" +
                nome +
                "\"?"
            );

        if (!confirmado) {
            return;
        }

        var novaLista = [];

        var i;

        for (
            i = 0;
            i < notas.length;
            i++
        ) {

            if (
                String(notas[i].id) !==
                String(notaAtual)
            ) {

                novaLista.push(
                    notas[i]
                );
            }
        }

        notas =
            novaLista;

        if (
            notas.length === 0
        ) {

            var nova =
                criarNotaVazia();

            notas.push(
                nova
            );
        }

        notaAtual =
            notas[0].id;

        titulo.value =
            notas[0].titulo;

        editor.innerHTML =
            notas[0].html;

        alteracoesPendentes =
            true;

        salvarStorage();

        atualizarLista();
        atualizarContadores();

        mostrarStatus(
            "Nota excluída",
            true
        );
    }


    /* =====================================================
       LISTA
    ===================================================== */

    function obterResumo(html) {

        var temp =
            document.createElement(
                "div"
            );

        temp.innerHTML =
            html || "";

        var texto =
            temp.innerText ||
            temp.textContent ||
            "";

        texto =
            texto.replace(
                /\s+/g,
                " "
            );

        texto =
            texto.replace(
                /^\s+|\s+$/g,
                ""
            );

        if (!texto) {

            var imagens =
                temp.getElementsByTagName(
                    "img"
                ).length;

            if (imagens > 0) {
                return "Imagem anexada";
            }

            return "Sem texto";
        }

        return texto.substring(
            0,
            70
        );
    }


    function obterQuantidadeImagens(html) {

        var temp =
            document.createElement(
                "div"
            );

        temp.innerHTML =
            html || "";

        return temp
            .getElementsByTagName(
                "img"
            )
            .length;
    }


    function atualizarLista() {

        lista.innerHTML =
            "";

        var termo =
            pesquisa.value
                .toLowerCase()
                .trim();

        var encontrou =
            false;

        var i;

        for (
            i = 0;
            i < notas.length;
            i++
        ) {

            var nota =
                notas[i];

            var nome =
                nota.titulo ||
                "Sem título";

            var resumo =
                obterResumo(
                    nota.html
                );

            var procuravel =
                (
                    nome +
                    " " +
                    resumo
                ).toLowerCase();

            if (
                termo &&
                procuravel.indexOf(
                    termo
                ) === -1
            ) {

                continue;
            }

            encontrou =
                true;

            var item =
                document.createElement(
                    "div"
                );

            item.className =
                "nota-item";

            if (
                String(nota.id) ===
                String(notaAtual)
            ) {

                item.className +=
                    " ativa";
            }

            var qtd =
                obterQuantidadeImagens(
                    nota.html
                );

            item.innerHTML =

                "<span class='nota-item-titulo'>" +
                escaparHtml(nome) +
                "</span>" +

                "<span class='nota-item-resumo'>" +
                escaparHtml(resumo) +
                "</span>" +

                "<div class='nota-item-meta'>" +
                escaparHtml(
                    dataBonita(
                        nota.atualizado ||
                        nota.criado
                    )
                ) +

                (
                    qtd > 0
                        ? " • " + qtd + " img"
                        : ""
                ) +

                "</div>";

            item.setAttribute(
                "data-id",
                nota.id
            );

            item.addEventListener(
                "click",
                function () {

                    abrirNota(
                        this.getAttribute(
                            "data-id"
                        )
                    );
                }
            );

            lista.appendChild(
                item
            );
        }

        if (!encontrou) {

            var vazio =
                document.createElement(
                    "div"
                );

            vazio.className =
                "lista-vazia";

            vazio.textContent =
                "Nenhuma anotação encontrada.";

            lista.appendChild(
                vazio
            );
        }
    }


    /* =====================================================
       CONTADORES
    ===================================================== */

    function obterTextoEditor() {

        var texto =
            editor.innerText ||
            editor.textContent ||
            "";

        texto =
            texto.replace(
                /\s+/g,
                " "
            );

        texto =
            texto.replace(
                /^\s+|\s+$/g,
                ""
            );

        return texto;
    }


    function atualizarContadores() {

        var texto =
            obterTextoEditor();

        var palavras =
            0;

        if (texto) {

            palavras =
                texto.split(
                    " "
                ).length;
        }

        var imagens =
            editor.getElementsByTagName(
                "img"
            ).length;

        contadorPalavras.textContent =
            palavras;

        contadorCaracteres.textContent =
            texto.length;

        contadorImagens.textContent =
            imagens;
    }


    /* =====================================================
       EDITOR
    ===================================================== */

    function marcarAlterado() {

        alteracoesPendentes =
            true;

        mostrarStatus(
            "Alterações não salvas",
            false
        );

        atualizarContadores();
        atualizarLista();

        iniciarAutoSave();
    }


    function executarComando(
        comando,
        valor
    ) {

        editor.focus();

        try {

            document.execCommand(
                comando,
                false,
                valor || null
            );

        } catch (erro) {

            console.error(
                "Erro de formatação:",
                erro
            );
        }

        marcarAlterado();
        atualizarContadores();
    }


    function formatarBloco(tag) {

        editor.focus();

        try {

            document.execCommand(
                "formatBlock",
                false,
                "<" + tag + ">"
            );

        } catch (erro) {

            try {

                document.execCommand(
                    "formatBlock",
                    false,
                    tag
                );

            } catch (erro2) {

                console.error(
                    "Erro no formatBlock:",
                    erro2
                );
            }
        }

        marcarAlterado();
        atualizarContadores();
    }


    function inserirLink() {

        var url =
            window.prompt(
                "Digite o endereço:",
                "https://"
            );

        if (!url) {
            return;
        }

        executarComando(
            "createLink",
            url
        );
    }


    function inserirData() {

        var texto =
            dataBonita(
                agora()
            );

        editor.focus();

        try {

            document.execCommand(
                "insertText",
                false,
                texto
            );

        } catch (erro) {

            editor.innerHTML +=
                "<span>" +
                escaparHtml(texto) +
                "</span>";
        }

        marcarAlterado();
        atualizarContadores();
    }


    /* =====================================================
       IMAGENS
    ===================================================== */

    function anexarImagem() {

        inputImagem.click();
    }


    function processarImagem(arquivo) {

        if (!arquivo) {
            return;
        }

        if (
            !arquivo.type ||
            arquivo.type.indexOf(
                "image/"
            ) !== 0
        ) {

            window.alert(
                "Escolha uma imagem válida."
            );

            return;
        }

        var leitor =
            new FileReader();

        leitor.onload =
            function (evento) {

                var dataUrl =
                    evento.target.result;

                inserirImagemNoCursor(
                    dataUrl
                );

                marcarAlterado();

                atualizarContadores();

                mostrarStatus(
                    "Imagem adicionada",
                    true
                );
            };

        leitor.onerror =
            function () {

                window.alert(
                    "Não foi possível ler a imagem."
                );
            };

        leitor.readAsDataURL(
            arquivo
        );
    }


    function inserirImagemNoCursor(
        dataUrl
    ) {

        editor.focus();

        try {

            var imagemExiste =
                document.execCommand(
                    "insertImage",
                    false,
                    dataUrl
                );

            if (
                !imagemExiste
            ) {

                var img =
                    document.createElement(
                        "img"
                    );

                img.src =
                    dataUrl;

                img.alt =
                    "Imagem anexada";

                editor.appendChild(
                    img
                );
            }

        } catch (erro) {

            var fallback =
                document.createElement(
                    "img"
                );

            fallback.src =
                dataUrl;

            fallback.alt =
                "Imagem anexada";

            editor.appendChild(
                fallback
            );
        }
    }


    /* =====================================================
       AUTOSAVE
    ===================================================== */

    function iniciarAutoSave() {

        if (autoSaveTimer) {

            clearTimeout(
                autoSaveTimer
            );
        }

        autoSaveTimer =
            setTimeout(
                function () {

                    if (
                        alteracoesPendentes
                    ) {

                        salvarAgora();
                    }

                },
                1200
            );
    }


    function salvarAgora() {

        salvarEstadoDaNotaAtual();

        salvarStorage();

        atualizarContadores();
    }


    /* =====================================================
       EVENTOS DOS BOTÕES
    ===================================================== */

    btnNova.addEventListener(
        "click",
        function () {

            criarNovaNota();
        }
    );


    btnDuplicar.addEventListener(
        "click",
        function () {

            duplicarNota();
        }
    );


    btnSalvar.addEventListener(
        "click",
        function () {

            salvarAgora();
        }
    );


    btnExcluir.addEventListener(
        "click",
        function () {

            excluirNota();
        }
    );


    btnAnexar.addEventListener(
        "click",
        function () {

            anexarImagem();
        }
    );


    inputImagem.addEventListener(
        "change",
        function () {

            if (
                this.files &&
                this.files.length > 0
            ) {

                processarImagem(
                    this.files[0]
                );
            }

            this.value =
                "";
        }
    );


    titulo.addEventListener(
        "input",
        function () {

            salvarEstadoDaNotaAtual();

            marcarAlterado();
        }
    );


    editor.addEventListener(
        "input",
        function () {

            marcarAlterado();
        }
    );


    pesquisa.addEventListener(
        "input",
        function () {

            salvarEstadoDaNotaAtual();

            atualizarLista();
        }
    );


    /* =====================================================
       TOOLBAR
    ===================================================== */

    var botoesComando =
        document.querySelectorAll(
            "[data-comando]"
        );

    var i;

    for (
        i = 0;
        i < botoesComando.length;
        i++
    ) {

        botoesComando[i]
            .addEventListener(
                "mousedown",
                function (evento) {

                    evento.preventDefault();
                }
            );

        botoesComando[i]
            .addEventListener(
                "click",
                function () {

                    executarComando(
                        this.getAttribute(
                            "data-comando"
                        )
                    );
                }
            );
    }


    var botoesBloco =
        document.querySelectorAll(
            "[data-bloco]"
        );

    for (
        i = 0;
        i < botoesBloco.length;
        i++
    ) {

        botoesBloco[i]
            .addEventListener(
                "mousedown",
                function (evento) {

                    evento.preventDefault();
                }
            );

        botoesBloco[i]
            .addEventListener(
                "click",
                function () {

                    formatarBloco(
                        this.getAttribute(
                            "data-bloco"
                        )
                    );
                }
            );
    }


    el("link-btn")
        .addEventListener(
            "mousedown",
            function (evento) {

                evento.preventDefault();
            }
        );


    el("link-btn")
        .addEventListener(
            "click",
            function () {

                inserirLink();
            }
        );


    el("data-btn")
        .addEventListener(
            "mousedown",
            function (evento) {

                evento.preventDefault();
            }
        );


    el("data-btn")
        .addEventListener(
            "click",
            function () {

                inserirData();
            }
        );


    /* =====================================================
       ATALHOS
    ===================================================== */

    document.addEventListener(
        "keydown",
        function (evento) {

            if (
                evento.ctrlKey &&
                evento.key.toLowerCase() === "s"
            ) {

                evento.preventDefault();

                salvarAgora();

                return;
            }


            if (
                evento.ctrlKey &&
                evento.key.toLowerCase() === "b"
            ) {

                evento.preventDefault();

                executarComando(
                    "bold"
                );

                return;
            }


            if (
                evento.ctrlKey &&
                evento.key.toLowerCase() === "i"
            ) {

                evento.preventDefault();

                executarComando(
                    "italic"
                );

                return;
            }


            if (
                evento.ctrlKey &&
                evento.key.toLowerCase() === "u"
            ) {

                evento.preventDefault();

                executarComando(
                    "underline"
                );
            }

        }
    );


    /* =====================================================
       FECHAMENTO
    ===================================================== */

    window.addEventListener(
        "beforeunload",
        function () {

            if (
                alteracoesPendentes
            ) {

                salvarAgora();
            }
        }
    );


    /* =====================================================
       INICIALIZAÇÃO
    ===================================================== */

    function iniciar() {

        carregarNotas();

        if (
            notas.length === 0
        ) {

            notas.push(
                criarNotaVazia()
            );
        }

        notaAtual =
            notas[0].id;

        titulo.value =
            notas[0].titulo || "";

        editor.innerHTML =
            notas[0].html || "<p></p>";

        alteracoesPendentes =
            false;

        atualizarLista();
        atualizarContadores();

        mostrarStatus(
            "Tudo salvo",
            true
        );
    }


    iniciar();

})();
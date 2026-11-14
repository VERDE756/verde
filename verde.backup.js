"use strict";

/* =========================================================
   VERDE - SISTEMA DE BACKUP
   ========================================================= */

const VERDE_BACKUP_PREFIXO =
    "verde_backup_";


/* =========================================================
   COLETAR DADOS
   ========================================================= */

function verdeColetarDadosBackup() {

    const dados = {};

    for (
        let i = 0;
        i < localStorage.length;
        i++
    ) {

        const chave =
            localStorage.key(i);

        if (
            chave &&
            chave.startsWith("verde_")
        ) {

            dados[chave] =
                localStorage.getItem(
                    chave
                );
        }
    }

    return dados;
}


/* =========================================================
   CRIAR BACKUP
   ========================================================= */

function verdeCriarBackup() {

    const dados =
        verdeColetarDadosBackup();

    const backup = {

        versao: "1.0.0",

        criadoEm:
            new Date().toISOString(),

        aplicativo:
            "VERDE",

        dados:
            dados
    };

    const texto =
        JSON.stringify(
            backup,
            null,
            2
        );

    const blob =
        new Blob(
            [texto],
            {
                type:
                    "application/json"
            }
        );

    const url =
        URL.createObjectURL(
            blob
        );

    const link =
        document.createElement(
            "a"
        );

    const data =
        new Date()
            .toISOString()
            .slice(
                0,
                10
            );

    link.href =
        url;

    link.download =
        `verde_backup_${data}.json`;

    link.click();

    URL.revokeObjectURL(
        url
    );

    return backup;
}


/* =========================================================
   RESTAURAR BACKUP
   ========================================================= */

function verdeRestaurarBackup(
    arquivo
) {

    return new Promise(
        (resolve, reject) => {

            if (!arquivo) {

                reject(
                    new Error(
                        "Nenhum backup selecionado."
                    )
                );

                return;
            }

            const leitor =
                new FileReader();

            leitor.onload =
                function () {

                    try {

                        const backup =
                            JSON.parse(
                                leitor.result
                            );

                        if (
                            !backup ||
                            !backup.dados
                        ) {

                            throw new Error(
                                "Backup inválido."
                            );
                        }

                        const dados =
                            backup.dados;

                        Object.keys(
                            dados
                        ).forEach(
                            chave => {

                                if (
                                    chave.startsWith(
                                        "verde_"
                                    )
                                ) {

                                    localStorage.setItem(
                                        chave,
                                        dados[chave]
                                    );
                                }
                            }
                        );

                        resolve(
                            backup
                        );

                    } catch (erro) {

                        reject(
                            new Error(
                                "Não foi possível restaurar o backup."
                            )
                        );
                    }
                };

            leitor.onerror =
                function () {

                    reject(
                        new Error(
                            "Erro ao ler o arquivo."
                        )
                    );
                };

            leitor.readAsText(
                arquivo
            );
        }
    );
}


/* =========================================================
   EXPORTAR CONFIGURAÇÕES
   ========================================================= */

function verdeExportarConfiguracoes() {

    const dados = {};

    const chaves = [
        "verde_config",
        "verde_tema",
        "verde_cor_principal",
        "verde_fonte",
        "verde_tamanho_fonte",
        "verde_intensidade_fundo",
        "verde_reduzir_animacoes",
        "verde_interface_grande",
        "verde_alto_contraste",
        "verde_efeitos",
        "verde_cursor",
        "verde_cursor_custom",
        "verde_cursor_tamanho",
        "verde_pincel_tamanho",
        "verde_pincel_cor"
    ];

    chaves.forEach(
        chave => {

            const valor =
                localStorage.getItem(
                    chave
                );

            if (valor !== null) {

                dados[chave] =
                    valor;
            }
        }
    );

    const arquivo = {

        aplicativo:
            "VERDE",

        tipo:
            "configuracoes",

        criadoEm:
            new Date().toISOString(),

        dados:
            dados
    };

    verdeBaixarJSON(
        arquivo,
        "verde_configuracoes.json"
    );

    return arquivo;
}


/* =========================================================
   EXPORTAR TUDO
   ========================================================= */

function verdeExportarTudo() {

    return verdeCriarBackup();
}


/* =========================================================
   BAIXAR JSON
   ========================================================= */

function verdeBaixarJSON(
    dados,
    nome
) {

    const texto =
        JSON.stringify(
            dados,
            null,
            2
        );

    const blob =
        new Blob(
            [texto],
            {
                type:
                    "application/json"
            }
        );

    const url =
        URL.createObjectURL(
            blob
        );

    const link =
        document.createElement(
            "a"
        );

    link.href =
        url;

    link.download =
        nome;

    link.click();

    URL.revokeObjectURL(
        url
    );
}


/* =========================================================
   LIMPAR DADOS DO VERDE
   ========================================================= */

function verdeLimparDados() {

    const chaves = [];

    for (
        let i = 0;
        i < localStorage.length;
        i++
    ) {

        const chave =
            localStorage.key(i);

        if (
            chave &&
            chave.startsWith(
                "verde_"
            )
        ) {

            chaves.push(
                chave
            );
        }
    }

    chaves.forEach(
        chave => {

            localStorage.removeItem(
                chave
            );
        }
    );
}


/* =========================================================
   TAMANHO DOS DADOS
   ========================================================= */

function verdeTamanhoDados() {

    let total =
        0;

    for (
        let i = 0;
        i < localStorage.length;
        i++
    ) {

        const chave =
            localStorage.key(i);

        if (
            chave &&
            chave.startsWith(
                "verde_"
            )
        ) {

            const valor =
                localStorage.getItem(
                    chave
                );

            total +=
                chave.length +
                (valor
                    ? valor.length
                    : 0);
        }
    }

    return total;
}


/* =========================================================
   INFORMAÇÕES DO BACKUP
   ========================================================= */

function verdeInformacoesBackup() {

    const dados =
        verdeColetarDadosBackup();

    return {

        aplicativo:
            "VERDE",

        quantidade:
            Object.keys(dados).length,

        tamanho:
            verdeTamanhoDados(),

        data:
            new Date().toISOString()
    };
}


/* =========================================================
   STATUS
   ========================================================= */

function verdeMostrarStatusBackup(
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
   INPUT DE RESTAURAÇÃO
   ========================================================= */

function verdeAtivarImportacaoBackup() {

    const input =
        document.querySelector(
            "#inputBackup"
        );

    if (!input) {
        return;
    }

    input.addEventListener(
        "change",
        async () => {

            const arquivo =
                input.files[0];

            if (!arquivo) {
                return;
            }

            try {

                await verdeRestaurarBackup(
                    arquivo
                );

                verdeMostrarStatusBackup(
                    "Backup restaurado."
                );

                setTimeout(
                    () => {

                        location.reload();

                    },
                    1000
                );

            } catch (erro) {

                console.error(
                    erro
                );

                verdeMostrarStatusBackup(
                    "Erro ao restaurar backup."
                );
            }

            input.value = "";
        }
    );
}


/* =========================================================
   BOTÕES
   ========================================================= */

function verdeAtivarBotoesBackup() {

    const criar =
        document.querySelector(
            "#criarBackup"
        );

    const exportar =
        document.querySelector(
            "#exportarConfiguracoes"
        );


    if (criar) {

        criar.addEventListener(
            "click",
            () => {

                verdeCriarBackup();

                verdeMostrarStatusBackup(
                    "Backup criado."
                );
            }
        );
    }


    if (exportar) {

        exportar.addEventListener(
            "click",
            () => {

                verdeExportarConfiguracoes();

                verdeMostrarStatusBackup(
                    "Configurações exportadas."
                );
            }
        );
    }
}


/* =========================================================
   INICIALIZAÇÃO
   ========================================================= */

function iniciarBackupVerde() {

    verdeAtivarImportacaoBackup();

    verdeAtivarBotoesBackup();
}


/* =========================================================
   API
   ========================================================= */

window.verdeBackup = {

    criar:
        verdeCriarBackup,

    restaurar:
        verdeRestaurarBackup,

    exportarTudo:
        verdeExportarTudo,

    exportarConfiguracoes:
        verdeExportarConfiguracoes,

    limparDados:
        verdeLimparDados,

    tamanho:
        verdeTamanhoDados,

    informacoes:
        verdeInformacoesBackup
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
        iniciarBackupVerde
    );

} else {

    iniciarBackupVerde();

}
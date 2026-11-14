/* =========================================================
   VERDE - verde.config.js
   Central de configurações
   ========================================================= */

"use strict";


/* =========================================================
   CHAVE PRINCIPAL
   ========================================================= */

const VERDE_CONFIG_KEY = "verde_config";


/* =========================================================
   CONFIGURAÇÕES PADRÃO
   ========================================================= */

const VERDE_CONFIG_PADRAO = {
    tema: "verde",
    corPrincipal: "#39ff72",

    fonte: "Arial",
    tamanhoFonte: 16,

    fundoPersonalizado: true,
    intensidadeFundo: 100,

    cursor: "padrao",
    cursorTamanho: 32,

    pincelTamanho: 8,
    pincelCor: "#39ff72",

    sons: true,
    volume: 50,

    reduzirAnimacoes: false,
    altoContraste: false,
    interfaceGrande: false,

    efeitos: true,

    versao: "1.0.0"
};


/* =========================================================
   LER CONFIGURAÇÕES
   ========================================================= */

function verdeLerConfig() {

    try {

        const salvo =
            localStorage.getItem(
                VERDE_CONFIG_KEY
            );

        if (!salvo) {
            return {
                ...VERDE_CONFIG_PADRAO
            };
        }

        const config =
            JSON.parse(salvo);

        return {
            ...VERDE_CONFIG_PADRAO,
            ...config
        };

    } catch (erro) {

        console.error(
            "Erro ao carregar configurações:",
            erro
        );

        return {
            ...VERDE_CONFIG_PADRAO
        };
    }
}


/* =========================================================
   SALVAR CONFIGURAÇÕES
   ========================================================= */

function verdeSalvarConfig(config) {

    try {

        localStorage.setItem(
            VERDE_CONFIG_KEY,
            JSON.stringify(config)
        );

        return true;

    } catch (erro) {

        console.error(
            "Erro ao salvar configurações:",
            erro
        );

        return false;
    }
}


/* =========================================================
   ALTERAR UMA CONFIGURAÇÃO
   ========================================================= */

function verdeDefinirConfig(chave, valor) {

    const config =
        verdeLerConfig();

    config[chave] = valor;

    verdeSalvarConfig(config);

    return config;
}


/* =========================================================
   PEGAR UMA CONFIGURAÇÃO
   ========================================================= */

function verdeObterConfig(chave) {

    const config =
        verdeLerConfig();

    return config[chave];
}


/* =========================================================
   RESTAURAR CONFIGURAÇÕES
   ========================================================= */

function verdeRestaurarConfig() {

    const novaConfig = {
        ...VERDE_CONFIG_PADRAO
    };

    verdeSalvarConfig(
        novaConfig
    );

    aplicarConfiguracoes();

    return novaConfig;
}


/* =========================================================
   APLICAR CONFIGURAÇÕES
   ========================================================= */

function aplicarConfiguracoes() {

    const config =
        verdeLerConfig();

    const root =
        document.documentElement;


    /* -----------------------------------------------------
       COR PRINCIPAL
       ----------------------------------------------------- */

    root.style.setProperty(
        "--verde",
        config.corPrincipal
    );


    /* -----------------------------------------------------
       TAMANHO DA FONTE
       ----------------------------------------------------- */

    root.style.setProperty(
        "--tamanho-fonte",
        `${config.tamanhoFonte}px`
    );


    /* -----------------------------------------------------
       FONTE
       ----------------------------------------------------- */

    document.body.style.fontFamily =
        config.fonte;


    /* -----------------------------------------------------
       REDUZIR ANIMAÇÕES
       ----------------------------------------------------- */

    if (
        config.reduzirAnimacoes
    ) {

        document.body.classList.add(
            "sem-animacoes"
        );

    } else {

        document.body.classList.remove(
            "sem-animacoes"
        );
    }


    /* -----------------------------------------------------
       ALTO CONTRASTE
       ----------------------------------------------------- */

    if (
        config.altoContraste
    ) {

        document.body.classList.add(
            "alto-contraste"
        );

    } else {

        document.body.classList.remove(
            "alto-contraste"
        );
    }


    /* -----------------------------------------------------
       INTERFACE GRANDE
       ----------------------------------------------------- */

    if (
        config.interfaceGrande
    ) {

        document.body.classList.add(
            "interface-grande"
        );

    } else {

        document.body.classList.remove(
            "interface-grande"
        );
    }


    /* -----------------------------------------------------
       EFEITOS
       ----------------------------------------------------- */

    if (
        config.efeitos
    ) {

        document.body.classList.remove(
            "sem-efeitos"
        );

    } else {

        document.body.classList.add(
            "sem-efeitos"
        );
    }


    /* -----------------------------------------------------
       FUNDO
       ----------------------------------------------------- */

    if (
        config.fundoPersonalizado
    ) {

        const fundo =
            localStorage.getItem(
                "verde_background"
            );

        if (fundo) {

            document.body.style.backgroundImage =
                `url("${fundo}")`;

            document.body.style.backgroundSize =
                "cover";

            document.body.style.backgroundAttachment =
                "fixed";

            document.body.style.backgroundPosition =
                "center";

        }

    } else {

        document.body.style.backgroundImage =
            "";
    }
}


/* =========================================================
   TEMA
   ========================================================= */

function verdeDefinirTema(tema) {

    verdeDefinirConfig(
        "tema",
        tema
    );

    document.body.dataset.tema =
        tema;
}


/* =========================================================
   COR PRINCIPAL
   ========================================================= */

function verdeDefinirCor(cor) {

    verdeDefinirConfig(
        "corPrincipal",
        cor
    );

    document.documentElement.style.setProperty(
        "--verde",
        cor
    );
}


/* =========================================================
   FONTE
   ========================================================= */

function verdeDefinirFonte(fonte) {

    verdeDefinirConfig(
        "fonte",
        fonte
    );

    document.body.style.fontFamily =
        fonte;
}


/* =========================================================
   TAMANHO DA FONTE
   ========================================================= */

function verdeDefinirTamanhoFonte(tamanho) {

    tamanho =
        Number(tamanho);

    if (
        Number.isNaN(tamanho)
    ) {
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

    verdeDefinirConfig(
        "tamanhoFonte",
        tamanho
    );

    document.documentElement.style.setProperty(
        "--tamanho-fonte",
        `${tamanho}px`
    );
}


/* =========================================================
   TAMANHO DO PINCEL
   ========================================================= */

function verdeDefinirTamanhoPincel(
    tamanho
) {

    tamanho =
        Number(tamanho);

    tamanho =
        Math.max(
            1,
            Math.min(
                100,
                tamanho
            )
        );

    verdeDefinirConfig(
        "pincelTamanho",
        tamanho
    );
}


/* =========================================================
   COR DO PINCEL
   ========================================================= */

function verdeDefinirCorPincel(cor) {

    verdeDefinirConfig(
        "pincelCor",
        cor
    );
}


/* =========================================================
   SOM
   ========================================================= */

function verdeDefinirSons(ativo) {

    verdeDefinirConfig(
        "sons",
        Boolean(ativo)
    );
}


function verdeDefinirVolume(volume) {

    volume =
        Number(volume);

    volume =
        Math.max(
            0,
            Math.min(
                100,
                volume
            )
        );

    verdeDefinirConfig(
        "volume",
        volume
    );
}


/* =========================================================
   ANIMAÇÕES
   ========================================================= */

function verdeDefinirAnimacoes(ativo) {

    verdeDefinirConfig(
        "reduzirAnimacoes",
        !ativo
    );

    aplicarConfiguracoes();
}


/* =========================================================
   ALTO CONTRASTE
   ========================================================= */

function verdeDefinirAltoContraste(ativo) {

    verdeDefinirConfig(
        "altoContraste",
        Boolean(ativo)
    );

    aplicarConfiguracoes();
}


/* =========================================================
   INTERFACE GRANDE
   ========================================================= */

function verdeDefinirInterfaceGrande(
    ativo
) {

    verdeDefinirConfig(
        "interfaceGrande",
        Boolean(ativo)
    );

    aplicarConfiguracoes();
}


/* =========================================================
   EFEITOS
   ========================================================= */

function verdeDefinirEfeitos(ativo) {

    verdeDefinirConfig(
        "efeitos",
        Boolean(ativo)
    );

    aplicarConfiguracoes();
}


/* =========================================================
   FUNDO
   ========================================================= */

function verdeAtivarFundo(ativo) {

    verdeDefinirConfig(
        "fundoPersonalizado",
        Boolean(ativo)
    );

    aplicarConfiguracoes();
}


/* =========================================================
   INTENSIDADE DO FUNDO
   ========================================================= */

function verdeDefinirIntensidadeFundo(
    intensidade
) {

    intensidade =
        Number(intensidade);

    intensidade =
        Math.max(
            0,
            Math.min(
                100,
                intensidade
            )
        );

    verdeDefinirConfig(
        "intensidadeFundo",
        intensidade
    );
}


/* =========================================================
   CURSOR
   ========================================================= */

function verdeDefinirCursor(cursor) {

    verdeDefinirConfig(
        "cursor",
        cursor
    );

    document.body.dataset.cursor =
        cursor;
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

    verdeDefinirConfig(
        "cursorTamanho",
        tamanho
    );
}


/* =========================================================
   EXPORTAR CONFIGURAÇÕES
   ========================================================= */

function verdeExportarConfig() {

    const config =
        verdeLerConfig();

    const dados =
        JSON.stringify(
            config,
            null,
            4
        );

    const arquivo =
        new Blob(
            [dados],
            {
                type:
                    "application/json"
            }
        );

    const url =
        URL.createObjectURL(
            arquivo
        );

    const link =
        document.createElement(
            "a"
        );

    link.href = url;
    link.download =
        "verde.configuracoes.json";

    link.click();

    URL.revokeObjectURL(
        url
    );
}


/* =========================================================
   IMPORTAR CONFIGURAÇÕES
   ========================================================= */

function verdeImportarConfig(
    arquivo
) {

    if (!arquivo) {
        return;
    }

    const leitor =
        new FileReader();

    leitor.onload = () => {

        try {

            const importado =
                JSON.parse(
                    leitor.result
                );

            const config = {
                ...VERDE_CONFIG_PADRAO,
                ...importado
            };

            verdeSalvarConfig(
                config
            );

            aplicarConfiguracoes();

            alert(
                "Configurações importadas."
            );

            location.reload();

        } catch {

            alert(
                "Esse arquivo de configuração não é válido."
            );
        }
    };

    leitor.readAsText(
        arquivo
    );
}


/* =========================================================
   INFORMAÇÕES
   ========================================================= */

function verdeObterInformacoes() {

    return {
        nome: "VERDE",
        versao: "1.0.0",
        plataforma: "Web",
        armazenamento: "localStorage"
    };
}


/* =========================================================
   INICIALIZAÇÃO
   ========================================================= */

function iniciarConfiguracoesVerde() {

    const config =
        verdeLerConfig();

    aplicarConfiguracoes();

    console.log(
        "VERDE configurado:",
        config
    );
}


/* =========================================================
   EXPORTAR FUNÇÕES
   ========================================================= */

window.verdeConfig = {

    ler:
        verdeLerConfig,

    salvar:
        verdeSalvarConfig,

    definir:
        verdeDefinirConfig,

    obter:
        verdeObterConfig,

    restaurar:
        verdeRestaurarConfig,

    aplicar:
        aplicarConfiguracoes,

    tema:
        verdeDefinirTema,

    cor:
        verdeDefinirCor,

    fonte:
        verdeDefinirFonte,

    tamanhoFonte:
        verdeDefinirTamanhoFonte,

    tamanhoPincel:
        verdeDefinirTamanhoPincel,

    corPincel:
        verdeDefinirCorPincel,

    sons:
        verdeDefinirSons,

    volume:
        verdeDefinirVolume,

    animacoes:
        verdeDefinirAnimacoes,

    contraste:
        verdeDefinirAltoContraste,

    interfaceGrande:
        verdeDefinirInterfaceGrande,

    efeitos:
        verdeDefinirEfeitos,

    fundo:
        verdeAtivarFundo,

    intensidadeFundo:
        verdeDefinirIntensidadeFundo,

    cursor:
        verdeDefinirCursor,

    tamanhoCursor:
        verdeDefinirTamanhoCursor,

    exportar:
        verdeExportarConfig,

    importar:
        verdeImportarConfig,

    informacoes:
        verdeObterInformacoes
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
        iniciarConfiguracoesVerde
    );

} else {

    iniciarConfiguracoesVerde();

}
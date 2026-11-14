"use strict";

/* =========================================================
   VERDE - SERVIDOR LOCAL
   ========================================================= */

const http = require("http");
const fs = require("fs");
const path = require("path");

const PORTA = 3000;
const PASTA = __dirname;


/* =========================================================
   TIPOS DE ARQUIVO
   ========================================================= */

const TIPOS = {

    ".html": "text/html; charset=utf-8",

    ".css": "text/css; charset=utf-8",

    ".js": "application/javascript; charset=utf-8",

    ".json": "application/json; charset=utf-8",

    ".png": "image/png",

    ".jpg": "image/jpeg",

    ".jpeg": "image/jpeg",

    ".gif": "image/gif",

    ".svg": "image/svg+xml",

    ".webp": "image/webp",

    ".ico": "image/x-icon",

    ".txt": "text/plain; charset=utf-8"
};


/* =========================================================
   LER ARQUIVO
   ========================================================= */

function lerArquivo(
    caminho,
    resposta
) {

    fs.readFile(
        caminho,
        (erro, dados) => {

            if (erro) {

                resposta.writeHead(
                    404,
                    {
                        "Content-Type":
                            "text/plain; charset=utf-8"
                    }
                );

                resposta.end(
                    "Arquivo não encontrado."
                );

                return;
            }

            const extensao =
                path.extname(
                    caminho
                ).toLowerCase();

            resposta.writeHead(
                200,
                {
                    "Content-Type":
                        TIPOS[extensao] ||
                        "application/octet-stream",

                    "Cache-Control":
                        "no-cache"
                }
            );

            resposta.end(
                dados
            );
        }
    );
}


/* =========================================================
   SERVIDOR
   ========================================================= */

const servidor =
    http.createServer(
        (requisicao, resposta) => {

            let url =
                decodeURIComponent(
                    requisicao.url
                );

            url =
                url.split("?")[0];


            if (
                url === "/" ||
                url === ""
            ) {

                url =
                    "/verde.html";
            }


            const caminho =
                path.normalize(
                    path.join(
                        PASTA,
                        url
                    )
                );


            /* Proteção contra acesso fora da pasta */

            if (
                !caminho.startsWith(
                    PASTA
                )
            ) {

                resposta.writeHead(
                    403,
                    {
                        "Content-Type":
                            "text/plain; charset=utf-8"
                    }
                );

                resposta.end(
                    "Acesso negado."
                );

                return;
            }


            fs.stat(
                caminho,
                (erro, informacoes) => {

                    if (
                        !erro &&
                        informacoes.isDirectory()
                    ) {

                        lerArquivo(
                            path.join(
                                caminho,
                                "verde.html"
                            ),
                            resposta
                        );

                        return;
                    }

                    lerArquivo(
                        caminho,
                        resposta
                    );
                }
            );
        }
    );


/* =========================================================
   INICIAR
   ========================================================= */

servidor.listen(
    PORTA,
    () => {

        console.log("");
        console.log(
            "================================"
        );

        console.log(
            "        VERDE SERVER"
        );

        console.log(
            "================================"
        );

        console.log(
            `Servidor: http://localhost:${PORTA}`
        );

        console.log(
            "Arquivo principal: verde.html"
        );

        console.log(
            "Pressione CTRL + C para parar."
        );

        console.log(
            "================================"
        );

        console.log("");
    }
);


/* =========================================================
   ERROS
   ========================================================= */

servidor.on(
    "error",
    erro => {

        if (
            erro.code ===
            "EADDRINUSE"
        ) {

            console.error(
                `A porta ${PORTA} já está em uso.`
            );

        } else {

            console.error(
                "Erro no servidor:",
                erro
            );
        }
    }
);
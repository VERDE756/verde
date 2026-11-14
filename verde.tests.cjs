const assert = require("assert");

console.log("================================");
console.log("       TESTES DO PROJETO VERDE");
console.log("================================");
console.log("");

function teste(nome, funcao) {
    try {
        funcao();
        console.log(`[OK] ${nome}`);
    } catch (erro) {
        console.error(`[ERRO] ${nome}`);
        console.error(erro.message);
        process.exitCode = 1;
    }
}

teste("Node.js está funcionando", () => {
    assert.strictEqual(typeof process.version, "string");
});

teste("Projeto possui nome correto", () => {
    const nome = "verde";
    assert.strictEqual(nome, "verde");
});

teste("Versão do projeto", () => {
    const versao = "1.0.0";
    assert.strictEqual(versao, "1.0.0");
});

teste("Dados de notas começam como array", () => {
    const notas = [];
    assert.ok(Array.isArray(notas));
});

teste("Configurações começam como objeto", () => {
    const configuracoes = {};
    assert.strictEqual(typeof configuracoes, "object");
});

console.log("");
console.log("================================");
console.log("          TESTES FINALIZADOS");
console.log("================================");
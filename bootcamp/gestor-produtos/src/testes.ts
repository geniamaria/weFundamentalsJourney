/**
 * ============================================================================
 * TESTES DAS FUNCIONALIDADES PRINCIPAIS
 * ============================================================================
 * Não usamos nenhuma biblioteca de testes: escrevemos um pequeno "runner"
 * que corre os casos, conta os que passam e mostra um resumo no final.
 *
 * Executar com: npm test
 *
 * Conceitos demonstrados:
 *  - importação de módulos e "import type"
 *  - async/await em série
 *  - unknown tratado com Type Guards e Zod
 *  - narrowing com "if (!resultado.sucesso)"
 */

import { GestorProdutos } from "./classes/GestorProdutos.ts";
import { consultarMeteorologiaMaputo } from "./services/meteo.service.ts";
import { linhaDoProduto, prepararActualizacao, prepararNovoProduto, produtoParaTexto } from "./services/produto.service.ts";
import { isCategoria, isProduto, obterCampo, chaveDeCategoria, formatarMeticais } from "./utils/validadores.ts";

// ---------------------------------------------------------------------------
// Mini "runner" de testes
// ---------------------------------------------------------------------------

let testesCorridos = 0;
let testesFalhados = 0;

/** Verifica uma condição e mostra o resultado no terminal. */
function verificar(descricao: string, condicao: boolean): void {
  testesCorridos += 1;
  if (condicao) {
    console.log(`  OK   ${descricao}`);
  } else {
    testesFalhados += 1;
    console.log(`  FALHA ${descricao}`);
  }
}

/** Agrupa visualmente um conjunto de testes. */
function grupo(titulo: string): void {
  console.log(`\n${titulo}`);
}

// ---------------------------------------------------------------------------
// 1. TYPE GUARDS
// ---------------------------------------------------------------------------

grupo("Type Guards");

verificar('isCategoria("bebidas") é verdadeiro', isCategoria("bebidas"));
verificar('isCategoria("peixe") é falso', !isCategoria("peixe"));
verificar("isCategoria(123) é falso", !isCategoria(123));

// Dados "unknown": só passam depois de validados pelo Type Guard.
const possivelProduto: unknown = {
  id: 1,
  nome: "Arroz",
  precoMT: 450,
  categoria: "mercearia",
};
verificar("isProduto() aceita um objecto válido", isProduto(possivelProduto));
verificar("isProduto() rejeita um texto", !isProduto("Arroz"));
verificar("isProduto() rejeita categoria inválida", !isProduto({ id: 1, nome: "X", precoMT: 1, categoria: "peixe" }));

// ---------------------------------------------------------------------------
// 2. VALIDAÇÃO COM ZOD
// ---------------------------------------------------------------------------

grupo("Validação com Zod");

const novoValido = prepararNovoProduto({
  nome: "  Feijão  ", // com espaços de propósito
  precoMT: "320", // texto: o Zod converte para número
  categoria: "mercearia",
  descricao: "Feijão manteiga",
});
verificar("Aceita dados válidos", novoValido.sucesso);
verificar(
  "Remove espaços e converte o preço para número",
  novoValido.sucesso && novoValido.dados.nome === "Feijão" && novoValido.dados.precoMT === 320,
);

const nomeCurto = prepararNovoProduto({ nome: "A", precoMT: 10, categoria: "bebidas" });
verificar("Rejeita nome com menos de 2 caracteres", !nomeCurto.sucesso);

const precoNegativo = prepararNovoProduto({ nome: "Água", precoMT: -5, categoria: "bebidas" });
verificar("Rejeita preço negativo", !precoNegativo.sucesso);

const categoriaInvalida = prepararNovoProduto({ nome: "Água", precoMT: 5, categoria: "peixe" });
verificar("Rejeita categoria inexistente", !categoriaInvalida.sucesso);

const semDescricao = prepararNovoProduto({ nome: "Água", precoMT: 5, categoria: "bebidas" });
verificar("Descrição é opcional", semDescricao.sucesso);

verificar("prepararActualizacao() aceita um só campo", prepararActualizacao({ precoMT: "99" }).sucesso);
verificar("prepararActualizacao() rejeita preço inválido", !prepararActualizacao({ precoMT: "abc" }).sucesso);

// ---------------------------------------------------------------------------
// 3. GESTOR DE PRODUTOS
// ---------------------------------------------------------------------------

grupo("Gestor de Produtos");

const gestor = new GestorProdutos("Loja de Teste");

// Adicionamos dois produtos (os dados já vêm validados).
const arroz = prepararNovoProduto({ nome: "Arroz", precoMT: 450, categoria: "mercearia", descricao: "Saco 5kg" });
const sumo = prepararNovoProduto({ nome: "Sumo", precoMT: 120.5, categoria: "bebidas" });

const primeiro = arroz.sucesso ? gestor.adicionar(arroz.dados) : arroz;
const segundo = sumo.sucesso ? gestor.adicionar(sumo.dados) : sumo;

verificar("adicionar() devolve o produto criado", primeiro.sucesso && primeiro.dados.id === 1);
verificar("O id é gerado automaticamente (1, 2, ...)", segundo.sucesso && segundo.dados.id === 2);
verificar("listar() devolve os 2 produtos", gestor.listar().length === 2);
verificar("quantidade reflecte a lista", gestor.quantidade === 2);

const buscaExistente = gestor.buscar(1);
verificar("buscar() encontra um produto existente", buscaExistente.sucesso && buscaExistente.dados.nome === "Arroz");

const buscaInexistente = gestor.buscar(999);
verificar("buscar() falha quando o id não existe", !buscaInexistente.sucesso);

const actualizacao = prepararActualizacao({ precoMT: "500", descricao: "Saco 5kg (promoção)" });
const resultadoActualizacao = actualizacao.sucesso ? gestor.actualizar(1, actualizacao.dados) : actualizacao;
verificar("actualizar() altera só os campos enviados", resultadoActualizacao.sucesso && resultadoActualizacao.dados.precoMT === 500);
verificar(
  "actualizar() mantém os campos não enviados",
  resultadoActualizacao.sucesso && resultadoActualizacao.dados.nome === "Arroz" && resultadoActualizacao.dados.categoria === "mercearia",
);
verificar("actualizar() falha em id inexistente", !gestor.actualizar(999, { nome: "X" }).sucesso);

verificar("calcularInventario() soma os preços", gestor.calcularInventario() === 620.5);

verificar("buscarPorCampo() filtra pela categoria", gestor.buscarPorCampo("categoria", "bebidas").length === 1);

const removido = gestor.remover(2);
verificar("remover() devolve o produto removido", removido.sucesso && removido.dados.nome === "Sumo");
verificar("remover() falha na segunda tentativa", !gestor.remover(2).sucesso);
verificar("O inventário diminui depois de remover", gestor.calcularInventario() === 500);

// Encapsulamento: o setter valida o nome da loja.
let lancouErro = false;
try {
  gestor.nomeDaLoja = "X";
} catch {
  lancouErro = true;
}
verificar("O setter nomeDaLoja rejeita nomes demasiado curtos", lancouErro);
verificar("O getter nomeDaLoja devolve o valor", gestor.nomeDaLoja === "Loja de Teste");

verificar("A propriedade static conta as instâncias", GestorProdutos.instanciasCriadas >= 1);
verificar("resumo() (método abstracto implementado) devolve texto", gestor.resumo().includes("Loja de Teste"));

// ---------------------------------------------------------------------------
// 4. UTILITÁRIOS
// ---------------------------------------------------------------------------

grupo("Utilitários");

verificar('chaveDeCategoria("bebidas") === "categoria:bebidas"', chaveDeCategoria("bebidas") === "categoria:bebidas");
verificar("formatarMeticais() inclui a moeda", formatarMeticais(450).includes("MTn"));

const produtoDeTeste = gestor.listar()[0];
if (produtoDeTeste !== undefined) {
  verificar('obterCampo(produto, "nome") devolve o nome', obterCampo(produtoDeTeste, "nome") === "Arroz");

  const texto = produtoParaTexto(produtoDeTeste);
  verificar("produtoParaTexto() (Mapped Type) tem tudo em texto", typeof texto.precoMT === "string" && typeof texto.id === "string");
  verificar("linhaDoProduto() mostra a categoria", linhaDoProduto(produtoDeTeste).includes("Mercearia"));
}

// ---------------------------------------------------------------------------
// 5. API EXTERNA (Open-Meteo)
// ---------------------------------------------------------------------------

grupo("API externa (Open-Meteo)");

const meteo = await consultarMeteorologiaMaputo();
if (meteo.sucesso) {
  verificar("A API devolve uma temperatura numérica", typeof meteo.dados.current.temperature_2m === "number");
  verificar("A API devolve a velocidade do vento", typeof meteo.dados.current.wind_speed_10m === "number");
} else {
  // Sem internet, o teste é ignorado em vez de falhar.
  console.log(`  --   Ignorado (sem rede?): ${meteo.erro}`);
}

// Endereço errado: o serviço tem de tratar o erro sem rebentar a aplicação.
const meteoComErro = await consultarMeteorologiaMaputo("https://api.open-meteo.com/v1/endereco-inexistente");
verificar("Um erro HTTP é devolvido como Resultado de erro", !meteoComErro.sucesso);

// ---------------------------------------------------------------------------
// RESUMO
// ---------------------------------------------------------------------------

console.log(`\n========================================`);
console.log(`  Testes: ${testesCorridos} | Falhas: ${testesFalhados}`);
console.log(`========================================`);

// Código de saída diferente de zero quando há falhas (útil em CI).
if (testesFalhados > 0) {
  process.exitCode = 1;
}

/**
 * ============================================================================
 * PONTO DE ENTRADA — MENU INTERACTIVO NO TERMINAL
 * ============================================================================
 * Este ficheiro liga tudo: lê os dados do utilizador, valida-os com Zod,
 * guarda-os no GestorProdutos e mostra os resultados.
 *
 * Conceitos demonstrados:
 *  - readline/promises (entrada assíncrona no terminal)
 *  - async/await
 *  - unknown (os dados do teclado são desconhecidos até serem validados)
 *  - Type Guards e Type Predicates
 *  - Template Literal Types (OpcaoMenu)
 *  - never (exaustividade do switch)
 *  - import type e ficheiros .d.ts
 */

import { createInterface } from "node:readline/promises";
import { stdin as entrada, stdout as saida } from "node:process";

// "import type" é apagado ao compilar. O módulo "servico-de-registos"
// não existe de verdade: os seus tipos estão em src/declarations/exemplo.d.ts.
import type { Registo } from "servico-de-registos";

import { Documento } from "./classes/Documento.ts";
import { GestorProdutos } from "./classes/GestorProdutos.ts";
import { consultarMeteorologiaMaputo } from "./services/meteo.service.ts";
import { linhaDoProduto, prepararActualizacao, prepararNovoProduto } from "./services/produto.service.ts";
import { CATEGORIAS } from "./types/produto.ts";
import { formatarMeticais, isProduto, obterCampo, verificarExaustividade } from "./utils/validadores.ts";

// ---------------------------------------------------------------------------
// 1. METADADOS (tipo global declarado em src/declarations/exemplo.d.ts)
// ---------------------------------------------------------------------------

const METADADOS: Aplicacao.Metadados = {
  nome: "Gestor de Produtos",
  versao: "1.0.0",
  autor: "Bootcamp weFundamentalsJourney",
};

/**
 * Usa o tipo "Registo" declarado no ficheiro .d.ts.
 * Repare que não existe nenhuma biblioteca instalada: só a declaração de tipos.
 */
function criarRegistoLocal(mensagem: string): Registo {
  return {
    id: Date.now(),
    mensagem,
    criadoEm: new Date().toISOString(),
  };
}

// ---------------------------------------------------------------------------
// 2. OPÇÕES DO MENU
// ---------------------------------------------------------------------------

/**
 * Template Literal Type: gera automaticamente as strings "1" até "8".
 * Assim nunca escrevemos as opções à mão duas vezes.
 */
type OpcaoMenu = `${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8}`;

const OPCOES: readonly OpcaoMenu[] = ["1", "2", "3", "4", "5", "6", "7", "8"];

/**
 * TYPE PREDICATE: depois de devolver "true", o texto passa a ser "OpcaoMenu".
 */
function isOpcaoMenu(valor: string): valor is OpcaoMenu {
  return (OPCOES as readonly string[]).includes(valor);
}

// ---------------------------------------------------------------------------
// 3. LEITURA DE DADOS DO TERMINAL
// ---------------------------------------------------------------------------

const rl = createInterface({ input: entrada, output: saida });

/**
 * O readline entrega as linhas através de um "async iterator".
 * Vantagem: funciona tanto no terminal como com entrada canalizada (pipe),
 * por exemplo "Get-Content respostas.txt | npm run dev".
 */
const linhas = rl[Symbol.asyncIterator]();

/** Erro usado para sinalizar que a entrada de dados terminou. */
class FimDaEntrada extends Error {
  constructor() {
    super("A entrada de dados terminou.");
    this.name = "FimDaEntrada";
  }
}

/** Mostra o pedido e lê a linha seguinte. Remove espaços nas pontas. */
async function perguntar(texto: string): Promise<string> {
  rl.setPrompt(texto);
  rl.prompt();

  const proximo = await linhas.next();

  // "done" é "true" quando a entrada acabou (Ctrl+Z/Ctrl+D ou fim do pipe).
  if (proximo.done === true) {
    throw new FimDaEntrada();
  }

  return proximo.value.trim();
}

/** Lê um número inteiro. Devolve "null" se o texto não for um número válido. */
async function perguntarId(mensagem: string): Promise<number | null> {
  const resposta = await perguntar(mensagem);
  const numero = Number(resposta);

  if (resposta === "" || !Number.isInteger(numero)) {
    console.log("  ! Introduza um número inteiro válido.");
    return null;
  }

  return numero;
}

// ---------------------------------------------------------------------------
// 4. ACÇÕES DO MENU
// ---------------------------------------------------------------------------

/** 1. Cadastrar produto. */
async function cadastrar(gestor: GestorProdutos): Promise<void> {
  console.log("\n--- Novo produto ---");

  const nome = await perguntar("Nome: ");
  const preco = await perguntar("Preço (MT): ");
  console.log(`Categorias: ${CATEGORIAS.join(" | ")}`);
  const categoria = await perguntar("Categoria: ");
  const descricao = await perguntar("Descrição (opcional): ");

  // Os dados vêm do exterior: juntamo-los como "unknown" e só depois validamos.
  const dadosBrutos: Record<string, unknown> = {
    nome,
    precoMT: preco, // texto! O Zod converte e valida o número.
    categoria,
    ...(descricao !== "" ? { descricao } : {}),
  };

  const validacao = prepararNovoProduto(dadosBrutos);

  if (!validacao.sucesso) {
    console.log(`  ! Dados inválidos -> ${validacao.erro}`);
    return;
  }

  const resultado = gestor.adicionar(validacao.dados);

  if (!resultado.sucesso) {
    console.log(`  ! ${resultado.erro}`);
    return;
  }

  console.log(`  OK Produto cadastrado: ${linhaDoProduto(resultado.dados)}`);
}

/** 2. Listar todos os produtos. */
function listar(gestor: GestorProdutos): void {
  const produtos = gestor.listar();

  if (produtos.length === 0) {
    console.log("  (não há produtos cadastrados)");
    return;
  }

  console.log(`\n--- ${gestor.resumo()} ---`);

  for (const produto of produtos) {
    // Type Guard: só mostramos o produto se ele tiver mesmo a forma certa.
    if (!isProduto(produto)) {
      console.log("  ! Produto com formato inesperado (ignorado).");
      continue;
    }
    console.log(`  ${linhaDoProduto(produto)}`);
  }
}

/** 3. Procurar um produto pelo id. */
async function procurar(gestor: GestorProdutos): Promise<void> {
  const id = await perguntarId("Id do produto: ");
  if (id === null) return;

  const resultado = gestor.buscar(id);

  if (!resultado.sucesso) {
    console.log(`  ! ${resultado.erro}`);
    return;
  }

  console.log(`  OK ${linhaDoProduto(resultado.dados)}`);
  // "obterCampo" usa "keyof Produto" e um Indexed Access Type.
  console.log(`     Nome (via obterCampo): ${obterCampo(resultado.dados, "nome")}`);
}

/** 4. Actualizar um produto existente. */
async function actualizar(gestor: GestorProdutos): Promise<void> {
  const id = await perguntarId("Id do produto a actualizar: ");
  if (id === null) return;

  const existente = gestor.buscar(id);
  if (!existente.sucesso) {
    console.log(`  ! ${existente.erro}`);
    return;
  }

  console.log(`  Produto actual: ${linhaDoProduto(existente.dados)}`);
  console.log("  (deixe um campo vazio para manter o valor actual)");

  // Só enviamos para validação os campos que o utilizador preencheu.
  const alteracoes: Record<string, unknown> = {};

  const nome = await perguntar("Novo nome: ");
  if (nome !== "") alteracoes["nome"] = nome;

  const preco = await perguntar("Novo preço (MT): ");
  if (preco !== "") alteracoes["precoMT"] = preco;

  const categoria = await perguntar(`Nova categoria (${CATEGORIAS.join(" | ")}): `);
  if (categoria !== "") alteracoes["categoria"] = categoria;

  const descricao = await perguntar("Nova descrição: ");
  if (descricao !== "") alteracoes["descricao"] = descricao;

  if (Object.keys(alteracoes).length === 0) {
    console.log("  ! Não indicou nenhuma alteração.");
    return;
  }

  const validacao = prepararActualizacao(alteracoes);

  if (!validacao.sucesso) {
    console.log(`  ! Dados inválidos -> ${validacao.erro}`);
    return;
  }

  const resultado = gestor.actualizar(id, validacao.dados);

  if (!resultado.sucesso) {
    console.log(`  ! ${resultado.erro}`);
    return;
  }

  console.log(`  OK Produto actualizado: ${linhaDoProduto(resultado.dados)}`);
}

/** 5. Remover um produto. */
async function remover(gestor: GestorProdutos): Promise<void> {
  const id = await perguntarId("Id do produto a remover: ");
  if (id === null) return;

  const resultado = gestor.remover(id);

  if (!resultado.sucesso) {
    console.log(`  ! ${resultado.erro}`);
    return;
  }

  console.log(`  OK Produto removido: ${linhaDoProduto(resultado.dados)}`);
}

/** 6. Calcular o valor total do inventário. */
function inventario(gestor: GestorProdutos): void {
  console.log("\n--- Inventário ---");
  console.log(`  Produtos em stock: ${gestor.quantidade}`);
  console.log(`  Valor total: ${formatarMeticais(gestor.calcularInventario())}`);
}

/** 8. Consultar a meteorologia em Maputo (API externa). */
async function meteorologia(): Promise<void> {
  console.log("\n  A consultar a API Open-Meteo...");
  const resultado = await consultarMeteorologiaMaputo();

  if (!resultado.sucesso) {
    console.log(`  ! ${resultado.erro}`);
    return;
  }

  const { current } = resultado.dados;
  console.log("--- Meteorologia em Maputo ---");
  console.log(`  Temperatura: ${current.temperature_2m} °C`);
  console.log(`  Vento: ${current.wind_speed_10m} km/h`);
  console.log(`  Observado em: ${new Date(current.time).toLocaleString("pt-PT")}`);
}

// ---------------------------------------------------------------------------
// 5. MENU
// ---------------------------------------------------------------------------

function mostrarMenu(): void {
  console.log("");
  console.log("========================================");
  console.log(`  ${METADADOS.nome} v${METADADOS.versao}`);
  console.log("========================================");
  console.log("  1. Cadastrar produto");
  console.log("  2. Listar produtos");
  console.log("  3. Procurar produto");
  console.log("  4. Actualizar produto");
  console.log("  5. Remover produto");
  console.log("  6. Calcular inventário");
  console.log("  7. Sair");
  console.log("  8. Consultar meteorologia (Maputo)");
  console.log("");
}

// ---------------------------------------------------------------------------
// 6. PROGRAMA PRINCIPAL
// ---------------------------------------------------------------------------

async function principal(): Promise<void> {
  // Criamos o gestor. "as const" não é preciso aqui porque é uma variável normal.
  const gestor = new GestorProdutos("Loja Central de Maputo");

  // Demonstração de "static": acedemos à propriedade através da classe.
  console.log(`${METADADOS.nome} v${METADADOS.versao} — ${METADADOS.autor}`);
  console.log(`Classe Documento v${Documento.versao} | gestores criados: ${GestorProdutos.instanciasCriadas}`);
  console.log(gestor.descrever());

  // Usamos o tipo declarado no ficheiro .d.ts.
  const registoDeArranque = criarRegistoLocal("Aplicação iniciada.");
  console.log(`Registo de auditoria #${registoDeArranque.id} em ${registoDeArranque.criadoEm}`);

  let aCorrer = true;

  try {
    while (aCorrer) {
      mostrarMenu();

      const resposta = await perguntar("Opção: ");

      // Type Guard: se não for uma opção válida, voltamos ao início do ciclo.
      if (!isOpcaoMenu(resposta)) {
        console.log("  ! Opção inválida. Escolha um número entre 1 e 8.");
        continue;
      }

      const opcao: OpcaoMenu = resposta;

      switch (opcao) {
        case "1":
          await cadastrar(gestor);
          break;
        case "2":
          listar(gestor);
          break;
        case "3":
          await procurar(gestor);
          break;
        case "4":
          await actualizar(gestor);
          break;
        case "5":
          await remover(gestor);
          break;
        case "6":
          inventario(gestor);
          break;
        case "7":
          aCorrer = false;
          break;
        case "8":
          await meteorologia();
          break;
        default:
          // Se todos os casos foram tratados, "opcao" aqui é "never".
          // Se alguém adicionar uma opção nova e esquecer o "case", dá erro.
          verificarExaustividade(opcao);
      }
    }
  } catch (erro) {
    // Quando a entrada termina (pipe ou Ctrl+D), saímos sem erro feio.
    if (erro instanceof FimDaEntrada) {
      console.log("\n(entrada de dados terminada)");
    } else {
      throw erro;
    }
  }

  rl.close();
  console.log(`\nObrigado! Foram guardados ${gestor.quantidade} produto(s).`);
  console.log(`Histórico da sessão: ${gestor.historico.length} operação(ões).`);
}

// "await" no topo do ficheiro: o Node suporta top-level await em módulos ES.
await principal();

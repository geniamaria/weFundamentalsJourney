/**
 * ============================================================================
 * SERVIÇO DE PRODUTOS
 * ============================================================================
 * Camada entre o terminal (main.ts) e o gestor (GestorProdutos).
 * Aqui tratamos da VALIDAÇÃO e da APRESENTAÇÃO dos dados.
 *
 * Conceitos demonstrados:
 *  - unknown (os dados chegam sem tipo)
 *  - Zod com safeParse (através de validarComSchema)
 *  - ReturnType
 *  - Mapped Types (ProdutoEmTexto)
 *  - exactOptionalPropertyTypes na prática
 */

import type { GestorProdutos } from "../classes/GestorProdutos.ts";
import { actualizarProdutoSchema, criarProdutoSchema } from "../schemas/produto.schema.ts";
import type {
  ActualizacaoProduto,
  NovoProduto,
  Produto,
  ProdutoEmTexto,
  Resultado,
} from "../types/index.ts";
import { ETIQUETAS, chaveDeCategoria, formatarMeticais, validarComSchema } from "../utils/validadores.ts";

/**
 * "ReturnType" extrai o tipo devolvido por um método.
 * Aqui obtemos "Resultado<Produto>" directamente do método "buscar".
 */
export type ResultadoDaBusca = ReturnType<GestorProdutos["buscar"]>;

/**
 * Valida os dados de um produto novo.
 *
 * Recebe "unknown" porque ainda não confiámos em nada.
 * Devolve: Resultado<NovoProduto>.
 */
export function prepararNovoProduto(dados: unknown): Resultado<NovoProduto> {
  const validado = validarComSchema(criarProdutoSchema, dados);

  if (!validado.sucesso) {
    return { sucesso: false, erro: validado.erro };
  }

  // Reconstruímos o objecto campo a campo. Assim garantimos que a descrição
  // ou existe com texto, ou não existe de todo — nunca existe com "undefined".
  const produto: NovoProduto = {
    nome: validado.dados.nome,
    precoMT: validado.dados.precoMT,
    categoria: validado.dados.categoria,
    ...(validado.dados.descricao !== undefined ? { descricao: validado.dados.descricao } : {}),
  };

  return { sucesso: true, dados: produto };
}

/**
 * Valida os dados de uma actualização parcial.
 * Devolve: Resultado<ActualizacaoProduto>.
 */
export function prepararActualizacao(dados: unknown): Resultado<ActualizacaoProduto> {
  const validado = validarComSchema(actualizarProdutoSchema, dados);

  if (!validado.sucesso) {
    return { sucesso: false, erro: validado.erro };
  }

  const alteracoes: ActualizacaoProduto = {
    ...(validado.dados.nome !== undefined ? { nome: validado.dados.nome } : {}),
    ...(validado.dados.precoMT !== undefined ? { precoMT: validado.dados.precoMT } : {}),
    ...(validado.dados.categoria !== undefined ? { categoria: validado.dados.categoria } : {}),
    ...(validado.dados.descricao !== undefined ? { descricao: validado.dados.descricao } : {}),
  };

  return { sucesso: true, dados: alteracoes };
}

/**
 * Converte um Produto num objecto só com textos.
 * O tipo de retorno "ProdutoEmTexto" é um Mapped Type: tem as mesmas
 * chaves de Produto, mas todas com valor "string".
 */
export function produtoParaTexto(produto: Produto): ProdutoEmTexto {
  return {
    id: String(produto.id),
    nome: produto.nome,
    precoMT: formatarMeticais(produto.precoMT),
    categoria: ETIQUETAS[produto.categoria],
    descricao: produto.descricao ?? "—",
  };
}

/**
 * Cria a linha que mostramos no terminal para um produto.
 * Usamos "chaveDeCategoria" para mostrar a chave do Template Literal Type.
 */
export function linhaDoProduto(produto: Produto): string {
  const texto = produtoParaTexto(produto);
  const chave = chaveDeCategoria(produto.categoria);

  return [
    `#${texto.id.padStart(3, " ")}`,
    texto.nome.padEnd(20, " "),
    texto.precoMT.padStart(14, " "),
    `[${texto.categoria}]`,
    `(${chave})`,
    texto.descricao,
  ].join("  ");
}

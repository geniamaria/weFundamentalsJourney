/**
 * ============================================================================
 * VALIDADORES E AJUDANTES GENÉRICOS
 * ============================================================================
 * Funções pequenas e reutilizáveis usadas por toda a aplicação.
 *
 * Conceitos demonstrados:
 *  - Type Guards
 *  - Type Predicates ("valor is Tipo")
 *  - unknown (só confiamos depois de validar)
 *  - never (garantir que todos os casos foram tratados)
 *  - keyof e Indexed Access Types
 *  - Template Literal Types
 *  - Record
 *  - ReturnType
 */

import type { ZodType } from "zod";

import { CATEGORIAS } from "../types/produto.ts";
import type { Categoria, ChaveDeCategoria, Produto, Resultado } from "../types/index.ts";

// ---------------------------------------------------------------------------
// 1. TYPE GUARDS (funções que estreitam tipos)
// ---------------------------------------------------------------------------

/**
 * TYPE PREDICATE: o "valor is Categoria" diz ao TypeScript que,
 * quando a função devolve "true", o valor passa a ser do tipo Categoria.
 *
 * Repare que recebemos "unknown": não sabemos o que nos chega.
 */
export function isCategoria(valor: unknown): valor is Categoria {
  // O "as readonly string[]" é necessário porque CATEGORIAS é um tuple literal
  // e o método .includes() só aceitaria exactamente esses três textos.
  return typeof valor === "string" && (CATEGORIAS as readonly string[]).includes(valor);
}

/**
 * Verifica se um valor desconhecido tem a forma de um Produto.
 * Cada campo é testado individualmente antes de o darmos como válido.
 */
export function isProduto(valor: unknown): valor is Produto {
  // Primeiro garantimos que é um objecto (e não "null", que também é objecto).
  if (typeof valor !== "object" || valor === null) {
    return false;
  }

  // Tratamos o objecto como um "saco" de chaves desconhecidas.
  const candidato = valor as Record<string, unknown>;

  return (
    typeof candidato["id"] === "number" &&
    typeof candidato["nome"] === "string" &&
    typeof candidato["precoMT"] === "number" &&
    isCategoria(candidato["categoria"]) &&
    // A descrição pode não existir, mas se existir tem de ser texto.
    (candidato["descricao"] === undefined || typeof candidato["descricao"] === "string")
  );
}

// ---------------------------------------------------------------------------
// 2. VALIDAÇÃO COM ZOD
// ---------------------------------------------------------------------------

/**
 * Valida dados "unknown" com qualquer schema Zod.
 *
 * Usamos safeParse() em vez de parse() porque safeParse() NÃO lança
 * excepções: devolve sempre um objecto que diz se correu bem ou mal.
 *
 * Devolve: Resultado<T> — ou os dados validados, ou uma mensagem de erro.
 */
export function validarComSchema<T>(schema: ZodType<T>, dados: unknown): Resultado<T> {
  const resultado = schema.safeParse(dados);

  if (resultado.success) {
    return { sucesso: true, dados: resultado.data };
  }

  // Juntamos todos os problemas numa única mensagem legível.
  const mensagens = resultado.error.issues
    .map((problema) => {
      // problema.path é uma lista, por exemplo ["nome"]. Unimos com ".".
      const caminho = problema.path.join(".") || "(raiz)";
      return `${caminho}: ${problema.message}`;
    })
    .join("; ");

  return { sucesso: false, erro: mensagens };
}

/**
 * "never" é o tipo sem valores possíveis.
 * Se um "switch" tratar todos os casos, o valor que sobra é "never".
 * Se alguém adicionar um caso novo e esquecer de o tratar, o TypeScript avisa.
 */
export function verificarExaustividade(valor: never): never {
  throw new Error(`Caso não tratado: ${JSON.stringify(valor)}`);
}

// ---------------------------------------------------------------------------
// 3. AJUDANTES DE TIPOS
// ---------------------------------------------------------------------------

/**
 * "keyof Produto" restringe o parâmetro às chaves reais do tipo Produto.
 * "Produto[K]" é um Indexed Access Type: devolve o tipo do campo escolhido.
 *
 * Exemplo: obterCampo(produto, "nome") devolve uma string.
 */
export function obterCampo<K extends keyof Produto>(produto: Produto, campo: K): Produto[K] {
  return produto[campo];
}

/**
 * Template Literal Type aplicado: o parâmetro só aceita uma Categoria
 * e o retorno é sempre "categoria:<valor>".
 */
export function chaveDeCategoria(categoria: Categoria): ChaveDeCategoria {
  return `categoria:${categoria}`;
}

/**
 * "Record<Categoria, string>" obriga a existir uma etiqueta
 * para CADA categoria. Se adicionarmos uma categoria nova, isto dá erro.
 */
export const ETIQUETAS: Record<Categoria, string> = {
  mercearia: "Mercearia",
  bebidas: "Bebidas",
  limpeza: "Limpeza",
};

/**
 * "ReturnType" extrai o tipo devolvido por uma função.
 * Aqui obtemos "Resultado<unknown>", o que mostra que a função é genérica.
 */
export type ResultadoDaValidacao = ReturnType<typeof validarComSchema>;

// ---------------------------------------------------------------------------
// 4. FORMATAÇÃO
// ---------------------------------------------------------------------------

// Criado uma só vez: formatar números é lento, por isso reutilizamos.
const formatadorDeMeticais = new Intl.NumberFormat("pt-MZ", {
  style: "currency",
  currency: "MZN",
});

/** Formata um número como moeda moçambicana (ex.: 450 -> "450,00 MTn"). */
export function formatarMeticais(valor: number): string {
  return formatadorDeMeticais.format(valor);
}

/** Formata a data/hora actual de forma legível. */
export function agoraLegivel(): string {
  return new Date().toLocaleString("pt-PT");
}

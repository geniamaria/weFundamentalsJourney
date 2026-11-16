/**
 * ============================================================================
 * PONTO ÚNICO DE IMPORTAÇÃO DOS TIPOS
 * ============================================================================
 * Em vez de importarmos tipos de vários ficheiros, importamos tudo daqui:
 *
 *   import type { Produto, Resultado } from "../types/index.ts";
 *
 * Conceitos demonstrados:
 *  - re-exportação com "export *"
 *  - Resultado<T> como união discriminada
 *  - Conditional Types + "never" para garantir exaustividade de tipos
 */

// Re-exporta tudo o que existe em produto.ts (tipos e valores).
export * from "./produto.ts";

// O "import type" diz ao TypeScript que isto é só um tipo:
// esta linha desaparece completamente do JavaScript gerado.
import type { Categoria, ElementoDoArray } from "./produto.ts";
import { CATEGORIAS } from "./produto.ts";

/**
 * "Resultado<T>" é uma união discriminada.
 * O campo "sucesso" funciona como "etiqueta" que permite ao TypeScript
 * saber exactamente que campos existem em cada caso.
 *
 * Assim evitamos usar excepções para tudo e obrigamos o programador
 * a tratar o erro antes de usar os dados.
 */
export type Resultado<T> =
  | { readonly sucesso: true; readonly dados: T }
  | { readonly sucesso: false; readonly erro: string };

/**
 * Conditional Type que devolve "true" apenas quando dois tipos são iguais.
 * Usamos os parênteses rectos [A] para impedir que o TypeScript
 * "distribua" a comparação por cada elemento de uma união.
 */
export type Iguais<A, B> = [A] extends [B] ? ([B] extends [A] ? true : false) : false;

/**
 * Truque para verificar tipos em tempo de compilação:
 * se o tipo recebido não for "true", o TypeScript dá erro.
 */
export type GarantiaDeTipo<T extends true> = T;

/**
 * Demonstração de "infer": extraímos o tipo dos elementos de CATEGORIAS
 * e provamos, em tempo de compilação, que é igual a "Categoria".
 */
export type CategoriaDoArray = ElementoDoArray<typeof CATEGORIAS>;

// Se as duas formas de obter a categoria deixarem de coincidir, esta linha falha.
export const _categoriasCoincidem: GarantiaDeTipo<Iguais<CategoriaDoArray, Categoria>> = true;

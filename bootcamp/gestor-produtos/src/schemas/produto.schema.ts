/**
 * ============================================================================
 * SCHEMAS DE VALIDAÇÃO COM ZOD
 * ============================================================================
 * O Zod valida dados que vêm "de fora" (teclado, ficheiros, APIs).
 * Nós nunca confiamos nesses dados: eles chegam como "unknown".
 *
 * Conceitos demonstrados:
 *  - z.object()
 *  - z.enum()
 *  - z.coerce (converte texto do terminal em número)
 *  - campos opcionais
 *  - z.infer (extrai o tipo TypeScript a partir do schema)
 *  - verificação de que o tipo inferido corresponde ao tipo do domínio
 */

import { z } from "zod";

import { CATEGORIAS } from "../types/produto.ts";
import type { NovoProduto } from "../types/produto.ts";
import type { GarantiaDeTipo, Iguais } from "../types/index.ts";

/**
 * z.enum() cria um validador que só aceita os valores permitidos.
 * Como CATEGORIAS foi declarado com "as const", o Zod conhece
 * exactamente as três opções e o tipo resultante é "Categoria".
 */
export const categoriaSchema = z.enum(CATEGORIAS);

/**
 * Schema para CRIAR um produto (sem "id", porque é gerado por nós).
 * Cada regra tem uma mensagem em português para ser mostrada ao utilizador.
 */
export const criarProdutoSchema = z.object({
  // .trim() remove espaços antes de validar o comprimento.
  nome: z.string().trim().min(2, "O nome deve ter pelo menos 2 caracteres."),
  // z.coerce.number() aceita "450" (texto do terminal) e transforma em 450.
  // .positive() garante que o preço é maior do que zero.
  precoMT: z.coerce.number().positive("O preço deve ser um número positivo."),
  // A categoria tem de ser uma das permitidas (mercearia, bebidas, limpeza).
  categoria: categoriaSchema,
  // .optional() torna a descrição facultativa.
  descricao: z.string().trim().min(1, "A descrição não pode estar vazia.").optional(),
});

/**
 * Schema para ACTUALIZAR um produto.
 * ".partial()" torna todos os campos opcionais: só validamos o que foi enviado.
 */
export const actualizarProdutoSchema = criarProdutoSchema.partial();

/**
 * "z.infer" extrai automaticamente o tipo TypeScript do schema.
 * Não escrevemos o tipo duas vezes: o schema é a fonte da verdade.
 */
export type ProdutoValidado = z.infer<typeof criarProdutoSchema>;
export type ActualizacaoValidada = z.infer<typeof actualizarProdutoSchema>;

/**
 * Verificação em tempo de compilação:
 * o tipo do schema tem de ser compatível com "NovoProduto".
 * Se alguém alterar o schema e esquecer o tipo do domínio, esta linha falha.
 */
export const _schemaCorrespondeAoProduto: GarantiaDeTipo<
  Iguais<Omit<ProdutoValidado, "descricao">, Omit<NovoProduto, "descricao">>
> = true;

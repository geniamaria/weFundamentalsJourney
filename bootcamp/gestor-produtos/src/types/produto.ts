/**
 * ============================================================================
 * TIPOS DO DOMÍNIO "PRODUTO"
 * ============================================================================
 * Este ficheiro concentra os tipos principais da aplicação.
 *
 * Conceitos de TypeScript demonstrados aqui:
 *  - as const
 *  - typeof
 *  - Indexed Access Types
 *  - Enum (comparado com Union Types)
 *  - Interface e Type Alias
 *  - Utility Types: Omit, Partial, Required, Pick, Readonly, Record
 *  - keyof
 *  - Mapped Types
 *  - Template Literal Types
 *  - Conditional Types + infer
 */

// ---------------------------------------------------------------------------
// 1. CATEGORIAS VÁLIDAS
// ---------------------------------------------------------------------------

// O "as const" impede que os valores sejam tratados como strings genéricas.
// Assim, o TypeScript mantém os valores literais das categorias.
export const CATEGORIAS = ["mercearia", "bebidas", "limpeza"] as const;

// "typeof CATEGORIAS" devolve o tipo do array.
// "[number]" é um Indexed Access Type: vai buscar o tipo de cada elemento.
// Resultado: "mercearia" | "bebidas" | "limpeza".
export type Categoria = (typeof CATEGORIAS)[number];

// ---------------------------------------------------------------------------
// 2. ENUM vs UNION TYPE
// ---------------------------------------------------------------------------

/**
 * Um ENUM gera código JavaScript (existe em tempo de execução).
 * É útil quando precisamos de percorrer os valores ou usá-los como objecto.
 */
export enum EstadoProduto {
  Activo = "activo",
  Esgotado = "esgotado",
  Descontinuado = "descontinuado",
}

/**
 * Uma UNION TYPE existe apenas em tempo de compilação (não gera JavaScript).
 * É mais leve, mais rápida e combina muito bem com "as const".
 *
 * Em resumo: usamos enum quando queremos um valor real no código;
 * usamos union type quando só precisamos de restringir o tipo.
 */
export type Estado = "activo" | "esgotado" | "descontinuado";

// Array de estados possíveis. "readonly" impede alterações acidentais.
export const ESTADOS: readonly Estado[] = ["activo", "esgotado", "descontinuado"];

// ---------------------------------------------------------------------------
// 3. INTERFACE PRINCIPAL
// ---------------------------------------------------------------------------

/**
 * Descreve um produto da loja.
 * Uma interface é ideal para descrever a "forma" de um objecto.
 */
export interface Produto {
  /** Identificador único, gerado automaticamente. "readonly" = nunca muda. */
  readonly id: number;
  /** Nome comercial do produto (mínimo 2 caracteres). */
  nome: string;
  /** Preço em meticais (MZN). Tem de ser positivo. */
  precoMT: number;
  /** Uma das categorias permitidas. */
  categoria: Categoria;
  /** Descrição livre. O "?" torna o campo opcional. */
  descricao?: string;
}

// ---------------------------------------------------------------------------
// 4. TYPE ALIASES E UTILITY TYPES
// ---------------------------------------------------------------------------

/**
 * "Omit" cria um tipo igual a Produto, mas sem a propriedade "id".
 * Usamos este tipo quando o utilizador cria um produto: o id é gerado por nós.
 */
export type NovoProduto = Omit<Produto, "id">;

/**
 * "Partial" torna todas as propriedades opcionais.
 * Perfeito para actualizações: só enviamos os campos que queremos mudar.
 */
export type ActualizacaoProduto = Partial<NovoProduto>;

/**
 * "Required" faz o contrário de Partial: obriga a preencher tudo.
 * Útil quando queremos garantir que a descrição já foi preenchida.
 */
export type ProdutoCompleto = Required<Produto>;

/**
 * "Pick" escolhe apenas algumas propriedades.
 * Aqui criamos um tipo só com o essencial para identificar um produto.
 */
export type IdentificacaoProduto = Pick<Produto, "id" | "nome">;

/**
 * "Readonly" impede alterações depois de o objecto ser criado.
 */
export type ProdutoImutavel = Readonly<Produto>;

/**
 * "Record" cria um objecto em que as chaves são de um tipo
 * e os valores de outro. Aqui: uma etiqueta legível por categoria.
 */
export type EtiquetaPorCategoria = Record<Categoria, string>;

// ---------------------------------------------------------------------------
// 5. keyof E INDEXED ACCESS TYPES
// ---------------------------------------------------------------------------

// "keyof Produto" devolve a união dos nomes das propriedades:
// "id" | "nome" | "precoMT" | "categoria" | "descricao".
export type ChaveDoProduto = keyof Produto;

// Indexed Access Type: extrai o tipo de uma propriedade específica.
export type PrecoDoProduto = Produto["precoMT"]; // -> number
export type NomeDoProduto = Produto["nome"]; // -> string

// ---------------------------------------------------------------------------
// 6. TEMPLATE LITERAL TYPES
// ---------------------------------------------------------------------------

// Um Template Literal Type constrói novos tipos de texto a partir de outros.
// Aqui geramos chaves como "categoria:mercearia".
export type ChaveDeCategoria = `categoria:${Categoria}`;

// Código legível para apresentar no terminal, por exemplo "PROD-7".
export type CodigoProduto = `PROD-${number}`;

// ---------------------------------------------------------------------------
// 7. CONDITIONAL TYPES, infer E never
// ---------------------------------------------------------------------------

/**
 * Conditional Type: "T extends X ? A : B".
 * Com "infer" conseguimos capturar o tipo interno de um array.
 * Se T não for um array, o resultado é "never" (nenhum valor possível).
 */
export type ElementoDoArray<T> = T extends readonly (infer U)[] ? U : never;

/**
 * Exemplo simples de "never": só tipos que sejam texto sobrevivem.
 * Para qualquer outro tipo o resultado é "never".
 */
export type ApenasTexto<T> = T extends string ? T : never;

// ---------------------------------------------------------------------------
// 8. MAPPED TYPES
// ---------------------------------------------------------------------------

/**
 * Mapped Type: percorre todas as chaves de Produto e transforma os valores.
 * Aqui convertemos tudo para texto (útil para mostrar num ecrã).
 * O "-?" remove a opcionalidade: todos os campos passam a ser obrigatórios.
 */
export type ProdutoEmTexto = {
  readonly [Chave in keyof Produto]-?: string;
};

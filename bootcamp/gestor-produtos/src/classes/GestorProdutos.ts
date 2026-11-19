/**
 * ============================================================================
 * CLASSE "GestorProdutos"
 * ============================================================================
 * É o coração da aplicação: guarda os produtos e aplica as regras de negócio.
 *
 * Conceitos demonstrados:
 *  - "extends" (herança) e "implements" (contrato)
 *  - interface como contrato
 *  - private, protected, readonly, static
 *  - campos privados com "#"
 *  - getters e setters
 *  - generics com "keyof" e Indexed Access Types
 *  - Resultado<T> em vez de excepções
 */

import { Documento } from "./Documento.ts";

import type { ActualizacaoProduto, NovoProduto, Produto, Resultado } from "../types/index.ts";

/**
 * Interface que define o CONTRATO de uma colecção de produtos.
 * Qualquer classe que a implemente tem de ter exactamente estes métodos.
 */
export interface ColeccaoDeProdutos {
  adicionar(produto: NovoProduto): Resultado<Produto>;
  listar(): readonly Produto[];
  buscar(id: number): Resultado<Produto>;
  actualizar(id: number, dados: ActualizacaoProduto): Resultado<Produto>;
  remover(id: number): Resultado<Produto>;
  calcularInventario(): number;
}

export class GestorProdutos extends Documento implements ColeccaoDeProdutos {
  /**
   * Campo ESTÁTICO e privado: conta quantos gestores foram criados.
   * O "#" junta as duas ideias: é da classe e é inacessível de fora.
   */
  static #contadorDeInstancias = 0;

  /** Mapa de produtos por id. O "#" torna-o privado. */
  #produtos = new Map<number, Produto>();

  /** Próximo id a usar. Começa em 1 e nunca volta atrás. */
  #proximoId = 1;

  /** Nome da loja, guardado numa propriedade privada normal. */
  private _nomeDaLoja: string;

  constructor(nomeDaLoja: string) {
    // Chamamos o construtor da classe base (Documento).
    super("Gestor de Produtos", 0);
    GestorProdutos.#contadorDeInstancias += 1;
    this._nomeDaLoja = nomeDaLoja;
    this.registar(`Gestor criado para a loja "${nomeDaLoja}".`);
  }

  /** Getter estático: permite ler o contador sem o poder alterar. */
  static get instanciasCriadas(): number {
    return GestorProdutos.#contadorDeInstancias;
  }

  /** Getter do nome da loja. */
  get nomeDaLoja(): string {
    return this._nomeDaLoja;
  }

  /**
   * Setter com validação: nunca deixamos entrar um nome inválido.
   * Ao ler "gestor.nomeDaLoja = '...'" o JavaScript chama este método.
   */
  set nomeDaLoja(novoNome: string) {
    const limpo = novoNome.trim();
    if (limpo.length < 2) {
      throw new Error("O nome da loja deve ter pelo menos 2 caracteres.");
    }
    this._nomeDaLoja = limpo;
  }

  /** Quantidade de produtos guardados. */
  get quantidade(): number {
    return this.#produtos.size;
  }

  /**
   * Cria um produto novo. Recebe os dados JÁ VALIDADOS (NovoProduto).
   * Devolve: Resultado<Produto> com o produto criado (com id).
   */
  adicionar(produto: NovoProduto): Resultado<Produto> {
    const id = this.#proximoId;
    this.#proximoId += 1;

    const novo: Produto = {
      id,
      nome: produto.nome,
      precoMT: produto.precoMT,
      categoria: produto.categoria,
      // Só incluímos "descricao" se ela existir.
      // Isto é necessário porque o tsconfig usa "exactOptionalPropertyTypes".
      ...(produto.descricao !== undefined ? { descricao: produto.descricao } : {}),
    };

    this.#produtos.set(id, novo);
    this.registar(`Produto ${id} ("${novo.nome}") adicionado.`);

    return { sucesso: true, dados: novo };
  }

  /** Devolve uma cópia da lista de produtos (ninguém mexe na lista interna). */
  listar(): readonly Produto[] {
    return [...this.#produtos.values()];
  }

  /**
   * Procura um produto pelo id.
   * Devolve: Resultado<Produto> — sucesso com o produto, ou erro se não existir.
   */
  buscar(id: number): Resultado<Produto> {
    const produto = this.#produtos.get(id);

    if (produto === undefined) {
      return { sucesso: false, erro: `Não existe nenhum produto com o id ${id}.` };
    }

    return { sucesso: true, dados: produto };
  }

  /**
   * Actualiza apenas os campos enviados em "dados".
   * Devolve: Resultado<Produto> com o produto actualizado.
   */
  actualizar(id: number, dados: ActualizacaoProduto): Resultado<Produto> {
    const encontrado = this.buscar(id);

    // Se a busca falhou, devolvemos o mesmo erro (reaproveitamos o resultado).
    if (!encontrado.sucesso) {
      return encontrado;
    }

    const actual = encontrado.dados;

    // Calculamos a nova descrição fora do objecto para podermos testar "undefined".
    const descricao = dados.descricao ?? actual.descricao;

    const actualizado: Produto = {
      // "??" usa o valor novo se existir, senão mantém o antigo.
      id: actual.id,
      nome: dados.nome ?? actual.nome,
      precoMT: dados.precoMT ?? actual.precoMT,
      categoria: dados.categoria ?? actual.categoria,
      ...(descricao !== undefined ? { descricao } : {}),
    };

    this.#produtos.set(id, actualizado);
    // "registar" vem da classe Documento e é "protected":
    // só pode ser usado dentro da hierarquia de classes.
    this.registar(`Produto ${id} actualizado.`);

    return { sucesso: true, dados: actualizado };
  }

  /** Remove um produto e devolve o produto que foi removido. */
  remover(id: number): Resultado<Produto> {
    const produto = this.#produtos.get(id);

    if (produto === undefined) {
      return { sucesso: false, erro: `Não existe nenhum produto com o id ${id}.` };
    }

    this.#produtos.delete(id);
    this.registar(`Produto ${id} removido.`);

    return { sucesso: true, dados: produto };
  }

  /**
   * Calcula o valor total do inventário: soma dos preços de todos os produtos.
   * Devolve: number (0 se não houver produtos).
   */
  calcularInventario(): number {
    // reduce percorre a lista e acumula a soma.
    return this.listar().reduce((total, produto) => total + produto.precoMT, 0);
  }

  /**
   * Procura por qualquer campo do produto.
   * "K extends keyof Produto" garante que só aceitamos campos que existem.
   * "Produto[K]" é um Indexed Access Type: o tipo do valor tem de coincidir.
   */
  buscarPorCampo<K extends keyof Produto>(campo: K, valor: Produto[K]): readonly Produto[] {
    return this.listar().filter((produto) => produto[campo] === valor);
  }

  /**
   * Implementação do método abstracto de Documento.
   * Devolve: string com um resumo legível.
   */
  resumo(): string {
    return `Loja "${this._nomeDaLoja}" — ${this.quantidade} produto(s) em stock.`;
  }
}

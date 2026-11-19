/**
 * ============================================================================
 * CLASSE ABSTRACTA "Documento"
 * ============================================================================
 * Serve de base para outras classes. Não pode ser instanciada directamente
 * (não podemos fazer "new Documento(...)").
 *
 * Conceitos demonstrados:
 *  - classes abstractas e métodos abstractos
 *  - public, private, protected
 *  - readonly
 *  - static
 *  - campos privados com "#" (privacidade real, em tempo de execução)
 *  - getters e setters
 *  - Parameter Properties (modificador no parâmetro do construtor)
 */

import type { Registo } from "servico-de-registos";

export abstract class Documento {
  /**
   * Propriedade ESTÁTICA: pertence à classe e não a cada instância.
   * Acedemos a ela com "Documento.versao".
   */
  static readonly versao = "1.0.0";

  /**
   * Campo PRIVADO com "#". Só o código desta classe lhe pode tocar.
   * Nem as subclasses conseguem aceder-lhe.
   */
  #criadoEm: Date;

  /** Histórico de alterações guardado em memória (campo privado). */
  #historico: Registo[] = [];

  /**
   * "protected readonly id": as subclasses vêem o campo, mas ninguém o altera.
   */
  protected readonly id: number;

  /**
   * Parameter Property: escrever "public readonly titulo" no parâmetro
   * cria automaticamente a propriedade "titulo" e atribui-lhe o valor.
   */
  constructor(
    public readonly titulo: string,
    id: number,
  ) {
    this.id = id;
    this.#criadoEm = new Date();
  }

  /** Getter: expõe a data de criação sem permitir alterações. */
  get criadoEm(): Date {
    return this.#criadoEm;
  }

  /** Getter para o identificador (o campo em si é "protected"). */
  get identificador(): number {
    return this.id;
  }

  /** Getter do histórico. Devolvemos "readonly" para ninguém o modificar. */
  get historico(): readonly Registo[] {
    return this.#historico;
  }

  /**
   * Setter com validação: um setter permite controlar o que entra.
   * Aqui substituímos o histórico por uma cópia (nunca guardamos a referência).
   */
  set historico(registos: readonly Registo[]) {
    this.#historico = [...registos];
  }

  /** Adiciona um registo ao histórico (método auxiliar "protected"). */
  protected registar(mensagem: string): void {
    this.#historico.push({
      id: this.#historico.length + 1,
      mensagem,
      criadoEm: new Date().toISOString(),
    });
  }

  /**
   * Método ABSTRACTO: não tem corpo aqui.
   * Cada subclasse é OBRIGADA a implementá-lo.
   */
  abstract resumo(): string;

  /** Método concreto, partilhado por todas as subclasses. */
  descrever(): string {
    return `${this.resumo()} (criado em ${this.#criadoEm.toLocaleString("pt-PT")})`;
  }
}

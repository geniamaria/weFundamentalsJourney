/**
 * ============================================================================
 * DECLARAÇÕES DE TIPOS (.d.ts)
 * ============================================================================
 * Um ficheiro ".d.ts" só contém TIPOS: não gera nenhum JavaScript.
 * Serve para descrever código que já existe noutro sítio, por exemplo:
 *   - uma biblioteca externa sem tipos próprios;
 *   - variáveis globais criadas pelo ambiente.
 *
 * Estes ficheiros são lidos pelo TypeScript mas não são executados.
 */

// ---------------------------------------------------------------------------
// 1. MÓDULO EXTERNO
// ---------------------------------------------------------------------------
// Imagine-se uma biblioteca "servico-de-registos" que guarda auditoria.
// Se ela não trouxer tipos, nós descrevemo-los aqui.
// Depois basta fazer: import type { Registo } from "servico-de-registos";
declare module "servico-de-registos" {
  /** Um registo de auditoria guardado pela biblioteca externa. */
  export interface Registo {
    /** Número sequencial do registo. */
    readonly id: number;
    /** Texto que descreve o que aconteceu. */
    readonly mensagem: string;
    /** Data/hora em formato ISO 8601. */
    readonly criadoEm: string;
  }

  /** Cria um novo registo a partir de uma mensagem. */
  export function criarRegisto(mensagem: string): Registo;
}

// ---------------------------------------------------------------------------
// 2. TIPOS GLOBAIS
// ---------------------------------------------------------------------------
// Um "declare namespace" cria um espaço de nomes global.
// Como este ficheiro não tem "import"/"export", é um script global.
declare namespace Aplicacao {
  /** Metadados que descrevem a aplicação no terminal. */
  interface Metadados {
    readonly nome: string;
    readonly versao: string;
    readonly autor: string;
  }
}

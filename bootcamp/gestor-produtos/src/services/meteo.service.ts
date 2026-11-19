/**
 * ============================================================================
 * SERVIÇO DE METEOROLOGIA (API Open-Meteo)
 * ============================================================================
 * Funcionalidade independente da gestão de produtos.
 * Demonstra como consumir uma API externa com segurança de tipos.
 *
 * Conceitos demonstrados:
 *  - fetch
 *  - Promise e async/await
 *  - unknown (a resposta da API não é de confiança)
 *  - Zod para validar a resposta (z.object + z.infer)
 *  - tratamento de erros HTTP e de validação
 *  - Resultado<T> em vez de excepções
 */

import { z } from "zod";

import type { Resultado } from "../types/index.ts";
import { validarComSchema } from "../utils/validadores.ts";

/**
 * Coordenadas de Maputo (Moçambique).
 * "as const" mantém os valores como literais e impede alterações.
 */
export const COORDENADAS_MAPUTO = {
  latitude: -25.9655,
  longitude: 32.5832,
  cidade: "Maputo",
} as const;

/**
 * Endereço base da API Open-Meteo.
 * Está numa constante para poder ser substituído nos testes.
 */
export const URL_DA_API_METEO = "https://api.open-meteo.com/v1/forecast";

/**
 * Schema que descreve APENAS a parte da resposta que nos interessa.
 * O Zod ignora tudo o resto (latitude, longitude, unidades, etc.).
 */
const previsaoSchema = z.object({
  current: z.object({
    time: z.string(),
    temperature_2m: z.number(),
    wind_speed_10m: z.number(),
  }),
});

/** "z.infer" cria o tipo TypeScript a partir do schema. */
export type Previsao = z.infer<typeof previsaoSchema>;

/**
 * Consulta a temperatura e a velocidade do vento em Maputo.
 *
 * Devolve: Promise<Resultado<Previsao>>.
 * Como é assíncrona, o resultado só está pronto depois do "await".
 *
 * O parâmetro "url" tem um valor por omissão: em produção usa sempre a API
 * verdadeira, mas os testes podem apontar para outro endereço.
 */
export async function consultarMeteorologiaMaputo(
  url: string = URL_DA_API_METEO,
): Promise<Resultado<Previsao>> {
  // URLSearchParams constrói a "query string" sem erros de escrita.
  const parametros = new URLSearchParams({
    latitude: String(COORDENADAS_MAPUTO.latitude),
    longitude: String(COORDENADAS_MAPUTO.longitude),
    current: "temperature_2m,wind_speed_10m",
    timezone: "Africa/Maputo",
  });

  const endereco = `${url}?${parametros.toString()}`;

  try {
    // "await" espera pela resposta da rede sem bloquear o resto do programa.
    const resposta = await fetch(endereco);

    // Erros HTTP (404, 500, ...) não lançam excepção: temos de os verificar.
    if (!resposta.ok) {
      return {
        sucesso: false,
        erro: `A API respondeu com o estado HTTP ${resposta.status} (${resposta.statusText}).`,
      };
    }

    // A resposta do fetch é "unknown": ainda não sabemos a sua forma.
    const dados: unknown = await resposta.json();

    // Só depois de o Zod validar é que confiamos nos dados.
    return validarComSchema(previsaoSchema, dados);
  } catch (erro) {
    // Em TypeScript, o erro de um "catch" é "unknown" por segurança.
    const mensagem = erro instanceof Error ? erro.message : String(erro);
    return { sucesso: false, erro: `Falha na comunicação com a API: ${mensagem}` };
  }
}

/**
 * Devolve uma frase pronta a mostrar no terminal.
 * Devolve: string (mesmo quando ocorre um erro).
 */
export async function descreverMeteorologiaMaputo(): Promise<string> {
  const resultado = await consultarMeteorologiaMaputo();

  if (!resultado.sucesso) {
    return `Não foi possível obter a meteorologia: ${resultado.erro}`;
  }

  const { current } = resultado.dados;
  const dataLegivel = new Date(current.time).toLocaleString("pt-PT");

  return [
    `Meteorologia em ${COORDENADAS_MAPUTO.cidade}`,
    `  Temperatura: ${current.temperature_2m} °C`,
    `  Vento: ${current.wind_speed_10m} km/h`,
    `  Observado em: ${dataLegivel}`,
  ].join("\n");
}

// Permite executar este ficheiro directamente: "npm run meteo".
// O "import.meta.url" compara o ficheiro actual com o que o Node está a correr.
if (process.argv[1]?.endsWith("meteo.service.ts") === true) {
  const texto = await descreverMeteorologiaMaputo();
  console.log(texto);
}

// agruparPor<T, K extends keyof T>(lista, campo) — devolve um Map com os itens agrupados pelo valor do campo.


function agruparPor<T, K extends keyof T>(
  lista: T[],
  campo: K
): Map<T[K], T[]> {

  const resultado = new Map<T[K], T[]>();

  for (const item of lista) {
    const chave = item[campo];

    const grupo = resultado.get(chave) ?? [];

    grupo.push(item);

    resultado.set(chave, grupo);
  }

  return resultado;
}
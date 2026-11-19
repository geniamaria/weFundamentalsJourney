//Escreva lerNumero(texto: string): number que lança um erro (função never) quando o texto não é um número válido.
function falhar(mensagem: string): never {
  throw new Error(mensagem);
}

function lerNumero(texto: string): number {
    const numero = Number(texto);
    if (isNaN(numero)) {
        falhar("O texto não é um número válido!");
    }
    return numero;
}



//Reescreva três funções do módulo de JavaScript Avançado com anotações apenas nas fronteiras e confirme os tipos inferidos no editor.
  //funcao 1
type Produto = {
  id: number;
  preco: number;
};

const IVA = 0.17;

const comIva = (p: Produto) => {
  const total = p.preco * (1 + IVA);
  return total;
};
//funcao 2
function somar(a: number, b: number) {
  const resultado = a + b;
  return resultado;
}
//funcao 3
class Produtos {
  constructor(
    public nome: string,
    public preco: number
  ) {}

  mostrarPreco() {
    const valor = this.preco;
    return valor;
  }
}

//Modele com tuplos o resultado de uma pesquisa paginada: [itens, total, temSeguinte] com nomes em cada posição.

// type ResultadoPaginado<T> = [
//   itens: T[],
//   total: number,
//   temSeguinte: boolean
// ];
//  type Produto = {
//   id: number;
//   nome: string;
// };

// const resultado: ResultadoPaginado<Produto> = [
//   [
//     { id: 1, nome: "Computador" },
//     { id: 2, nome: "Teclado" }
//   ],
//   50,
//   true
// ];

//Escreva uma função que recebe unknown e devolve o preço em MT se o valor for um objecto com preco numérico, ou null caso contrário.

function obterPreco(valor: unknown): number | null {
  if (
    typeof valor === "object" &&
    valor !== null &&
    "preco" in valor &&
    typeof valor.preco === "number"
  ) {
    return valor.preco;
  }

  return null;
}
//Criar Produto (id só de leitura, nome, preço em MT, categoria como união de literais e descrição opcional).
type Produto = {
    readonly id: number;
    nome: string;
    preco: number;
    categoria: "eletrónica" | "roupa" | "alimentos";
    descricao?: string;
  };

  //Criar Cliente com nome, cidade (união de literais de cidades moçambicanas), telefone e número de BI.
type Cliente = {
    nome: string;
    cidade: "Maputo" | "Beira" | "Nampula" | "Tete" | "Quelimane";
    telefone: string;
    bi: string;
  };

//Escrever o predicado eBiValido(texto: string) que verifica o formato do BI: 12 dígitos seguidos de uma letra (/^[0-9]{12}[A-Z]$/).
function eBiValido(texto: string): boolean {
  const regex = /^[0-9]{12}[A-Z]$/;
  return regex.test(texto);
}

//Modelar Encomenda como união discriminada: pendente, paga (com método de pagamento), enviada (com data) e cancelada (com motivo).
type Encomenda =
  | {
      estado: "pendente";
      total: number;
    }
  | {
      estado: "paga";
      total: number;
      metodoPagamento: string;
    }
  | {
      estado: "enviada";
      total: number;
      data: Date;
    }
  | {
      estado: "cancelada";
      total: number;
      motivo: string;
    };


 //Escrever totalEncomenda e podeCancelar(e: Encomenda): boolean usando narrowing — sem as e sem !.
function totalEncomenda(e: Encomenda): number {
  return e.total;
}

function podeCancelar(e: Encomenda): boolean {
  if (e.estado === "pendente") {
    return true;
  }

  if (e.estado === "paga") {
    return true;
  }

  return false;
}   

const encomenda: Encomenda = {
  estado: "pendente",
  total: 2500
};

console.log(totalEncomenda(encomenda)); 

console.log(podeCancelar(encomenda)); 

function formatarEstado(e: Encomenda): string {
  switch (e.estado) {
    case "pendente":
      return "Aguardando pagamento";

    case "paga":
      return `Paga via ${e.metodoPagamento}`;

    case "enviada":
      return `Enviada em ${e.data.toLocaleDateString()}`;

    case "cancelada":
      return `Cancelada: ${e.motivo}`;

    default:
      return verificarEstado(e);
  }
}

function verificarEstado(e: never): string {
    throw new Error("Function not implemented.");
}

//Escreva uma função copiarEncomenda(encomenda) que devolve uma cópia 
// em que alterar o total não altera o original. Prove-o com console.log.

// const order={
//     nameproduct:"camisa",
//     unitPrice:100,
//     quantity:2,
//     total:100
   
// }
// function copiarEncomenda( order){
//     const copyorder = {...order, total:200};
//     return copyorder;
// }
// console.log(order);
// console.log(copiarEncomenda(order));

//Dado const loja = { nome: "Beira Shop", contacto: { telefone: null } },
//  obtenha o email com ?. e ??, mostrando "Sem email" quando não existir.

const store={ 
    name:"beira Shop",
    cell:{
        telefone:null,
        email:"mariagenia@gmail.com"
    }
}
const getEmail=store.cell?.email??"sem email";
console.log(getEmail)
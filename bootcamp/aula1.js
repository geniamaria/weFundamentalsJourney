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

// const store={ 
//     name:"beira Shop",
//     cell:{
//         telefone:null,
//         email:"mariagenia@gmail.com"
//     }
// }
// const getEmail=store.cell?.email??"sem email";
// console.log(getEmail)

//Crie estatisticas(...valores) que devolve { minimo, maximo, media } e chame-a com spread a partir de um array de preços em MT.
const valores=[ 1,2,3,4,5,6,7 ]
 function estatisticas(...valores){
   //  const value=[...valores]
    if(value.length===0){
      return{min:null, max:null, media:0}
    }
     const max= Math.max(...valores);
      const min= Math.min(...valores);
       const media= valores.reduce((sun,n)=>soma+n,0)/valores.length;

       return{max,min,media};
 }

 //Reescreva uma função com 5 parâmetros posicionais para receber um único objecto desestruturado com valores por omissão.
//Divida o exercício anterior em dois módulos (calculos.js e main.js) e execute-o com node --watch
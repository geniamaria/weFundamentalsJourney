//Para cada compra, chamar a função e mostrar na consola o total, o desconto aplicado e o valor final, com template literals.

let total=[5000,1000,200,3000,100,1000];
let nClientes=0;

 function calcularDesconto(total){    
    let desconto=0;
    let valorAPagar=0;

    if(total >= 5000){

        desconto = total*0.15;
        valorAPagar= total-desconto;
         nClientes++;

    }else if(total >= 1000){

         desconto=total*0.5;
         valorAPagar = total-desconto;
          nClientes++;
    }else{

         valorAPagar = total;
    }
    return { total, desconto, valorAPagar };
 }
 for( let compra of total ){
    
    let resultado = calcularDesconto(compra);
   
     console.log(`
        Total: ${resultado.compra}
        Desconto aplicado: ${resultado.desconto}
        Valor final: ${resultado.valorAPagar}
    `);
   } 
console.log(`Os clientes com desconto são: ${nClientes}`);

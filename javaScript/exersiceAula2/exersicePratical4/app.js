//Para cada compra, chamar a função e mostrar na consola o total, o desconto aplicado e o valor final, com template literals.

let total=[5000,1000,2000,100,500,50,10,5,1];


 function calcularDesconto(total){ 
     let desconto=0;
     let valorAPagar=0;  

    if(total >= 5000){
        desconto = total*0.15;
        valorAPagar= total-desconto;
    }else if(total >= 1000){
         desconto=total*0.5;
         valorAPagar = total - desconto;
    }else{
         valorAPagar = total;
    }
    return { total, desconto, valorAPagar };
 }
 for( let compra of total ){
     let resultado = calcularDesconto(compra);
    

      console.log(`O total ${resultado.total} 
          o desconto aplicado e ${resultado.desconto} 
          o valor final ${resultado.valorAPagar}`);

   
}

 

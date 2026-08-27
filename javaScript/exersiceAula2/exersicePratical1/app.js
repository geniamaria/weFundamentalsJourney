//Criar uma função calcularDesconto(total) que devolve 15% para totais acima de 5 000 MT, 5% acima de 1 000 MT, e 0% abaixo disso.
 function calcularDesconto(total){
   
    let valorPagar;

    total>=5000
        valorPagar=total-(total*0.15);
    total>=1000
         valorPagar= total-(total*0.5);
    
         valorPagar=total;
    valorPagar;
 }
 console.log(calcularDesconto(5000));
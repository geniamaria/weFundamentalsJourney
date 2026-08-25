//Usar if / else if / else dentro da função e devolver o valor com return — nunca imprimir lá dentro.
//Criar uma função calcularDesconto(total) que devolve 15% para totais acima de 5 000 MT, 5% acima de 1 000 MT, e 0% abaixo disso.
 function calcularDesconto(total){
    //vai receber um paramentro que e o total, vai comparar para saber qual e o descononto que vai receber.
    let valorPagar;

    if(total>=5000){
        valorPagar=total-(total*0.15);
    }else if(total>=1000){
         valorPagar= total-(total*0.5);
    }else{
         valorPagar=total;
    }
    return valorPagar;
 }
 console.log(calcularDesconto(5000));

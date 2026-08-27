//Escreva uma função que receba um número e devolva “par” ou “ímpar”, usando o operador %.
 function verificarNumero(numero){
    if(numero%2===0){
        console.log("numero par")
    }else{
        console.log("numero impar");
    }
 }
 console.log(verificarNumero(6))
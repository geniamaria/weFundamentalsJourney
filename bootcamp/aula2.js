// // Escreva criarCofre(codigo) que devolve { abrir(tentativa), estado() }. 
// // Após 3 tentativas falhadas o cofre bloqueia. O código nunca pode ser lido de fora.
 
// function criarCofre(codigo){
//     let tentativas=0;
//     let block= false;

//     return{
//         OPEN(tentativa){
//              if(block){
//             return" esta bloqueidado";
//         }
//         if(tentativa===codigo){
//             tentativas=0;
//             return"cofre aberto";

//         }else{
//             tentativas++;
//         }
//         if (tentativas>=3){
//             block=true;
//             return"3 tentativas falhadas"
//         }
//     }

//         }
       
// }
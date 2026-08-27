//Escreva cinco comparações com === e || e preveja o resultado de cada uma antes de a correr na consola.

let idade=20;
let nome="maria";
let nota=2;
let media=14;
//comparacao so de idade;
console.log(idade==20)// verdadeiro
console.log(idade===20)// verdadeiro comparar tambem o tipo de dado
console.log(idade=="20")// Verdadeiro
console.log(idade==="20")// Falso

//comparacao so de nome;
console.log(nome==="20")// Falso
console.log(nome==="maria")// Verdadeiro
console.log(nome===20)// Falso

//comparacao de notas usando ||
console.log( nota>=12 || media<=14);// so precisa de uma condico verdadeira para ser cumprida.

//operador ternario ?

let eleitor=(idade>=21)? "pode votar":"nao pode votar";

console.log(eleitor);
// Reescreva três acessos a propriedades aninhadas usando destructuring e optional chaining.

const city={
    nome:"Matola",
    bairros:["intaka", "kaia", "nacala"],
    populacao: 1000000,
    clima:{
        temperatura: 30,},
    Descrever(){
        return `A cidade de ${this.nome} tem uma população de ${this.populacao} habitantes e uma temperatura média de ${this.clima.temperatura}°C.`;
    }
}
const { nome, populacao, clima: { temperatura } } = city;
console.log(nome, populacao, clima?.temperatura);
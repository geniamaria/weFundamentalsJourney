//Crie um objecto que descreva a sua própria cidade, com pelo menos um objecto aninhado e um método.
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
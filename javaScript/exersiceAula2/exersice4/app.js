//Crie uma função conversor(meticais) que devolva o valor em dólares, assumindo 1 USD = 64 MT.
 function adivarter(meticais) {
    const exchangeRate= 64;
    let valueInDollars = meticais *  exchangeRate;
    return valueInDollars;
}
console.log(adivarter(1));
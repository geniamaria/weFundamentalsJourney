//Dado um array de dez preços, crie com map um novo array com todos os preços aumentados em 10%.
const prices = [200,90,80,70,60,50,40,30,20,10];
const increasedPrices = prices.map(price => price * 1.1);
console.log(increasedPrices);

 //Percorra um array de dez notas e use continue para ignorar as negativas, contando apenas as positivas.
 const notes = [7, -3, 5, 10, -1, 8, 4, -2, 9, 6];
let sum = 0;
let count = 0;

for (let i = 0; i < notes.length; i++) {
    if (notes[i] < 0) {
        continue; 
    }
    sum += notes[i];
    count++;
}
console.log("A Soma das notas positivas:", sum);
console.log("A Quantidade de notas positivas:", count);
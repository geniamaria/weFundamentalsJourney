//Criar um array com cinco valores de compra e percorrê-lo com um ciclo for…of.
const notas=[0,1,2,3,4,5];

for(const p of notas ){
    if (p===5)break;
    console.log(p);
}
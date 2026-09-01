//Use reduce para calcular o total de uma lista de compras com quantidade e preço unitário.
const products=[
    {name:`product1`, price:100,quant:2, stock:5},
     {name:`product2`, price:200,quant:3, stock:4},
      {name:`product3`, price:300,quant:4, stock:3},
       {name:`product4`,price:400,quant:5,  stock:2},
        {name:`product5`, price:500,quant:6, stock:0}
];

const totalProducts = products.reduce((s,products)=>s+products.price*products.quant,0);
console.log(`Total: ${totalProducts}`);


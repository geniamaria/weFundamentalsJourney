//Filtre de uma lista de produtos apenas os que têm stock maior que zero e mostre quantos são.
const products=[
    {name:`product1`, stock:5},
     {name:`product2`, stock:4},
      {name:`product3`, stock:3},
       {name:`product4`, stock:2},
        {name:`product5`, stock:0}
];

const productsInStock = products.filter(product => product.stock > 0);
console.log("Produtos em stock:", productsInStock.length);
console.log("Produtos em stock:", productsInStock);

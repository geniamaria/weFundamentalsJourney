// Criar um array com seis objectos de venda, cada um com produto, quantidade, precoUnitario e cidade.
const sales = [
    { produto: "Arroz", quantidade: 10, precoUnitario: 5.0, cidade: "Maputo" },
    { produto: "Feijão", quantidade: 5, precoUnitario: 8.0, cidade: "Maputo" },
    { produto: "Macarrão", quantidade: 8, precoUnitario: 3.0, cidade: "Maputo" },
    { produto: "Carne", quantidade: 3, precoUnitario: 20.0, cidade: "Maputo" },
    { produto: "Frango", quantidade: 4, precoUnitario: 15.0, cidade: "Maputo" },
    { produto: "Peixe", quantidade: 6, precoUnitario: 12.0, cidade: "Maputo" }
];

//Usar map para acrescentar a cada venda um campo total (quantidade × precoUnitario), sem alterar o array original.
const salesWithTotal = sales.map(sale => {
    return {
        ...sale,
        total: sale.quantidade * sale.precoUnitario
    };
});
console.log(salesWithTotal);

//Usar filter para obter apenas as vendas de Maputo e apenas as vendas acima de 1 000 MT.
const filteredSales = salesWithTotal.filter(sale => sale.cidade === "Maputo" && sale.total > 1000);

//Usar reduce para calcular a receita total, e depois a média por venda.
const totalRevenue = salesWithTotal.reduce((accumulator, sale) => accumulator + sale.total, 0);
console.log(totalRevenue);
const mediaSales = totalRevenue/salesWithTotal.length;
console.log(mediaSales);

//Aplicar destructuring dentro do forEach para imprimir um relatório linha a linha com template literals.
filteredSales.forEach(({ produto, quantidade, precoUnitario, cidade, total }) => {
    console.log(`Produto: ${produto}, Quantidade: ${quantidade}, Preço Unitário: ${precoUnitario}, Cidade: ${cidade}, Total: ${total}`);
});
function makeCar(name,price,quanty){

}

 function criarProduto(name,price=0,quanty=0 ,iva=0.17,
    totlaPrice=price*quanty*(1+iva)
 ){
    return{name,price,quanty,totlaPrice};
 }
 criarProduto("pasta",200,1);
 
 

 function removerProduto( name,price=0,quanty=0){

 }
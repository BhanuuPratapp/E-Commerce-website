if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready)
 
    
} else {
    ready()
   
}

function ready(){

 axios.get('http://localhost:3000/orders').then(response =>{

      if(response.status === 200)

      {
        
    response.data.ordersDetails.forEach(orders =>{
       
       orders.products.forEach(response =>{
        let ordersinnerhtml  = document.getElementById("order-items-id");
           
            let ordersinnerhtmtcontents = `<h1>OrderId: ${response.orderItems.orderId}</h1>
                               <ul>
                               <l1>Title: ${response.title}  Quantity: ${response.orderItems.quantity}</li>
                               </ul>
                               `
         ordersinnerhtml.innerHTML += ordersinnerhtmtcontents;

        })
    })
      }
      else{
        throw new Error("message");
      }
 }).catch(err => console.log(err))
}
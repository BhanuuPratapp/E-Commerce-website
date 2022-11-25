if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready)
  //  document.addEventListener('DOMContentLoaded', showCartItems)
    
} else {
    ready()
    //showCartItems()
}

   function ready() {
    const page =1;
    axios.get(`http://localhost:3000/products?page=${page}`).then(response =>{

          listProducts(response.data.products);    
          showPagination(response.data);
          showCartItems();
    }).catch(err => console.log(err));

    //document.getElementsByClassName('btn-purchase')[0].addEventListener('click', purchaseClicked)
    
   // document.getElementsByClassName('btn-danger').addEventListener('click', removeCartItems)
    

}
 

//var removeCartItemButtons = document.getElementsByClassName('btn-danger')

   window.addEventListener('click', () =>{
    var removeCartItemButtons = document.getElementsByClassName('btn-danger')
    for (var i = 0; i < removeCartItemButtons.length; i++) {
        var button = removeCartItemButtons[i]
        console.log(button)
    
       button.addEventListener('click', removeCartItem)
     
    }

   }) 
  


function removeCartItem(productId) {
  
var innerhtml  = document.getElementById("main-div");
innerhtml.parentNode.remove();

  axios.post('http://localhost:3000/cart-delete-item', {productId: productId}).then(response =>{
  console.log("Deleted cart product -------------> SUCCESSFULL")
 // console.log(response)
  }).catch(err => console.log(err));
  updateCartTotal();
}


var products = document.getElementsByClassName('btn-danger')
console.log("products-------------",products)

function purchaseClicked() {
    alert('Thank you for your purchase')
  
    var cartItems = document.getElementsByClassName('cart-items')[0]

    while (cartItems.hasChildNodes()) {
        cartItems.removeChild(cartItems.firstChild)
    }
    updateCartTotal();
}




function showPagination({
    currentPage,
    nextPage,
    hasNextPage,
    previousPage,
    hasPreviousPage,
    lastPage,

}){

    pagination.innerHTML ='';

    if(hasPreviousPage){
        const btn1 =  document.createElement("button");
        btn1.innerHTML = previousPage;
        btn1.addEventListener('click', () =>getProducts(previousPage));
        pagination.appendChild(btn1);
    }

    const btn2 =  document.createElement("button");
        btn2.innerHTML = `<h1>${currentPage}</h1>`;
      
        btn2.addEventListener('click', () =>getProducts(currentPage));
        pagination.appendChild(btn2);

     if(hasNextPage){
        const btn3 =  document.createElement("button");
        btn3.innerHTML = nextPage;
        btn3.addEventListener('click', () =>getProducts(nextPage));
        pagination.appendChild(btn3);
     }   

}

function getProducts(page){
    axios.get(`http://localhost:3000/products?page=${page}`).then(response =>{

          listProducts(response.data.products);    
          showPagination(response.data);
        
    }).catch(err => console.log(err))
}

function listProducts(products){
    
    const parentSection = document.getElementsByClassName('content-section');
    if(parentSection[0].innerHTML !== ''){
       //console.log(parentSection[0])
       parentSection[0].innerHTML = ''; 
    }
    //  console.log(parentSection[0])
      products.forEach(product =>{
        const productHTML = `
            <div>
            <h1>${product.title}</h1>
            <img src="${product.imageUrl}"></img>
            <button onclick="getUser(${product.id})">Add to cart</button>
             
            </div>
        `
      
        parentSection[0].innerHTML += productHTML;
      })
    
}

function getUser(productId){
    

    
    axios.post('http://localhost:3000/cart', {productId: productId}).then(response =>{
         if(response.request.status === 200){
              
               // console.log("response----------->",response);
              
                showCartItems(productId);
                notifyUsers(response.data.message)
         }
         else 
         {
            throw new Error(response.data.message);
         }
    }  
    ).catch((errMess) =>{
        notifyUsers(errMess);
        
    })
}


function showCartItems(prodId){
    var cartItems = document.getElementsByClassName('cart-items')[0]
    if(cartItems.innerHTML !== ''){
        cartItems.innerHTML = ''
    }

    var cartOrders = document.getElementsByClassName('cart-orders-button')[0];
    if(cartOrders.innerHTML !== ''){
        cartOrders.innerHTML = ''
    }
   
    axios.get('http://localhost:3000/cart').then(products =>{
        //console.log("products    ",products.data.products[0].title); 
  
    if(products.status === 200){
     //   console.log("products    ",products.cartItems.quantity);
       var cartOrders = document.getElementsByClassName('cart-orders-button')[0];
       var cartRows = document.createElement('div');
       cartRows.classList.add('cart-row');
       
    

        products.data.products.forEach(product => {
            var HTMLcontents = `<button class="btn btn-primary btn-purchase" type="button" onclick="orderNow('${decodeURIComponent(product.imageUrl)}','${encodeURIComponent(product.price)}','${decodeURIComponent(product.description)}','${encodeURIComponent(product.cartItems.quantity)}','${decodeURIComponent(product.title)}')">PURCHASE</button>`
          //  console.log("products    ",product.cartItems.quantity);

            var cartItems = document.getElementsByClassName('cart-items')[0];
          
            var cartRow = document.createElement('div');
            cartRow.classList.add('cart-row');
            var cartRowContents =  `
            <div id="main-div" class="cart-item cart-column">
                <img class="cart-item-image" src="${product.imageUrl}" width="100" height="100">
                <span class="cart-item-title">${product.title}</span>

            </div>
            <span class="cart-price cart-column">${product.price}</span>
            <div id="main-div" class="cart-quantity cart-column">
                <input class="cart-quantity-input" type="number" value=${product.cartItems.quantity}>
                <button class="btn btn-danger" type="button" onclick="removeCartItem(${product.id})">REMOVE</button>
            </div>`
         
    
          //  var removeInnerHTML = document.getElementsByClassName('cart-items')[0]
        //    console.log("elelelellelelel=======", removeInnerHTML.di)

            cartRow.innerHTML += cartRowContents;
            cartItems.append(cartRow);
            cartRows.innerHTML = HTMLcontents;
        })
       
      
        cartOrders.append(cartRows)
    }
}).catch(err => console.log(err))
updateCartTotal();
}



function orderNow( ){
    axios.post('http://localhost:3000/create-orders').then(response =>{
    console.log(response);


}).catch(err => console.log(err))

    
}


function updateCartTotal() {


    var total = 0;
    axios.get('http://localhost:3000/cart').then(product =>{
       
        product.data.products.forEach(product => {
     
        var price = product.price;
        console.log(price);
        var quantity =product.cartItems.quantity;
        console.log(quantity);
     
        total = total + (price * quantity)
        console.log(total)
    })
    total = Math.round(total * 100) / 100
    console.log(total)
    document.getElementsByClassName('cart-total-price')[0].innerText = '$' + total
})
    
}
 
function notifyUsers(message){
    const container = document.getElementById('container');
    const notification = document.createElement('div');
   // notification.style.backgroundColor = iserror ? 'red' : 'green';
    notification.style.backgroundColor = 'green';

    notification.classList.add('notification');
    notification.innerHTML = `<h4>${message}<h4>`;
    container.appendChild(notification);
    setTimeout(()=>{
        notification.remove();
    },2500)
}

/*

if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready)
} else {
    ready()
}

function ready() {
    axios.get('http://localhost:3000/products').then((data) =>{
        console.log(data);

       
    })
    var removeCartItemButtons = document.getElementsByClassName('btn-danger')
    
    for (var i = 0; i < removeCartItemButtons.length; i++) {
        var button = removeCartItemButtons[i]
        
        button.addEventListener('click', removeCartItem)
    }

    var quantityInputs = document.getElementsByClassName('cart-quantity-input')
    for (var i = 0; i < quantityInputs.length; i++) {
        var input = quantityInputs[i]
        input.addEventListener('change', quantityChanged)
    }

    var addToCartButtons = document.getElementsByClassName('shop-item-button')
    for (var i = 0; i < addToCartButtons.length; i++) {
        var button = addToCartButtons[i]
        button.addEventListener('click', addToCartClicked)
    }

    document.getElementsByClassName('btn-purchase')[0].addEventListener('click', purchaseClicked)
}

function purchaseClicked() {
    alert('Thank you for your purchase')
  
    var cartItems = document.getElementsByClassName('cart-items')[0]
    while (cartItems.hasChildNodes()) {
        cartItems.removeChild(cartItems.firstChild)
    }
    updateCartTotal()
}

function removeCartItem(event) {
    var buttonClicked = event.target
  
    buttonClicked.parentElement.parentElement.remove()
    updateCartTotal()
}

function quantityChanged(event) {
    var input = event.target
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1
    }
    updateCartTotal()
}

function addToCartClicked(event) {
    var button = event.target
    var shopItem = button.parentElement.parentElement
    var title = shopItem.getElementsByClassName('shop-item-title')[0].innerText
    var price = shopItem.getElementsByClassName('shop-item-price')[0].innerText
    var imageSrc = shopItem.getElementsByClassName('shop-item-image')[0].src
    addItemToCart(title, price, imageSrc)
    updateCartTotal()
}

function addItemToCart(title, price, imageSrc) {
    var cartRow = document.createElement('div')
    cartRow.classList.add('cart-row')
    var cartItems = document.getElementsByClassName('cart-items')[0]
    var cartItemNames = cartItems.getElementsByClassName('cart-item-title')
    for (var i = 0; i < cartItemNames.length; i++) {
        if (cartItemNames[i].innerText == title) {
            alert('This item is already added to the cart')
            return
        }
    }
    var cartRowContents = `
        <div class="cart-item cart-column">
            <img class="cart-item-image" src="${imageSrc}" width="100" height="100">
            <span class="cart-item-title">${title}</span>
        </div>
        <span class="cart-price cart-column">${price}</span>
        <div class="cart-quantity cart-column">
            <input class="cart-quantity-input" type="number" value="1">
            <button class="btn btn-danger" type="button">REMOVE</button>
        </div>`
    cartRow.innerHTML = cartRowContents
    cartItems.append(cartRow)
    cartRow.getElementsByClassName('btn-danger')[0].addEventListener('click', removeCartItem)
    cartRow.getElementsByClassName('cart-quantity-input')[0].addEventListener('change', quantityChanged)
}

function updateCartTotal() {
    var cartItemContainer = document.getElementsByClassName('cart-items')[0]
    var cartRows = cartItemContainer.getElementsByClassName('cart-row')
    var total = 0
    for (var i = 0; i < cartRows.length; i++) {
        var cartRow = cartRows[i]
        var priceElement = cartRow.getElementsByClassName('cart-price')[0]
        var quantityElement = cartRow.getElementsByClassName('cart-quantity-input')[0]
        var price = parseFloat(priceElement.innerText.replace('$', ''))
        var quantity = quantityElement.value
        total = total + (price * quantity)
    }
    total = Math.round(total * 100) / 100
    document.getElementsByClassName('cart-total-price')[0].innerText = '$' + total
}

*/

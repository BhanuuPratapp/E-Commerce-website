if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready)
} else {
    ready()
}

function ready() {
    axios.get('http://localhost:3000/products').then((data) =>{
        console.log(data);
        if(data.request.status === 200){
      const products = data.data.products;
      const parentSection = document.getElementsByClassName('content-section');
      console.log(parentSection[0])
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
    })
}

function getUser(productId){
    axios.post('http://localhost:3000/cart', {productId: productId}).then(response =>{
         if(response.request.status === 200){
            //    console.log(response.data.message)
              //  console.log(response.data.imageUrl)
                console.log(response.data.title)
                showCartItems();
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

function showCartItems(){
    axios.get('http://localhost:3000/cart').then(products =>{

      console.log(products.data.products);
      var cartRow = document.createElement('div');
      cartRow.classList.add('cart-row');
      var cartItems = document.getElementsByClassName('cart-items')[0];
      for(i=0;i<products.data.products.length;i++){
        console.log(products.data.products[i].title)
        var cartRowContents = `
        <div class="cart-item cart-column">
            <img class="cart-item-image" src="${products.data.products[i].imageUrl}" width="100" height="100">
            <span class="cart-item-title">${products.data.products[i].title}</span>
        </div>
        <span class="cart-price cart-column">${products.data.products[i].price}</span>
        <div class="cart-quantity cart-column">
            <input class="cart-quantity-input" type="number" value="1">
            <button class="btn btn-danger" type="button">REMOVE</button>
        </div>`
    cartRow.innerHTML = cartRowContents;
    cartItems.append(cartRow);
      }
     
      
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
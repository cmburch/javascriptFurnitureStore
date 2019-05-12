
// variables
const cartBtn = document.querySelector(".cart-btn");
const closeCartBtn = document.querySelector(".close-cart");
const clearCartBtn = document.querySelector(".clear-cart");
const cartDOM = document.querySelector(".cart");
const cartOverlay = document.querySelector(".cart-overlay");
const cartItems = document.querySelector(".cart-items");
const cartTotal = document.querySelector(".cart-total");
const cartContent = document.querySelector(".cart-content");
const productsDOM = document.querySelector(".products-center");//inject products into html

//cart
let cart = [];
//buttons
let buttonsDOM = [];
// products
class Products {
    async getProducts() {
      try {
        let result = await fetch('products.json');
        let data = await result.json();
        let products = data.items;
        products = products.map(item => {
          const { title, price } = item.fields;
          const { id } = item.sys;
          const image = item.fields.image.fields.file.url;
          return { title, price, id, image };
        });
        return products;
        } catch (error) {
        console.log(error);
      }
    }
  }

  //display products
  class UI {
    displayProducts(products) {
      let result = "";
      products.forEach(product => {
        result += `
     <!-- single product -->
          <article class="product">
            <div class="img-container">
              <img
                src=${product.image}
                alt="product"
                class="product-img"
              />
              <button class="bag-btn" data-id=${product.id}>
                <i class="fas fa-shopping-cart"></i>
                add to bag
              </button>
            </div>
            <h3>${product.title}</h3>
            <h4>$${product.price}</h4>
          </article>
          <!-- end of single product -->
     `;
      });
      productsDOM.innerHTML = result;
    }

    getBagButtons() {
      //get all the buttons that are associated to a product
      const buttons = [...document.querySelectorAll(".bag-btn")];
      buttonsDOM = buttons;
      buttons.forEach(button => {
        //get the data-id that is on the button
        let id = button.dataset.id;
        //try to find the item inside of the cart
        let inCart = cart.find(item => item.id === id);
        if (inCart) {
          button.innerText = "In Cart";
          button.disabled = true;
        }
        //not inside of cart
        button.addEventListener("click", event => {
          // disable button
          event.target.innerText = "In Cart";
          event.target.disabled = true;

          // add to cart
          let cartItem = { ...Storage.getProduct(id), amount: 1 };
          cart = [...cart, cartItem];
          console.log(cart);
          //save the cart in local storage
          Storage.saveCart(cart);
          // add to DOM
          //set cart values
          this.setCartValues(cart);
          //display cart items
          this.addCartItem(cartItem);

        });
      });
    }

    setCartValues(cart) {
      let tempTotal = 0;
      let itemsTotal = 0;
      cart.map(item => {
        tempTotal += item.price * item.amount;
        itemsTotal += item.amount;
      });
      cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
      cartItems.innerText = itemsTotal;
    }
    addCartItem(item) {
      const div = document.createElement("div");
      div.classList.add("cart-item");
      div.innerHTML = `<!-- cart item -->
              <!-- item image -->
              <img src=${item.image} alt="product" />
              <!-- item info -->
              <div>
                <h4>${item.title}</h4>
                <h5>$${item.price}</h5>
                <span class="remove-item" data-id=${item.id}>remove</span>
              </div>
              <!-- item functionality -->
              <div>
                  <i class="fas fa-chevron-up" data-id=${item.id}></i>
                <p class="item-amount">
                  ${item.amount}
                </p>
                  <i class="fas fa-chevron-down" data-id=${item.id}></i>
              </div>
            <!-- cart item -->
      `;
      cartContent.appendChild(div);
    }
  }

  //local storage
  class Storage {
    static saveProducts(products) {
      localStorage.setItem("products", JSON.stringify(products));
    }

    static getProduct(id) {
      //get all of the products
      let products = JSON.parse(localStorage.getItem("products"));
      return products.find(product => product.id === id);
    }

    static saveCart(cart) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }
  
document.addEventListener("DOMContentLoaded", () => {
    const ui = new UI();
    const products = new Products();
  
    // get all products
  products.getProducts().then(products => {
    ui.displayProducts(products);
    Storage.saveProducts(products);

  }).then(() => {
    ui.getBagButtons();
  });;
  });
document.addEventListener('DOMContentLoaded', () => {
  const carousels = document.querySelectorAll('.product-carousel, .testimonial-carousel');
  
  carousels.forEach(carousel => {
      let isDown = false;
      let startX;
      let scrollLeft;
  
      carousel.addEventListener('mousedown', (e) => {
          isDown = true;
          carousel.classList.add('active');
          startX = e.pageX - carousel.offsetLeft;
          scrollLeft = carousel.scrollLeft;
      });
  
      carousel.addEventListener('mouseleave', () => {
          isDown = false;
          carousel.classList.remove('active');
      });
  
      carousel.addEventListener('mouseup', () => {
          isDown = false;
          carousel.classList.remove('active');
      });
  
      carousel.addEventListener('mousemove', (e) => {
          if (!isDown) return;
          e.preventDefault();
          const x = e.pageX - carousel.offsetLeft;
          const walk = (x - startX) * 3; //scroll-fast
          carousel.scrollLeft = scrollLeft - walk;
      });
  });

  // Update cart UI whenever the page loads
  updateCartUI();

  // If we're on the cart page, update it
  if (typeof updateCartPage === 'function') {
      updateCartPage();
  }
});

function addToCart(productName, price) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  let totalAmount = parseFloat(localStorage.getItem('totalAmount')) || 0;

  const item = cart.find(i => i.name === productName);
  if (item) {
      item.quantity += 1;
  } else {
      cart.push({ name: productName, price: price, quantity: 1 });
  }
  totalAmount += price;

  localStorage.setItem('cart', JSON.stringify(cart));
  localStorage.setItem('totalAmount', totalAmount.toString());
  updateCartUI();
  showNotification('Item added to cart!');
}

function updateCartUI() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const totalAmount = parseFloat(localStorage.getItem('totalAmount')) || 0;

  const cartCountElement = document.getElementById('cart-count');
  const cartItemsElement = document.getElementById('cart-items');
  const totalAmountElement = document.getElementById('total-amount');

  cartCountElement.innerText = cart.reduce((acc, item) => acc + item.quantity, 0);
  
  if (cartItemsElement) {
      cartItemsElement.innerHTML = cart.map(item => `
          <div class="cart-item">
              <div class="item-details">
                  <span>${item.name} - ₹${item.price}</span>
              </div>
              <div class="item-quantity">
                  <button class="quantity-btn" onclick="updateQuantity('${item.name}', -1)">-</button>
                  <span>${item.quantity}</span>
                  <button class="quantity-btn" onclick="updateQuantity('${item.name}', 1)">+</button>
              </div>
          </div>
      `).join('');
  }
  
  if (totalAmountElement) {
      totalAmountElement.innerText = totalAmount.toFixed(2);
  }
}

function updateQuantity(productName, change) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  let totalAmount = parseFloat(localStorage.getItem('totalAmount')) || 0;

  const item = cart.find(i => i.name === productName);
  if (item) {
      item.quantity += change;
      if (item.quantity <= 0) {
          removeItem(productName);
      } else {
          totalAmount += item.price * change;
          localStorage.setItem('cart', JSON.stringify(cart));
          localStorage.setItem('totalAmount', totalAmount.toString());
          updateCartUI();
          if (typeof updateCartPage === 'function') {
              updateCartPage();
          }
      }
  }
}

function removeItem(productName) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  let totalAmount = parseFloat(localStorage.getItem('totalAmount')) || 0;

  const index = cart.findIndex(i => i.name === productName);
  if (index !== -1) {
      const item = cart[index];
      totalAmount -= item.price * item.quantity;
      cart.splice(index, 1);
      localStorage.setItem('cart', JSON.stringify(cart));
      localStorage.setItem('totalAmount', totalAmount.toString());
      updateCartUI();
      if (typeof updateCartPage === 'function') {
          updateCartPage();
      }
  }
}

function checkout() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const totalAmount = parseFloat(localStorage.getItem('totalAmount')) || 0;

  if (cart.length === 0) {
      alert('Your cart is empty.');
      return;
  }
  alert('Checkout successful!\nTotal amount: ₹' + totalAmount.toFixed(2));
  
  // Clear the cart and total amount in localStorage
  localStorage.removeItem('cart');
  localStorage.removeItem('totalAmount');
  
  // Update the cart UI
  updateCartUI();
  
  // If we're on the cart page, update it
  if (typeof updateCartPage === 'function') {
      updateCartPage();
  }
  
  // Redirect to the home page after a short delay
  setTimeout(() => {
      window.location.href = 'index.html';
  }, 1000);
}

function showNotification(message) {
  const notificationElement = document.getElementById('notification');
  notificationElement.innerText = message;
  notificationElement.classList.add('show');
  setTimeout(() => {
      notificationElement.classList.remove('show');
  }, 3000);
}

// Event listener for the contact form
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      showNotification('Thank you for subscribing!');
      this.reset();
  });
}

// Function to update the cart page (called from cart.html)
function updateCartPage() {
  const cartItemsElement = document.getElementById('cart-items');
  const totalAmountElement = document.getElementById('total-amount');
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const totalAmount = parseFloat(localStorage.getItem('totalAmount')) || 0;

  if (cartItemsElement) {
      cartItemsElement.innerHTML = cart.map(item => `
          <div class="cart-item">
              <div class="item-details">
                  <h3>${item.name}</h3>
                  <p>Price: ₹${item.price.toFixed(2)}</p>
              </div>
              <div class="item-quantity">
                  <button class="quantity-btn" onclick="updateQuantity('${item.name}', -1)">-</button>
                  <span>${item.quantity}</span>
                  <button class="quantity-btn" onclick="updateQuantity('${item.name}', 1)">+</button>
              </div>
              <button class="remove-btn" onclick="removeItem('${item.name}')">Remove</button>
          </div>
      `).join('');
  }

  if (totalAmountElement) {
      totalAmountElement.innerText = totalAmount.toFixed(2);
  }
}
document.addEventListener("DOMContentLoaded", () => {
  fetch("http://localhost:8081/api/productos/listar")
    .then((response) => {
      if (!response || !response.ok) {
        throw new Error("API  no disponible");
      }
      return response.json();
    })
    .then((data) => {
      console.log(data)
      if (data ) {
        console.log(data)
        cargarProductos(data); // Solo mostramos 10 productos
      } else {
        throw new Error("Formato inesperado de API");
      }
    })
    .catch((error) =>
      console.error("Error al obtener productos de la API", error)
    );

  function cargarProductos(data) {
    const productosContainer = document.getElementById("productos-container");
    productosContainer.innerHTML = "";

    data.forEach((producto) => {
      console.log(producto)
      const shortDescription =
      productosContainer.innerHTML += `
        <div class="card">
        
          <img src="./img/${producto.id}.png" class="card-img-top" alt="${producto.nombre}">
          <div class="card-body">
            <h5 class="card-title">${producto.nombre}</h5>
            <p class="card-text">$${producto.precio}</p>
            <button class="btn btn-primary" onclick="addToCart(${
              producto.id
            }'${
        producto.nombre
      }', ${producto.precio}, this)">Agregar al carrito</button>
          </div>
        </div>
      `;
    });
  }

  window.addToCart = function (id, nombre, precio, button) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let existingProduct = cart.find((product) => product.id === id);
    if (existingProduct) {
      existingProduct.quantity++;
    } else {
      cart.push({ id, nombre, precio, quantity: 1 });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartUI();

    // Cambiar el texto del botón
    button.textContent = "Agregado";
    button.disabled = true;
    setTimeout(() => {
      button.textContent = "Agregar al carrito";
      button.disabled = false;
    }, 1000);
  };

  window.toggleDescription = function (button) {
    const shortDescription = button.previousElementSibling;
    const fullDescription = shortDescription.nextElementSibling;
    if (fullDescription.style.display === "none") {
      fullDescription.style.display = "block";
      shortDescription.style.display = "none";
      button.textContent = "Ocultar descripción";
    } else {
      fullDescription.style.display = "none";
      shortDescription.style.display = "block";
      button.textContent = "Ver descripción";
    }
  };

  // FUNCIÓN UPDATECARTUI PARA MOSTRAR TARJETAS
  function updateCartUI() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const carritoItems = document.getElementById("carrito-items");
    carritoItems.innerHTML = "";
    let total = 0;

    if (cart.length === 0) {
      carritoItems.innerHTML =
        '<li class="text-center text-muted w-100">Tu carrito está vacío</li>';
      document.getElementById("realizar-compra").disabled = true;
    } else {
      document.getElementById("realizar-compra").disabled = false;

      cart.forEach((item) => {
        const cartItemHTML = `
          <li class="cart-item">
            <img src="./img/${item.id}.png" alt="${item.title}">
            <div class="card-body">
              <h6 class="card-title">${item.title}</h6>
              <p class="card-text">Cantidad: <strong>${
                item.quantity
              }</strong></p>
              <p class="card-text">Precio unitario: ${item.price}</p>
              <p class="card-text">Subtotal: <strong>${(
                item.price * item.quantity
              ).toFixed(2)}</strong></p>
              <button class="btn btn-sm btn-danger" onclick="removeFromCart(${
                item.id
              })">
                Eliminar
              </button>
            </div>
          </li>
        `;
        carritoItems.innerHTML += cartItemHTML;
        total += item.price * item.quantity;
      });
    }

    document.getElementById("carrito-total").textContent = total.toFixed(2);
    document.getElementById("cart-counter").textContent = cart.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
  }

  // FUNCIÓN PARA ELIMINAR PRODUCTOS INDIVIDUALES
  window.removeFromCart = function (id) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart = cart.filter((item) => item.id !== id);
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartUI();
  };

  document.getElementById("vaciar-carrito").addEventListener("click", () => {
    localStorage.clear();
    updateCartUI();
  });

  // FUNCIONALIDAD PARA REALIZAR COMPRA
  document.getElementById("realizar-compra").addEventListener("click", () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (cart.length === 0) {
      alert("Tu carrito está vacío");
      return;
    }

    const total = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    document.getElementById("modal-total").textContent = total.toFixed(2);

    // Mostrar el modal
    const modal = new bootstrap.Modal(
      document.getElementById("compraExitosaModal")
    );
    modal.show();

    // Limpiar el carrito después de la compra
    localStorage.clear();
    updateCartUI();
  });

  updateCartUI();
});

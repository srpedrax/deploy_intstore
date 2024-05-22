document.addEventListener('DOMContentLoaded', function() {
  const urlParams = new URLSearchParams(window.location.search);
  const username = urlParams.get('username');
  const adminNameElement = document.getElementById('admin-name');
  const menuButtons = document.querySelectorAll('.menu-btn');
  const manageSections = document.querySelectorAll('.manage-section');
  const modal = document.getElementById('modal');
  const modalContent = document.getElementById('modal-body');
  const closeModalBtn = document.querySelector('.close-btn');

  if (username) {
    adminNameElement.textContent = username;
  }

  menuButtons.forEach(button => {
    button.addEventListener('click', () => {
      const section = button.dataset.section;
      manageSections.forEach(sec => {
        if (sec.classList.contains(section)) {
          sec.style.display = 'block';
          if (section === 'manageProducts') {
            loadProducts();
          }
        } else {
          sec.style.display = 'none';
        }
      });
    });
  });

  document.querySelectorAll('.edit-btn, .create-btn, .delete-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.className.split('-')[0];
      const section = btn.closest('.manage-section').classList[1];
      openModal(action, section);
    });
  });

  closeModalBtn.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = 'none';
    }
  };

  function openModal(action, section) {
    modalContent.innerHTML = `<h2>${action.charAt(0).toUpperCase() + action.slice(1)} ${section.slice(6)}</h2>`;
    if (section === 'manageProducts' && action === 'create') {
      // Criar um formulário para criar um novo produto
      modalContent.innerHTML += `
        <form id="create-product-form" enctype="multipart/form-data">
          <label for="name">Nome:</label>
          <input type="text" id="name" name="name" required><br>
          <label for="price">Preço:</label>
          <input type="number" id="price" name="price" min="0" step="0.01" required><br>
          <label for="description">Descrição:</label><br>
          <textarea id="description" name="description" rows="4" cols="50" required></textarea><br>
          <label for="observationTitle">Título da Observação:</label><br>
          <input type="text" id="observationTitle" name="observationTitle"><br>
          <label for="observationDescription">Descrição da Observação:</label><br>
          <textarea id="observationDescription" name="observationDescription" rows="4" cols="50"></textarea><br>
          <label for="image">Imagem do Produto:</label><br>
          <input type="file" id="image" name="image" accept="image/*" required><br>
          <button type="submit">Criar Produto</button>
        </form>
      `;
      document.getElementById('create-product-form').addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        createProduct(formData); // Passa o FormData diretamente
      });
    }
    modal.style.display = 'block';
  }

  async function loadProducts() {
    try {
      const response = await fetch('/api/products');
      if (!response.ok) {
        throw new Error('Erro ao carregar produtos');
      }
      const products = await response.json();
      displayProducts(products);
    } catch (error) {
      console.error('Erro:', error);
    }
  }

  async function createProduct(productData) {
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        body: productData, // Agora enviamos diretamente o FormData
      });
      if (!response.ok) {
        throw new Error('Erro ao criar produto');
      }
      closeModalBtn.click(); // Fechar o modal após a criação do produto
      loadProducts(); // Recarregar a lista de produtos
    } catch (error) {
      console.error('Erro:', error);
    }
  }

  function displayProducts(products) {
    const productsList = document.querySelector('.productsList');
    productsList.innerHTML = products.map(product => `
      <div class="product-item">
        <h3>${product.name}</h3>
        <p>Preço: ${product.price}</p>
        <p>Descrição: ${product.description}</p>
      </div>
    `).join('');
  }
});
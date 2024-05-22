document.addEventListener('DOMContentLoaded', function() {
  const urlParams = new URLSearchParams(window.location.search);
  const username = urlParams.get('username');
  const adminNameElement = document.getElementById('admin-name');
  const menuButtons = document.querySelectorAll('.menu-btn');
  const manageSections = document.querySelectorAll('.manage-section');
  const modal = document.getElementById('modal');
  const modalContent = document.getElementById('modal-body');
  const closeModalBtn = document.querySelector('.close-btn');
  const productsList = document.querySelector('.productsList');

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

  closeModalBtn.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = 'none';
    }
  };

  function loadProducts() {
    fetch('/api/products')
      .then(response => {
        if (!response.ok) {
          throw new Error('Erro ao carregar produtos');
        }
        return response.json();
      })
      .then(products => {
        displayProducts(products);
      })
      .catch(error => {
        console.error('Erro:', error);
      });
  }

  function displayProducts(products) {
    productsList.innerHTML = products.map(product => `
      <div class="product-item">
        <h3>${product.name}</h3>
        <p>Preço: ${product.price}</p>
        <p>Descrição: ${product.description}</p>
        <img src="${product.imagePath}" alt="${product.name}" width="100"><br>
        <button class="edit-btn" data-product-id="${product.id}">Editar</button>
        <button class="delete-btn" data-product-id="${product.id}">Excluir</button>
      </div>
    `).join('');

    // Adiciona eventos aos botões de editar e excluir
    document.querySelectorAll('.edit-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const productId = btn.dataset.productId;
        openProductModal(productId);
      });
    });

    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const productId = btn.dataset.productId;
        deleteProduct(productId);
      });
    });
  }

  function openProductModal(productId) {
    // Aqui você pode abrir um modal com os detalhes do produto
    // e permitir a edição das informações.
    // Exemplo:
    modalContent.innerHTML = `<h2>Detalhes do Produto</h2>`;
    const product = getProductById(productId); // Função fictícia para obter os detalhes do produto
    modalContent.innerHTML += `
      <p>Nome: ${product.name}</p>
      <p>Preço: ${product.price}</p>
      <p>Descrição: ${product.description}</p>
      <img src="${product.imagePath}" alt="${product.name}" width="200"><br>
      <button class="edit-product-btn" data-product-id="${product.id}">Editar</button>
      <button class="delete-product-btn" data-product-id="${product.id}">Excluir</button>
    `;
    modal.style.display = 'block';
  }

  function deleteProduct(productId) {
    fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Erro ao excluir produto');
        }
        console.log(`Produto com ID ${productId} excluído com sucesso`);
        // Recarregar a lista de produtos após a exclusão
        loadProducts();
      })
      .catch(error => {
        console.error('Erro:', error);
      });
  }
  
  function getProductById(productId) {
    // Aqui você faria uma requisição ao servidor para obter os detalhes do produto pelo ID
    return fetch(`/api/products/${productId}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Erro ao obter detalhes do produto');
        }
        return response.json();
      })
      .then(product => {
        return product; // Retornar os detalhes do produto obtidos do servidor
      })
      .catch(error => {
        console.error('Erro:', error);
      });
  }
});
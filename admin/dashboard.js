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
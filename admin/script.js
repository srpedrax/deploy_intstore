document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('loginForm');
  const errorMessage = document.getElementById('error-message');
  const loginBtn = document.getElementById('loginBtn');
  const registerBtn = document.getElementById('registerBtn');

  form.addEventListener('submit', async function(event) {
    event.preventDefault();

    const username = form.username.value;
    const password = form.password.value;

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro desconhecido');
      }

      window.location.href = `dashboard.html?username=${username}`;

    } catch (error) {
      errorMessage.textContent = error.message;
      errorMessage.style.display = 'block';
    }
  });

  registerBtn.addEventListener('click', async function() {
    const username = form.username.value;
    const password = form.password.value;

    try {
      const response = await fetch('/api/admin/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro desconhecido');
      }

      alert('Registro bem-sucedido! Você pode fazer login agora.');
    } catch (error) {
      errorMessage.textContent = error.message;
      errorMessage.style.display = 'block';
    }
  });
});
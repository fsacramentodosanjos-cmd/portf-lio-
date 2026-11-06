const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.navbar-nav .nav-link[href^="#"]');
const BACKEND_URL = 'http://localhost:3000';

function mostrarSecao(id) {
  sections.forEach(sec => sec.classList.toggle('active', sec.id === id));
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === '#' + id);
  });
  window.scrollTo(0, 0);
}

navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const id = link.getAttribute('href').substring(1);
    history.pushState(null, '', '#' + id);
    mostrarSecao(id);

    const collapse = document.getElementById('navbarNav');
    if (collapse && collapse.classList.contains('show')) {
      new bootstrap.Collapse(collapse).hide();
    }
  });
});

window.addEventListener('DOMContentLoaded', () => {
  const id = window.location.hash.substring(1) || 'home';
  mostrarSecao(id);
});

window.addEventListener('popstate', () => {
  const id = window.location.hash.substring(1) || 'home';
  mostrarSecao(id);
});

async function enviarMensagem() {
  const nome = document.getElementById('nome').value.trim();
  const email = document.getElementById('email').value.trim();
  const msg = document.getElementById('mensagem').value.trim();

  if (!nome || !email || !msg) {
    alert('Por favor, preencha todos os campos antes de enviar.');
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert('Por favor, insira um email válido.');
    return;
  }

  const btn = document.querySelector('#contato button');
  const textoOriginal = btn.innerHTML;
  btn.innerHTML = '<i class="bi bi-hourglass-split me-2"></i>Enviando...';
  btn.disabled = true;

  try {
    const resposta = await fetch(`${BACKEND_URL}/enviar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, email, mensagem: msg })
    });

    const dados = await resposta.json();

    if (!resposta.ok || !dados.sucesso) {
      throw new Error(dados.mensagem || 'Erro ao enviar mensagem.');
    }

    btn.innerHTML = '<i class="bi bi-check-circle-fill me-2"></i>Mensagem enviada!';
    btn.style.background = '#059669';

    document.getElementById('nome').value = '';
    document.getElementById('email').value = '';
    document.getElementById('mensagem').value = '';

    setTimeout(() => {
      btn.innerHTML = textoOriginal;
      btn.style.background = '';
      btn.disabled = false;
    }, 3000);

  } catch (erro) {
    console.error(erro);
    btn.innerHTML = textoOriginal;
    btn.disabled = false;
    alert('Não foi possível enviar a mensagem. Verifique se o servidor está rodando.');
  }
}
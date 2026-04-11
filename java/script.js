
const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

const btn = document.getElementById('voltarTopo');
window.addEventListener('scroll', () => {
  if (btn) btn.style.display = window.scrollY > 260 ? 'block' : 'block';
});
if (btn) btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

const paginaAtual = window.location.pathname.split('/').pop() || 'index.html';
$$('nav a').forEach(link => {
  if (link.getAttribute('href') === paginaAtual) link.classList.add('ativo');
});

const elementos = $$('main section, .card, .stat-card, .caixa, .timeline-item, .link-card, table, form, .contact-info, .galeria-item, .imagem img, .produto-card, .quiz-box');
elementos.forEach(el => el.classList.add('reveal'));
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visivel');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
elementos.forEach(el => observer.observe(el));

const galeriaImagens = $$('.galeria img');
if (galeriaImagens.length) {
  galeriaImagens.forEach(img => {
    const alt = (img.alt || '').toLowerCase();
    let category = 'decoracao';
    if (alt.includes('sala')) category = 'sala';
    else if (alt.includes('armário') || alt.includes('armario')) category = 'armario';
    else if (alt.includes('mesa') || alt.includes('jantar')) category = 'mesa';
    img.dataset.category = category;

    if (!img.parentElement.classList.contains('galeria-item')) {
      const wrapper = document.createElement('div');
      wrapper.className = 'galeria-item';
      wrapper.dataset.category = category;
      img.parentNode.insertBefore(wrapper, img);
      wrapper.appendChild(img);
      const legenda = document.createElement('span');
      legenda.className = 'legenda-galeria';
      legenda.textContent = img.alt || 'Imagem';
      wrapper.appendChild(legenda);
    } else {
      img.parentElement.dataset.category = category;
    }
  });

  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.innerHTML = `
    <div class="lightbox-conteudo">
      <button class="fechar-lightbox" aria-label="Fechar">×</button>
      <img src="" alt="Imagem ampliada">
      <p></p>
    </div>
  `;
  document.body.appendChild(lightbox);
  const lightboxImg = $('img', lightbox);
  const lightboxTexto = $('p', lightbox);
  const fechar = () => lightbox.classList.remove('ativo');

  $$('.galeria img').forEach(img => {
    img.addEventListener('click', () => {
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightboxTexto.textContent = img.alt || 'Imagem ampliada';
      lightbox.classList.add('ativo');
    });
  });

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target.classList.contains('fechar-lightbox')) fechar();
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') fechar(); });
}

const formContato = document.getElementById('formContato');
const formStatus = document.getElementById('formStatus');
if (formContato && formStatus) {
  formContato.addEventListener('submit', (e) => {
    e.preventDefault();
    formStatus.textContent = 'Mensagem enviada com sucesso (simulação do projeto).';
    formContato.reset();
  });
}

function setupTheme() {
  const saved = localStorage.getItem('tema-site');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (saved === 'escuro' || (!saved && prefersDark)) document.body.classList.add('dark-mode');

  const toggle = document.createElement('button');
  toggle.className = 'theme-toggle';
  toggle.setAttribute('aria-label', 'Alternar modo escuro');
  toggle.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
  document.body.appendChild(toggle);
  toggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const ativo = document.body.classList.contains('dark-mode');
    localStorage.setItem('tema-site', ativo ? 'escuro' : 'claro');
    toggle.textContent = ativo ? '☀️' : '🌙';
  });
}

function setupCatalogo() {
  const filtros = $$('#filtrosCatalogo .filtro-btn');
  const produtos = $$('#catalogoProdutos .produto-card');
  filtros.forEach(botao => {
    botao.addEventListener('click', () => {
      filtros.forEach(b => b.classList.remove('ativo'));
      botao.classList.add('ativo');
      const filtro = botao.dataset.filter;
      produtos.forEach(produto => {
        produto.style.display = filtro === 'todos' || produto.dataset.category === filtro ? 'grid' : 'none';
      });
    });
  });
}

function setupFiltroGaleria() {
  const filtros = $$('#filtrosGaleria .filtro-btn');
  const itens = $$('.galeria-item');
  if (!filtros.length || !itens.length) return;
  filtros.forEach(botao => {
    botao.addEventListener('click', () => {
      filtros.forEach(b => b.classList.remove('ativo'));
      botao.classList.add('ativo');
      const filtro = botao.dataset.filter;
      itens.forEach(item => {
        item.style.display = filtro === 'todos' || item.dataset.category === filtro ? 'block' : 'none';
      });
    });
  });
}

function formatMoney(value) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function setupCarrinho() {
  const cartButton = document.createElement('button');
  cartButton.className = 'cart-fab';
  cartButton.innerHTML = '🛒 <span id="cartCount">0</span>';
  document.body.appendChild(cartButton);

  const cartPanel = document.createElement('aside');
  cartPanel.className = 'cart-panel';
  cartPanel.innerHTML = `
    <div class="cart-head">
      <h3>Carrinho do projeto</h3>
      <button class="cart-close">×</button>
    </div>
    <div class="cart-body">
      <p class="cart-vazio">Nenhum item adicionado ainda.</p>
      <ul class="cart-list"></ul>
    </div>
    <div class="cart-foot">
      <strong>Total: <span id="cartTotal">R$ 0,00</span></strong>
      <button class="botao" id="finalizarCompra">Finalizar simulação</button>
    </div>
  `;
  document.body.appendChild(cartPanel);

  const lista = $('.cart-list', cartPanel);
  const vazio = $('.cart-vazio', cartPanel);
  const count = $('#cartCount');
  const total = $('#cartTotal');
  let cart = JSON.parse(localStorage.getItem('carrinho-moveis') || '[]');

  function renderCart() {
    lista.innerHTML = '';
    let soma = 0;
    if (!cart.length) vazio.style.display = 'block';
    else vazio.style.display = 'none';

    cart.forEach((item, index) => {
      soma += item.price;
      const li = document.createElement('li');
      li.innerHTML = `<span>${item.name}</span><strong>${formatMoney(item.price)}</strong><button class="remover-item" data-index="${index}">Remover</button>`;
      lista.appendChild(li);
    });
    count.textContent = cart.length;
    total.textContent = formatMoney(soma);
    localStorage.setItem('carrinho-moveis', JSON.stringify(cart));
  }

  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('add-cart')) {
      const card = e.target.closest('.produto-card');
      if (!card) return;
      cart.push({
        name: card.dataset.name,
        price: Number(card.dataset.price)
      });
      renderCart();
      cartPanel.classList.add('ativo');
    }
    if (e.target.classList.contains('remover-item')) {
      cart.splice(Number(e.target.dataset.index), 1);
      renderCart();
    }
  });

  cartButton.addEventListener('click', () => cartPanel.classList.toggle('ativo'));
  $('.cart-close', cartPanel).addEventListener('click', () => cartPanel.classList.remove('ativo'));
  $('#finalizarCompra', cartPanel).addEventListener('click', () => {
    if (!cart.length) {
      alert('Adicione pelo menos um item ao carrinho para simular a compra.');
      return;
    }
    alert('Compra simulada com sucesso! Este recurso foi adicionado em JavaScript para enriquecer o projeto.');
    cart = [];
    renderCart();
    cartPanel.classList.remove('ativo');
  });

  renderCart();
}

function setupChatbot() {
  const respostas = {
    entrega: 'Este site foi melhorado com catálogo, carrinho, filtro, modo escuro, chatbot e quiz interativo.',
    sofa: 'Na página inicial há um sofá no catálogo. Você pode filtrar por categoria e adicionar ao carrinho.',
    contato: 'A página de contato possui formulário visual com envio simulado.',
    ajuda: 'Você pode me perguntar sobre móveis, páginas do projeto, carrinho, galeria ou quiz.'
  };

  const fab = document.createElement('button');
  fab.className = 'chat-fab';
  fab.textContent = '💬';
  document.body.appendChild(fab);

  const chat = document.createElement('div');
  chat.className = 'chatbot';
  chat.innerHTML = `
    <div class="chat-header"><strong>Chat do projeto</strong><button class="chat-close">×</button></div>
    <div class="chat-messages">
      <div class="msg bot">Olá! Posso responder dúvidas simples sobre o site de móveis.</div>
    </div>
    <form class="chat-form">
      <input type="text" placeholder="Digite sua pergunta" aria-label="Digite sua pergunta">
      <button type="submit">Enviar</button>
    </form>
  `;
  document.body.appendChild(chat);

  fab.addEventListener('click', () => chat.classList.toggle('ativo'));
  $('.chat-close', chat).addEventListener('click', () => chat.classList.remove('ativo'));
  $('.chat-form', chat).addEventListener('submit', (e) => {
    e.preventDefault();
    const input = $('input', chat);
    const texto = input.value.trim();
    if (!texto) return;
    const painel = $('.chat-messages', chat);
    const userMsg = document.createElement('div');
    userMsg.className = 'msg user';
    userMsg.textContent = texto;
    painel.appendChild(userMsg);

    const chave = Object.keys(respostas).find(k => texto.toLowerCase().includes(k));
    const botMsg = document.createElement('div');
    botMsg.className = 'msg bot';
    botMsg.textContent = chave ? respostas[chave] : 'Entendi. Este chatbot é simples e responde melhor sobre entrega, sofá, contato e ajuda.';
    painel.appendChild(botMsg);
    painel.scrollTop = painel.scrollHeight;
    input.value = '';
  });
}

function setupQuiz() {
  const resultado = $('#quizResultado');
  const opcoes = $$('.quiz-opcao');
  if (!resultado || !opcoes.length) return;
  opcoes.forEach(opcao => {
    opcao.addEventListener('click', () => {
      opcoes.forEach(btn => btn.disabled = true);
      const correta = opcao.dataset.correct === 'true';
      opcao.classList.add(correta ? 'certa' : 'errada');
      const certa = opcoes.find(btn => btn.dataset.correct === 'true');
      if (certa && !correta) certa.classList.add('certa');
      resultado.textContent = correta ? 'Resposta certa! MDF é um dos materiais mais usados em armários e painéis.' : 'Quase! A resposta correta é MDF.';
    });
  });
}

setupTheme();
setupCatalogo();
setupFiltroGaleria();
setupCarrinho();
setupChatbot();
setupQuiz();

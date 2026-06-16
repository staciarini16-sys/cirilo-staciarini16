const $=(s,c=document)=>c.querySelector(s);const $$=(s,c=document)=>[...c.querySelectorAll(s)];
const btn=$('#voltarTopo');window.addEventListener('scroll',()=>{if(btn)btn.style.display=window.scrollY>250?'block':'none'});if(btn)btn.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));
// Link ativo no menu
const page=location.pathname.split('/').pop()||'index.html';$$('.nav-principal a').forEach(a=>{if(a.getAttribute('href')===page)a.classList.add('ativo')});
// Tema claro/escuro
const savedTheme=localStorage.getItem('temaMoveis');if(savedTheme==='dark')document.body.classList.add('dark');$$('.theme-toggle').forEach(b=>{b.textContent=document.body.classList.contains('dark')?'☀️':'🌙';b.addEventListener('click',()=>{document.body.classList.toggle('dark');localStorage.setItem('temaMoveis',document.body.classList.contains('dark')?'dark':'light');$$('.theme-toggle').forEach(x=>x.textContent=document.body.classList.contains('dark')?'☀️':'🌙')})});
// Animação de entrada
const obs=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visivel')}),{threshold:.12});$$('main section,.card,.produto-card,.stat-card,.link-card').forEach(el=>{el.classList.add('reveal');obs.observe(el)});
// Contadores animados
let counted=false;function animateCounters(){if(counted)return;const cards=$$('.stat-card strong[data-counter]');if(!cards.length)return;const top=cards[0].getBoundingClientRect().top;if(top<innerHeight){counted=true;cards.forEach(el=>{const end=+el.dataset.counter;let n=0;const step=Math.max(1,Math.ceil(end/40));const timer=setInterval(()=>{n+=step;if(n>=end){n=end;clearInterval(timer)}el.textContent=n},25)})}}window.addEventListener('scroll',animateCounters);animateCounters();
// Filtro do catálogo
const filtroCatalogo=$('#filtrosCatalogo');if(filtroCatalogo){filtroCatalogo.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;$$('.filtros-catalogo .filtro-btn').forEach(x=>x.classList.remove('ativo'));b.classList.add('ativo');const f=b.dataset.filter;$$('.produto-card').forEach(card=>{card.style.display=(f==='todos'||card.dataset.category===f)?'block':'none'})})}
// Carrinho simples
let cart=JSON.parse(localStorage.getItem('cartMoveis')||'[]');function updateCart(){const count=$('#cartCount'),total=$('#cartTotal');if(!count||!total)return;count.textContent=cart.length;const soma=cart.reduce((s,i)=>s+Number(i.price),0);total.textContent=soma.toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}$$('.add-cart').forEach(btn=>btn.addEventListener('click',()=>{const p=btn.closest('.produto-card');cart.push({name:p.dataset.name,price:p.dataset.price});localStorage.setItem('cartMoveis',JSON.stringify(cart));updateCart();btn.textContent='Adicionado ✓';setTimeout(()=>btn.textContent='Adicionar',900)}));const limpar=$('#limparCarrinho');if(limpar)limpar.addEventListener('click',()=>{cart=[];localStorage.setItem('cartMoveis','[]');updateCart()});updateCart();
// Quiz
$$('.quiz-opcao').forEach(btn=>btn.addEventListener('click',()=>{const box=btn.closest('.quiz-box');$$('.quiz-opcao',box).forEach(b=>b.disabled=true);const ok=btn.dataset.correct==='true';btn.classList.add(ok?'correta':'errada');if(!ok){const certo=$$('.quiz-opcao',box).find(b=>b.dataset.correct==='true');if(certo)certo.classList.add('correta')}const res=$('#quizResultado');if(res)res.textContent=ok?'Resposta correta! MDF é muito usado em móveis planejados.':'Quase! A resposta correta é MDF.'}));
// Galeria: filtros e lightbox
const filtrosGal=$('#filtrosGaleria');if(filtrosGal){filtrosGal.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;$$('.filtros-galeria .filtro-btn').forEach(x=>x.classList.remove('ativo'));b.classList.add('ativo');const f=b.dataset.filter;$$('.galeria img').forEach(img=>{img.style.display=(f==='todos'||img.dataset.category===f)?'block':'none'})})}$$('.galeria img').forEach(img=>img.addEventListener('click',()=>{const lb=document.createElement('div');lb.className='lightbox';lb.innerHTML=`<button aria-label="Fechar">×</button><img src="${img.src}" alt="${img.alt}">`;document.body.appendChild(lb);lb.addEventListener('click',e=>{if(e.target===lb||e.target.tagName==='BUTTON')lb.remove()})}));
// Formulário de contato com mensagem simulada
const form=$('#formContato');if(form){form.addEventListener('submit',e=>{e.preventDefault();const status=$('#formStatus');if(status){status.textContent='Mensagem enviada com sucesso! Obrigado pela participação.';status.style.color='#16a34a'}form.reset()})}


// ===== CAMADA EXTRA: efeitos ousados =====
window.addEventListener('load',()=>{const p=document.getElementById('preloader');if(p)setTimeout(()=>p.classList.add('oculto'),500)});
const progress=document.getElementById('progressScroll');window.addEventListener('scroll',()=>{if(progress){const h=document.documentElement.scrollHeight-innerHeight;progress.style.width=(h>0?(scrollY/h)*100:0)+'%'}});
document.addEventListener('pointermove',e=>{document.body.style.setProperty('--mx',e.clientX+'px');document.body.style.setProperty('--my',e.clientY+'px')});
const ambientePreview=document.getElementById('ambientePreview');const ambienteTitulo=document.getElementById('ambienteTitulo');const ambienteTexto=document.getElementById('ambienteTexto');
const textosAmbiente={luxo:['Sala Luxo Contemporânea','Combinação com tons sofisticados, luz indireta e móveis de presença marcante.'],minimalista:['Ambiente Minimalista','Poucos elementos, linhas limpas, cores suaves e foco total na organização.'],industrial:['Estilo Industrial Urbano','Metal, madeira, tons escuros e personalidade forte para um visual moderno.'],colorido:['Casa Criativa Colorida','Cores vibrantes, decoração divertida e móveis que chamam atenção no primeiro olhar.']};
$$('.estilo-btn').forEach(btn=>btn.addEventListener('click',()=>{$$('.estilo-btn').forEach(b=>b.classList.remove('ativo'));btn.classList.add('ativo');const st=btn.dataset.style;if(ambientePreview){ambientePreview.className='ambiente-preview '+st;ambienteTitulo.textContent=textosAmbiente[st][0];ambienteTexto.textContent=textosAmbiente[st][1];toast('Estilo aplicado: '+btn.textContent)}}));
$$('.tilt-card').forEach(card=>{card.addEventListener('pointermove',e=>{const r=card.getBoundingClientRect();const x=e.clientX-r.left,y=e.clientY-r.top;const rx=((y/r.height)-.5)*-8;const ry=((x/r.width)-.5)*10;card.style.transform=`rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`});card.addEventListener('pointerleave',()=>card.style.transform='')});
const assist=document.getElementById('assistenteFlutuante');if(assist){assist.querySelector('.assistente-btn').addEventListener('click',()=>assist.classList.toggle('aberto'))}
function toast(msg){const old=document.querySelector('.toast');if(old)old.remove();const t=document.createElement('div');t.className='toast';t.textContent=msg;document.body.appendChild(t);setTimeout(()=>t.remove(),2200)}


// Menu hambúrguer responsivo
const menuToggle = document.getElementById('menuToggle');
const menuPrincipal = document.getElementById('menuPrincipal');
if (menuToggle && menuPrincipal) {
  menuToggle.addEventListener('click', () => {
    const aberto = menuPrincipal.classList.toggle('aberto');
    menuToggle.classList.toggle('menu-aberto', aberto);
    menuToggle.setAttribute('aria-expanded', aberto ? 'true' : 'false');
    menuToggle.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
  });

  menuPrincipal.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 760) {
        menuPrincipal.classList.remove('aberto');
        menuToggle.classList.remove('menu-aberto');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Abrir menu');
      }
    });
  });
}

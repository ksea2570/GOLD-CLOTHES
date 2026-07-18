/* ==========================================
   GOLD CLOTHES — Lógica principal
   ========================================== */
(function () {

  const grid       = document.getElementById('product-grid');
  const resultCount = document.getElementById('result-count');
  const marquee    = document.getElementById('marquee');
  const catGrid    = document.getElementById('cat-grid');
  const productos  = document.getElementById('productos');
  const categorias = document.getElementById('categorias');
  const catLabel   = document.getElementById('cat-label');
  const catTitle   = document.getElementById('cat-title');
  const backBtn    = document.getElementById('back-btn');

  /* Foto representativa de cada categoría (primer producto que tenga imagen) */
  function getCatImg(cat) {
    const p = PRODUCTS.find(p => p.category === cat);
    return p ? p.img : '';
  }

  /* Emojis por categoría */
  const ICONS = {
    'Accesorios':            '🧢',
    'Blusas y Tops':         '👚',
    'Bodies y Corsets':      '🪡',
    'Buzos y Sudaderas':     '🧥',
    'Camisetas y Camisas':   '👕',
    'Chaquetas':             '🧤',
    'Conjuntos y Enteriozos':'👗',
    'Faldas':                '🩱',
    'Licras':                '🩲',
    'Pantalones y Jeans':    '👖',
    'Shorts':                '🩳',
    'Vestidos':              '👘',
  };

  /* --- Renderizar grid de categorías --- */
  function renderCategories() {
    catGrid.innerHTML = CATEGORIES.map(cat => {
      const n = PRODUCTS.filter(p => p.category === cat).length;
      const img = getCatImg(cat);
      const icon = ICONS[cat] || '🛍️';
      return `
        <div class="cat-card" data-cat="${cat}">
          <div class="cat-img">
            ${img ? `<img src="${img}" alt="${cat}" onerror="this.style.display='none'">` : ''}
            <div class="cat-overlay">
              <span class="cat-icon">${icon}</span>
              <h3>${cat}</h3>
              <span class="cat-count">${n} productos</span>
            </div>
          </div>
        </div>`;
    }).join('');

    catGrid.querySelectorAll('.cat-card').forEach(card => {
      card.addEventListener('click', () => selectCategory(card.dataset.cat));
    });
  }

  /* --- Seleccionar categoría --- */
  function selectCategory(cat) {
    catLabel.textContent = cat.toUpperCase();
    catTitle.textContent = cat;
    renderProducts(cat);
    categorias.style.display = 'none';
    productos.style.display = 'block';
    setTimeout(() => {
      productos.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  }

  /* --- Volver a categorías --- */
  backBtn.addEventListener('click', () => {
    productos.style.display = 'none';
    categorias.style.display = 'block';
    setTimeout(() => {
      categorias.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  });

  /* --- Renderizar productos de una categoría --- */
  function renderProducts(cat) {
    const list = PRODUCTS.filter(p => p.category === cat);
    resultCount.textContent = list.length + (list.length === 1 ? ' producto' : ' productos');

    grid.innerHTML = list.map(p => `
      <div class="product">
        <div class="product-img">
          <img src="${p.img}" alt="${p.name}">
          <div class="placeholder" style="display:none;">
            <div class="ph-icon">+</div>
            <div class="ph-label">Foto pendiente</div>
            <div class="ph-file">${p.img}</div>
          </div>
        </div>
        <h4>${p.name}</h4>
        <div class="price">$${p.price.toLocaleString('es-CO')}</div>
        ${p.colors.length ? `<div class="colors">${p.colors.join(' · ')}</div>` : ''}
      </div>
    `).join('');

    grid.querySelectorAll('.product-img').forEach(box => {
      const img = box.querySelector('img');
      const ph  = box.querySelector('.placeholder');
      img.addEventListener('error', () => {
        img.style.display = 'none';
        ph.style.display  = 'flex';
      });
    });
  }

  /* --- Marquee --- */
  function renderMarquee() {
    const items = ['ENVÍOS A TODO COLOMBIA', '99 PRODUCTOS DISPONIBLES', 'NUEVA COLECCIÓN', 'PAGA POR WHATSAPP'];
    marquee.innerHTML = [...items, ...items].map(t => `<span>${t}</span>`).join('');
  }

  renderCategories();
  renderMarquee();

})();

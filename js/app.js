/* ==========================================
   GOLD CLOTHES — Lógica principal
   ========================================== */
(function () {

  const grid        = document.getElementById('product-grid');
  const resultCount = document.getElementById('result-count');
  const marquee     = document.getElementById('marquee');
  const catGrid     = document.getElementById('cat-grid');
  const productos   = document.getElementById('productos');
  const categorias  = document.getElementById('categorias');
  const catLabel    = document.getElementById('cat-label');
  const catTitle    = document.getElementById('cat-title');
  const backBtn     = document.getElementById('back-btn');
  const searchInput = document.getElementById('search-input');
  const searchClear = document.getElementById('search-clear');
  const searchRes   = document.getElementById('search-results');
  const catSelect   = document.getElementById('cat-select');
  const sortSelect  = document.getElementById('sort-select');

  const WA_NUMBER = '573145651803';
  let currentCat  = null;

  /* ========== LIGHTBOX ========== */
  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.innerHTML = `
    <div class="lightbox-inner">
      <span class="lightbox-close">✕</span>
      <img class="lightbox-img" src="" alt="">
      <div class="lightbox-name"></div>
      <div class="lightbox-price"></div>
      <div class="lightbox-colors"></div>
      <a class="lightbox-wa" href="" target="_blank" rel="noopener">PEDIR POR WHATSAPP →</a>
    </div>`;
  document.body.appendChild(lightbox);

  const lbImg    = lightbox.querySelector('.lightbox-img');
  const lbName   = lightbox.querySelector('.lightbox-name');
  const lbPrice  = lightbox.querySelector('.lightbox-price');
  const lbColors = lightbox.querySelector('.lightbox-colors');
  const lbWa     = lightbox.querySelector('.lightbox-wa');
  const lbClose  = lightbox.querySelector('.lightbox-close');

  function openLightbox(p) {
    lbImg.src = p.img; lbImg.alt = p.name;
    lbName.textContent   = p.name;
    lbPrice.textContent  = '$' + p.price.toLocaleString('es-CO');
    lbColors.textContent = p.colors.length ? p.colors.join(' · ') : '';
    const msg = encodeURIComponent(`Hola! Me interesa: *${p.name}* ($${p.price.toLocaleString('es-CO')} COP). ¿Está disponible?`);
    lbWa.href = `https://wa.me/${WA_NUMBER}?text=${msg}`;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }
  lbClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

  /* ========== BÚSQUEDA ========== */
  function doSearch() {
    const q   = searchInput.value.trim().toLowerCase();
    const cat = catSelect.value;
    searchClear.style.display = q ? 'block' : 'none';
    if (!q && !cat) { searchRes.style.display = 'none'; return; }

    let results = PRODUCTS;
    if (cat) results = results.filter(p => p.category === cat);
    if (q)   results = results.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.colors.some(c => c.toLowerCase().includes(q))
    );
    results = results.slice(0, 10);

    if (results.length === 0) {
      searchRes.innerHTML = '<div class="search-empty">No se encontraron productos.</div>';
    } else {
      searchRes.innerHTML = results.map(p => `
        <div class="search-item" data-id="${p.id}">
          <img src="${p.img}" alt="${p.name}" onerror="this.style.display='none'">
          <div class="search-item-info">
            <div class="search-item-name">${p.name}</div>
            <div class="search-item-cat">${p.category}</div>
          </div>
          <div class="search-item-price">$${p.price.toLocaleString('es-CO')}</div>
        </div>`).join('');

      searchRes.querySelectorAll('.search-item').forEach(item => {
        item.addEventListener('click', () => {
          const p = PRODUCTS.find(p => p.id === parseInt(item.dataset.id));
          if (p) { searchRes.style.display = 'none'; searchInput.value = ''; openLightbox(p); }
        });
      });
    }
    searchRes.style.display = 'block';
  }

  searchInput.addEventListener('input', doSearch);
  catSelect.addEventListener('change', doSearch);
  searchClear.addEventListener('click', () => {
    searchInput.value = '';
    searchClear.style.display = 'none';
    searchRes.style.display = 'none';
  });
  document.addEventListener('click', e => {
    if (!e.target.closest('.search-wrap')) searchRes.style.display = 'none';
  });

  /* ========== ORDENAR ========== */
  sortSelect.addEventListener('change', () => {
    if (currentCat) renderProducts(currentCat);
  });

  function sortProducts(list) {
    const val = sortSelect.value;
    if (val === 'asc')  return [...list].sort((a,b) => a.price - b.price);
    if (val === 'desc') return [...list].sort((a,b) => b.price - a.price);
    return list;
  }

  /* ========== CATEGORÍAS ========== */
  const ICONS = {
    'Accesorios':'🧢','Blusas y Tops':'👚','Bodies y Corsets':'🪡',
    'Buzos y Sudaderas':'🧥','Camisetas y Camisas':'👕','Chaquetas':'🧤',
    'Conjuntos y Enteriozos':'👗','Faldas':'🩱','Licras':'🩲',
    'Pantalones y Jeans':'👖','Shorts':'🩳','Vestidos':'👘',
  };

  function getCatImg(cat) {
    const prods = PRODUCTS.filter(p => p.category === cat);
    if (!prods.length) return '';
    return prods[Math.floor(Math.random() * Math.min(3, prods.length))].img;
  }

  function renderCategories() {
    catSelect.innerHTML = '<option value="">Todas las categorías</option>' +
      CATEGORIES.map(c => `<option value="${c}">${c}</option>`).join('');

    catGrid.innerHTML = CATEGORIES.map(cat => {
      const n   = PRODUCTS.filter(p => p.category === cat).length;
      const img = getCatImg(cat);
      return `
        <div class="cat-card" data-cat="${cat}">
          <div class="cat-img">
            ${img ? `<img src="${img}" alt="${cat}" onerror="this.style.opacity='0'">` : ''}
            <div class="cat-overlay">
              <span class="cat-icon">${ICONS[cat]||'🛍️'}</span>
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

  function selectCategory(cat) {
    currentCat = cat;
    catLabel.textContent = cat.toUpperCase();
    catTitle.textContent = cat;
    sortSelect.value = '';
    renderProducts(cat);
    categorias.style.display = 'none';
    productos.style.display = 'block';
    setTimeout(() => productos.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
  }

  backBtn.addEventListener('click', () => {
    productos.style.display = 'none';
    categorias.style.display = 'block';
    currentCat = null;
    setTimeout(() => categorias.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
  });

  /* ========== PRODUCTOS ========== */
  function renderProducts(cat) {
    let list = PRODUCTS.filter(p => p.category === cat);
    list = sortProducts(list);
    resultCount.textContent = list.length + (list.length === 1 ? ' producto' : ' productos');

    grid.innerHTML = list.map(p => `
      <div class="product" data-id="${p.id}" style="cursor:pointer;">
        <div class="product-img">
          <img src="${p.img}" alt="${p.name}">
          <div class="placeholder" style="display:none;">
            <div class="ph-icon">+</div>
            <div class="ph-label">Foto pendiente</div>
          </div>
        </div>
        <h4>${p.name}</h4>
        <div class="price">$${p.price.toLocaleString('es-CO')}</div>
        ${p.colors.length ? `<div class="colors">${p.colors.join(' · ')}</div>` : ''}
      </div>`).join('');

    grid.querySelectorAll('.product-img').forEach(box => {
      const img = box.querySelector('img');
      const ph  = box.querySelector('.placeholder');
      img.addEventListener('error', () => { img.style.display='none'; ph.style.display='flex'; });
    });

    grid.querySelectorAll('.product').forEach(card => {
      card.addEventListener('click', () => {
        const p = PRODUCTS.find(p => p.id === parseInt(card.dataset.id));
        if (p) openLightbox(p);
      });
    });
  }

  /* ========== MARQUEE ========== */
  function renderMarquee() {
    const items = ['ENVÍOS A TODO COLOMBIA','99 PRODUCTOS DISPONIBLES','NUEVA COLECCIÓN','PAGA POR WHATSAPP'];
    marquee.innerHTML = [...items,...items].map(t => `<span>${t}</span>`).join('');
  }

  renderCategories();
  renderMarquee();

})();

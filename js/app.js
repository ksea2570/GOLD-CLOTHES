/* ==========================================
   GOLD CLOTHES — Lógica principal
   ========================================== */

(function () {

  const grid       = document.getElementById('product-grid');
  const filterBar  = document.getElementById('filter-bar');
  const resultCount = document.getElementById('result-count');
  const marquee    = document.getElementById('marquee');

  let activeCategory = 'Todos';

  /* --- Formato de precio COP --- */
  function fmtPrice(n) {
    return '$' + n.toLocaleString('es-CO');
  }

  /* --- Renderizar grid de productos --- */
  function render() {
    const list = activeCategory === 'Todos'
      ? PRODUCTS
      : PRODUCTS.filter(p => p.category === activeCategory);

    resultCount.textContent = list.length + (list.length === 1 ? ' producto' : ' productos');

    if (list.length === 0) {
      grid.innerHTML = '<div class="empty-state">No hay productos en esta categoría todavía.</div>';
      return;
    }

    grid.innerHTML = list.map(p => `
      <div class="product">
        <div class="product-img">
          <span class="product-cat-tag">${p.category}</span>
          <img src="${p.img}" alt="${p.name}">
          <div class="placeholder" style="display:none;">
            <div class="ph-icon">+</div>
            <div class="ph-label">Foto pendiente</div>
            <div class="ph-file">${p.img}</div>
          </div>
        </div>
        <h4>${p.name}</h4>
        <div class="price">${fmtPrice(p.price)}</div>
        ${p.colors.length ? `<div class="colors">${p.colors.join(' · ')}</div>` : ''}
      </div>
    `).join('');

    /* Mostrar placeholder si la imagen no existe */
    grid.querySelectorAll('.product-img').forEach(box => {
      const img = box.querySelector('img');
      const ph  = box.querySelector('.placeholder');
      img.addEventListener('error', () => {
        img.style.display = 'none';
        ph.style.display  = 'flex';
      });
    });
  }

  /* --- Renderizar filtros de categoría --- */
  function renderFilters() {
    const cats = ['Todos', ...CATEGORIES];

    filterBar.innerHTML = cats.map(c => {
      const n = c === 'Todos'
        ? PRODUCTS.length
        : PRODUCTS.filter(p => p.category === c).length;
      const isActive = c === activeCategory ? 'active is-gold' : '';
      return `<button class="filter-chip ${isActive}" data-cat="${c}">
        ${c} <span style="opacity:.5">(${n})</span>
      </button>`;
    }).join('');

    filterBar.querySelectorAll('.filter-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        activeCategory = btn.dataset.cat;
        filterBar.querySelectorAll('.filter-chip').forEach(b => b.classList.remove('active', 'is-gold'));
        btn.classList.add('active', 'is-gold');
        render();
      });
    });
  }

  /* --- Renderizar marquee --- */
  function renderMarquee() {
    const items = [
      'ENVÍOS A TODO COLOMBIA',
      '99 PRODUCTOS DISPONIBLES',
      'NUEVA COLECCIÓN',
      'PAGA POR WHATSAPP'
    ];
    const doubled = [...items, ...items];
    marquee.innerHTML = doubled.map(t => `<span>${t}</span>`).join('');
  }

  /* --- Iniciar --- */
  renderFilters();
  render();
  renderMarquee();

})();

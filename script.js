/* ── NAV SCROLL ── */
const navShell = document.getElementById('navShell');
addEventListener('scroll', () => navShell.classList.toggle('scrolled', scrollY > 60), {passive:true});

/* ── HERO PARALLAX + KEN BURNS ── */
const heroBg = document.getElementById('heroBg');
addEventListener('load', () => heroBg && heroBg.classList.add('ready'));
addEventListener('scroll', () => {
  if (heroBg && scrollY < innerHeight) heroBg.style.transform = `translateY(${scrollY * 0.28}px)`;
}, {passive:true});

/* ── SCROLL REVEAL ── */
const ro = new IntersectionObserver(
  entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); }),
  {threshold:0.1, rootMargin:'0px 0px -28px 0px'}
);
document.querySelectorAll('.reveal').forEach(el => ro.observe(el));

/* ── COLLECTION FILTER ── */
function filterProducts(cat, btn) {
  document.querySelectorAll('.ctab').forEach(b => b.classList.remove('on'));
  btn.classList.add('on');
  document.querySelectorAll('.pcard').forEach(c => {
    c.style.display = (cat === 'all' || c.dataset.cat === cat) ? '' : 'none';
  });
}

/* ── SWATCHES ── */
document.querySelectorAll('.pcard-swatches').forEach(g =>
  g.querySelectorAll('.swatch').forEach(s =>
    s.addEventListener('click', e => {
      e.stopPropagation();
      g.querySelectorAll('.swatch').forEach(x => x.classList.remove('on'));
      s.classList.add('on');
    })
  )
);

/* ── MOBILE NAV ── */
const burger = document.getElementById('burger');
const mobileDrawer = document.getElementById('mobileDrawer');
burger && burger.addEventListener('click', () => {
  burger.classList.toggle('open');
  mobileDrawer.classList.toggle('open');
  document.body.style.overflow = mobileDrawer.classList.contains('open') ? 'hidden' : '';
});
document.getElementById('mobileDrawerBg') && document.getElementById('mobileDrawerBg').addEventListener('click', closeMobileNav);
function closeMobileNav() {
  burger.classList.remove('open');
  mobileDrawer.classList.remove('open');
  document.body.style.overflow = '';
}

/* ── CART DRAWER ── */
let cartItems = [];
function openCart() {
  document.getElementById('cartDrawer').classList.add('open');
  document.body.style.overflow = 'hidden';
  renderCart();
}
function closeCart() {
  document.getElementById('cartDrawer').classList.remove('open');
  document.body.style.overflow = '';
}
document.getElementById('cartBg') && document.getElementById('cartBg').addEventListener('click', closeCart);

function addToCart(id, name, price, collection, img) {
  const existing = cartItems.find(i => i.id === id);
  if (existing) { existing.qty++; } else { cartItems.push({id, name, price, collection, img, qty:1}); }
  updateCartCount();
  openCart();
}

function removeFromCart(id) {
  cartItems = cartItems.filter(i => i.id !== id);
  updateCartCount();
  renderCart();
}

function updateCartCount() {
  const total = cartItems.reduce((s, i) => s + i.qty, 0);
  document.querySelectorAll('.cart-count').forEach(el => { el.textContent = total; el.style.display = total ? 'flex' : 'none'; });
}

function renderCart() {
  const body = document.getElementById('cartBody');
  const foot = document.getElementById('cartFoot');
  if (!cartItems.length) {
    body.innerHTML = '<p style="text-align:center;color:var(--warm-grey);font-size:.875rem;padding:3rem 0">Your bag is empty.</p>';
    foot.style.display = 'none'; return;
  }
  foot.style.display = '';
  body.innerHTML = cartItems.map(item => `
    <div class="cart-item">
      <img class="cart-item-img" src="${item.img}" alt="${item.name}"/>
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-meta">${item.collection} · Qty ${item.qty}</div>
        <div class="cart-item-price">${item.price}</div>
        <button class="cart-item-remove" onclick="removeFromCart('${item.id}')">Remove</button>
      </div>
    </div>`).join('');
  const total = cartItems.reduce((s, i) => {
    const n = parseFloat(i.price.replace('£','').replace(',',''));
    return s + n * i.qty;
  }, 0);
  document.getElementById('cartTotal').textContent = '£' + total.toFixed(2);
}

/* ── IMPACT CALCULATOR ── */
const B = {water:1840, co2:4.2, chem:94, wage:22};
const impactRange = document.getElementById('impactRange');
impactRange && impactRange.addEventListener('input', function() {
  const n = +this.value;
  document.getElementById('gCount').textContent = n;
  document.getElementById('rWater').textContent = (B.water * n).toLocaleString();
  document.getElementById('rCo2').textContent = (B.co2 * n).toFixed(1);
  document.getElementById('rChem').textContent = (B.chem * n).toLocaleString();
  document.getElementById('rWage').textContent = '£' + (B.wage * n).toLocaleString();
});

/* ── SUSTAINABILITY SCROLL ── */
const strack = document.getElementById('sustainTrack');
if (strack) {
  let isDown = false, startX, scrollStart;
  strack.addEventListener('mousedown', e => { isDown=true; startX=e.pageX-strack.offsetLeft; scrollStart=strack.scrollLeft; });
  strack.addEventListener('mouseleave', () => isDown=false);
  strack.addEventListener('mouseup', () => isDown=false);
  strack.addEventListener('mousemove', e => { if(!isDown) return; e.preventDefault(); strack.scrollLeft = scrollStart-(e.pageX-strack.offsetLeft-startX); });
  document.getElementById('sLeft') && document.getElementById('sLeft').addEventListener('click', () => strack.scrollBy({left:-310,behavior:'smooth'}));
  document.getElementById('sRight') && document.getElementById('sRight').addEventListener('click', () => strack.scrollBy({left:310,behavior:'smooth'}));
}
const barObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if(e.isIntersecting) e.target.querySelectorAll('.sbar-fill').forEach(b => b.classList.add('go')); });
}, {threshold:0.2});
const sustainSec = document.getElementById('sustainability');
sustainSec && barObs.observe(sustainSec);

/* ── PRODUCT MODAL ── */
const PRODUCTS = {
  'lume-cardigan-ash':  {img:'https://oxfordmeadow.com/cdn/shop/files/OxfordMeadowEarly-06_a316259f-8237-45db-9ac8-012caedf478e.jpg?v=1760994309&width=1200', coll:'Lumé — Women', name:'Lumé Cardigan', colour:'Ash', price:'£279', desc:'Effortless femininity through refined silhouettes. Our bestselling Lumé Cardigan knitted from single-ply Grade A cashmere, hand-finished in Ulaanbaatar. Relaxed fit, open front.', material:'100% Grade A Mongolian Cashmere · 15.5µm max fibre', sizes:['XS','S','M','L','XL'], herder:'Fibre: Davaasuren family, Övörkhangai Province'},
  'lume-crew-cream':    {img:'https://oxfordmeadow.com/cdn/shop/files/OxfordMeadowEarly-05.jpg?v=1760993867&width=1200',                                       coll:'Lumé — Women', name:'Lumé Crew',     colour:'Cream', price:'£246', desc:'Clean design, refined texture. The Lumé Crew is the everyday essential — substantial enough to stand alone, minimal enough to layer.',                                    material:'100% Grade A Mongolian Cashmere · 15.5µm max fibre', sizes:['XS','S','M','L','XL'], herder:'Fibre: Enkhjargal family, Arkhangai Province'},
  'lume-crew-copper':   {img:'https://oxfordmeadow.com/cdn/shop/files/IMG_8037.jpg?v=1761598644&width=1200',                                                   coll:'Lumé — Women', name:'Lumé Crew',     colour:'Deep Copper', price:'£246', desc:'Clean design, refined texture. The Lumé Crew is the everyday essential — substantial enough to stand alone, minimal enough to layer.',                              material:'100% Grade A Mongolian Cashmere · 15.5µm max fibre', sizes:['XS','S','M','L','XL'], herder:'Fibre: Enkhjargal family, Arkhangai Province'},
  'lume-high-ash':      {img:'https://oxfordmeadow.com/cdn/shop/files/IMG_6871.jpg?v=1761597877&width=1200',                                                   coll:'Lumé — Women', name:'Lumé High',     colour:'Ash', price:'£489', desc:'Our most sculptural piece. A high-neck silhouette with extraordinary drape, hand-finished to a standard most brands reserve for couture. Limited production.',     material:'100% Grade A Mongolian Cashmere · 15.5µm · Double-ply', sizes:['XS','S','M','L'], herder:'Fibre: Munkhjargal family, Övörkhangai Province'},
  'lume-high-copper':   {img:'https://oxfordmeadow.com/cdn/shop/files/IMG_7292.jpg?v=1761598043&width=1200',                                                   coll:'Lumé — Women', name:'Lumé High',     colour:'Deep Copper', price:'£489', desc:'Our most sculptural piece. A high-neck silhouette with extraordinary drape, hand-finished to a standard most brands reserve for couture. Limited production.',  material:'100% Grade A Mongolian Cashmere · 15.5µm · Double-ply', sizes:['XS','S','M','L'], herder:'Fibre: Munkhjargal family, Övörkhangai Province'},
  'qf-crew-ash':        {img:'https://oxfordmeadow.com/cdn/shop/files/IMG_6592.jpg?v=1761597825&width=1200',                                                   coll:'Quiet Form — Men', name:'Quiet Form Crew', colour:'Ash', price:'£265', desc:'Clean design that redefines modern essentials. Built for a lifetime of wear — neither trend-driven nor timid. Substantial weight, perfect structure.',               material:'100% Grade A Mongolian Cashmere · 15.5µm max fibre', sizes:['S','M','L','XL','XXL'], herder:'Fibre: Gantulga family, Arkhangai Province'},
  'qf-crew-noir':       {img:'https://oxfordmeadow.com/cdn/shop/files/OxfordMeadowEarly-02.jpg?v=1760982993&width=1200',                                       coll:'Quiet Form — Men', name:'Quiet Form Crew', colour:'Noir', price:'£265', desc:'Clean design that redefines modern essentials. Built for a lifetime of wear — neither trend-driven nor timid. Substantial weight, perfect structure.',               material:'100% Grade A Mongolian Cashmere · 15.5µm max fibre', sizes:['S','M','L','XL','XXL'], herder:'Fibre: Gantulga family, Arkhangai Province'},
  'qf-vee-ash':         {img:'https://oxfordmeadow.com/cdn/shop/files/IMG_7531.jpg?v=1761598454&width=1200',                                                   coll:'Quiet Form — Men', name:'Quiet Form Vee', colour:'Ash', price:'£219', desc:'The V-neck that earns its price. Worn over a shirt or alone — the piece that disappears into your wardrobe and reappears constantly.',                                  material:'100% Grade A Mongolian Cashmere · 15.5µm max fibre', sizes:['S','M','L','XL','XXL'], herder:'Fibre: Gantulga family, Arkhangai Province'},
  'qf-vee-copper':      {img:'https://oxfordmeadow.com/cdn/shop/files/IMG_7822_2b5e7fa7-a3b1-45ee-9d43-7fd677753263.jpg?v=1761822244&width=1200',              coll:'Quiet Form — Men', name:'Quiet Form Vee', colour:'Deep Copper', price:'£219', desc:'The V-neck that earns its price. Worn over a shirt or alone — the piece that disappears into your wardrobe and reappears constantly.',                              material:'100% Grade A Mongolian Cashmere · 15.5µm max fibre', sizes:['S','M','L','XL','XXL'], herder:'Fibre: Gantulga family, Arkhangai Province'},
  'ox-wrap':            {img:'https://oxfordmeadow.com/cdn/shop/collections/IMG_7994_ef08a8e2-05f6-4bfd-b7af-fde96af73c5b.jpg?v=1762036123&width=1200',        coll:'The Ox Haven', name:'Ox Haven Wrap', colour:'Deep Copper', price:'£165', desc:'200×70cm of pure Mongolian cashmere. Worn as a scarf, shawl, or light blanket. Hand-finished fringe. The most versatile thing in your wardrobe.',                material:'100% Pure Mongolian Cashmere', sizes:['One Size'], herder:'Fibre: Nominchimeg family, Övörkhangai Province'},
  'ox-hat':             {img:'https://oxfordmeadow.com/cdn/shop/collections/IMG_7794_12864f48-ea3e-4ff0-8ca7-a52f055bcede.jpg?v=1762036141&width=1200',        coll:'The Ox Haven', name:'Ox Haven Hat',  colour:'Noir', price:'£95', desc:'Ribbed, slouched, made to last. The entry point to Oxford Meadow — proof that £95 spent once is better than £30 spent five times.',                                    material:'100% Pure Mongolian Cashmere', sizes:['One Size'], herder:'Fibre: Davaasuren family, Övörkhangai Province'},
  'ox-gloves':          {img:'https://oxfordmeadow.com/cdn/shop/collections/IMG_7961.jpg?v=1762036053&width=1200',                                             coll:'The Ox Haven', name:'Ox Haven Gloves', colour:'Navy', price:'£125', desc:'Full-finger cashmere gloves with ribbed cuff. Warm enough for a Scottish winter, light enough for a coat pocket.',                                                    material:'100% Pure Mongolian Cashmere', sizes:['S/M','M/L'], herder:'Fibre: Enkhjargal family, Arkhangai Province'},
};

function openModal(id) {
  const p = PRODUCTS[id]; if (!p) return;
  document.getElementById('mImg').src = p.img;
  document.getElementById('mImg').alt = p.name;
  document.getElementById('mBody').innerHTML = `
    <div class="modal-prov"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>Made in Mongolia</div>
    <div class="modal-coll">${p.coll}</div>
    <h2 class="modal-name">${p.name} — ${p.colour}</h2>
    <p class="modal-price">${p.price}</p>
    <p class="modal-desc">${p.desc}</p>
    <p style="font-size:.7rem;color:var(--copper);font-weight:600;margin-bottom:1.25rem;letter-spacing:.06em">${p.material}</p>
    <p class="sz-label">Size</p>
    <div class="sizes">${p.sizes.map((s,i)=>`<button class="sz${i===1?' on':''}" onclick="pickSz(this)">${s}</button>`).join('')}</div>
    <button class="add-btn" onclick="handleAddToCart('${id}',${JSON.stringify(p.name)},${JSON.stringify(p.price)},${JSON.stringify(p.coll)},${JSON.stringify(p.img)},this)">Add to Bag — ${p.price}</button>
    <button class="apple-btn">Buy with  Pay</button>
    <div class="modal-perks">
      <div class="modal-perk"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M5 12h14M12 5l7 7-7 7"/></svg>Free carbon-neutral delivery on orders over £150</div>
      <div class="modal-perk"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M9 11l3 3L22 4"/></svg>Free returns within 30 days</div>
      <div class="modal-perk"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>Lifetime repair — free, forever</div>
      <div class="modal-perk"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>${p.herder}</div>
    </div>`;
  document.getElementById('overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function handleAddToCart(id, name, price, coll, img, btn) {
  addToCart(id, name, price, coll, img);
  document.getElementById('overlay').classList.remove('open');
  document.body.style.overflow = '';
}

function closeModal(e, force) {
  if (force || (e && e.target === document.getElementById('overlay'))) {
    document.getElementById('overlay').classList.remove('open');
    document.body.style.overflow = '';
  }
}

function pickSz(btn) {
  btn.closest('.sizes').querySelectorAll('.sz').forEach(b => b.classList.remove('on'));
  btn.classList.add('on');
}

document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeModal(null,true); closeCart(); closeMobileNav && closeMobileNav(); }});

/* ── NEWSLETTER ── */
function handleSub(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button');
  btn.textContent = "✓ You're in";
  btn.style.background = 'var(--forest)';
  e.target.querySelector('input').value = '';
  setTimeout(() => { btn.textContent = 'Subscribe'; btn.style.background = ''; }, 3000);
}

/* ── INIT CART COUNT HIDE ── */
document.querySelectorAll('.cart-count').forEach(el => el.style.display = 'none');

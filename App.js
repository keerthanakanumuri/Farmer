// app.js - Dashboard logic (products, waste, contracts, profile, translations, charts)

// ---------- Helpers ----------
const $ = sel => document.querySelector(sel);
const $$ = sel => document.querySelectorAll(sel);

// ---------- Data keys in localStorage ----------
const KEY_USER = 'farmerUser';
const KEY_PRODUCTS = 'farmerProducts';
const KEY_WASTE = 'farmerWaste';
const KEY_CONTRACTS = 'farmerContracts';
const KEY_NOTIFS = 'farmerNotifs';
const KEY_LANG = 'kisan_lang';

// ---------- Default demo data (if none) ----------
if(!localStorage.getItem(KEY_PRODUCTS)){
  localStorage.setItem(KEY_PRODUCTS, JSON.stringify([
    {title:'Wheat',quantity:500,quality:'A',price:25,image:null,createdAt:Date.now()},
    {title:'Tomatoes',quantity:200,quality:'B',price:30,image:null,createdAt:Date.now()},
    {title:'Onions',quantity:150,quality:'B',price:20,image:null,createdAt:Date.now()}
  ]));
}
if(!localStorage.getItem(KEY_WASTE)){
  localStorage.setItem(KEY_WASTE, JSON.stringify([]));
}
if(!localStorage.getItem(KEY_CONTRACTS)){
  localStorage.setItem(KEY_CONTRACTS, JSON.stringify([]));
}
if(!localStorage.getItem(KEY_NOTIFS)){
  localStorage.setItem(KEY_NOTIFS, JSON.stringify([{id:1,text:'Welcome to Kisan Saathi!'}]));
}

// ---------- Auth check ----------
if(localStorage.getItem('loggedIn')!=='true'){
  // Not logged in: redirect to login page
  window.location.href = 'login.html';
}

// ---------- Elements ----------
const navLinks = document.querySelectorAll('#mainNav a[data-view]');
const views = document.querySelectorAll('.view');
const pageTitle = $('#pageTitle');
const sideUserName = $('#sideUserName');
const topUserName = $('#topUserName');
const topProfilePic = $('#topProfilePic');
const overviewPic = $('#overviewPic');
const profilePicLarge = $('#profilePicLarge');
const profileNameLarge = $('#profileNameLarge');
const profilePicInput = $('#profilePicInput');

// Language
const langButtons = $$('.lang-btn');
let currentLang = localStorage.getItem(KEY_LANG) || 'en';

// ---------- TRANSLATIONS ----------
const TRANSLATIONS = {
  en: {
    portalName:'Kisan Saathi', portalSub:'Farmer Portal',
    navOverview:'Overview', navAdd:'Add Products', navProducts:'My Products', navWaste:'Agro Waste', navContracts:'Contracts', navProfile:'Profile',
    signedIn:'Signed in as', farmerProfile:'Farmer Profile', listedProducts:'Listed Products', wasteItems:'Agro Waste Items', salesChart:'Sales & Income',
    totals:'Totals', addProductHeading:'Add Product', myProducts:'My Products', agroWasteHeading:'Agro Waste', contractsHeading:'Contracts', profileHeading:'Profile',
    colImage:'Image', colName:'Name', colQty:'Qty', colQuality:'Quality', colPrice:'Price', colActions:'Actions'
  },
  hi: {
    portalName:'किसान साथी', portalSub:'किसान पोर्टल',
    navOverview:'अवलोकन', navAdd:'उत्पाद जोड़ें', navProducts:'मेरे उत्पाद', navWaste:'एग्रो वेस्ट', navContracts:'अनुबंध', navProfile:'प्रोफ़ाइल',
    signedIn:'साइन इन', farmerProfile:'किसान प्रोफ़ाइल', listedProducts:'सूचीबद्ध उत्पाद', wasteItems:'एग्रो वेस्ट आइटम', salesChart:'बिक्री और आय',
    totals:'कुल', addProductHeading:'उत्पाद जोड़ें', myProducts:'मेरे उत्पाद', agroWasteHeading:'एग्रो वेस्ट', contractsHeading:'अनुबंध', profileHeading:'प्रोफ़ाइल',
    colImage:'तस्वीर', colName:'नाम', colQty:'मात्रा', colQuality:'गुणवत्ता', colPrice:'मूल्य', colActions:'क्रियाएँ'
  },
  te: {
    portalName:'కిసాన్ సాథీ', portalSub:'ఫార్మర్ పోర్టల్',
    navOverview:'అవలోకనం', navAdd:'ఉత్పత్తులు జోడించండి', navProducts:'నా ఉత్పత్తులు', navWaste:'అగ్రో వ్యర్థాలు', navContracts:'ఒప్పందాలు', navProfile:'ప్రొఫైల్',
    signedIn:'సైన్ ఇన్', farmerProfile:'రైతు ప్రొఫైల్', listedProducts:'జాబితా ఉత్పత్తులు', wasteItems:'అగ్రో వ్యర్థాలు', salesChart:'సేల్స్ & ఆదాయం',
    totals:'మొత్తం', addProductHeading:'ఉత్పత్తి జోడించు', myProducts:'నా ఉత్పత్తులు', agroWasteHeading:'అగ్రో వ్యర్థాలు', contractsHeading:'ఒప్పందాలు', profileHeading:'ప్రొఫైల్',
    colImage:'చిత్రం', colName:'పేరు', colQty:'సంఖ్య', colQuality:'నాణ్యత', colPrice:'ధర', colActions:'చర్యలు'
  }
};

function applyLanguage(lang){
  document.querySelectorAll('[data-i18n]').forEach(el=>{
    const key = el.getAttribute('data-i18n');
    if(TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) el.innerText = TRANSLATIONS[lang][key];
  });
  // active lang button
  langButtons.forEach(b=>b.classList.remove('active'));
  $('#lang-' + lang).classList.add('active');
  localStorage.setItem(KEY_LANG, lang);
  currentLang = lang;
}
applyLanguage(currentLang);

// listen language toggle
$('#lang-en').addEventListener('click', ()=> applyLanguage('en'));
$('#lang-hi').addEventListener('click', ()=> applyLanguage('hi'));
$('#lang-te').addEventListener('click', ()=> applyLanguage('te'));

// ---------- Load user and show in UI ----------
const user = JSON.parse(localStorage.getItem(KEY_USER) || '{}');
function updateUserUI(){
  const name = user.name || 'Farmer';
  sideUserName.innerText = name;
  topUserName.innerText = name;
  profileNameLarge.innerText = name;
  $('#overviewName').innerText = name;
  // profile pic
  const pic = user.pic || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop';
  topProfilePic.src = pic;
  overviewPic.src = pic;
  profilePicLarge.src = pic;
}
updateUserUI();

// allow changing profile picture
profilePicInput && profilePicInput.addEventListener('change', (e)=>{
  const f = e.target.files[0];
  if(!f) return;
  const r = new FileReader();
  r.onload = ev => {
    user.pic = ev.target.result;
    localStorage.setItem(KEY_USER, JSON.stringify(user));
    updateUserUI();
    alert('Profile picture updated');
  };
  r.readAsDataURL(f);
});

// ---------- Navigation (sidebar) ----------
navLinks.forEach(a=>{
  a.addEventListener('click', (ev)=>{
    ev.preventDefault();
    navLinks.forEach(x=>x.classList.remove('active'));
    a.classList.add('active');
    const view = a.dataset.view;
    showView(view);
  });
});
function hideAllViews(){ views.forEach(v => v.style.display = 'none'); }
function showView(view){
  hideAllViews();
  const el = document.getElementById('view-' + view);
  if(el) el.style.display = 'block';
  pageTitle.innerText = (document.querySelector('.nav a.active .label') || document.querySelector('.nav a.active')).innerText || view;
}
// default
showView('overview');

// sidebar collapse/hamburger
$('#collapseBtn').addEventListener('click', ()=>{
  document.getElementById('sidebar').classList.toggle('collapsed');
  document.querySelector('.main-wrap').classList.toggle('collapsed');
});
$('#hamburger').addEventListener('click', ()=>{
  document.getElementById('sidebar').classList.toggle('collapsed');
  document.querySelector('.main-wrap').classList.toggle('collapsed');
});

// ---------- Notifications ----------
function renderNotifs(){
  const notifs = JSON.parse(localStorage.getItem(KEY_NOTIFS) || '[]');
  const n = notifs.length;
  const badge = $('#notifCount');
  if(n>0){ badge.style.display = 'inline-block'; badge.innerText = n; } else badge.style.display='none';
}
$('#notifBtn').addEventListener('click', ()=>{
  const notifs = JSON.parse(localStorage.getItem(KEY_NOTIFS) || '[]');
  if(notifs.length===0) { alert('No notifications'); return; }
  let text = 'Notifications:\\n\\n';
  notifs.forEach(n=> text += `• ${n.text}\\n`);
  alert(text);
  // clear
  localStorage.setItem(KEY_NOTIFS, JSON.stringify([]));
  renderNotifs();
});
renderNotifs();

// ---------- PRODUCTS: add/edit/delete/render ----------
function loadProducts(){ return JSON.parse(localStorage.getItem(KEY_PRODUCTS) || '[]'); }
function saveProducts(arr){ localStorage.setItem(KEY_PRODUCTS, JSON.stringify(arr)); renderProducts(); renderOverviewStats(); updateChart(); }

function renderProducts(){
  const products = loadProducts();
  const tbody = document.querySelector('#productsTable tbody');
  tbody.innerHTML = '';
  products.forEach((p,i) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="width:80px"><img src="${p.image || 'https://via.placeholder.com/80'}" class="img-thumb" /></td>
      <td>${p.title}</td>
      <td>${p.quantity} kg</td>
      <td>${p.quality || '-'}</td>
      <td>₹${p.price}</td>
      <td>
        <button class="btn ghost" onclick="editProduct(${i})">Edit</button>
        <button class="btn" onclick="deleteProduct(${i})">Delete</button>
      </td>`;
    tbody.appendChild(tr);
  });
  // overview table (selling)
  const otbody = document.querySelector('#view-products table') ? document.querySelector('#view-products table tbody') : null;
  // also fill overview selling area in the overview view
  const overviewTbody = document.querySelector('#view-overview table#productsTableOverview tbody');
  // but we used different element; simpler: populate overviewProducts area:
  const overviewProducts = document.querySelector('#view-overview #overviewProducts');
  if(overviewProducts){
    // replaced earlier structure: we have table with id "overviewProducts" in the initial template; ensure it exists
  }
}
window.editProduct = function(i){
  const arr = loadProducts();
  const p = arr[i];
  // open minimal prompts for editing
  const title = prompt('Edit product name', p.title);
  if(title === null) return;
  const qty = prompt('Quantity (kg)', p.quantity);
  if(qty === null) return;
  const price = prompt('Price per unit (₹)', p.price);
  if(price === null) return;
  p.title = title; p.quantity = Number(qty); p.price = Number(price);
  arr[i] = p;
  saveProducts(arr);
  alert('Product updated');
};
window.deleteProduct = function(i){
  if(!confirm('Delete this product?')) return;
  const arr = loadProducts();
  arr.splice(i,1);
  saveProducts(arr);
};

// Add product form with image upload
$('#addProductForm').addEventListener('submit', function(e){
  e.preventDefault();
  const title = $('#p_title').value.trim();
  const price = Number($('#p_price').value || 0);
  const quantity = Number($('#p_quantity').value || 0);
  const quality = $('#p_quality').value || '';
  const desc = $('#p_desc').value || '';

  const file = $('#p_image').files[0];
  if(file){
    const reader = new FileReader();
    reader.onload = function(ev){
      const imageData = ev.target.result;
      const arr = loadProducts();
      arr.push({ title, price, quantity, quality, desc, image: imageData, createdAt: Date.now() });
      saveProducts(arr);
      e.target.reset();
      $('#uploadPreview').innerHTML = '';
    };
    reader.readAsDataURL(file);
  } else {
    const arr = loadProducts();
    arr.push({ title, price, quantity, quality, desc, image: null, createdAt: Date.now() });
    saveProducts(arr);
    e.target.reset();
    $('#uploadPreview').innerHTML = '';
  }
});

// show preview of uploaded product image
$('#p_image').addEventListener('change', (ev)=>{
  const f = ev.target.files[0];
  if(!f){ $('#uploadPreview').innerHTML=''; return; }
  const r = new FileReader();
  r.onload = e => $('#uploadPreview').innerHTML = `<img src="${e.target.result}" style="width:60px;height:45px;object-fit:cover;border-radius:6px"/>`;
  r.readAsDataURL(f);
});

// render overview product rows
function renderOverviewProducts(){
  const arr = loadProducts();
  const container = document.getElementById('view-overview').querySelector('#overviewProducts');
  if(!container) return;
  container.innerHTML = '';
  arr.forEach(p=>{
    const tr = document.createElement('tr');
    tr.style.background = '#f9f9f9';
    tr.innerHTML = `<td>${p.title}</td><td>${p.quantity} kg</td><td>₹${p.price}/kg</td>`;
    container.appendChild(tr);
  });
}

// ---------- WASTE ----------
function loadWaste(){ return JSON.parse(localStorage.getItem(KEY_WASTE) || '[]'); }
function saveWaste(arr){ localStorage.setItem(KEY_WASTE, JSON.stringify(arr)); renderWaste(); renderOverviewStats(); }

function renderWaste(){
  const arr = loadWaste();
  const tbody = $('#wasteTable');
  tbody.innerHTML = '';
  arr.forEach((w,i)=>{
    const row = document.createElement('tr');
    row.innerHTML = `<td>${w.name}</td><td>${w.qty}</td><td>${w.type}</td><td>₹${w.price||0}</td><td><button class="btn" onclick="deleteWaste(${i})">Delete</button></td>`;
    tbody.appendChild(row);
  });
}
window.deleteWaste = function(i){
  if(!confirm('Delete waste item?')) return;
  const arr = loadWaste();
  arr.splice(i,1);
  saveWaste(arr);
};

$('#addWasteForm').addEventListener('submit', function(e){
  e.preventDefault();
  const name = $('#w_name').value.trim();
  const qty = Number($('#w_qty').value || 0);
  const type = $('#w_type').value;
  const price = Number($('#w_price').value || 0);
  const arr = loadWaste();
  arr.push({ name, qty, type, price, createdAt: Date.now() });
  saveWaste(arr);
  e.target.reset();
});

// ---------- CONTRACTS ----------
function loadContracts(){ return JSON.parse(localStorage.getItem(KEY_CONTRACTS)||'[]'); }
function saveContracts(arr){ localStorage.setItem(KEY_CONTRACTS, JSON.stringify(arr)); renderContracts(); renderOverviewStats(); }

function renderContracts(){
  const arr = loadContracts();
  const container = $('#contractsList');
  container.innerHTML = '';
  if(arr.length === 0){ container.innerHTML = '<div class="card">No contracts</div>'; return; }
  arr.forEach((c, i) => {
    const el = document.createElement('div'); el.className='card'; el.style.marginBottom='8px';
    el.innerHTML = `<div style="display:flex;justify-content:space-between"><div><strong>${c.buyer}</strong> — ${c.crop}</div>
      <div>${c.status || 'ongoing'}</div></div><div style="margin-top:8px">Qty: ${c.qty} kg • ₹${c.price}/kg • <button onclick="updateContract(${i})" class="btn small">Mark done</button></div>`;
    container.appendChild(el);
  });
}
$('#addContractForm').addEventListener('submit', function(e){
  e.preventDefault();
  const buyer = $('#c_buyer').value.trim();
  const crop = $('#c_crop').value.trim();
  const qty = Number($('#c_qty').value || 0);
  const price = Number($('#c_price').value || 0);
  const arr = loadContracts();
  arr.push({ buyer, crop, qty, price, status:'ongoing', createdAt: Date.now() });
  saveContracts(arr);
  e.target.reset();
});
window.updateContract = function(i){
  const arr = loadContracts();
  arr[i].status = 'completed';
  saveContracts(arr);
};

// ---------- Overview totals & stats ----------
function renderOverviewStats(){
  const products = loadProducts();
  const waste = loadWaste();
  const contracts = loadContracts();

  $('#statProducts').innerText = products.length;
  $('#statWaste').innerText = waste.length;

  // totals: sales = number of products sold (count), income = sum price*qty
  let totalSales = products.length;
  let totalIncome = products.reduce((s,p)=> s + (Number(p.price||0) * Number(p.quantity||0)), 0);
  $('#totalSales').innerText = totalSales;
  $('#totalIncome').innerText = '₹' + totalIncome;

  // push a notification example when new product count changes (optional)
}
renderOverviewStats();

// ---------- Chart (sales over months demo) ----------
let salesChart = null;
function updateChart(){
  // demo sales data from products by month (simple aggregated)
  const products = loadProducts();
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const data = new Array(12).fill(0);
  products.forEach(p=>{
    const m = new Date(p.createdAt || Date.now()).getMonth();
    data[m] += (Number(p.price||0) * Number(p.quantity || 0));
  });
  const ctx = document.getElementById('salesChart').getContext('2d');
  if(salesChart) salesChart.destroy();
  salesChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: months,
      datasets: [
        { label: 'Income (₹)', data: data, backgroundColor: 'rgba(46,139,62,0.8)' }
      ]
    },
    options: { responsive:true, plugins:{legend:{display:false}} }
  });
}
updateChart();

// ---------- Renderers init ----------
function initializeRenderers(){
  renderProducts(); // may be empty but used in table
  // Build products table manually (we used renderProducts earlier mostly for productsTable, implement now)
  function fillProductsTable(){
    const arr = loadProducts();
    const tbody = document.querySelector('#productsTable tbody');
    tbody.innerHTML = '';
    arr.forEach((p,i)=>{
      const tr = document.createElement('tr');
      tr.innerHTML = `<td style="width:80px"><img src="${p.image || 'https://via.placeholder.com/80'}" class="img-thumb" /></td>
        <td>${p.title}</td>
        <td>${p.quantity} kg</td>
        <td>${p.quality || '-'}</td>
        <td>₹${p.price}</td>
        <td><button class="btn ghost" onclick="editProduct(${i})">Edit</button> <button class="btn" onclick="deleteProduct(${i})">Delete</button></td>`;
      tbody.appendChild(tr);
    });
  }
  // override renderProducts to call fillProductsTable + overview table
  window.renderProducts = function(){
    fillProductsTable();
    renderOverviewProducts();
    renderOverviewStats();
    updateChart();
  };
  renderProducts();

  renderWaste();
  renderContracts();
  renderNotifs();
}
initializeRenderers();

// ---------- Profile editing (change name etc) ----------
$('#editProfileBtn') && $('#editProfileBtn').addEventListener('click', ()=>{
  const newName = prompt('Your name', user.name || '');
  if(newName){ user.name = newName; localStorage.setItem(KEY_USER, JSON.stringify(user)); updateUserUI(); }
});

// change top user picture click -> open file dialog
$('#profilePicInput') && $('#profilePicInput').addEventListener('change', (ev)=>{
  const f = ev.target.files[0]; if(!f) return;
  const r = new FileReader(); r.onload = e => { user.pic = e.target.result; localStorage.setItem(KEY_USER, JSON.stringify(user)); updateUserUI(); alert('Profile updated'); }; r.readAsDataURL(f);
});

// ---------- Logout ----------
$('#logoutBtn').addEventListener('click', ()=>{
  if(confirm('Logout?')){ localStorage.removeItem('loggedIn'); window.location.href = 'login.html'; }
});



// ===== Test data — replace with real clinic info =====
const IMGS = ['p6.jpg', 'p5.jpg', 'p7.jpg', 'p8.jpg'];
const CLINICS = [
  { id: 'saburtalo',   name: 'საბურთალო',   city: 'თბილისი', region: 'tbilisi' },
  { id: 'tskneti',     name: 'წყნეთი',      city: 'თბილისი', region: 'tbilisi' },
  { id: 'gldani',      name: 'გლდანი',      city: 'თბილისი', region: 'tbilisi' },
  { id: 'varketili',   name: 'ვარკეთილი',   city: 'თბილისი', region: 'tbilisi' },
  { id: 'senaki',      name: 'სენაკი',      city: 'სამეგრელო', region: 'west' },
  { id: 'khobi',       name: 'ხობი',        city: 'სამეგრელო', region: 'west' },
  { id: 'tsalenjikha', name: 'წალენჯიხა',   city: 'სამეგრელო', region: 'west' },
  { id: 'zugdidi',     name: 'ზუგდიდი',     city: 'სამეგრელო', region: 'west' },
  { id: 'poti',        name: 'ფოთი',        city: 'სამეგრელო', region: 'west' },
  { id: 'kutaisi',     name: 'ქუთაისი',     city: 'იმერეთი',  region: 'west' },
].map((c, i) => ({
  ...c,
  img: IMGS[i % IMGS.length],
  address: `${c.region === 'tbilisi' ? 'თბილისი, ' + c.name : c.name}, მისამართი დასაზუსტებელია`,
  days: 'ორშაბათი – შაბათი',
  hours: '09:00 – 18:00',
  phone: '+995 XXX XX XX XX',
  email: 'infodiomedi@gmail.com',
  doctors: [
    { n: 'ნინო გელაშვილი', s: 'ოჯახის ექიმი' },
    { n: 'გიორგი ბერიძე', s: 'კარდიოლოგი' },
    { n: 'მარიამ ქავთარაძე', s: 'პედიატრი' },
  ],
}));

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const arrow = '<svg><use href="#i-arrow"/></svg>';
let current = CLINICS[0].id;

// Mega menu, mobile menu, form select
(function fillMenus() {
  const groups = [['tbilisi', 'თბილისი'], ['west', 'რეგიონები']];
  const mega = $('#megaClinics');
  groups.forEach(([r, label]) => {
    const col = document.createElement('div');
    col.innerHTML = `<div class="mega-group-label">${label}</div>` +
      CLINICS.filter(c => c.region === r).map(c => `<a href="#clinics" data-clinic="${c.id}">${c.name}</a>`).join('');
    mega.appendChild(col);
  });
  $('#mobileClinics').innerHTML = CLINICS.map(c => `<a href="#clinics" data-clinic="${c.id}">${c.name}</a>`).join('');
  $('#formClinic').innerHTML = CLINICS.map(c => `<option>${c.name}</option>`).join('');
})();

function renderList(region = 'all') {
  const list = CLINICS.filter(c => region === 'all' || c.region === region);
  $('#clinicList').innerHTML = list.map(c => `
    <button class="clinic-btn ${c.id === current ? 'active' : ''}" data-clinic="${c.id}">
      <span class="num">${String(CLINICS.indexOf(c) + 1).padStart(2, '0')}</span>
      <span><strong>${c.name}</strong><small>${c.city}</small></span>
      <svg class="arr"><use href="#i-arrow"/></svg>
    </button>`).join('');
}

function renderDetail(id) {
  const c = CLINICS.find(x => x.id === id);
  current = id;
  const initials = n => n.split(' ').map(w => w[0]).join('');
  $('#clinicDetail').innerHTML = `
    <div class="cd-img"><img src="assets/img/${c.img}" alt="${c.name}"><span class="tag"><i></i>ღიაა ახლა</span></div>
    <div class="cd-body">
      <h3>${c.name}</h3>
      <div class="addr"><svg><use href="#i-pin"/></svg>${c.address}</div>
      <div class="cd-info">
        <div><small>სამუშაო დღეები</small><b>${c.days}</b></div>
        <div><small>სამუშაო საათები</small><b>${c.hours}</b></div>
        <div><small>ტელეფონი</small><b>${c.phone}</b></div>
        <div><small>ელ-ფოსტა</small><b>${c.email}</b></div>
      </div>
      <div class="cd-doctors">
        <h4><span>ექიმები</span><span>${c.doctors.length} სპეციალისტი</span></h4>
        ${c.doctors.map(d => `<div class="doc-row"><span class="doc-av">${initials(d.n)}</span><div><strong>${d.n}</strong><span>${d.s}</span></div></div>`).join('')}
      </div>
      <a href="#contact" class="btn btn-primary" style="margin-top:22px">ჩაწერა ამ კლინიკაში ${arrow}</a>
    </div>`;
  $$('.clinic-btn').forEach(b => b.classList.toggle('active', b.dataset.clinic === id));
}

renderList();
renderDetail(current);

document.addEventListener('click', e => {
  const cb = e.target.closest('[data-clinic]');
  if (cb) {
    renderDetail(cb.dataset.clinic);
    closeNav();
  }
  const rf = e.target.closest('#regionFilter button');
  if (rf) {
    $$('#regionFilter button').forEach(b => b.classList.toggle('active', b === rf));
    renderList(rf.dataset.region);
    const first = CLINICS.find(c => rf.dataset.region === 'all' || c.region === rf.dataset.region);
    renderDetail(first.id);
  }
  const mv = e.target.closest('[data-tab], [data-mv]');
  if (mv) setMv(mv.dataset.tab || mv.dataset.mv);
  const lib = e.target.closest('[data-lib]');
  if (lib) setLib(lib.dataset.lib);
  const g = e.target.closest('.g-item');
  if (g) { $('#lightbox img').src = g.querySelector('img').src; $('#lightbox').classList.add('open'); }
  if (e.target.closest('#lightbox')) $('#lightbox').classList.remove('open');
});

function setMv(id) {
  $$('.mv-tabs button').forEach(b => b.classList.toggle('active', b.dataset.tab === id));
  $$('.mv-panel').forEach(p => p.classList.toggle('active', p.id === 'mv-' + id));
}
function setLib(id) {
  $$('#libTabs button').forEach(b => b.classList.toggle('active', b.dataset.lib === id));
  $$('.lib-panel').forEach(p => p.classList.toggle('active', p.id === 'lib-' + id));
}

// Mobile nav
const nav = $('#mobileNav');
function closeNav() { nav.classList.remove('open'); }
$('#burger').onclick = () => nav.classList.add('open');
$('#closeNav').onclick = closeNav;
$$('#mobileNav a').forEach(a => a.addEventListener('click', closeNav));

// Header shadow
addEventListener('scroll', () => $('#header').classList.toggle('scrolled', scrollY > 10), { passive: true });

// Reveal + counters
const io = new IntersectionObserver(entries => entries.forEach(en => {
  if (!en.isIntersecting) return;
  en.target.classList.add('in');
  io.unobserve(en.target);
}), { threshold: .12 });
$$('.reveal').forEach((el, i) => { el.style.transitionDelay = (i % 4) * 80 + 'ms'; io.observe(el); });

const co = new IntersectionObserver(entries => entries.forEach(en => {
  if (!en.isIntersecting) return;
  const el = en.target, end = +el.dataset.count, suf = el.dataset.suffix || '';
  const t0 = performance.now();
  const step = t => {
    const p = Math.min((t - t0) / 1600, 1);
    el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))) + suf;
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
  co.unobserve(el);
}), { threshold: .5 });
$$('[data-count]').forEach(el => co.observe(el));

(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Bahasa ---------- */
  const T = {
    id: {
      nav_about: 'Tentang', nav_skill: 'Skill', nav_projects: 'Proyek', nav_contact: 'Kontak',
      hero_lead: 'Developer web yang pemalas, tapi ide-idenya nggak habis-habis.',
      btn_wa: 'Chat WhatsApp', btn_projects: 'Lihat proyek', btn_open: 'Buka web',
      about_t: 'Tentang aku',
      about_p1: 'Aku developer web yang pemalas tapi punya ide yang banyak. Kadang aku juga ngedit gabut di Alight Motion.',
      about_p2: 'Aku sering bikin proyek website baru yang mirip web publik lainnya, tapi tampilannya beda dan aku tambahin fitur lain yang berguna kalau dibutuhkan.',
      f_name: 'Nama', f_city: 'Asal', f_do: 'Bikin',
      skill_t: 'Skill & hobi',
      h1_t: 'Main game', h1_p: 'Cara paling enak buat istirahat dari ngoding.',
      h2_t: 'Nonton manhwa', h2_p: 'Sumber ide dan penghilang gabut.',
      h3_t: 'Edit video', h3_p: 'Ngedit santai di Alight Motion.',
      proj_t: 'Proyek',
      p1_p: 'Email sementara, buat kamu yang nggak mau pakai email utama.',
      p2_t: 'Proyek berikutnya', p2_p: 'Lagi dikerjain. Idenya masih banyak.', soon: 'Segera hadir',
      contact_t: 'Hubungi aku',
      roles: ['Web Developer', 'Bot Maker', 'Pemalas yang banyak ide']
    },
    en: {
      nav_about: 'About', nav_skill: 'Skills', nav_projects: 'Projects', nav_contact: 'Contact',
      hero_lead: 'A lazy web developer, but never short of ideas.',
      btn_wa: 'Chat on WhatsApp', btn_projects: 'See projects', btn_open: 'Open site',
      about_t: 'About me',
      about_p1: "I'm a lazy web developer with plenty of ideas. Sometimes I also do casual edits in Alight Motion.",
      about_p2: 'I often build new websites that resemble popular public ones, but with a different look and extra useful features when needed.',
      f_name: 'Name', f_city: 'From', f_do: 'Builds',
      skill_t: 'Skills & hobbies',
      h1_t: 'Playing games', h1_p: 'The best way to rest from coding.',
      h2_t: 'Reading manhwa', h2_p: 'A source of ideas and a cure for boredom.',
      h3_t: 'Video editing', h3_p: 'Casual edits in Alight Motion.',
      proj_t: 'Projects',
      p1_p: "Temporary email for when you don't want to use your main one.",
      p2_t: 'Next project', p2_p: 'In progress. Still lots of ideas.', soon: 'Coming soon',
      contact_t: 'Get in touch',
      roles: ['Web Developer', 'Bot Maker', 'Lazy but full of ideas']
    }
  };
  let lang = localStorage.getItem('lang') || 'id';
  let roles = T[lang].roles;

  function applyLang() {
    document.documentElement.lang = lang;
    $$('[data-i18n]').forEach(el => { el.textContent = T[lang][el.dataset.i18n]; });
    $('#lang').textContent = lang === 'id' ? 'EN' : 'ID';
    roles = T[lang].roles;
    localStorage.setItem('lang', lang);
  }
  $('#lang').addEventListener('click', () => { lang = lang === 'id' ? 'en' : 'id'; applyLang(); });

  /* ---------- Tema ---------- */
  const root = document.documentElement;
  function applyTheme(t) {
    root.dataset.theme = t;
    $('#theme').textContent = t === 'dark' ? '☀️' : '🌙';
    localStorage.setItem('theme', t);
  }
  applyTheme(localStorage.getItem('theme') || 'light');
  $('#theme').addEventListener('click', () => applyTheme(root.dataset.theme === 'dark' ? 'light' : 'dark'));

  /* ---------- Efek ketik ---------- */
  const typed = $('#typed');
  let ri = 0, ci = 0, del = false;
  function type() {
    const word = roles[ri % roles.length];
    if (reduce) { typed.textContent = word; return; }
    typed.textContent = word.slice(0, ci);
    if (!del && ci < word.length) ci++;
    else if (!del) { del = true; return setTimeout(type, 1400); }
    else if (ci > 0) ci--;
    else { del = false; ri++; }
    setTimeout(type, del ? 40 : 85);
  }

  /* ---------- Reveal saat scroll ---------- */
  const io = new IntersectionObserver(es => {
    es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: .15 });
  $$('.reveal').forEach(el => io.observe(el));

  /* ---------- Progress scroll ---------- */
  const bar = $('.progress');
  addEventListener('scroll', () => {
    const h = document.documentElement;
    bar.style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100 + '%';
  }, { passive: true });

  /* ---------- Cahaya ngikut kursor ---------- */
  const glow = $('.glow');
  addEventListener('pointermove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
  }, { passive: true });

  /* ---------- Tilt 3D kartu ---------- */
  if (!reduce) {
    $$('.tilt').forEach(card => {
      card.addEventListener('pointermove', e => {
        if (e.pointerType === 'touch') return;
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - .5;
        const y = (e.clientY - r.top) / r.height - .5;
        card.style.transform = `perspective(700px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) translateY(-6px)`;
      });
      card.addEventListener('pointerleave', () => { card.style.transform = ''; });
    });
  }

  /* ---------- Ripple tombol ---------- */
  $$('.btn').forEach(b => b.addEventListener('pointerdown', e => {
    const r = b.getBoundingClientRect();
    const s = Math.max(r.width, r.height);
    const sp = document.createElement('span');
    sp.className = 'ripple';
    sp.style.cssText = `width:${s}px;height:${s}px;left:${e.clientX - r.left - s / 2}px;top:${e.clientY - r.top - s / 2}px`;
    b.appendChild(sp);
    setTimeout(() => sp.remove(), 700);
  }));

  /* ---------- Lainnya ---------- */
  $('#top').addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));
  $('#yr').textContent = new Date().getFullYear();

  applyLang();
  type();
})();

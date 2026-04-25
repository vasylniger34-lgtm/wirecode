/* ===== Wire Code — Main JS ===== */

document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initLightningTrail();
  initNavbar();
  initScrollAnimations();
  initCounters();
  initTypingAnimation();
  initCursorGlow();
  initFloatingCode();
  initChat();
});

/* ===== PARTICLES ===== */
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];
  let mouse = { x: null, y: null };
  const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
  resize();
  window.addEventListener('resize', resize);
  canvas.addEventListener('mousemove', e => { mouse.x = e.offsetX; mouse.y = e.offsetY; });
  canvas.addEventListener('mouseleave', () => { mouse.x = null; mouse.y = null; });

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.5;
      this.speedY = (Math.random() - 0.5) * 0.5;
      this.opacity = Math.random() * 0.5 + 0.2;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
      if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
      if (mouse.x !== null) {
        const dx = mouse.x - this.x, dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) { this.x -= dx * 0.01; this.y -= dy * 0.01; }
      }
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 240, 255, ${this.opacity})`;
      ctx.fill();
    }
  }

  const count = Math.min(80, Math.floor(canvas.width * canvas.height / 12000));
  for (let i = 0; i < count; i++) particles.push(new Particle());

  function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(0, 240, 255, ${0.1 * (1 - dist / 150)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    connectParticles();
    requestAnimationFrame(animate);
  }
  animate();
}

/* ===== LIGHTNING TRAIL ===== */
function initLightningTrail() {
  const canvas = document.getElementById('lightning-canvas');
  if (!canvas || window.innerWidth < 768) return;
  const ctx = canvas.getContext('2d');
  const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
  resize();
  window.addEventListener('resize', resize);

  const trail = [];
  const maxTrail = 20;
  let mouseX = 0, mouseY = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    trail.push({ x: mouseX, y: mouseY, life: 1 });
    if (trail.length > maxTrail) trail.shift();
  });

  function drawLightning(x1, y1, x2, y2, opacity) {
    const segments = 5;
    const dx = (x2 - x1) / segments;
    const dy = (y2 - y1) / segments;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    for (let i = 1; i < segments; i++) {
      const jitterX = (Math.random() - 0.5) * 16;
      const jitterY = (Math.random() - 0.5) * 16;
      ctx.lineTo(x1 + dx * i + jitterX, y1 + dy * i + jitterY);
    }
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = `rgba(0, 240, 255, ${opacity * 0.4})`;
    ctx.lineWidth = 1.5;
    ctx.stroke();
    // glow
    ctx.strokeStyle = `rgba(0, 240, 255, ${opacity * 0.15})`;
    ctx.lineWidth = 4;
    ctx.stroke();
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < trail.length; i++) {
      trail[i].life -= 0.04;
    }
    // remove dead
    while (trail.length > 0 && trail[0].life <= 0) trail.shift();

    for (let i = 1; i < trail.length; i++) {
      drawLightning(trail[i - 1].x, trail[i - 1].y, trail[i].x, trail[i].y, trail[i].life);
    }

    // dots at each point
    trail.forEach(p => {
      if (p.life > 0) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2 * p.life, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 240, 255, ${p.life * 0.5})`;
        ctx.fill();
      }
    });

    requestAnimationFrame(animate);
  }
  animate();
}

/* ===== NAVBAR ===== */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const toggle = document.getElementById('menuToggle');
  const links = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    links.classList.toggle('active');
  });

  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      toggle.classList.remove('active');
      links.classList.remove('active');
    });
  });
}

/* ===== SCROLL ANIMATIONS ===== */
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.fade-up, .fade-left, .process-step').forEach(el => observer.observe(el));
}

/* ===== COUNTERS ===== */
function initCounters() {
  const counters = document.querySelectorAll('.stat-number');
  let started = false;
  const observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !started) {
      started = true;
      counters.forEach(counter => {
        const target = parseInt(counter.dataset.target);
        const duration = 2000;
        const start = performance.now();
        function step(now) {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          counter.textContent = Math.floor(eased * target) + '+';
          if (progress < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      });
    }
  }, { threshold: 0.5 });
  if (counters.length) observer.observe(counters[0]);
}

/* ===== TYPING ANIMATION ===== */
function initTypingAnimation() {
  const el = document.getElementById('heroTyping');
  if (!el) return;
  const phrases = [
    '> Розробляю Telegram ботів',
    '> Створюю сучасні сайти',
    '> Будую Web Applications',
    '> Автоматизую бізнес-процеси',
    '> Пишу чистий код'
  ];
  let phraseIdx = 0, charIdx = 0, deleting = false;
  function type() {
    const current = phrases[phraseIdx];
    if (!deleting) {
      el.innerHTML = current.substring(0, charIdx) + '<span class="cursor">|</span>';
      charIdx++;
      if (charIdx > current.length) { deleting = true; setTimeout(type, 2000); return; }
      setTimeout(type, 60);
    } else {
      el.innerHTML = current.substring(0, charIdx) + '<span class="cursor">|</span>';
      charIdx--;
      if (charIdx < 0) { deleting = false; phraseIdx = (phraseIdx + 1) % phrases.length; setTimeout(type, 400); return; }
      setTimeout(type, 30);
    }
  }
  type();
}

/* ===== CURSOR GLOW ===== */
function initCursorGlow() {
  const glow = document.getElementById('cursorGlow');
  if (!glow || window.innerWidth < 768) { if (glow) glow.style.display = 'none'; return; }
  document.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
  });
}

/* ===== FLOATING CODE SNIPPETS ===== */
function initFloatingCode() {
  const snippets = [
    'const bot = new TelegramBot();',
    'app.listen(3000);',
    'npm run deploy',
    'git push origin main',
    'SELECT * FROM users;',
    'export default App;',
    '<div className="hero">',
    'docker-compose up -d',
    'async function fetch()',
    'border-radius: 16px;',
    'useEffect(() => {}, []);',
    'res.json({ success: true })',
  ];

  const sections = document.querySelectorAll('section');
  sections.forEach(section => {
    for (let i = 0; i < 2; i++) {
      const el = document.createElement('div');
      el.className = 'floating-code';
      el.textContent = snippets[Math.floor(Math.random() * snippets.length)];
      el.style.left = Math.random() * 80 + 10 + '%';
      el.style.bottom = '-20px';
      el.style.animationDelay = Math.random() * 15 + 's';
      el.style.animationDuration = (15 + Math.random() * 15) + 's';
      section.appendChild(el);
    }
  });
}

/* ===== AI CHAT WIDGET ===== */
function initChat() {
  const toggleBtn = document.getElementById('chatToggle');
  const chatWin = document.getElementById('chatWindow');
  const closeBtn = document.getElementById('chatClose');
  const messagesEl = document.getElementById('chatMessages');
  const optionsEl = document.getElementById('chatOptions');
  const popupEl = document.getElementById('chatPopup');
  const popupClose = document.getElementById('popupClose');
  let isOpen = false, chatStarted = false, popupShown = false;

  // Auto-popup after 5 seconds
  setTimeout(() => {
    if (!isOpen && !popupShown) {
      popupShown = true;
      popupEl.classList.add('show');
    }
  }, 5000);

  // Click popup -> open chat
  popupEl.addEventListener('click', (e) => {
    if (e.target === popupClose) {
      popupEl.classList.remove('show');
      return;
    }
    popupEl.classList.remove('show');
    openChat();
  });

  popupClose.addEventListener('click', (e) => {
    e.stopPropagation();
    popupEl.classList.remove('show');
  });

  const chatFlow = {
    start: {
      msg: 'Привіт! 👋 Я Wire AI — віртуальний помічник студії Wire Code. Допоможу визначити, яке рішення вам потрібно. Що вас цікавить?',
      options: [
        { text: '🤖 Telegram / Viber бот', next: 'bot' },
        { text: '🌐 Сайт або лендінг', next: 'site' },
        { text: '📱 Веб-додаток', next: 'webapp' },
        { text: '🤔 Не знаю, що мені потрібно', next: 'help' }
      ]
    },
    bot: {
      msg: 'Чудовий вибір! Боти — потужний інструмент для бізнесу. Розкажіть, для чого вам потрібен бот:',
      options: [
        { text: '🛒 Прийом замовлень', next: 'bot_orders' },
        { text: '📢 Розсилки та сповіщення', next: 'bot_notify' },
        { text: '💬 Підтримка клієнтів', next: 'bot_support' },
        { text: '🎮 Гра або Mini App', next: 'bot_game' }
      ]
    },
    bot_orders: {
      msg: 'Бот для замовлень — це каталог товарів, кошик, оплата та сповіщення адміну. Зазвичай це займає 3-7 днів і коштує від 2000 грн. Хочете обговорити деталі з Андрієм?',
      options: [{ text: '💬 Написати в Telegram', next: 'telegram' }, { text: '← Назад', next: 'start' }]
    },
    bot_notify: {
      msg: 'Бот для розсилок може масово відправляти повідомлення, сегментувати аудиторію, працювати з кнопками та медіа. Терміни: 2-5 днів, від 1000 грн.',
      options: [{ text: '💬 Написати в Telegram', next: 'telegram' }, { text: '← Назад', next: 'start' }]
    },
    bot_support: {
      msg: 'Бот підтримки відповідає на часті питання, збирає заявки та передає складні запити живому оператору. AI-інтеграція також можлива! Від 1500 грн.',
      options: [{ text: '💬 Написати в Telegram', next: 'telegram' }, { text: '← Назад', next: 'start' }]
    },
    bot_game: {
      msg: 'Telegram Mini App або гра — це повноцінний веб-додаток всередині Telegram з кастомним UI, анімаціями та інтерактивом. Від 3000 грн. Це моя улюблена тема! 🎮',
      options: [{ text: '💬 Написати в Telegram', next: 'telegram' }, { text: '← Назад', next: 'start' }]
    },
    site: {
      msg: 'Сайт — це ваша візитівка в інтернеті. Який тип вам потрібен?',
      options: [
        { text: '📄 Сайт-візитівка', next: 'site_card' },
        { text: '🎯 Landing page', next: 'site_landing' },
        { text: '🏢 Корпоративний сайт', next: 'site_corp' },
        { text: '🛍️ Інтернет-магазин', next: 'site_shop' }
      ]
    },
    site_card: {
      msg: 'Сайт-візитівка — ідеальний варіант для фрілансерів та малого бізнесу. Сучасний дизайн, адаптивність, швидке завантаження. Від 1000 грн, 3-5 днів.',
      options: [{ text: '💬 Написати в Telegram', next: 'telegram' }, { text: '← Назад', next: 'start' }]
    },
    site_landing: {
      msg: 'Landing page — односторінковий сайт, сфокусований на конверсію. Ідеально для запуску продукту або послуги. Від 2000 грн, 5-7 днів.',
      options: [{ text: '💬 Написати в Telegram', next: 'telegram' }, { text: '← Назад', next: 'start' }]
    },
    site_corp: {
      msg: 'Корпоративний сайт — багатосторінковий проєкт з каталогом послуг, блогом, контактами. Від 4000 грн, 7-14 днів.',
      options: [{ text: '💬 Написати в Telegram', next: 'telegram' }, { text: '← Назад', next: 'start' }]
    },
    site_shop: {
      msg: 'Інтернет-магазин — каталог, фільтри, кошик, оплата, особистий кабінет. Повний e-commerce. Від 6000 грн, 14-21 день.',
      options: [{ text: '💬 Написати в Telegram', next: 'telegram' }, { text: '← Назад', next: 'start' }]
    },
    webapp: {
      msg: 'Веб-додаток — це вже серйозна розробка. Що саме вам потрібно?',
      options: [
        { text: '📊 Дашборд / CRM', next: 'webapp_dash' },
        { text: '🔧 Адмін-панель', next: 'webapp_admin' },
        { text: '🔗 API / Інтеграція', next: 'webapp_api' },
        { text: '💡 Інше', next: 'webapp_other' }
      ]
    },
    webapp_dash: {
      msg: 'Дашборд або CRM — візуалізація даних, графіки, таблиці, фільтри, ролі користувачів. Повноцінний інструмент для управління. Від 5000 грн.',
      options: [{ text: '💬 Написати в Telegram', next: 'telegram' }, { text: '← Назад', next: 'start' }]
    },
    webapp_admin: {
      msg: 'Адмін-панель для управління контентом, замовленнями, користувачами. Кастомізована під ваші потреби. Від 3000 грн.',
      options: [{ text: '💬 Написати в Telegram', next: 'telegram' }, { text: '← Назад', next: 'start' }]
    },
    webapp_api: {
      msg: 'REST API, інтеграції з зовнішніми сервісами, webhook-и, парсери, автоматизація — все це я можу реалізувати. Від 2000 грн.',
      options: [{ text: '💬 Написати в Telegram', next: 'telegram' }, { text: '← Назад', next: 'start' }]
    },
    webapp_other: {
      msg: 'Є нестандартна ідея? Це ще цікавіше! Напишіть мені — розберемося разом, як це реалізувати. 🚀',
      options: [{ text: '💬 Написати в Telegram', next: 'telegram' }, { text: '← Назад', next: 'start' }]
    },
    help: {
      msg: 'Не хвилюйтесь, це нормально! Давайте розберемось. Вам потрібно щось для бізнесу чи персональне?',
      options: [
        { text: '💼 Для бізнесу', next: 'help_biz' },
        { text: '👤 Персональний проєкт', next: 'help_personal' }
      ]
    },
    help_biz: {
      msg: 'Для бізнесу зазвичай потрібно: сайт для залучення клієнтів, бот для автоматизації, або система для управління процесами. Що ближче?',
      options: [
        { text: '📣 Залучення клієнтів', next: 'site' },
        { text: '🤖 Автоматизація', next: 'bot' },
        { text: '📊 Управління', next: 'webapp' }
      ]
    },
    help_personal: {
      msg: 'Крутий персональний проєкт — це може бути портфоліо, блог, гра або будь-яка ідея. Розкажіть Андрію — він допоможе реалізувати!',
      options: [{ text: '💬 Написати в Telegram', next: 'telegram' }, { text: '← Назад', next: 'start' }]
    },
    telegram: {
      msg: 'Чудово! Напишіть Андрію в Telegram — він відповідає швидко і допоможе з усіма деталями. Дякую, що скористались Wire AI! 🙌',
      options: [{ text: '🚀 Відкрити Telegram', next: 'open_tg' }, { text: '← На початок', next: 'start' }]
    }
  };

  function addMessage(text, type) {
    const msg = document.createElement('div');
    msg.className = `chat-msg ${type}`;
    msg.textContent = text;
    messagesEl.appendChild(msg);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function showTyping() {
    const msg = document.createElement('div');
    msg.className = 'chat-msg bot typing';
    msg.id = 'typingIndicator';
    msg.innerHTML = '<div class="dots"><span></span><span></span><span></span></div>';
    messagesEl.appendChild(msg);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function removeTyping() {
    const t = document.getElementById('typingIndicator');
    if (t) t.remove();
  }

  function showStep(stepId) {
    if (stepId === 'open_tg') { window.open('https://t.me/wire_code', '_blank'); return; }
    const step = chatFlow[stepId];
    if (!step) return;
    optionsEl.innerHTML = '';
    showTyping();
    setTimeout(() => {
      removeTyping();
      addMessage(step.msg, 'bot');
      if (step.options) {
        step.options.forEach(opt => {
          const btn = document.createElement('button');
          btn.className = 'chat-option';
          btn.textContent = opt.text;
          btn.addEventListener('click', () => {
            addMessage(opt.text, 'user');
            optionsEl.innerHTML = '';
            setTimeout(() => showStep(opt.next), 300);
          });
          optionsEl.appendChild(btn);
        });
      }
    }, 800 + Math.random() * 400);
  }

  function openChat() {
    isOpen = true;
    chatWin.classList.add('open');
    toggleBtn.innerHTML = '✕';
    toggleBtn.classList.add('is-close');
    popupEl.classList.remove('show');
    if (!chatStarted) { chatStarted = true; showStep('start'); }
  }

  function closeChat() {
    isOpen = false;
    chatWin.classList.remove('open');
    toggleBtn.innerHTML = '<img src="assets/wirecode_logo.jpg" alt="Wire Code">';
    toggleBtn.classList.remove('is-close');
  }

  toggleBtn.addEventListener('click', () => { isOpen ? closeChat() : openChat(); });
  closeBtn.addEventListener('click', closeChat);
}

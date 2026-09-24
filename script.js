/* ============================================
   SCRIPT.JS — TikTopia v10.0
   Полный интерактив
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  const isMobile = !window.matchMedia('(hover: hover)').matches;
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  /* ============================================
     0. LOADING SCREEN
     ============================================ */
  const loadingScreen = document.createElement('div');
  loadingScreen.className = 'loading-screen';
  const joke = window.LOADING_JOKES ? LOADING_JOKES[Math.floor(Math.random() * LOADING_JOKES.length)] : 'Загрузка...';
  loadingScreen.innerHTML = `
    <div class="loading-logo">🚀</div>
    <div class="loading-text">${joke}</div>
    <div class="loading-bar"><div class="loading-bar-fill"></div></div>
  `;
  document.body.appendChild(loadingScreen);

  setTimeout(() => {
    loadingScreen.classList.add('hidden');
    setTimeout(() => loadingScreen.remove(), 600);
  }, 1500);

  /* ============================================
     1. CUSTOM CURSOR
     ============================================ */
  if (!isMobile) {
    const dot = document.createElement('div');
    dot.className = 'cursor-dot';
    const outline = document.createElement('div');
    outline.className = 'cursor-outline';
    document.body.appendChild(dot);
    document.body.appendChild(outline);

    let mouseX = 0, mouseY = 0;
    let outlineX = 0, outlineY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = mouseX + 'px';
      dot.style.top = mouseY + 'px';
    });

    const animateCursor = () => {
      outlineX += (mouseX - outlineX) * 0.15;
      outlineY += (mouseY - outlineY) * 0.15;
      outline.style.left = outlineX + 'px';
      outline.style.top = outlineY + 'px';
      requestAnimationFrame(animateCursor);
    };
    animateCursor();

    document.addEventListener('mouseover', (e) => {
      if (e.target.closest('a, button, .card, .tab, .accordion-header, li, input, .tracker-day')) {
        outline.classList.add('hover');
      }
    });
    document.addEventListener('mouseout', (e) => {
      if (e.target.closest('a, button, .card, .tab, .accordion-header, li, input, .tracker-day')) {
        outline.classList.remove('hover');
      }
    });
  }

  /* ============================================
     2. SCROLL PROGRESS + HEADER + BACK-TO-TOP
     ============================================ */
  const progressBar = document.createElement('div');
  progressBar.className = 'scroll-progress';
  document.body.appendChild(progressBar);

  const backBtn = document.createElement('button');
  backBtn.className = 'back-to-top';
  backBtn.innerHTML = '↑';
  backBtn.setAttribute('aria-label', 'Наверх');
  backBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  document.body.appendChild(backBtn);

  let lastScroll = 0;
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        progressBar.style.width = Math.min((scrollTop / docHeight) * 100, 100) + '%';

        document.querySelector('header')?.classList.toggle('scrolled', scrollTop > 50);
        backBtn.classList.toggle('visible', scrollTop > 400);

        // Scroll master achievement
        if (Math.abs(scrollTop - lastScroll) > 5000) {
          unlockAchievement('scroll-master');
        }
        lastScroll = scrollTop;

        ticking = false;
      });
      ticking = true;
    }
  });

  /* ============================================
     3. FLOATING SHAPES + STARS
     ============================================ */
  ['shape-1', 'shape-2', 'shape-3'].forEach(cls => {
    const shape = document.createElement('div');
    shape.className = `floating-shape ${cls}`;
    document.body.appendChild(shape);
  });

  const starsBg = document.createElement('div');
  starsBg.className = 'stars-bg';
  for (let i = 0; i < 80; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    star.style.left = Math.random() * 100 + '%';
    star.style.top = Math.random() * 100 + '%';
    star.style.animationDelay = Math.random() * 4 + 's';
    star.style.animationDuration = (3 + Math.random() * 4) + 's';
    starsBg.appendChild(star);
  }
  document.body.appendChild(starsBg);

  /* ============================================
     4. REVEAL ON SCROLL
     ============================================ */
  const revealSelectors = [
    '.card', '.callout', '.stat-grid > div', '.hero > *',
    '.lead', '.quote', '.fact-box', '.tip-box', '.accordion-item',
    'table', '.progress-block', '.timer', '.tabs',
    '.calculator', '.game-area', '.tracker-grid',
    '.share-buttons', '.rating-row', '.quest-list'
  ];

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -60px 0px' });

  revealSelectors.forEach(sel => {
    document.querySelectorAll(sel).forEach(el => {
      el.classList.add('reveal');
      revealObserver.observe(el);
    });
  });

  /* ============================================
     5. ГРАДИЕНТНЫЙ HERO H1
     ============================================ */
  const heroH1 = document.querySelector('.hero h1');
  if (heroH1) heroH1.classList.add('gradient-text');

  /* ============================================
     6. TYPEWRITER ДЛЯ HERO P
     ============================================ */
  const heroP = document.querySelector('.hero p');
  if (heroP && !sessionStorage.getItem('heroTyped')) {
    const originalText = heroP.textContent;
    heroP.textContent = '';

    const cursor = document.createElement('span');
    cursor.className = 'typewriter-cursor';
    heroP.appendChild(cursor);

    let i = 0;
    const speed = 20;
    const type = () => {
      if (i < originalText.length) {
        cursor.before(document.createTextNode(originalText.charAt(i)));
        i++;
        setTimeout(type, speed);
      } else {
        setTimeout(() => cursor.remove(), 2000);
        sessionStorage.setItem('heroTyped', '1');
      }
    };
    setTimeout(type, 1700);
  }

  /* ============================================
     7. ЭМОДЗИ-ПРЫЖОК
     ============================================ */
  document.querySelectorAll('.article h1, .card h3').forEach(el => {
    el.innerHTML = el.innerHTML.replace(
      /(\p{Emoji_Presentation}|\p{Extended_Pictographic})/gu,
      '<span class="emoji-bounce">$1</span>'
    );
  });

  /* ============================================
     8. BURGER MENU
     ============================================ */
  const nav = document.querySelector('nav');
  const navList = document.querySelector('nav ul');
  const existingBurger = document.querySelector('.burger');

  if (navList && existingBurger) {
    existingBurger.addEventListener('click', () => {
      navList.classList.toggle('open');
      existingBurger.innerHTML = navList.classList.contains('open') ? '✕' : '☰';
    });

    navList.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navList.classList.remove('open');
        existingBurger.innerHTML = '☰';
      });
    });
  }

  /* ============================================
     9. SEARCH
     ============================================ */
  const searchContainer = document.querySelector('.search-container');
  if (searchContainer && window.SEARCH_INDEX) {
    const input = searchContainer.querySelector('.search-input');
    const results = searchContainer.querySelector('.search-results');

    input.addEventListener('input', () => {
      const q = input.value.trim().toLowerCase();
      if (q.length < 2) {
        results.classList.remove('open');
        return;
      }

      unlockAchievement('used-search');

      const matches = SEARCH_INDEX.filter(item => {
        const haystack = `${item.title} ${item.desc} ${(item.tags || []).join(' ')}`.toLowerCase();
        return haystack.includes(q);
      }).slice(0, 6);

      if (matches.length === 0) {
        results.innerHTML = '<div class="search-result"><span>Ничего не найдено 😔</span></div>';
      } else {
        results.innerHTML = matches.map(m =>
          `<a href="${m.url}" class="search-result">
            <strong>${m.title}</strong>
            <span>${m.desc}</span>
          </a>`
        ).join('');
      }
      results.classList.add('open');
    });

    document.addEventListener('click', (e) => {
      if (!searchContainer.contains(e.target)) results.classList.remove('open');
    });
  }

  /* ============================================
     10. TABS
     ============================================ */
  document.querySelectorAll('.tabs').forEach(tabsEl => {
    const tabs = tabsEl.querySelectorAll('.tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const target = tab.dataset.tab;
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const parent = tabsEl.parentElement;
        parent.querySelectorAll('.tab-content').forEach(c => {
          c.classList.toggle('active', c.dataset.tab === target);
        });
      });
    });
  });

  /* ============================================
     11. ACCORDION
     ============================================ */
  document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const wasOpen = item.classList.contains('open');

      item.parentElement.querySelectorAll('.accordion-item').forEach(i => {
        i.classList.remove('open');
      });

      if (!wasOpen) item.classList.add('open');
    });
  });

  /* ============================================
     12. CHECKLIST
     ============================================ */
  document.querySelectorAll('.checklist li').forEach(item => {
    item.addEventListener('click', () => {
      item.classList.toggle('done');

      const allItems = [...document.querySelectorAll('.checklist li')];
      const idx = allItems.indexOf(item);
      const key = `check-${currentPage}-${idx}`;
      localStorage.setItem(key, item.classList.contains('done') ? '1' : '0');

      if (allItems.every(i => i.classList.contains('done'))) {
        unlockAchievement('checked-all');
        showToast('🏆 Все пункты выполнены!', 'success');
      }
    });
  });

  document.querySelectorAll('.checklist li').forEach((item, idx) => {
    const key = `check-${currentPage}-${idx}`;
    if (localStorage.getItem(key) === '1') item.classList.add('done');
  });

  /* ============================================
     13. PROGRESS BARS
     ============================================ */
  const progressObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target.querySelector('.progress-fill');
        if (fill && fill.dataset.width) {
          fill.style.width = fill.dataset.width;
        }
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.progress-block').forEach(block => {
    progressObserver.observe(block);
  });

  /* ============================================
     14. TILT 3D
     ============================================ */
  if (!isMobile) {
    document.querySelectorAll('.card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `translateY(-10px) scale(1.02) rotateX(${y * -8}deg) rotateY(${x * 8}deg)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  /* ============================================
     15. TOAST
     ============================================ */
  const toastContainer = document.createElement('div');
  toastContainer.className = 'toast-container';
  document.body.appendChild(toastContainer);

  function showToast(message, type = 'default', duration = 3500) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('out');
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }
  window.showToast = showToast;

  /* ============================================
     16. QUOTES
     ============================================ */
  const quoteEl = document.querySelector('.quote-text');
  const authorEl = document.querySelector('.quote-author');
  if (quoteEl && window.QUOTES) {
    let idx = Math.floor(Math.random() * QUOTES.length);
    const setQuote = () => {
      quoteEl.style.opacity = '0';
      setTimeout(() => {
        quoteEl.textContent = QUOTES[idx].text;
        authorEl.textContent = '— ' + QUOTES[idx].author;
        quoteEl.style.opacity = '1';
        idx = (idx + 1) % QUOTES.length;
      }, 300);
    };
    quoteEl.style.transition = 'opacity 0.3s';
    setQuote();
    setInterval(setQuote, 8000);

    const copyBtn = document.querySelector('.quote-copy');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(quoteEl.textContent + '\n' + authorEl.textContent);
        showToast('📋 Цитата скопирована!', 'success');
        unlockAchievement('copied-quote');
        trackQuest('read-quote');
      });
    }
  }

  /* ============================================
     17. COUNTER ANIMATION
     ============================================ */
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.count);
        const duration = 1500;
        const start = Date.now();

        const animate = () => {
          const elapsed = Date.now() - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.floor(target * eased).toLocaleString('ru-RU');
          if (progress < 1) requestAnimationFrame(animate);
          else el.textContent = target.toLocaleString('ru-RU');
        };
        animate();
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));

  /* ============================================
     18. ACHIEVEMENTS SYSTEM
     ============================================ */
  const unlockedSet = new Set(JSON.parse(localStorage.getItem('achievements') || '[]'));

  function unlockAchievement(id) {
    if (unlockedSet.has(id) || !window.ACHIEVEMENTS) return;
    const ach = ACHIEVEMENTS.find(a => a.id === id);
    if (!ach) return;

    unlockedSet.add(id);
    localStorage.setItem('achievements', JSON.stringify([...unlockedSet]));

    showToast(`${ach.icon} Достижение: ${ach.title}`, 'success');
    fireConfetti();

    // Проверка "Легенды"
    if (unlockedSet.size >= 25) {
      setTimeout(() => unlockAchievement('secret-master'), 500);
    }
    if (unlockedSet.size >= ACHIEVEMENTS.length - 1) {
      setTimeout(() => unlockAchievement('all-achievements'), 1000);
    }

    // Обновить бейдж уровня
    updatePlayerLevel();
  }
  window.unlockAchievement = unlockAchievement;

  if (!localStorage.getItem('visited')) {
    unlockAchievement('first-visit');
    localStorage.setItem('visited', '1');
  }

  // Special: время суток
  const hour = new Date().getHours();
  if (hour >= 0 && hour < 6) unlockAchievement('night-owl');
  if (hour >= 5 && hour < 6) unlockAchievement('early-bird');

  // Special: выходные
  const day = new Date().getDay();
  if (day === 0 || day === 6) unlockAchievement('weekend-warrior');

  // Special: 100 посещений
  const visitCount = parseInt(localStorage.getItem('visitCount') || '0') + 1;
  localStorage.setItem('visitCount', visitCount);
  if (visitCount >= 100) unlockAchievement('secret-100-visited');

  // Scroll achievements
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
    if (scrolled > 0.5) unlockAchievement('scrolled-half');
    if (scrolled > 0.95) unlockAchievement('scrolled-end');
  });

  // Visited pages
  const visitedPages = JSON.parse(sessionStorage.getItem('visitedPages') || '[]');
  if (!visitedPages.includes(currentPage)) {
    visitedPages.push(currentPage);
    sessionStorage.setItem('visitedPages', JSON.stringify(visitedPages));
    trackQuest('visit-page');
  }
  if (visitedPages.length >= 3) unlockAchievement('opened-3-tabs');

  const allPages = ['index.html', 'tiktok.html', 'youtube.html', 'instagram.html', 'content.html', 'mistakes.html', 'tools.html'];
  const visitedAll = JSON.parse(localStorage.getItem('visitedAllPages') || '[]');
  if (!visitedAll.includes(currentPage)) {
    visitedAll.push(currentPage);
    localStorage.setItem('visitedAllPages', JSON.stringify(visitedAll));
  }
  if (visitedAll.length >= 7) {
    unlockAchievement('explored-all');
    unlockAchievement('secret-read-all');
  }

  // 7-day streak
  const today = new Date().toDateString();
  const lastVisit = localStorage.getItem('lastVisit');
  const streak = parseInt(localStorage.getItem('streak') || '0');
  const yesterday = new Date(Date.now() - 86400000).toDateString();

  if (lastVisit !== today) {
    if (lastVisit === yesterday) {
      localStorage.setItem('streak', streak + 1);
      if (streak + 1 >= 7) unlockAchievement('7-day-streak');
    } else {
      localStorage.setItem('streak', '1');
    }
    localStorage.setItem('lastVisit', today);
  }

  // Secret: click logo 5 times
  let logoTaps = 0;
  const logo = document.querySelector('.logo');
  if (logo) {
    logo.addEventListener('click', (e) => {
      logoTaps++;
      if (logoTaps >= 5) {
        unlockAchievement('secret-click-logo');
        logoTaps = 0;
      }
    });
  }

  // Player level
  function updatePlayerLevel() {
    const badge = document.querySelector('.player-level');
    if (!badge || !window.LEVELS) return;
    const score = unlockedSet.size;
    let level = LEVELS[0];
    for (const l of LEVELS) {
      if (score >= l.min) level = l;
    }
    badge.innerHTML = `<span class="level-icon">${level.icon}</span> ${level.name}`;
  }

  /* ============================================
     19. CONFETTI
     ============================================ */
  function fireConfetti() {
    const canvas = document.createElement('canvas');
    canvas.className = 'confetti-canvas';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    const colors = ['#ff2d55', '#7c3aed', '#06b6d4', '#fbbf24'];
    const particles = [];

    for (let i = 0; i < 80; i++) {
      particles.push({
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
        vx: (Math.random() - 0.5) * 18,
        vy: (Math.random() - 0.5) * 18 - 5,
        size: 4 + Math.random() * 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        rot: Math.random() * 360,
        vrot: (Math.random() - 0.5) * 20,
        life: 1,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = 0;
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.4;
        p.rot += p.vrot;
        p.life -= 0.012;

        if (p.life > 0) {
          alive++;
          ctx.save();
          ctx.globalAlpha = p.life;
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rot * Math.PI / 180);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
          ctx.restore();
        }
      });
      if (alive > 0) requestAnimationFrame(animate);
      else canvas.remove();
    };
    animate();
  }
  window.fireConfetti = fireConfetti;

  /* ============================================
     20. MOTIVATION BANNER
     ============================================ */
  const motivationEl = document.querySelector('.motivation-banner');
  if (motivationEl && window.MOTIVATION) {
    const phrase = MOTIVATION[Math.floor(Math.random() * MOTIVATION.length)];
    motivationEl.textContent = phrase;
  }

  /* ============================================
     21. ФАКТ ДНЯ
     ============================================ */
  const factEl = document.querySelector('.fact-of-day');
  if (factEl && window.FACTS) {
    const seed = today.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
    factEl.textContent = FACTS[seed % FACTS.length];
  }

  /* ============================================
     22. СОВЕТ ДНЯ
     ============================================ */
  const tipEl = document.querySelector('.tip-of-day');
  if (tipEl && window.TIPS) {
    const seed = today.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
    tipEl.textContent = TIPS[(seed + 7) % TIPS.length];
  }

  /* ============================================
     23. EMOJI RIPPLE
     ============================================ */
  document.addEventListener('click', (e) => {
    const emojis = ['✨', '💫', '⭐', '🌟', '💥', '🔥'];
    const emoji = emojis[Math.floor(Math.random() * emojis.length)];

    if (e.target.closest('button, .btn, .tab')) {
      const span = document.createElement('span');
      span.textContent = emoji;
      span.style.cssText = `
        position: fixed;
        left: ${e.clientX}px;
        top: ${e.clientY}px;
        font-size: 1.5rem;
        pointer-events: none;
        z-index: 99999;
        animation: emojiRipple 0.8s ease-out forwards;
      `;
      document.body.appendChild(span);
      setTimeout(() => span.remove(), 800);
    }
  });

  /* ============================================
     24. SMOOTH SCROLL
     ============================================ */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - 100;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ============================================
     25. KONAMI CODE
     ============================================ */
  const konami = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  let konamiIdx = 0;
  document.addEventListener('keydown', (e) => {
    if (e.key === konami[konamiIdx]) {
      konamiIdx++;
      if (konamiIdx === konami.length) {
        fireConfetti();
        showToast('🎮 Чит-код активирован! Ты — легенда!', 'success');
        unlockAchievement('konami');
        konamiIdx = 0;
      }
    } else {
      konamiIdx = 0;
    }
  });

  /* ============================================
     26. АКТИВНАЯ ССЫЛКА
     ============================================ */
  document.querySelectorAll('nav a.nav-link').forEach(link => {
    if (link.getAttribute('href') === currentPage) link.classList.add('active');
  });

  /* ============================================
     27. THEME SWITCHER
     ============================================ */
  const themeSwitcher = document.createElement('div');
  themeSwitcher.className = 'theme-switcher';
  themeSwitcher.innerHTML = `
    <button class="theme-btn" data-theme="dark" title="Тёмная">🌙</button>
    <button class="theme-btn" data-theme="light" title="Светлая">☀️</button>
    <button class="theme-btn" data-theme="neon" title="Неон">⚡</button>
  `;

  if (nav) nav.appendChild(themeSwitcher);

  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.body.classList.add(`theme-${savedTheme}`);
  themeSwitcher.querySelectorAll('.theme-btn').forEach(btn => {
    if (btn.dataset.theme === savedTheme) btn.classList.add('active');
    btn.addEventListener('click', () => {
      document.body.className = document.body.className.replace(/theme-\w+/g, '').trim();
      document.body.classList.add(`theme-${btn.dataset.theme}`);
      localStorage.setItem('theme', btn.dataset.theme);
      themeSwitcher.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      showToast(`🎨 Тема: ${btn.title}`);

      const tried = JSON.parse(localStorage.getItem('triedThemes') || '[]');
      if (!tried.includes(btn.dataset.theme)) {
        tried.push(btn.dataset.theme);
        localStorage.setItem('triedThemes', JSON.stringify(tried));
      }
      if (tried.length >= 3) unlockAchievement('theme-master');
    });
  });

  /* ============================================
     28. PLAYER LEVEL BADGE в NAV
     ============================================ */
  const playerBadge = document.createElement('div');
  playerBadge.className = 'player-level';
  playerBadge.innerHTML = '🥚 Новичок';
  if (nav) nav.insertBefore(playerBadge, themeSwitcher);
  updatePlayerLevel();

  /* ============================================
     29. ACHIEVEMENTS MODAL
     ============================================ */
  const achBtn = document.createElement('button');
  achBtn.className = 'audio-toggle';
  achBtn.style.bottom = '160px';
  achBtn.innerHTML = '🏆';
  achBtn.title = 'Достижения';
  document.body.appendChild(achBtn);

  const achModal = document.createElement('div');
  achModal.className = 'modal-overlay';
  achModal.innerHTML = `
    <div class="modal" style="max-width: 700px;">
      <button class="modal-close">✕</button>
      <h2 style="margin-bottom: 8px;">🏆 Достижения</h2>
      <p style="color: var(--muted); margin-bottom: 20px;">Собрано: <strong id="ach-count">0</strong> из ${window.ACHIEVEMENTS ? ACHIEVEMENTS.length : 0}</p>
      <div class="ach-grid" id="ach-grid"></div>
    </div>
  `;
  document.body.appendChild(achModal);

  achBtn.addEventListener('click', () => {
    achModal.classList.add('open');
    renderAchievements();
    unlockAchievement('opened-achievements');
  });

  achModal.querySelector('.modal-close').addEventListener('click', () => {
    achModal.classList.remove('open');
  });

  achModal.addEventListener('click', (e) => {
    if (e.target === achModal) achModal.classList.remove('open');
  });

  function renderAchievements() {
    const grid = document.getElementById('ach-grid');
    const countEl = document.getElementById('ach-count');
    if (!grid || !window.ACHIEVEMENTS) return;

    if (countEl) countEl.textContent = unlockedSet.size;

    grid.innerHTML = ACHIEVEMENTS.map(ach => {
      const unlocked = unlockedSet.has(ach.id);
      return `
        <div class="ach-card ${unlocked ? 'unlocked' : 'locked'} ${ach.tier || ''}">
          <span class="ach-tier ${ach.tier}">${(ach.tier || '').toUpperCase()}</span>
          <span class="ach-icon">${unlocked ? ach.icon : '🔒'}</span>
          <strong>${ach.title}</strong>
          <small>${ach.desc}</small>
        </div>
      `;
    }).join('');
  }

  /* ============================================
     30. READING TIME
     ============================================ */
  const articleContent = document.querySelector('.article');
  const articleH1El = document.querySelector('.article h1');
  if (articleContent && articleH1El) {
    const words = articleContent.textContent.split(/\s+/).length;
    const minutes = Math.max(1, Math.round(words / 200));
    const rtEl = document.createElement('div');
    rtEl.className = 'reading-time';
    rtEl.innerHTML = `⏱ <strong>~${minutes} мин</strong> чтения`;
    articleH1El.parentNode.insertBefore(rtEl, articleH1El.nextSibling);

    // Typing effect на H1
    articleH1El.classList.add('typing');
  }

  /* ============================================
     31. DOUBLE CLICK HEARTS
     ============================================ */
  document.addEventListener('dblclick', (e) => {
    const hearts = ['❤️', '💖', '💕', '💗', '💓'];
    for (let i = 0; i < 3; i++) {
      const heart = document.createElement('span');
      heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
      heart.style.cssText = `
        position: fixed;
        left: ${e.clientX + (Math.random() - 0.5) * 60}px;
        top: ${e.clientY + (Math.random() - 0.5) * 60}px;
        font-size: ${1 + Math.random() * 0.8}rem;
        pointer-events: none;
        z-index: 99999;
        animation: heartFloat 1.2s ease-out forwards;
      `;
      document.body.appendChild(heart);
      setTimeout(() => heart.remove(), 1200);
    }
    unlockAchievement('double-click');
  });

  /* ============================================
     32. PWA
     ============================================ */
  if ('serviceWorker' in navigator && window.location.protocol !== 'file:') {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }

  /* ============================================
     33. DYNAMIC TITLE
     ============================================ */
  const originalTitle = document.title;
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      document.title = '👀 Вернись, тут интересно!';
    } else {
      document.title = originalTitle;
    }
  });

  /* ============================================
     34. HABIT TRACKER
     ============================================ */
  const trackerGrid = document.querySelector('.tracker-grid');
  if (trackerGrid) {
    const todayIdx = new Date().getDate() - 1;
    for (let i = 0; i < 30; i++) {
      const dayEl = document.createElement('div');
      dayEl.className = 'tracker-day';
      dayEl.textContent = i + 1;
      if (i === todayIdx) dayEl.classList.add('today');
      if (localStorage.getItem(`tracker-${i}`) === '1') dayEl.classList.add('done');

      dayEl.addEventListener('click', () => {
        dayEl.classList.toggle('done');
        localStorage.setItem(`tracker-${i}`, dayEl.classList.contains('done') ? '1' : '0');

        const doneCount = [...trackerGrid.children].filter(d => d.classList.contains('done')).length;
        if (doneCount >= 10) unlockAchievement('tracker-10');
        if (doneCount >= 30) {
          unlockAchievement('tracker-30');
          showToast('🏆 30-дневный челлендж пройден!', 'success');
          fireConfetti();
        }
      });
      trackerGrid.appendChild(dayEl);
    }
  }

  /* ============================================
     35. CALCULATOR
     ============================================ */
  const calcForm = document.getElementById('growth-calc');
  if (calcForm) {
    const currentInput = document.getElementById('calc-current');
    const dailyInput = document.getElementById('calc-daily');
    const daysInput = document.getElementById('calc-days');
    const daysValue = document.getElementById('calc-days-value');
    const resultEl = document.getElementById('calc-result-value');
    const labelEl = document.getElementById('calc-result-label');

    const update = () => {
      const current = parseInt(currentInput.value) || 0;
      const daily = parseInt(dailyInput.value) || 0;
      const days = parseInt(daysInput.value) || 30;

      if (daysValue) daysValue.textContent = days;
      const result = current + daily * days;
      if (resultEl) resultEl.textContent = result.toLocaleString('ru-RU');
      if (labelEl) labelEl.textContent = `подписчиков через ${days} дней`;

      unlockAchievement('used-calc');
      trackQuest('use-calc');

      if (result >= 1000000) unlockAchievement('calc-million');
    };

    [currentInput, dailyInput, daysInput].forEach(inp => {
      inp?.addEventListener('input', update);
    });
    update();
  }

  /* ============================================
     36. MINI-GAME
     ============================================ */
  const tapBtn = document.getElementById('tap-btn');
  if (tapBtn) {
    let subs = 0;
    let clicks = 0;
    let startTime = Date.now();
    const subsEl = document.getElementById('game-subs');
    const cpsEl = document.getElementById('game-cps');
    const timeEl = document.getElementById('game-time');
    const clicksEl = document.getElementById('game-clicks');
    const gameArea = document.querySelector('.game-area');

    const updateStats = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      const cps = (clicks / elapsed).toFixed(1);
      if (cpsEl) cpsEl.textContent = cps;
      if (timeEl) timeEl.textContent = Math.floor(elapsed) + 'с';
      if (clicksEl) clicksEl.textContent = clicks;
    };

    setInterval(updateStats, 500);

    tapBtn.addEventListener('click', (e) => {
      const gain = Math.floor(Math.random() * 15) + 1;
      subs += gain;
      clicks++;

      if (subsEl) {
        subsEl.textContent = subs.toLocaleString('ru-RU');
        subsEl.classList.remove('shake');
        void subsEl.offsetWidth;
        subsEl.classList.add('shake');
      }

      const float = document.createElement('span');
      float.className = 'game-float';
      float.textContent = `+${gain}`;
      const rect = tapBtn.getBoundingClientRect();
      float.style.left = (e.clientX - rect.left + 120) + 'px';
      float.style.top = (e.clientY - rect.top) + 'px';
      gameArea?.appendChild(float);
      setTimeout(() => float.remove(), 1000);

      trackQuest('play-game');

      if (subs >= 1000) {
        unlockAchievement('game-1000');
        if (subs - gain < 1000) {
          fireConfetti();
          showToast('🎉 1000 подписчиков в игре!', 'success');
        }
      }
      if (subs >= 10000) {
        unlockAchievement('game-10000');
        if (subs - gain < 10000) {
          fireConfetti();
          showToast('👾 10 000 подписчиков! Хардкор!', 'success');
        }
      }
    });
  }

  /* ============================================
     37. RATING BARS
     ============================================ */
  const ratingObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.rating-bar-fill').forEach(fill => {
          const w = fill.dataset.width;
          if (w) setTimeout(() => fill.style.width = w, 100);
        });
        ratingObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.rating-row').forEach(row => ratingObserver.observe(row));

  /* ============================================
     38. SHARE BUTTONS
     ============================================ */
  document.querySelectorAll('.share-btn[data-share]').forEach(btn => {
    btn.addEventListener('click', () => {
      const type = btn.dataset.share;
      const url = window.location.href;
      const text = 'Как стать популярным в соцсетях — гайд TikTopia 🚀';

      let shareUrl = '';
      switch (type) {
        case 'vk':
          shareUrl = `https://vk.com/share.php?url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}`;
          break;
        case 'tg':
          shareUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
          break;
        case 'wa':
          shareUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`;
          break;
        case 'copy':
          navigator.clipboard.writeText(url);
          showToast('📋 Ссылка скопирована!', 'success');
          unlockAchievement('shared-site');
          return;
        case 'native':
          if (navigator.share) {
            navigator.share({ title: 'TikTopia', text, url }).catch(() => {});
            unlockAchievement('shared-site');
            return;
          }
          navigator.clipboard.writeText(url);
          showToast('📋 Ссылка скопирована!', 'success');
          unlockAchievement('shared-site');
          return;
      }
      if (shareUrl) {
        window.open(shareUrl, '_blank', 'width=600,height=500');
        unlockAchievement('shared-site');
      }
    });
  });

  /* ============================================
     39. AUDIO AMBIENT
     ============================================ */
  const audioBtn = document.createElement('button');
  audioBtn.className = 'audio-toggle';
  audioBtn.innerHTML = '🔇';
  audioBtn.title = 'Звук вкл/выкл';
  document.body.appendChild(audioBtn);

  let audioCtx = null;
  let osc = null;
  let gainNode = null;
  let isAudioOn = false;

  audioBtn.addEventListener('click', () => {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (isAudioOn) {
      osc?.stop();
      isAudioOn = false;
      audioBtn.innerHTML = '🔇';
      showToast('🔇 Звук выключен');
    } else {
      osc = audioCtx.createOscillator();
      gainNode = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.value = 220;
      gainNode.gain.value = 0.02;
      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      osc.start();
      isAudioOn = true;
      audioBtn.innerHTML = '🔊';
      showToast('🔊 Фоновый звук включён', 'success');
      unlockAchievement('used-audio');
    }
  });

  /* ============================================
     40. DAILY QUESTS SYSTEM
     ============================================ */
  const questState = JSON.parse(localStorage.getItem('quests') || '{}');
  const questDate = localStorage.getItem('questDate');

  // Сброс квестов каждый день
  if (questDate !== today) {
    localStorage.setItem('questDate', today);
    localStorage.setItem('quests', JSON.stringify({}));
  }

  function trackQuest(questId) {
    const state = JSON.parse(localStorage.getItem('quests') || '{}');
    state[questId] = (state[questId] || 0) + 1;
    localStorage.setItem('quests', JSON.stringify(state));

    const quest = window.DAILY_QUESTS ? DAILY_QUESTS.find(q => q.id === questId) : null;
    if (quest && state[questId] >= quest.target) {
      showToast(`✅ Квест выполнен: ${quest.title}`, 'success');
    }
  }

  function renderQuests() {
    const questList = document.querySelector('.quest-list');
    if (!questList || !window.DAILY_QUESTS) return;

    const state = JSON.parse(localStorage.getItem('quests') || '{}');

    questList.innerHTML = DAILY_QUESTS.map(q => {
      const current = state[q.id] || 0;
      const done = current >= q.target;
      const percent = Math.min((current / q.target) * 100, 100);
      return `
        <div class="quest-item ${done ? 'done' : ''}">
          <span class="q-icon">${q.icon}</span>
          <div class="q-info">
            <div class="q-title">${q.title}</div>
            <div class="quest-progress">
              <div class="quest-progress-fill" style="width: ${percent}%"></div>
            </div>
          </div>
          <strong style="color: var(--accent);">${current}/${q.target}</strong>
        </div>
      `;
    }).join('');
  }

  renderQuests();
  window.trackQuest = trackQuest;

  /* ============================================
     41. AUTO-UPDATE PLAYER LEVEL BADGE
     ============================================ */
  updatePlayerLevel();

  /* ============================================
     42. RANDOM HERO GREETING
     ============================================ */
  const heroBadge = document.querySelector('.hero-badge');
  if (heroBadge && window.MOTIVATION) {
    const greetings = [
      '🔥 Гайд 2025 — обновлён сегодня',
      '✨ Твоя утопия для роста',
      '🚀 12 достижений ждут тебя',
      '🎮 Мини-игра внутри',
      '💎 3 темы: тёмная, светлая, неон',
    ];
    heroBadge.textContent = greetings[Math.floor(Math.random() * greetings.length)];
  }

  /* ============================================
     43. COPY PAGE LINK HINT
     ============================================ */
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'k') {
      e.preventDefault();
      const searchInput = document.querySelector('.search-input');
      if (searchInput) {
        searchInput.focus();
        showToast('🔍 Поиск активирован', 'info');
      }
    }
  });

});
/* ==========================================================================
   Portfolio — I Made Ari Praditya, S.Kom
   1. Config (edit your social links here)
   2. Content for popups
   3. Page navigation (nav, Previous/Next, hash, keyboard)
   4. Mobile menu
   5. Popup (tools & certificates)
   6. Social buttons & toast
   ========================================================================== */

(() => {
  'use strict';

  /* ---------- 1. Config ---------- */
  // Fill in your own links. Leave a value empty ("") and the button
  // will show a small "coming soon" message instead of a broken link.
  const SOCIALS = {
    phone: '',      // e.g. 'tel:+62812xxxxxxx'
    facebook: '',   // e.g. 'https://www.facebook.com/your.name'
    instagram: ''   // e.g. 'https://www.instagram.com/your.name'
  };

  /* ---------- 2. Popup content ---------- */
  const TOOLS = {
    excel: {
      title: 'Microsoft Excel',
      text: 'Data processing, spreadsheet management, and financial calculations.',
      img: 'assets/img/tool-excel.png',
      alt: 'Microsoft Excel logo'
    },
    jurnal: {
      title: 'Jurnal.id',
      text: 'Basic accounting processes, including sales, purchases, and financial records.',
      img: 'assets/img/tool-jurnal.png',
      alt: 'Jurnal.id logo'
    },
    looker: {
      title: 'Looker Studio',
      text: 'Creating interactive dashboards and visualizing financial data.',
      img: 'assets/img/tool-looker.png',
      alt: 'Looker Studio logo'
    },
    mysql: {
      title: 'MySQL',
      text: 'Database management and data storage.',
      img: 'assets/img/tool-mysql.png',
      alt: 'MySQL logo'
    },
    pentaho: {
      title: 'Pentaho Data Integration',
      text: 'Data extraction, transformation, and loading (ETL).',
      img: 'assets/img/tool-pentaho.png',
      alt: 'Pentaho logo'
    }
  };

  const CERTS = {
    mos: {
      title: 'Microsoft Office Specialist (MOS)',
      text: 'Excel Associate.',
      img: 'assets/img/cert-mos.jpg',
      alt: 'Microsoft Office Specialist certificate'
    },
    jurnal: {
      title: 'Jurnal.id',
      text: 'Basic accounting software and financial transaction management.',
      img: 'assets/img/cert-jurnal.jpg',
      alt: 'Jurnal.id certificate of completion'
    },
    toeic: {
      title: 'TOEIC',
      text: 'English Proficiency Test – Score: 415.',
      img: 'assets/img/cert-toeic.jpg',
      alt: 'TOEIC score report'
    },
    taxation: {
      title: 'Taxation Training',
      text: 'Participant in a basic taxation seminar covering tax planning and legal approaches to managing tax obligations in accordance with applicable regulations.',
      img: 'assets/img/cert-taxation.jpg',
      alt: 'INSTIKI taxation training certificate'
    }
  };

  /* ---------- Helpers ---------- */
  const $  = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const pages = $$('.page');
  const navLinks = $$('.main-nav a');
  const order = pages.map((p) => p.id);
  const baseTitle = 'I Made Ari Praditya, S.Kom | Portfolio';

  let current = 'home';

  /* ---------- 3. Page navigation ---------- */
  function showPage(id, { updateHash = true, scroll = true } = {}) {
    if (!order.includes(id)) id = 'home';

    pages.forEach((page) => {
      const active = page.id === id;
      page.hidden = !active;
      page.classList.toggle('is-active', active);
      page.classList.remove('is-entering');
      if (active && id !== current) {
        // restart the fade-in animation
        void page.offsetWidth;
        page.classList.add('is-entering');
      }
    });

    navLinks.forEach((link) => {
      const active = link.dataset.page === id;
      link.classList.toggle('is-active', active);
      if (active) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });

    const page = document.getElementById(id);
    document.title = id === 'home' ? baseTitle : `${page.dataset.title} | I Made Ari Praditya`;

    if (updateHash && location.hash !== `#${id}`) {
      history.pushState(null, '', `#${id}`);
    }
    if (scroll) window.scrollTo({ top: 0, behavior: 'smooth' });

    current = id;
    closeMenu();
  }

  function go(step) {
    const next = order[order.indexOf(current) + step];
    if (next) showPage(next);
  }

  // Previous / Next buttons
  $$('[data-dir]').forEach((btn) => {
    btn.addEventListener('click', () => go(btn.dataset.dir === 'next' ? 1 : -1));
  });

  // Links that jump to a page (e.g. "Explore My Portfolio") and nav links
  $$('[data-go], .main-nav a').forEach((el) => {
    el.addEventListener('click', (event) => {
      event.preventDefault();
      showPage(el.dataset.go || el.dataset.page);
    });
  });

  // Browser back/forward and manual hash changes
  window.addEventListener('hashchange', () => {
    showPage(location.hash.slice(1), { updateHash: false });
  });

  // Keyboard: arrow keys move between pages
  document.addEventListener('keydown', (event) => {
    if (!$('#modal').hidden) return;
    if (event.target.closest('input, textarea, select')) return;
    if (event.key === 'ArrowRight') go(1);
    if (event.key === 'ArrowLeft') go(-1);
  });

  /* ---------- 4. Mobile menu ---------- */
  const menuToggle = $('#menuToggle');
  const mainNav = $('#mainNav');

  function setMenu(open) {
    mainNav.classList.toggle('is-open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }
  function closeMenu() { setMenu(false); }

  menuToggle.addEventListener('click', () => {
    setMenu(menuToggle.getAttribute('aria-expanded') !== 'true');
  });

  document.addEventListener('click', (event) => {
    if (!mainNav.classList.contains('is-open')) return;
    if (!event.target.closest('.main-nav, .menu-toggle')) closeMenu();
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 1080) closeMenu();
  });

  /* ---------- 5. Popup ---------- */
  const modal = $('#modal');
  const modalMedia = $('#modalMedia');
  const modalTitle = $('#modalTitle');
  const modalText = $('#modalText');
  let lastFocused = null;

  function openModal(data, isLogo) {
    lastFocused = document.activeElement;

    modalMedia.className = 'modal__media' + (isLogo ? ' modal__media--logo' : '');
    modalMedia.innerHTML = '';
    const img = document.createElement('img');
    img.src = data.img;
    img.alt = data.alt;
    modalMedia.appendChild(img);

    modalTitle.textContent = data.title;
    modalText.textContent = data.text;

    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    $('.modal__close', modal).focus();
  }

  function closeModal() {
    if (modal.hidden) return;
    modal.hidden = true;
    document.body.style.overflow = '';
    if (lastFocused) lastFocused.focus();
  }

  $$('[data-tool]').forEach((btn) => {
    btn.addEventListener('click', () => openModal(TOOLS[btn.dataset.tool], true));
  });
  $$('[data-cert]').forEach((btn) => {
    btn.addEventListener('click', () => openModal(CERTS[btn.dataset.cert], false));
  });

  modal.addEventListener('click', (event) => {
    if (event.target.closest('[data-close]')) closeModal();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeModal();
      closeMenu();
    }
    // keep keyboard focus inside the popup
    if (event.key === 'Tab' && !modal.hidden) {
      const focusable = $$('button, a[href]', modal);
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });

  /* ---------- 6. Social buttons & toast ---------- */
  const toast = $('#toast');
  let toastTimer;

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 2400);
  }

  $$('[data-social]').forEach((link) => {
    const type = link.dataset.social;
    if (type === 'email') return; // regular mailto: link

    const url = SOCIALS[type];
    if (url) {
      link.href = url;
      if (url.startsWith('http')) {
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
      }
    } else {
      link.addEventListener('click', (event) => {
        event.preventDefault();
        showToast('This link will be available soon.');
      });
    }
  });

  /* ---------- Init ---------- */
  showPage(location.hash.slice(1) || 'home', { updateHash: false, scroll: false });
})();

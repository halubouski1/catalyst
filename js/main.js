// ========================================
// Nav Menu
// ========================================
const navMenu      = document.getElementById('nav-menu');
const burger       = document.querySelector('.header__burger');
const navMenuClose = document.getElementById('nav-menu-close');

function openNavMenu() {
  navMenu.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeNavMenu() {
  navMenu.classList.remove('active');
  document.body.style.overflow = '';
}

if (navMenu && burger && navMenuClose) {
  burger.addEventListener('click', openNavMenu);
  navMenuClose.addEventListener('click', closeNavMenu);
  document.querySelectorAll('.nav-menu__item').forEach(link => {
    link.addEventListener('click', closeNavMenu);
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && navMenu.classList.contains('active')) closeNavMenu();
  });
}

// ========================================
// Modal
// ========================================
const modalOverlay = document.getElementById('modal');
const modalClose   = document.getElementById('modal-close');

function openModal() {
  modalOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modalOverlay.classList.remove('active');
  document.body.style.overflow = '';
  setTimeout(() => {
    const body    = document.getElementById('modal-body');
    const success = document.getElementById('modal-success');
    if (body)    body.classList.remove('hiding');
    if (success) success.classList.remove('active');
  }, 300);
}

if (modalOverlay) {
  const triggers  = document.querySelectorAll('.hero__cta, .hero__contact-btn, .header__contact-btn, .work-card__btn');
  const modalForm = document.getElementById('modal-form');

  if (modalForm) {
    modalForm.addEventListener('submit', e => {
      e.preventDefault();
      const body    = document.getElementById('modal-body');
      const success = document.getElementById('modal-success');
      if (body) body.classList.add('hiding');
      setTimeout(() => { if (success) success.classList.add('active'); }, 280);
    });
  }

  triggers.forEach(btn => btn.addEventListener('click', openModal));
  if (modalClose) modalClose.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', e => {
    if (e.target === modalOverlay) closeModal();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });
}

// ========================================
// Team profile modal
// ========================================
const teamProfileOverlay = document.getElementById('team-profile-modal');

if (teamProfileOverlay) {
  const profileTriggers = document.querySelectorAll('.team-card__profile-btn[data-profile]');
  const profilePanels   = [...teamProfileOverlay.querySelectorAll('[data-profile-modal]')];
  let activeProfileTrigger = null;
  let profileCloseTimer = null;

  function openTeamProfile(profileId, trigger) {
    const targetPanel = profilePanels.find(panel => panel.dataset.profileModal === profileId);
    if (!targetPanel) return;

    window.clearTimeout(profileCloseTimer);
    activeProfileTrigger = trigger;
    profilePanels.forEach(panel => {
      panel.hidden = panel !== targetPanel;
    });
    teamProfileOverlay.classList.add('active');
    teamProfileOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    const closeButton = targetPanel.querySelector('.team-profile-modal__close');
    if (closeButton) closeButton.focus({ preventScroll: true });
  }

  function closeTeamProfile() {
    if (!teamProfileOverlay.classList.contains('active')) return;

    teamProfileOverlay.classList.remove('active');
    teamProfileOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    const triggerToFocus = activeProfileTrigger;
    activeProfileTrigger = null;
    if (triggerToFocus) triggerToFocus.focus({ preventScroll: true });

    profileCloseTimer = window.setTimeout(() => {
      profilePanels.forEach(panel => {
        panel.hidden = true;
      });
    }, 300);
  }

  profileTriggers.forEach(button => {
    button.addEventListener('click', () => openTeamProfile(button.dataset.profile, button));
  });

  profilePanels.forEach(panel => {
    const closeButton = panel.querySelector('.team-profile-modal__close');
    if (closeButton) closeButton.addEventListener('click', closeTeamProfile);
  });

  teamProfileOverlay.addEventListener('click', e => {
    if (e.target === teamProfileOverlay) closeTeamProfile();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeTeamProfile();
  });
}

// ========================================
// Lenis smooth scroll
// ========================================
let lenis = null;
if (typeof Lenis !== 'undefined') {
  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });

  const lenisRaf = (time) => {
    lenis.raf(time);
    requestAnimationFrame(lenisRaf);
  };
  requestAnimationFrame(lenisRaf);
}

// ========================================
// Anchor scroll (uses Lenis if present, else native)
// ========================================
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const hash = link.getAttribute('href');
    if (!hash || hash === '#') return;
    const target = document.querySelector(hash);
    if (!target) return;
    e.preventDefault();
    if (lenis) {
      lenis.scrollTo(target, { duration: 1.4, offset: 0 });
    } else {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// ========================================
// AOS init
// ========================================
if (typeof AOS !== 'undefined') {
  AOS.init({
    duration: 900,
    once: true,
    offset: 80,
    easing: 'ease-out-cubic',
  });
  if (lenis) lenis.on('scroll', AOS.refresh);
}

// svg what we do animation
if (document.getElementById('scene')) {
  const VBOX  = 1311;
  const R_DOT = 22.5;
  const getGAP = () => window.innerWidth <= 1919 ? 20 : 50;

  const BTN_DATA = [
    { i: 0, cx: 654.635, cy:   70.135, side: 'right' }, // top
    { i: 1, cx: 1239.63, cy:  655.135, side: 'right' }, // right
    { i: 2, cx:  70.635, cy:  655.135, side: 'left'  }, // left
    { i: 3, cx: 654.635, cy: 1239.13,  side: 'left'  }, // bottom
    { i: 4, cx: 228.635, cy: 1048.13,  side: 'left'  }, // bottom-left
    { i: 5, cx: 1081.63, cy:  262.135, side: 'right' }, // top-right
    { i: 6, cx: 1081.63, cy: 1048.13,  side: 'right' }, // bottom-right
    { i: 7, cx: 228.635, cy:  262.135, side: 'left'  }, // top-left
  ];

  function placeLabels() {
    if (window.innerWidth <= 1024) return;
    const scene = document.getElementById('scene');
    const rect  = scene.getBoundingClientRect();
    const size  = rect.width;
    const scale = size / VBOX;

    BTN_DATA.forEach(({ i, cx, cy, side }) => {
      const label = document.querySelector(`.info-label[data-i="${i}"]`);
      if (!label) return;

      const vx = rect.left + cx * scale;
      const vy = rect.top  + cy * scale;
      const r  = R_DOT * scale;

      const GAP = getGAP();
      label.style.left  = '';
      label.style.right = '';
      if (side === 'right') {
        label.style.left      = (vx + r + GAP) + 'px';
        label.style.textAlign = 'left';
      } else {
        label.style.right     = (window.innerWidth - (vx - r - GAP)) + 'px';
        label.style.textAlign = 'right';
      }

      label.style.top    = vy + 'px';
      label.style.bottom = '';
    });
  }

  const allLabels = [...document.querySelectorAll('.info-label')];
  const allBtns   = [...document.querySelectorAll('.btn-dot')];

  // Pre-cache label heights to avoid reflows on each tap
  const mobileH = new Map();
  let mobilePanelH = 0;

  function buildHeightCache() {
    if (window.innerWidth > 1024) return;
    mobileH.clear();
    allLabels.forEach(label => {
      const h = label.scrollHeight;
      if (h > 0) mobileH.set(label, h);
    });
  }
  buildHeightCache();
  window.addEventListener('resize', buildHeightCache);

  const dblRaf = (fn) => requestAnimationFrame(() => requestAnimationFrame(fn));

  const panelDone = (panel, fn) => {
    const handler = (e) => {
      if (e.propertyName !== 'height') return;
      panel.removeEventListener('transitionend', handler);
      fn();
    };
    panel.addEventListener('transitionend', handler);
  };

  // Smoothly collapse the open label (used on tap-outside and tap-same-dot)
  function mobileCollapse() {
    const panel = document.querySelector('.what-we-do__label-panel');
    if (!panel) return;
    const curLabel = allLabels.find(l => l.classList.contains('active'));
    allBtns.forEach(b => b.classList.remove('active'));
    if (!curLabel) return;

    panel.style.transition = '';
    panel.style.height = mobilePanelH + 'px';
    curLabel.style.opacity = '0';
    dblRaf(() => {
      panel.style.transition = 'height 0.35s ease';
      panel.style.height = '0px';
    });
    panelDone(panel, () => {
      curLabel.classList.remove('active');
      curLabel.style.opacity = '';
      panel.style.transition = '';
      panel.style.height = '';
      mobilePanelH = 0;
    });
  }

  function mobileSwitchLabel(iStr) {
    const panel = document.querySelector('.what-we-do__label-panel');
    if (!panel) return;

    const curLabel = allLabels.find(l => l.classList.contains('active'));
    const newLabel = document.querySelector(`.info-label[data-i="${iStr}"]`);
    const newBtn   = document.querySelector(`.btn-dot[data-i="${iStr}"]`);
    if (!newLabel) return;

    // Close same label
    if (curLabel === newLabel) {
      mobileCollapse();
      return;
    }

    allBtns.forEach(b => b.classList.remove('active'));
    if (newBtn) newBtn.classList.add('active');
    const targetH = mobileH.get(newLabel) || newLabel.scrollHeight;

    // Open first label (nothing was active)
    if (!curLabel) {
      panel.style.transition = '';
      panel.style.height = '0px';
      newLabel.classList.add('active');
      newLabel.style.opacity = '0';
      dblRaf(() => {
        panel.style.transition = 'height 0.35s ease';
        panel.style.height = targetH + 'px';
        newLabel.style.transition = 'opacity 0.28s ease 0.08s';
        newLabel.style.opacity = '1';
      });
      panelDone(panel, () => {
        panel.style.transition = '';
        panel.style.height = '';
        newLabel.style.transition = '';
        newLabel.style.opacity = '';
        mobilePanelH = targetH;
      });
      return;
    }

    // Switch from one label to another
    const fromH = mobilePanelH;
    curLabel.style.opacity = '0';

    setTimeout(() => {
      curLabel.classList.remove('active');
      curLabel.style.opacity = '';
      panel.style.transition = '';
      panel.style.height = fromH + 'px';
      newLabel.classList.add('active');
      newLabel.style.opacity = '0';
      dblRaf(() => {
        panel.style.transition = 'height 0.35s ease';
        panel.style.height = targetH + 'px';
        newLabel.style.transition = 'opacity 0.28s ease';
        newLabel.style.opacity = '1';
      });
      panelDone(panel, () => {
        panel.style.transition = '';
        panel.style.height = '';
        newLabel.style.transition = '';
        newLabel.style.opacity = '';
        mobilePanelH = targetH;
      });
    }, 180);
  }

  allBtns.forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();

      if (window.innerWidth <= 1024) {
        mobileSwitchLabel(btn.dataset.i);
        return;
      }

      const label = document.querySelector(`.info-label[data-i="${btn.dataset.i}"]`);
      if (!label) return;
      const wasActive = label.classList.contains('active');
      allLabels.forEach(l => l.classList.remove('active'));
      allBtns.forEach(b => b.classList.remove('active'));
      if (!wasActive) {
        label.classList.add('active');
        btn.classList.add('active');
      }
    });
  });

  document.addEventListener('click', () => {
    if (window.innerWidth <= 1024) {
      mobileCollapse();
      return;
    }
    allLabels.forEach(l => l.classList.remove('active'));
    allBtns.forEach(b => b.classList.remove('active'));
  });

  placeLabels();
  window.addEventListener('resize', placeLabels);
  window.addEventListener('scroll', placeLabels);

  function activateDot(index) {
    allLabels.forEach(l => l.classList.remove('active'));
    allBtns.forEach(b => b.classList.remove('active'));
    const label = document.querySelector(`.info-label[data-i="${index}"]`);
    const btn   = document.querySelector(`.btn-dot[data-i="${index}"]`);
    if (label) label.classList.add('active');
    if (btn)   btn.classList.add('active');
    // On mobile the panel opens instantly here, so keep mobilePanelH in sync
    // with the open label — otherwise the first tap animates from 0 (jump).
    if (window.innerWidth <= 1024 && label) {
      mobilePanelH = mobileH.get(label) || label.scrollHeight;
    }
  }

  const whatWeDo = document.querySelector('.what-we-do');
  if (whatWeDo) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          activateDot(0);
          observer.disconnect();
        }
      });
    }, { threshold: 0.3 });
    observer.observe(whatWeDo);
  }

} // end scene guard

// swiper
if (typeof Swiper !== 'undefined' && document.querySelector('.team__swiper')) {
  new Swiper('.team__swiper', {
    slidesPerView: 3.5,
    spaceBetween: 34,
    breakpoints: {
      0: {
        slidesPerView: 'auto',
        spaceBetween: 25,
      },
      1024: {
        slidesPerView: 3.5,
      },
      1920: {
        spaceBetween: 34,
      },
    },
    navigation: {
      prevEl: '.team__arrow--prev',
      nextEl: '.team__arrow--next',
    },
    a11y: {
      // Keep accessibility, but don't let the slider auto-scroll to a slide
      // when a card button regains focus (e.g. after closing a team popup).
      scrollOnFocus: false,
    },
  });
}

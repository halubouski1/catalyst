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

burger.addEventListener('click', openNavMenu);
navMenuClose.addEventListener('click', closeNavMenu);
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && navMenu.classList.contains('active')) closeNavMenu();
});

// ========================================
// Modal
// ========================================
const modalOverlay = document.getElementById('modal');
const modalClose   = document.getElementById('modal-close');
const triggers     = document.querySelectorAll('.hero__cta, .hero__contact-btn, .header__contact-btn, .work-card__btn');

function openModal() {
  modalOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modalOverlay.classList.remove('active');
  document.body.style.overflow = '';
  setTimeout(() => {
    document.getElementById('modal-body').classList.remove('hiding');
    document.getElementById('modal-success').classList.remove('active');
  }, 300);
}

document.getElementById('modal-form').addEventListener('submit', e => {
  e.preventDefault();
  const body    = document.getElementById('modal-body');
  const success = document.getElementById('modal-success');
  body.classList.add('hiding');
  setTimeout(() => success.classList.add('active'), 280);
});

triggers.forEach(btn => btn.addEventListener('click', openModal));
modalClose.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', e => {
  if (e.target === modalOverlay) closeModal();
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});

// ========================================
// Lenis smooth scroll
// ========================================
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
});

function lenisRaf(time) {
  lenis.raf(time);
  requestAnimationFrame(lenisRaf);
}
requestAnimationFrame(lenisRaf);

// ========================================
// AOS init
// ========================================
AOS.init({
  duration: 900,
  once: true,
  offset: 80,
  easing: 'ease-out-cubic',
});
lenis.on('scroll', AOS.refresh);

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

  function mobileSwitchLabel(iStr) {
    const panel    = document.querySelector('.what-we-do__label-panel');
    if (!panel) return;

    const curLabel = allLabels.find(l => l.classList.contains('active'));
    const curBtn   = allBtns.find(b => b.classList.contains('active'));
    const newLabel = document.querySelector(`.info-label[data-i="${iStr}"]`);
    const newBtn   = document.querySelector(`.btn-dot[data-i="${iStr}"]`);
    if (!newLabel) return;

    const toggling = curLabel === newLabel;

    if (toggling) {
      panel.style.height = panel.offsetHeight + 'px';
      curLabel.style.transition = 'opacity 0.25s ease';
      curLabel.style.opacity    = '0';
      if (curBtn) curBtn.classList.remove('active');

      setTimeout(() => {
        curLabel.classList.remove('active');
        curLabel.style.transition = '';
        curLabel.style.opacity    = '';
        panel.style.transition = 'height 0.35s ease';
        panel.style.height     = '0px';
        setTimeout(() => {
          panel.style.transition = '';
          panel.style.height     = '';
        }, 350);
      }, 260);
      return;
    }

    if (!curLabel) {
      newLabel.style.display    = 'block';
      newLabel.style.opacity    = '0';
      newLabel.style.transition = 'none';
      newLabel.classList.add('active');
      if (newBtn) newBtn.classList.add('active');

      const newH = newLabel.scrollHeight;
      panel.style.height = '0px';

      requestAnimationFrame(() => {
        panel.style.transition    = 'height 0.35s ease';
        panel.style.height        = newH + 'px';
        newLabel.style.transition = 'opacity 0.3s ease';
        newLabel.style.opacity    = '1';

        setTimeout(() => {
          newLabel.style.display    = '';
          newLabel.style.opacity    = '';
          newLabel.style.transition = '';
          panel.style.transition    = '';
          panel.style.height        = '';
        }, 350);
      });
      return;
    }

    panel.style.height   = panel.offsetHeight + 'px';
    curLabel.style.transition = 'opacity 0.25s ease';
    curLabel.style.opacity    = '0';
    if (curBtn) curBtn.classList.remove('active');

    setTimeout(() => {
      curLabel.classList.remove('active');
      curLabel.style.transition = '';
      curLabel.style.opacity    = '';

      newLabel.style.display    = 'block';
      newLabel.style.opacity    = '0';
      newLabel.style.transition = 'none';
      newLabel.classList.add('active');
      if (newBtn) newBtn.classList.add('active');

      const newH = newLabel.scrollHeight;

      requestAnimationFrame(() => {
        panel.style.transition    = 'height 0.35s ease';
        panel.style.height        = newH + 'px';
        newLabel.style.transition = 'opacity 0.3s ease';
        newLabel.style.opacity    = '1';

        setTimeout(() => {
          newLabel.style.display    = '';
          newLabel.style.opacity    = '';
          newLabel.style.transition = '';
          panel.style.transition    = '';
          panel.style.height        = '';
        }, 350);
      });
    }, 260);
  }

  allBtns.forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();

      if (window.innerWidth <= 1024) {
        mobileSwitchLabel(btn.dataset.i);
        return;
      }

      const label     = document.querySelector(`.info-label[data-i="${btn.dataset.i}"]`);
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

//swiper
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
  });
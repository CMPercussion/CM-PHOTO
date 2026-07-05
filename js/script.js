(function () {
  if (typeof CONFIG === 'undefined') return;  // not a gallery page, stop here safely

(function () {
  var gallery = document.getElementById('gallery');
  var emptyMsg = document.getElementById('gallery-empty');
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightbox-img');
  var btnClose = document.getElementById('lightbox-close');
  var btnPrev = document.getElementById('lightbox-prev');
  var btnNext = document.getElementById('lightbox-next');
  var images = [];
  var currentIndex = 0;

  function filenameToAlt(filename) {
    return filename.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ');
  }

  function updateLightboxImage() {
    var filename = images[currentIndex];
    lightboxImg.src = CONFIG.GALLERY + '/images/' + filename;
    lightboxImg.alt = filenameToAlt(filename);
  }

  function openLightbox(index) {
    currentIndex = index;
    updateLightboxImage();
    lightbox.classList.add('active');
    btnClose.focus();
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    lightboxImg.src = '';
    document.body.style.overflow = '';
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % images.length;
    updateLightboxImage();
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    updateLightboxImage();
  }

  btnClose.addEventListener('click', closeLightbox);
  btnNext.addEventListener('click', showNext);
  btnPrev.addEventListener('click', showPrev);

  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', function (e) {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNext();
    if (e.key === 'ArrowLeft') showPrev();
  });

  fetch(CONFIG.GALLERY + '/manifest.json', { cache: 'no-store' })
    .then(function (res) {
      if (!res.ok) throw new Error('manifest.json not found');
      return res.json();
    })
    .then(function (list) {
      images = Array.isArray(list) ? list : [];
      if (images.length === 0) {
        emptyMsg.hidden = false;
        return;
      }
      images.forEach(function (filename, index) {
        var img = document.createElement('img');
        img.src = CONFIG.GALLERY + '/images/' + filename;
        img.alt = filenameToAlt(filename);
        img.loading = 'lazy';
        img.tabIndex = 0;
        img.setAttribute('role', 'button');
        img.addEventListener('click', function () {
          openLightbox(index);
        });
        img.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openLightbox(index);
          }
        });
        gallery.appendChild(img);
      });
    })
    .catch(function (err) {
      console.error('Gallery error:', err);
      emptyMsg.hidden = false;
      emptyMsg.textContent = 'Could not load images. Make sure manifest.json exists and lists your image filenames.';
    });
})();
})();


    // ============================================
    //               GALLERY HEADER
    // ============================================
(function () {
  const heroWrap = document.querySelector('.hero-wrap');
  const heroImg = document.getElementById('heroImg');
  const heroContent = document.getElementById('heroContent');

  if (!heroWrap || !heroImg || !heroContent) return;

  const MAX_BLUR = 14;
  const MIN_BRIGHTNESS = 0.35;
  const MAX_SCALE = 1.12;

  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  window.scrollTo(0, 0);

  function onHeroScroll() {
    const fadeRange = window.innerHeight; // effect plays over one full viewport of scrolling
    const progress = Math.min(Math.max(window.scrollY / fadeRange, 0), 1);
    const blur = progress * MAX_BLUR;
    const brightness = 1 - progress * (1 - MIN_BRIGHTNESS);
    const scale = 1 + progress * (MAX_SCALE - 1);
    heroImg.style.filter = `blur(${blur}px) brightness(${brightness})`;
    heroImg.style.transform = `scale(${scale})`;
    heroContent.style.opacity = 1 - progress * 1.3;
    heroContent.style.transform = `translateY(${progress * -40}px)`;
  }

  window.addEventListener('scroll', onHeroScroll, { passive: true });
  window.addEventListener('resize', onHeroScroll);
  onHeroScroll();
})();
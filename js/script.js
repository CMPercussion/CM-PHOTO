(function () {
  if (typeof CONFIG === 'undefined') return;  // not a gallery page, stop here safely

  var gallery = document.getElementById('gallery');
  var emptyMsg = document.getElementById('gallery-empty');
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightbox-img');
  var btnClose = document.getElementById('lightbox-close');
  var btnPrev = document.getElementById('lightbox-prev');
  var btnNext = document.getElementById('lightbox-next');
  var images = [];
  var currentIndex = 0;

  if (!gallery || !emptyMsg) return;

  function filenameToAlt(filename) {
    return filename.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ');
  }

  function updateLightboxImage() {
    var filename = images[currentIndex];
    lightboxImg.src = CONFIG.GALLERY + '/images/' + filename;
    lightboxImg.alt = filenameToAlt(filename);
  }

  function openLightbox(index) {
    if (!lightbox || !lightboxImg) return;
    currentIndex = index;
    updateLightboxImage();
    lightbox.classList.add('active');
    if (btnClose) btnClose.focus();
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightbox || !lightboxImg) return;
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

  if (btnClose) btnClose.addEventListener('click', closeLightbox);
  if (btnNext) btnNext.addEventListener('click', showNext);
  if (btnPrev) btnPrev.addEventListener('click', showPrev);

  if (lightbox) {
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });
  }

  document.addEventListener('keydown', function (e) {
    if (!lightbox || !lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNext();
    if (e.key === 'ArrowLeft') showPrev();
  });

  function renderGallery(list) {
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
  }

  function showError(err) {
    console.error('Gallery error:', err);
    emptyMsg.hidden = false;
    emptyMsg.textContent = 'Could not load images. Run "node generate-manifest.js" inside the gallery folder to update manifest.js and manifest.json.';
  }

  function loadManifestFromJson() {
    return fetch(CONFIG.GALLERY + '/manifest.json', { cache: 'no-store' })
      .then(function (res) {
        if (!res.ok) throw new Error('manifest.json not found');
        return res.json();
      });
  }

  function loadManifestFromScript() {
    return new Promise(function (resolve, reject) {
      window.GALLERY_MANIFEST = undefined;
      var script = document.createElement('script');
      var src = CONFIG.GALLERY + '/manifest.js';
      if (window.location.protocol !== 'file:') {
        src += '?v=' + Date.now();
      }
      script.src = src;
      script.onload = function () {
        if (Array.isArray(window.GALLERY_MANIFEST)) {
          resolve(window.GALLERY_MANIFEST);
        } else {
          reject(new Error('manifest.js did not define GALLERY_MANIFEST'));
        }
      };
      script.onerror = function () {
        reject(new Error('manifest.js not found'));
      };
      document.head.appendChild(script);
    });
  }

  loadManifestFromScript()
    .catch(function () {
      return loadManifestFromJson();
    })
    .then(renderGallery)
    .catch(showError);
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

// ============ formspree ============

document.addEventListener('DOMContentLoaded', function () {
  const openBtn = document.getElementById('contact-btn');
  const modal = document.getElementById('contact-modal');
  const form = document.getElementById('contact-form');

  if (!openBtn || !modal || !form) return;

  const closeBtn = modal.querySelector('.modal-close');

  openBtn.addEventListener('click', function (e) {
    e.preventDefault();
    modal.hidden = false;
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', function () {
      modal.hidden = true;
    });
  }

  modal.addEventListener('click', function (e) {
    if (e.target === modal) modal.hidden = true;
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { 'Accept': 'application/json' }
    })
      .then(function (response) {
        if (response.ok) {
          modal.hidden = true;
          form.reset();
          alert("Thanks! Your message has been sent.");
        } else {
          alert("Something went wrong. Please try again or email me directly.");
        }
      })
      .catch(function () {
        alert("Something went wrong. Please try again or email me directly.");
      });
  });
});
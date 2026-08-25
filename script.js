/**
 * Hindustan Tea Co. - Modern Heritage Interactive Logic
 * Media Gallery Filter, Lightbox Player & Motion Architecture
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Ambient Glow Mouse Follower (Throttled for 60fps)
  let ticking = false;
  window.addEventListener('mousemove', (e) => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const xPercent = ((e.clientX / window.innerWidth) * 100).toFixed(1);
        const yPercent = ((e.clientY / window.innerHeight) * 100).toFixed(1);
        document.documentElement.style.setProperty('--mouse-x', `${xPercent}%`);
        document.documentElement.style.setProperty('--mouse-y', `${yPercent}%`);
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  // 2. Media Gallery Filter System
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryCards = document.querySelectorAll('.gallery-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const filter = btn.getAttribute('data-filter');

      galleryCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px) scale(0.98)';
          setTimeout(() => {
            card.style.transition = 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
          }, 30);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // 3. Interactive Lightbox Modal (Videos & High-Res Images)
  const lightbox = document.getElementById('lightbox-backdrop');
  const mediaBox = document.getElementById('lightbox-media-box');
  const lbTitle = document.getElementById('lightbox-title');
  const lbDesc = document.getElementById('lightbox-desc');
  const lbClose = document.getElementById('lightbox-close');
  let prevFocus = null;

  function openLightbox(card) {
    if (!lightbox || !mediaBox) return;
    prevFocus = document.activeElement;

    const type = card.getAttribute('data-type');
    const src = card.getAttribute('data-src');
    const title = card.getAttribute('data-title') || '';
    const desc = card.getAttribute('data-desc') || '';

    lbTitle.textContent = title;
    lbDesc.textContent = desc;
    mediaBox.innerHTML = '';

    if (type === 'video') {
      const video = document.createElement('video');
      video.src = src;
      video.controls = true;
      video.autoplay = true;
      video.playsInline = true;
      video.style.width = '100%';
      video.style.maxHeight = '70vh';
      mediaBox.appendChild(video);
    } else {
      const img = document.createElement('img');
      img.src = src;
      img.alt = title;
      img.style.maxWidth = '100%';
      img.style.maxHeight = '70vh';
      img.style.objectFit = 'contain';
      mediaBox.appendChild(img);
    }

    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
    if (lbClose) lbClose.focus();
  }

  function closeLightbox() {
    if (!lightbox) return;
    const activeVideo = mediaBox.querySelector('video');
    if (activeVideo) {
      activeVideo.pause();
    }
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    mediaBox.innerHTML = '';
    if (prevFocus) prevFocus.focus();
  }

  galleryCards.forEach(card => {
    card.addEventListener('click', () => openLightbox(card));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(card);
      }
    });
    // Ensure keyboard accessible tab stop
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `View ${card.getAttribute('data-title') || 'media item'}`);
  });

  if (lbClose) {
    lbClose.addEventListener('click', closeLightbox);
  }

  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox?.classList.contains('active')) {
      closeLightbox();
    }
  });

  // 4. Google Sheets Invitation Form Integration
  // Replace with your deployed Google Apps Script Web App URL
  const GOOGLE_SHEET_WEBAPP_URL = "https://script.google.com/macros/s/AKfycbwEK3XrvpYZBOUcg5OYUmZkb6BPP2ByKZtIn9O0SUkGLSk3IzJLJpRL2r2EM3j5rh66Ng/exec";

  const form = document.getElementById('invitation-form');
  const emailInput = document.getElementById('email-input');
  const successCard = document.getElementById('success-message');
  const submitBtn = document.getElementById('submit-btn');
  const btnText = document.getElementById('btn-text');

  if (form && emailInput && successCard && submitBtn) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = emailInput.value.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!email || !emailRegex.test(email)) {
        emailInput.classList.add('error');
        emailInput.focus();
        setTimeout(() => {
          emailInput.classList.remove('error');
        }, 1200);
        return;
      }

      submitBtn.disabled = true;
      if (btnText) btnText.textContent = 'RESERVING INVITATION...';

      const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

      // 1. Submit to Google Sheets (Free Google Apps Script Web App)
      if (GOOGLE_SHEET_WEBAPP_URL && GOOGLE_SHEET_WEBAPP_URL.startsWith('http')) {
        try {
          const formData = new FormData();
          formData.append('email', email);
          formData.append('timestamp', timestamp);
          formData.append('source', window.location.href);

          await fetch(GOOGLE_SHEET_WEBAPP_URL, {
            method: 'POST',
            body: formData,
            mode: 'no-cors'
          });
        } catch (err) {
          console.warn('Google Sheets sync notice:', err);
        }
      }

      // 2. Local Backup Persistence
      try {
        const subscribers = JSON.parse(localStorage.getItem('htea_subscribers') || '[]');
        subscribers.push({ email, timestamp, syncedToGoogleSheets: !!GOOGLE_SHEET_WEBAPP_URL });
        localStorage.setItem('htea_subscribers', JSON.stringify(subscribers));
      } catch (err) {
        console.warn('Storage unavailable:', err);
      }

      // 3. Visual Success Confirmation
      setTimeout(() => {
        form.style.display = 'none';
        successCard.style.display = 'block';
      }, 500);
    });
  }

  // 5. Background Video Autoplay Resilience & Smooth Fade-In
  const bgVideo = document.getElementById('bg-video');
  if (bgVideo) {
    const handleVideoReady = () => {
      bgVideo.classList.add('is-loaded');
    };

    if (bgVideo.readyState >= 2) {
      handleVideoReady();
    } else {
      bgVideo.addEventListener('loadeddata', handleVideoReady, { once: true });
      bgVideo.addEventListener('playing', handleVideoReady, { once: true });
      // Fallback timeout in case video loading is slow
      setTimeout(handleVideoReady, 300);
    }

    const playPromise = bgVideo.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        bgVideo.muted = true;
        bgVideo.play().catch(() => { });
      });
    }
  }
});

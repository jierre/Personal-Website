function initCertSlider() {
  const certContainer = document.getElementById('certContainer');
  if (!certContainer) return;

  const certCards = Array.from(certContainer.querySelectorAll('.cert-card'));
  const upBtn = document.getElementById('certUpBtn');
  const downBtn = document.getElementById('certDownBtn');
  const progressBar = document.getElementById('certProgressBar');

  if (!certCards.length) return;

  let activeIndex = 0;
  const totalCerts = certCards.length;

  function updateCertSlider() {
    certCards.forEach((card, idx) => {
      const offset = idx - activeIndex;

      if (offset === 0) {
        // --- Active Center Card ---
        card.style.transform = 'translateY(0px) scale(1)';
        card.style.opacity = '1';
        card.style.zIndex = '5';
        card.style.pointerEvents = 'auto';
      } else if (offset === 1) {
        // --- Peeking Below ---
        card.style.transform = 'translateY(90px) scale(0.95)';
        card.style.opacity = '0.35';
        card.style.zIndex = '3';
        card.style.pointerEvents = 'auto';
      } else if (offset === -1) {
        // --- Peeking Above ---
        card.style.transform = 'translateY(-90px) scale(0.95)';
        card.style.opacity = '0.35';
        card.style.zIndex = '3';
        card.style.pointerEvents = 'auto';
      } else {
        // --- Stacked / Hidden Outer Cards ---
        const direction = offset > 0 ? 1 : -1;
        card.style.transform = `translateY(${direction * 180}px) scale(0.88)`;
        card.style.opacity = '0';
        card.style.zIndex = '1';
        card.style.pointerEvents = 'none';
      }
    });

    // --- Update Timeline Progress Bar Height & Position ---
    if (progressBar) {
      const segmentPercent = 100 / totalCerts;
      progressBar.style.height = `${segmentPercent}%`;
      progressBar.style.top = `${activeIndex * segmentPercent}%`;
    }
  }

  // --- Controls ---
  if (downBtn) {
    downBtn.addEventListener('click', () => {
      activeIndex = (activeIndex + 1) % totalCerts;
      updateCertSlider();
    });
  }

  if (upBtn) {
    upBtn.addEventListener('click', () => {
      activeIndex = (activeIndex - 1 + totalCerts) % totalCerts;
      updateCertSlider();
    });
  }

  // Allow direct card clicks to active them
  certCards.forEach((card, idx) => {
    card.addEventListener('click', () => {
      if (activeIndex !== idx) {
        activeIndex = idx;
        updateCertSlider();
      }
    });
  });

  // Enable subtle vertical mouse wheel navigation over viewport
  const viewport = certContainer.closest('.cert-viewport');
  if (viewport) {
    let isCooldown = false;
    viewport.addEventListener('wheel', (e) => {
      e.preventDefault();
      if (isCooldown) return;

      if (e.deltaY > 0) {
        activeIndex = (activeIndex + 1) % totalCerts;
      } else if (e.deltaY < 0) {
        activeIndex = (activeIndex - 1 + totalCerts) % totalCerts;
      }
      
      updateCertSlider();

      // Debounce scroll velocity
      isCooldown = true;
      setTimeout(() => { isCooldown = false; }, 300);
    }, { passive: false });
  }

  updateCertSlider();
}

// Dom Ready Initializer
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCertSlider);
} else {
  initCertSlider();
}
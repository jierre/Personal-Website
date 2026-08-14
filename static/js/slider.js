function initCarousel() {
  const cards = Array.from(document.querySelectorAll('.card'));
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const indicatorsContainer = document.getElementById('indicators');

  if (!cards.length) return;

  let activeIndex = 0;
  const totalCards = cards.length;

  // Clear & Render Indicator Dots
  if (indicatorsContainer) {
    indicatorsContainer.innerHTML = '';
    cards.forEach((_, idx) => { // Fixed: iterate over 'cards' array, not 'totalCards'
      const dot = document.createElement('div');
      dot.classList.add('dot');
      if (idx === 0) dot.classList.add('active');
      dot.addEventListener('click', () => {
        activeIndex = idx;
        updateCarousel();
      });
      indicatorsContainer.appendChild(dot);
    });
  }

  function updateCarousel() {
    const dots = document.querySelectorAll('.dot');

    // Detect mobile viewport
    const isMobile = window.innerWidth <= 640;

    // Displacement distances
    const translateDist = isMobile ? 130 : 200; // 130px shift on mobile leaves plenty of clickable space
    const hiddenDist = isMobile ? 260 : 350;

    cards.forEach((card, index) => {
      let offset = index - activeIndex;

      // Circular looping calculation
      if (offset > totalCards / 2) {
        offset -= totalCards;
      } else if (offset < -totalCards / 2) {
        offset += totalCards;
      }

      if (offset === 0) {
        // --- Active Center Card ---
        card.style.transform = `translateX(0px) scale(1) rotateZ(0deg)`;
        card.style.zIndex = '10';
        card.style.opacity = '1';
        card.style.pointerEvents = 'auto';
        card.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.12)';
      } 
      else if (offset === 1) {
        // --- Peeking Right Card ---
        card.style.transform = `translateX(${translateDist}px) scale(0.88) rotateZ(5deg)`;
        card.style.zIndex = '5';
        card.style.opacity = '0.85';
        card.style.pointerEvents = 'auto'; // Tappable
        card.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.05)';
      } 
      else if (offset === -1) {
        // --- Peeking Left Card ---
        card.style.transform = `translateX(-${translateDist}px) scale(0.88) rotateZ(-5deg)`;
        card.style.zIndex = '5';
        card.style.opacity = '0.85';
        card.style.pointerEvents = 'auto'; // Tappable
        card.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.05)';
      } 
      else {
        // --- Hidden Background Cards ---
        const direction = offset > 0 ? 1 : -1;
        card.style.transform = `translateX(${direction * hiddenDist}px) scale(0.7) rotateZ(${direction * 10}deg)`;
        card.style.zIndex = '1';
        card.style.opacity = '0';
        card.style.pointerEvents = 'none';
      }
    });

    // Update Dots
    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === activeIndex);
    });
  }

  // Recalculate layout dynamically on window resize
  window.addEventListener('resize', updateCarousel);

  // Click card directly to bring it to front
  cards.forEach((card, index) => {
    card.addEventListener('click', () => {
      if (activeIndex !== index) {
        activeIndex = index;
        updateCarousel();
      }
    });
  });

  // Buttons
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      activeIndex = (activeIndex + 1) % totalCards;
      updateCarousel();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      activeIndex = (activeIndex - 1 + totalCards) % totalCards;
      updateCarousel();
    });
  }

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' && nextBtn) nextBtn.click();
    if (e.key === 'ArrowLeft' && prevBtn) prevBtn.click();
  });

  updateCarousel();
}

// Safely execute when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCarousel);
} else {
  initCarousel();
}
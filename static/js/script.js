document.addEventListener('DOMContentLoaded', () => {
  const cards = Array.from(document.querySelectorAll('.deck-card'));
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');

  let activeIndex = 0;
  const total = cards.length;

  function updateDeckState() {
    cards.forEach((card, i) => {
      // Remove previous position classes
      card.classList.remove('is-center', 'is-left', 'is-right', 'is-hidden');

      const prevIndex = (activeIndex - 1 + total) % total;
      const nextIndex = (activeIndex + 1) % total;

      if (i === activeIndex) {
        card.classList.add('is-center');
      } else if (i === prevIndex) {
        card.classList.add('is-left');
      } else if (i === nextIndex) {
        card.classList.add('is-right');
      } else {
        card.classList.add('is-hidden');
      }
    });
  }

  // Allow direct card clicks to focus them
  cards.forEach((card, index) => {
    card.addEventListener('click', () => {
      if (index !== activeIndex) {
        activeIndex = index;
        updateDeckState();
      }
    });
  });

  // Next / Prev Button Controls
  nextBtn.addEventListener('click', () => {
    activeIndex = (activeIndex + 1) % total;
    updateDeckState();
  });

  prevBtn.addEventListener('click', () => {
    activeIndex = (activeIndex - 1 + total) % total;
    updateDeckState();
  });

  // Keyboard Arrow navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') nextBtn.click();
    if (e.key === 'ArrowLeft') prevBtn.click();
  });

  // Initialize deck layout
  updateDeckState();
});
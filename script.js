const screens = document.querySelectorAll('.screen');
const startBtn = document.getElementById('start-btn');
const toMemoriesBtn = document.getElementById('to-memories');
const toThanksBtn = document.getElementById('to-thanks');
const toLetterBtn = document.getElementById('to-letter');
const toFinalBtn = document.getElementById('to-final');
const introHeartEl = document.getElementById('intro-heart');
const photoModalEl = document.getElementById('photo-modal');
const photoModalImageEl = document.getElementById('photo-modal-image');
const photoModalCloseEl = document.getElementById('photo-modal-close');

function showScreen(screenId) {
  screens.forEach((screen) => {
    screen.classList.toggle('active', screen.id === screenId);
  });
}

if (startBtn) {
  startBtn.addEventListener('click', () => showScreen('screen2'));
}
if (toMemoriesBtn) {
  toMemoriesBtn.addEventListener('click', () => showScreen('screen4'));
}
if (toThanksBtn) {
  toThanksBtn.addEventListener('click', () => showScreen('screen5'));
}
if (toLetterBtn) {
  toLetterBtn.addEventListener('click', () => showScreen('screen6'));
}
if (toFinalBtn) {
  toFinalBtn.addEventListener('click', () => showScreen('screen7'));
}

// Hearts checkbox behavior on screen 2.
document.querySelectorAll('.reason-item .heart-check').forEach((button) => {
  button.addEventListener('click', () => {
    const item = button.closest('.reason-item');
    const willSelect = !item.classList.contains('selected');

    item.classList.toggle('selected', willSelect);
    button.textContent = willSelect ? '💗' : '🤍';
    button.setAttribute('aria-pressed', String(willSelect));
  });
});

// Gratitude cards reveal animation on click.
document.querySelectorAll('.gratitude-card').forEach((card) => {
  card.addEventListener('click', () => {
    const isOpen = card.classList.toggle('is-open');
    card.setAttribute('aria-expanded', String(isOpen));
  });
});

// Shows placeholder for missing gallery images.
document.querySelectorAll('.memory-card img').forEach((image) => {
  const wrap = image.closest('.photo-wrap');
  const setLoaded = () => wrap.classList.remove('is-empty');
  const setMissing = () => wrap.classList.add('is-empty');

  image.addEventListener('load', setLoaded);
  image.addEventListener('error', setMissing);

  if (image.complete && image.naturalWidth > 0) {
    setLoaded();
  }
});

// Intro heart animation.
function hideIntroHeart() {
  if (!introHeartEl) return;
  introHeartEl.classList.add('is-hidden');
  setTimeout(() => introHeartEl.remove(), 450);
}

const introReduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
setTimeout(hideIntroHeart, introReduceMotion ? 300 : 1400);

// Polaroid photo viewer.
function openPhotoModal(image) {
  if (!photoModalEl || !photoModalImageEl || !image?.src) return;
  photoModalImageEl.src = image.src;
  photoModalImageEl.alt = image.alt || 'Фото';
  photoModalEl.classList.add('is-open');
  photoModalEl.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
}

function closePhotoModal() {
  if (!photoModalEl || !photoModalImageEl) return;
  photoModalEl.classList.remove('is-open');
  photoModalEl.setAttribute('aria-hidden', 'true');
  photoModalImageEl.removeAttribute('src');
  document.body.classList.remove('modal-open');
}

document.querySelectorAll('.photo-wrap img').forEach((image) => {
  image.addEventListener('click', () => {
    if (image.closest('.photo-wrap').classList.contains('is-empty')) return;
    openPhotoModal(image);
  });
});

if (photoModalCloseEl && photoModalEl) {
  photoModalCloseEl.addEventListener('click', closePhotoModal);
  photoModalEl.addEventListener('click', (event) => {
    if (event.target === photoModalEl) closePhotoModal();
  });
}
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closePhotoModal();
});

// Falling flowers in background on all screens.
const flowerRain = document.getElementById('flower-rain');
const mobileMedia = window.matchMedia('(max-width: 700px)');
const motionMedia = window.matchMedia('(prefers-reduced-motion: reduce)');
const flowerSymbols = ['🌷', '🌸', '🌼', '🌹', '🌺'];

let isMobile = mobileMedia.matches;
let reduceMotion = motionMedia.matches;
let maxFlowers = isMobile ? 20 : 36;
let flowerSpawnRate = isMobile ? 360 : 250;
let flowerIntervalId = null;

function canAnimateFlowers() {
  return Boolean(flowerRain) && !reduceMotion && !document.hidden;
}

function spawnFlower() {
  if (!canAnimateFlowers()) return;
  if (flowerRain.childElementCount >= maxFlowers) return;

  const flower = document.createElement('span');
  flower.className = 'bg-flower';
  flower.textContent = flowerSymbols[Math.floor(Math.random() * flowerSymbols.length)];
  flower.style.left = `${Math.random() * 100}%`;
  flower.style.fontSize = `${isMobile ? 13 + Math.random() * 8 : 15 + Math.random() * 13}px`;
  flower.style.animationDuration = `${isMobile ? 8 + Math.random() * 4 : 7 + Math.random() * 4}s`;
  flower.style.opacity = `${0.72 + Math.random() * 0.26}`;
  flower.style.setProperty('--drift', `${-28 + Math.random() * 56}px`);
  flowerRain.appendChild(flower);

  flower.addEventListener('animationend', () => {
    flower.remove();
  });
}

function startFlowers() {
  if (flowerIntervalId) clearInterval(flowerIntervalId);
  if (!canAnimateFlowers()) return;
  flowerIntervalId = setInterval(spawnFlower, flowerSpawnRate);
}

document.addEventListener('visibilitychange', startFlowers);
const onMobileMediaChange = (event) => {
  isMobile = event.matches;
  maxFlowers = isMobile ? 20 : 36;
  flowerSpawnRate = isMobile ? 360 : 250;
  startFlowers();
};
const onMotionMediaChange = (event) => {
  reduceMotion = event.matches;
  startFlowers();
};

if (mobileMedia.addEventListener) {
  mobileMedia.addEventListener('change', onMobileMediaChange);
  motionMedia.addEventListener('change', onMotionMediaChange);
} else {
  mobileMedia.addListener(onMobileMediaChange);
  motionMedia.addListener(onMotionMediaChange);
}

startFlowers();
for (let i = 0; i < (isMobile ? 10 : 18); i += 1) {
  setTimeout(spawnFlower, i * (isMobile ? 210 : 150));
}

showScreen('screen1');

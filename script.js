const screens = document.querySelectorAll('.screen');
const startBtn = document.getElementById('start-btn');
const toMemoriesBtn = document.getElementById('to-memories');
const toMarch8Btn = document.getElementById('to-march8');
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
if (toMarch8Btn) {
  toMarch8Btn.addEventListener('click', () => showScreen('screen5'));
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

// Falling hearts in background on all screens.
const heartRain = document.getElementById('heart-rain');
const mobileMedia = window.matchMedia('(max-width: 700px)');
const motionMedia = window.matchMedia('(prefers-reduced-motion: reduce)');

let isMobile = mobileMedia.matches;
let reduceMotion = motionMedia.matches;
let maxHearts = isMobile ? 22 : 40;
let heartSpawnRate = isMobile ? 340 : 240;
let heartIntervalId = null;

function canAnimateHearts() {
  return !reduceMotion && !document.hidden;
}

function spawnHeart() {
  if (!heartRain || !canAnimateHearts()) return;
  if (heartRain.childElementCount >= maxHearts) return;

  const heart = document.createElement('span');
  heart.className = 'bg-heart';
  heart.textContent = Math.random() > 0.86 ? '💖' : '💗';
  heart.style.left = `${Math.random() * 100}%`;
  heart.style.fontSize = `${isMobile ? 12 + Math.random() * 9 : 14 + Math.random() * 14}px`;
  heart.style.animationDuration = `${isMobile ? 7 + Math.random() * 5 : 6 + Math.random() * 5}s`;
  heart.style.setProperty('--drift', `${-24 + Math.random() * 48}px`);
  heartRain.appendChild(heart);

  heart.addEventListener('animationend', () => {
    heart.remove();
  });
}

function startHearts() {
  if (heartIntervalId) clearInterval(heartIntervalId);
  if (!canAnimateHearts()) return;
  heartIntervalId = setInterval(spawnHeart, heartSpawnRate);
}

document.addEventListener('visibilitychange', startHearts);
const onMobileMediaChange = (event) => {
  isMobile = event.matches;
  maxHearts = isMobile ? 22 : 40;
  heartSpawnRate = isMobile ? 340 : 240;
  startHearts();
};
const onMotionMediaChange = (event) => {
  reduceMotion = event.matches;
  startHearts();
};

if (mobileMedia.addEventListener) {
  mobileMedia.addEventListener('change', onMobileMediaChange);
  motionMedia.addEventListener('change', onMotionMediaChange);
} else {
  mobileMedia.addListener(onMobileMediaChange);
  motionMedia.addListener(onMotionMediaChange);
}

startHearts();
for (let i = 0; i < (isMobile ? 10 : 18); i += 1) {
  setTimeout(spawnHeart, i * (isMobile ? 190 : 140));
}

showScreen('screen1');

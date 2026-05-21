import { moveInstrumentation } from '../../scripts/scripts.js';

const WAVE_HORIZONTAL_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 80" preserveAspectRatio="none">
  <path d="M0,80 L0,40 C360,80 720,0 1440,40 L1440,80 Z" fill="rgb(4,8,50)"/>
</svg>`;

const WAVE_VERTICAL_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 500" preserveAspectRatio="none">
  <path d="M80,0 L40,0 C80,125 0,250 40,375 C80,437 0,500 40,500 L80,500 Z" fill="rgb(4,8,50)"/>
</svg>`;

let autoplayInterval = null;
let carouselId = 0;

function updateActiveSlide(block, slideIndex) {
  const slides = block.querySelectorAll('.carousel-hero-slide');
  const total = slides.length;
  const realIndex = ((slideIndex % total) + total) % total;

  block.dataset.activeSlide = realIndex;

  slides.forEach((slide, idx) => {
    slide.classList.toggle('active', idx === realIndex);
    slide.setAttribute('aria-hidden', idx !== realIndex);
  });

  block.querySelectorAll('.carousel-hero-stepper').forEach((stepper, idx) => {
    stepper.classList.toggle('active', idx === realIndex);
  });
}

function showSlide(block, index, animate = true) {
  const slides = block.querySelectorAll('.carousel-hero-slide');
  const total = slides.length;
  const realIndex = ((index % total) + total) % total;

  if (animate) {
    const current = block.querySelector('.carousel-hero-slide.active');
    if (current) {
      current.classList.add('slide-out');
      setTimeout(() => current.classList.remove('slide-out'), 500);
    }
  }

  updateActiveSlide(block, realIndex);
}

function stopAutoplay() {
  if (autoplayInterval) {
    clearInterval(autoplayInterval);
    autoplayInterval = null;
  }
}

function startAutoplay(block) {
  stopAutoplay();
  autoplayInterval = setInterval(() => {
    const current = parseInt(block.dataset.activeSlide, 10);
    showSlide(block, current + 1);
  }, 5000);
}

function createSlide(row, slideIndex) {
  const slide = document.createElement('div');
  slide.classList.add('carousel-hero-slide');
  if (slideIndex === 0) slide.classList.add('active');
  slide.dataset.slideIndex = slideIndex;
  slide.setAttribute('aria-hidden', slideIndex !== 0);

  const columns = row.querySelectorAll(':scope > div');
  const imageCol = columns[0];
  const contentCol = columns[1];

  const imageWrapper = document.createElement('div');
  imageWrapper.classList.add('carousel-hero-slide-image');
  if (imageCol) {
    while (imageCol.firstChild) imageWrapper.append(imageCol.firstChild);
  }

  const wave = document.createElement('div');
  wave.classList.add('carousel-hero-wave', 'carousel-hero-wave-horizontal');
  wave.innerHTML = WAVE_HORIZONTAL_SVG;
  imageWrapper.append(wave);

  const waveVertical = document.createElement('div');
  waveVertical.classList.add('carousel-hero-wave', 'carousel-hero-wave-vertical');
  waveVertical.innerHTML = WAVE_VERTICAL_SVG;
  imageWrapper.append(waveVertical);

  const contentWrapper = document.createElement('div');
  contentWrapper.classList.add('carousel-hero-slide-content');
  if (contentCol) {
    while (contentCol.firstChild) contentWrapper.append(contentCol.firstChild);
  }

  slide.append(imageWrapper);
  slide.append(contentWrapper);

  return slide;
}

function createPaginator(block, slides) {
  const paginator = document.createElement('div');
  paginator.classList.add('carousel-hero-paginator');

  const playPauseBtn = document.createElement('button');
  playPauseBtn.classList.add('carousel-hero-playpause');
  playPauseBtn.setAttribute('aria-label', 'Pausa');
  playPauseBtn.innerHTML = '<span class="pause-icon"></span>';
  let isPlaying = true;
  playPauseBtn.addEventListener('click', () => {
    isPlaying = !isPlaying;
    if (isPlaying) {
      startAutoplay(block);
      playPauseBtn.setAttribute('aria-label', 'Pausa');
      playPauseBtn.innerHTML = '<span class="pause-icon"></span>';
    } else {
      stopAutoplay();
      playPauseBtn.setAttribute('aria-label', 'Play');
      playPauseBtn.innerHTML = '<span class="play-icon"></span>';
    }
  });

  const steppersContainer = document.createElement('div');
  steppersContainer.classList.add('carousel-hero-steppers');

  slides.forEach((slide, idx) => {
    const stepper = document.createElement('button');
    stepper.classList.add('carousel-hero-stepper');
    if (idx === 0) stepper.classList.add('active');

    const progressBar = document.createElement('span');
    progressBar.classList.add('carousel-hero-progress');

    const title = document.createElement('span');
    title.classList.add('carousel-hero-stepper-title');
    const heading = slide.querySelector('h1, h2, h3, h4, h5, h6');
    title.textContent = heading ? heading.textContent.trim() : `Slide ${idx + 1}`;

    stepper.append(progressBar);
    stepper.append(title);
    stepper.addEventListener('click', () => {
      showSlide(block, idx);
      if (isPlaying) startAutoplay(block);
    });
    steppersContainer.append(stepper);
  });

  const arrowsContainer = document.createElement('div');
  arrowsContainer.classList.add('carousel-hero-arrows');

  const prevBtn = document.createElement('button');
  prevBtn.classList.add('carousel-hero-arrow-prev');
  prevBtn.setAttribute('aria-label', 'Precedente');
  prevBtn.addEventListener('click', () => {
    const current = parseInt(block.dataset.activeSlide, 10);
    showSlide(block, current - 1);
    if (isPlaying) startAutoplay(block);
  });

  const nextBtn = document.createElement('button');
  nextBtn.classList.add('carousel-hero-arrow-next');
  nextBtn.setAttribute('aria-label', 'Successivo');
  nextBtn.addEventListener('click', () => {
    const current = parseInt(block.dataset.activeSlide, 10);
    showSlide(block, current + 1);
    if (isPlaying) startAutoplay(block);
  });

  arrowsContainer.append(prevBtn);
  arrowsContainer.append(nextBtn);

  paginator.append(playPauseBtn);
  paginator.append(steppersContainer);
  paginator.append(arrowsContainer);

  return paginator;
}

export default async function decorate(block) {
  carouselId += 1;
  block.setAttribute('id', `carousel-hero-${carouselId}`);
  block.setAttribute('role', 'region');
  block.setAttribute('aria-roledescription', 'Carousel');

  const rows = [...block.querySelectorAll(':scope > div')];

  const slidesContainer = document.createElement('div');
  slidesContainer.classList.add('carousel-hero-slides');

  const slideElements = rows.map((row, idx) => {
    const slide = createSlide(row, idx);
    moveInstrumentation(row, slide);
    slidesContainer.append(slide);
    row.remove();
    return slide;
  });

  block.append(slidesContainer);

  if (slideElements.length > 1) {
    const paginator = createPaginator(block, slideElements);
    block.append(paginator);
    block.dataset.activeSlide = 0;
    startAutoplay(block);
  }
}

// ENI Header Block — custom two-row header with megamenu
const isDesktop = window.matchMedia('(min-width: 900px)');

// Navigation groups: left (white), center (yellow), right (white)
const NAV_GROUPS = {
  left: ['azienda', 'governance', 'sostenibilità'],
  center: ['visione', 'azioni', 'prodotti'],
  right: ['investitori', 'media', 'carriere'],
};

function getNavGroup(label) {
  const lower = label.toLowerCase();
  if (NAV_GROUPS.left.includes(lower)) return 'left';
  if (NAV_GROUPS.center.includes(lower)) return 'center';
  if (NAV_GROUPS.right.includes(lower)) return 'right';
  return 'left';
}

/**
 * Builds the search icon SVG
 */
function searchIcon() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>`;
}

/**
 * Builds the login/user icon SVG
 */
function loginIcon() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>`;
}

/**
 * Closes all open megamenu panels
 */
function closeAllMegamenus(nav) {
  nav.querySelectorAll('.nav-item[aria-expanded="true"]').forEach((item) => {
    item.setAttribute('aria-expanded', 'false');
  });
  nav.querySelector('.megamenu-overlay')?.classList.remove('megamenu-overlay-visible');
}

/**
 * Toggles a megamenu panel
 */
function toggleMegamenu(nav, navItem) {
  const wasExpanded = navItem.getAttribute('aria-expanded') === 'true';
  closeAllMegamenus(nav);
  if (!wasExpanded) {
    navItem.setAttribute('aria-expanded', 'true');
    nav.querySelector('.megamenu-overlay')?.classList.add('megamenu-overlay-visible');
  }
}

/**
 * Toggles mobile menu
 */
function toggleMobileMenu(nav) {
  const expanded = nav.getAttribute('aria-expanded') === 'true';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  document.body.style.overflowY = expanded ? '' : 'hidden';
  const btn = nav.querySelector('.nav-hamburger button');
  btn.setAttribute('aria-label', expanded ? 'Apri menu' : 'Chiudi menu');
}

/**
 * Builds a megamenu panel for a nav item
 */
function buildMegamenuPanel(label, links) {
  const panel = document.createElement('div');
  panel.className = 'megamenu-panel';

  // Left column with links
  const leftCol = document.createElement('div');
  leftCol.className = 'megamenu-left';

  const title = document.createElement('h3');
  title.className = 'megamenu-title';
  title.textContent = label;
  leftCol.appendChild(title);

  const goToLink = document.createElement('a');
  goToLink.className = 'megamenu-goto';
  goToLink.href = links.length > 0 ? links[0].href.replace(/\/[^/]*$/, '') : '#';
  goToLink.innerHTML = `Vai a ${label} <span class="megamenu-arrow">→</span>`;
  leftCol.appendChild(goToLink);

  const linkList = document.createElement('ul');
  linkList.className = 'megamenu-links';
  links.forEach((link) => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = link.href;
    a.textContent = link.textContent;
    li.appendChild(a);
    linkList.appendChild(li);
  });
  leftCol.appendChild(linkList);

  // Right column with promotional cards
  const rightCol = document.createElement('div');
  rightCol.className = 'megamenu-right';

  for (let i = 0; i < 2; i += 1) {
    const card = document.createElement('div');
    card.className = 'megamenu-card';
    const cardImg = document.createElement('div');
    cardImg.className = 'megamenu-card-image';
    cardImg.setAttribute('aria-label', `${label} promo ${i + 1}`);
    const cardBody = document.createElement('div');
    cardBody.className = 'megamenu-card-body';
    cardBody.innerHTML = `<span class="megamenu-card-tag">${label}</span><p class="megamenu-card-title">Scopri di più su ${label}</p>`;
    card.appendChild(cardImg);
    card.appendChild(cardBody);
    rightCol.appendChild(card);
  }

  panel.appendChild(leftCol);
  panel.appendChild(rightCol);
  return panel;
}

/**
 * Fetches and parses the nav content
 */
async function fetchNav() {
  const resp = await fetch('/nav.plain.html');
  if (!resp.ok) return null;
  const html = await resp.text();
  const parser = new DOMParser();
  return parser.parseFromString(html, 'text/html');
}

export default async function decorate(block) {
  const navDoc = await fetchNav();
  if (!navDoc) return;

  block.textContent = '';

  const nav = document.createElement('nav');
  nav.id = 'nav';
  nav.setAttribute('aria-expanded', 'false');

  // Parse nav.plain.html sections
  const sections = navDoc.querySelectorAll('body > div');
  const brandSection = sections[0];
  const navSection = sections[1];
  const toolsSection = sections[2];

  // === ROW 1: Utility Bar ===
  const utilityBar = document.createElement('div');
  utilityBar.className = 'nav-utility';

  // Utility left: logo
  const utilityLeft = document.createElement('div');
  utilityLeft.className = 'nav-utility-left';
  const logoLink = brandSection.querySelector('a');
  const logoImg = brandSection.querySelector('img') || brandSection.querySelector('picture img');
  const logoSrc = logoImg
    ? logoImg.getAttribute('src')
    : 'https://www.eni.com/content/dam/enicom/images/loghi/logoEni.svg';
  const logoHref = logoLink ? (logoLink.getAttribute('href') || '/') : '/';

  const logo = document.createElement('a');
  logo.href = logoHref;
  logo.className = 'nav-logo';
  logo.setAttribute('aria-label', 'ENI Home');
  const img = document.createElement('img');
  img.src = logoSrc;
  img.alt = logoImg ? (logoImg.getAttribute('alt') || 'ENI Logo') : 'ENI Logo';
  logo.appendChild(img);
  utilityLeft.appendChild(logo);

  // Utility center: EnergIA button
  const utilityCenter = document.createElement('div');
  utilityCenter.className = 'nav-utility-center';
  const toolLinks = toolsSection.querySelectorAll('a');
  let energiaLink = null;
  let docLink = null;
  let globaleLink = null;
  let langLink = null;

  toolLinks.forEach((a) => {
    const text = a.textContent.trim().toLowerCase();
    if (text === 'energia') energiaLink = a;
    else if (text === 'documentazione') docLink = a;
    else if (text === 'presenza globale') globaleLink = a;
    else if (text === 'it') langLink = a;
  });

  if (energiaLink) {
    const btn = document.createElement('a');
    btn.href = energiaLink.getAttribute('href');
    btn.className = 'nav-energia-btn';
    btn.textContent = 'EnergIA';
    utilityCenter.appendChild(btn);
  }

  // Utility right: links + icons
  const utilityRight = document.createElement('div');
  utilityRight.className = 'nav-utility-right';

  if (docLink) {
    const a = document.createElement('a');
    a.href = docLink.getAttribute('href');
    a.className = 'nav-utility-link';
    a.textContent = 'Documentazione';
    utilityRight.appendChild(a);
  }
  if (globaleLink) {
    const a = document.createElement('a');
    a.href = globaleLink.getAttribute('href');
    a.className = 'nav-utility-link';
    a.textContent = 'Presenza Globale';
    utilityRight.appendChild(a);
  }
  if (langLink) {
    const a = document.createElement('a');
    a.href = langLink.getAttribute('href');
    a.className = 'nav-utility-link nav-lang-selector';
    a.textContent = 'IT';
    utilityRight.appendChild(a);
  }

  const searchBtn = document.createElement('button');
  searchBtn.className = 'nav-icon-btn';
  searchBtn.setAttribute('aria-label', 'Cerca');
  searchBtn.innerHTML = searchIcon();
  utilityRight.appendChild(searchBtn);

  const loginBtn = document.createElement('button');
  loginBtn.className = 'nav-icon-btn';
  loginBtn.setAttribute('aria-label', 'Accedi');
  loginBtn.innerHTML = loginIcon();
  utilityRight.appendChild(loginBtn);

  utilityBar.appendChild(utilityLeft);
  utilityBar.appendChild(utilityCenter);
  utilityBar.appendChild(utilityRight);

  // === ROW 2: Main Navigation ===
  const mainNav = document.createElement('div');
  mainNav.className = 'nav-main';

  const navItems = navSection.querySelectorAll(':scope > ul > li');
  const navLeft = document.createElement('div');
  navLeft.className = 'nav-group nav-group-left';
  const navCenter = document.createElement('div');
  navCenter.className = 'nav-group nav-group-center';
  const navRight = document.createElement('div');
  navRight.className = 'nav-group nav-group-right';

  navItems.forEach((li) => {
    const strong = li.querySelector(':scope > p > strong');
    const directLink = li.querySelector(':scope > a');
    let label = '';
    if (strong) label = strong.textContent.trim();
    else if (directLink) label = directLink.textContent.trim();
    if (!label) return;

    const subLinks = li.querySelectorAll(':scope > ul > li > a');
    const group = getNavGroup(label);

    const navItem = document.createElement('div');
    navItem.className = 'nav-item';
    navItem.setAttribute('aria-expanded', 'false');

    const trigger = document.createElement('button');
    trigger.className = 'nav-item-trigger';
    trigger.textContent = label.toUpperCase();
    trigger.setAttribute('aria-label', `${label} menu`);

    navItem.appendChild(trigger);

    if (subLinks.length > 0) {
      const panel = buildMegamenuPanel(label, Array.from(subLinks));
      navItem.appendChild(panel);

      trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        if (isDesktop.matches) {
          toggleMegamenu(nav, navItem);
        } else {
          const expanded = navItem.getAttribute('aria-expanded') === 'true';
          navItem.setAttribute('aria-expanded', expanded ? 'false' : 'true');
        }
      });
    } else {
      trigger.addEventListener('click', () => {
        if (directLink) {
          window.location.href = directLink.getAttribute('href');
        }
      });
    }

    if (group === 'left') navLeft.appendChild(navItem);
    else if (group === 'center') navCenter.appendChild(navItem);
    else navRight.appendChild(navItem);
  });

  mainNav.appendChild(navLeft);
  mainNav.appendChild(navCenter);
  mainNav.appendChild(navRight);

  // === Megamenu overlay (for click-outside closing) ===
  const overlay = document.createElement('div');
  overlay.className = 'megamenu-overlay';
  overlay.addEventListener('click', () => closeAllMegamenus(nav));

  // === Hamburger ===
  const hamburger = document.createElement('div');
  hamburger.className = 'nav-hamburger';
  hamburger.innerHTML = `<button type="button" aria-controls="nav" aria-label="Apri menu">
    <span class="nav-hamburger-icon"></span>
  </button>`;
  hamburger.addEventListener('click', () => toggleMobileMenu(nav));

  // === Assemble ===
  utilityRight.appendChild(hamburger);
  nav.appendChild(utilityBar);
  nav.appendChild(mainNav);
  nav.appendChild(overlay);

  const wrapper = document.createElement('div');
  wrapper.className = 'nav-wrapper';
  wrapper.appendChild(nav);
  block.appendChild(wrapper);

  // === Keyboard: Escape to close ===
  window.addEventListener('keydown', (e) => {
    if (e.code === 'Escape') {
      if (isDesktop.matches) {
        closeAllMegamenus(nav);
      } else if (nav.getAttribute('aria-expanded') === 'true') {
        toggleMobileMenu(nav);
      }
    }
  });

  // Close megamenu on click outside (desktop)
  document.addEventListener('click', (e) => {
    if (isDesktop.matches && !nav.querySelector('.nav-main').contains(e.target)) {
      closeAllMegamenus(nav);
    }
  });

  // Handle resize
  isDesktop.addEventListener('change', () => {
    closeAllMegamenus(nav);
    if (isDesktop.matches) {
      nav.setAttribute('aria-expanded', 'false');
      document.body.style.overflowY = '';
    }
  });
}

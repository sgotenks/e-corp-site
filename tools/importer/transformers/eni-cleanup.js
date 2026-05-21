/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: ENI Italy site-wide cleanup.
 * Removes non-authorable content: header/navigation, footer, cookie banner,
 * AI assistant modals, login modal, skip-to-content links.
 * All selectors validated from migration-work/cleaned.html.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Remove cookie banner and overlays (may block parsing)
    // Found: <div id="onetrust-banner-sdk"> (line 2362)
    // Found: <div id="onetrust-pc-sdk"> (line 2390)
    // Found: <div class="onetrust-pc-dark-filter"> (line 2360)
    WebImporter.DOMUtils.remove(element, [
      '#onetrust-banner-sdk',
      '#onetrust-pc-sdk',
      '.onetrust-pc-dark-filter',
    ]);

    // Remove AI assistant modals (overlays that block parsing)
    // Found: <div class="modal fade slide-in-right" id="modalGenAI"> (line 1936)
    // Found: <div class="modal fade show" id="popupWelcome-genAI"> (line 2233)
    // Found: <div class="modal fade modalSecondLevel" id="modalScopriAI"> (line 2164)
    // Found: <div class="modal fade modalSecondLevel" id="modalDisclaimerAI"> (line 2198)
    // Found: <div class="modal fade modalSecondLevel" id="modalInputAI"> (line 2213)
    WebImporter.DOMUtils.remove(element, [
      '#modalGenAI',
      '#popupWelcome-genAI',
      '#modalScopriAI',
      '#modalDisclaimerAI',
      '#modalInputAI',
    ]);

    // Remove login modal and disclaimer modal
    // Found: <div class="modal fade" id="modal-login"> (line 1393)
    // Found: <div class="modal fade" id="modal-disclaimer"> (line 2276)
    WebImporter.DOMUtils.remove(element, [
      '#modal-login',
      '#modal-disclaimer',
    ]);

    // Fix overflow hidden on body that may affect parsing
    // Found: <body ... style="overflow: hidden; padding-right: 0px;"> (line 1)
    if (element.style && element.style.overflow === 'hidden') {
      element.style.overflow = '';
    }
  }

  if (hookName === TransformHook.afterTransform) {
    // Remove header/navigation (non-authorable site chrome)
    // The ENI header includes: .containerHeader, .headerDesktop, .headerNavbar,
    // mobile nav, mega-menu panels, login/language selectors, and wrapper divs.
    WebImporter.DOMUtils.remove(element, [
      '.containerHeader',
      '.headerDesktop',
      '.headerNavbar',
      '.headerMobile',
      '#pg',
    ]);

    // Remove all content before the first actual block (carousel/content area)
    // The mega-navigation renders as flat paragraphs with links before real content.
    // Target: the hero-template container is the first real content section.
    const { document } = payload;
    const heroTemplate = element.querySelector('.container.responsivegrid.hero-template');
    if (heroTemplate) {
      const parent = heroTemplate.parentElement;
      if (parent) {
        while (parent.firstChild && parent.firstChild !== heroTemplate) {
          parent.removeChild(parent.firstChild);
        }
      }
    }

    // Remove skip-to-content links (non-authorable)
    WebImporter.DOMUtils.remove(element, [
      '.skipToMainContent',
      '#skipToMainContent',
    ]);

    // Remove footer (non-authorable site chrome)
    WebImporter.DOMUtils.remove(element, ['footer']);

    // Remove social share box, back-to-top button, and leftover utility elements
    WebImporter.DOMUtils.remove(element, [
      '.share-box',
      '.align',
    ]);

    // Remove back-to-top buttons and social sharing elements that appear after blocks
    const backToTopImgs = element.querySelectorAll('img[alt="Back to top"]');
    backToTopImgs.forEach((img) => {
      const wrapper = img.closest('p') || img.closest('div');
      if (wrapper) wrapper.remove();
    });

    // Remove social sharing icons (Linkedin, Facebook, Twitter, Mail, Copy link)
    const shareImgs = element.querySelectorAll('img[alt*="Condividi"], img[alt*="Copia link"]');
    shareImgs.forEach((img) => {
      const wrapper = img.closest('p') || img.closest('div');
      if (wrapper) wrapper.remove();
    });

    // Remove "Scarica documento" download links
    const downloadLinks = element.querySelectorAll('a[href*="download"]');
    downloadLinks.forEach((link) => {
      const wrapper = link.closest('p') || link.closest('div');
      if (wrapper && wrapper.querySelector('img[alt*="Scarica"]')) wrapper.remove();
    });

    // Remove noscript, link elements
    WebImporter.DOMUtils.remove(element, ['noscript', 'link']);
  }
}

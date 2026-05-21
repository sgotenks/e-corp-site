import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-explore-card-image';
      else div.className = 'cards-explore-card-body';
    });

    // Extract the link from card body and make whole card clickable
    const body = li.querySelector('.cards-explore-card-body');
    if (body) {
      const link = body.querySelector('a');
      if (link) {
        const cardLink = document.createElement('a');
        cardLink.href = link.href;
        cardLink.setAttribute('aria-label', link.textContent || '');
        li.append(cardLink);
      }
    }

    ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => {
    if (new URL(img.src, window.location.origin).origin === window.location.origin) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      moveInstrumentation(img, optimizedPic.querySelector('img'));
      img.closest('picture').replaceWith(optimizedPic);
    }
  });
  block.textContent = '';
  block.append(ul);
}

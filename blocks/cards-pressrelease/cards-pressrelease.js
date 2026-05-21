import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      // Skip empty cells (no meaningful content)
      if (div.children.length === 0 && div.textContent.trim() === '') {
        div.remove();
        return;
      }
      if (div.children.length === 1 && div.querySelector('picture')) {
        div.className = 'cards-pressrelease-card-image';
      } else {
        div.className = 'cards-pressrelease-card-body';
      }
    });
    ul.append(li);
  });
  block.textContent = '';
  block.append(ul);
}

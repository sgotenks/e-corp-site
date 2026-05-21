/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-explore
 * Base block: cards
 * Source: https://www.eni.com/it-IT/home.html
 * Selector: .homepage-approfondisci .containerCard.default
 * Generated: 2026-05-21
 *
 * Source structure: div.containerCard.default > a (3 cards)
 *   Each card: a > picture > img.img-card + div.description > ul.tagsList + h5.eni-h5
 * Target structure: Cards block, one row per card, col1=image, col2=text (tag + heading + link)
 * UE Model: container block "cards" with child "card" items (fields: image, text)
 */
export default function parse(element, { document }) {
  // Extract all card links from the container
  const cardLinks = element.querySelectorAll(':scope > a');

  const cells = [];

  cardLinks.forEach((cardLink) => {
    // Column 1: Image with field hint
    const img = cardLink.querySelector('img.img-card, img');
    const imageCell = document.createDocumentFragment();
    imageCell.appendChild(document.createComment(' field:image '));
    if (img) {
      const picture = document.createElement('picture');
      const imgClone = img.cloneNode(true);
      picture.appendChild(imgClone);
      imageCell.appendChild(picture);
    }

    // Column 2: Text content (tag + heading) with field hint
    const textCell = document.createDocumentFragment();
    textCell.appendChild(document.createComment(' field:text '));

    // Extract tag text from tagsList
    const tag = cardLink.querySelector('.tagsList .tag, .tagsList li');
    if (tag) {
      const tagParagraph = document.createElement('p');
      tagParagraph.textContent = tag.textContent.trim();
      textCell.appendChild(tagParagraph);
    }

    // Extract heading
    const heading = cardLink.querySelector('h5.eni-h5, h5, h4, h3, h2');
    if (heading) {
      const headingClone = heading.cloneNode(true);
      textCell.appendChild(headingClone);
    }

    // Extract link (the card itself is a link - preserve it as a CTA)
    const href = cardLink.getAttribute('href');
    if (href) {
      const link = document.createElement('a');
      link.setAttribute('href', href);
      link.textContent = heading ? heading.textContent.trim() : 'Read more';
      textCell.appendChild(link);
    }

    cells.push([imageCell, textCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-explore', cells });
  element.replaceWith(block);
}

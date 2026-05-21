/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-pressrelease
 * Base block: cards
 * Source: https://www.eni.com/it-IT/home.html
 * Selector: .homepage-fascia-cs-v2 .slick-fascia
 * Generated: 2026-05-21
 *
 * Press release cards - horizontal row of text-only cards.
 * Each card has: date/time, headline title, and a chevron link.
 * No images. Container block: each card = one row with columns [image, text].
 * Image column is empty; text column contains date, heading, and link.
 */
export default function parse(element, { document }) {
  const cards = element.querySelectorAll(':scope > div > a.card, :scope > div a.card');
  const cells = [];

  cards.forEach((card) => {
    // Extract date/time
    const time = card.querySelector('time.body-small, time');

    // Extract headline
    const heading = card.querySelector('h6.eni-h6, h6, h5, h4');

    // Extract the link href from the card anchor
    const href = card.getAttribute('href');

    // Build the image cell (empty for press release cards)
    const imageCell = '';

    // Build the text cell with field hint
    const textFrag = document.createDocumentFragment();
    textFrag.appendChild(document.createComment(' field:text '));

    if (time) {
      const p = document.createElement('p');
      p.textContent = time.textContent.trim();
      textFrag.appendChild(p);
    }

    if (heading) {
      const h = document.createElement('strong');
      h.textContent = heading.textContent.trim();
      const p = document.createElement('p');
      p.appendChild(h);
      textFrag.appendChild(p);
    }

    if (href) {
      const link = document.createElement('a');
      link.setAttribute('href', href);
      link.textContent = heading ? heading.textContent.trim() : 'Read more';
      textFrag.appendChild(link);
    }

    cells.push([imageCell, textFrag]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-pressrelease', cells });
  element.replaceWith(block);
}

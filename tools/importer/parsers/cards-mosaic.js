/* eslint-disable */
/* global WebImporter */

/**
 * Parser: cards-mosaic
 * Base block: cards
 * Source: https://www.eni.com/it-IT/home.html
 * Selectors: #widget--33891057 .mosaico, #widget-913498274 .mosaico
 * Generated: 2026-05-21
 *
 * Mosaic grid of image cards with category tags and headline text overlaid.
 * Each card is an <a> wrapping a <picture> with img.img-card and div.description
 * containing ul.tagsList (category) and h5.eni-h5 (headline).
 *
 * UE Model (card): image (reference), text (richtext)
 * Output: One row per card — col1: image, col2: tag + heading + link
 */
export default function parse(element, { document }) {
  // Each card is an anchor wrapping a picture with image and description
  const cardLinks = element.querySelectorAll(':scope > a');
  const cells = [];

  cardLinks.forEach((cardLink) => {
    // Column 1: Image with field hint
    const img = cardLink.querySelector('img.img-card, picture img');
    const imageCell = [];
    if (img) {
      const imageComment = document.createComment(' field:image ');
      imageCell.push(imageComment);
      imageCell.push(img);
    }

    // Column 2: Text content (tag + heading) with link, field hint
    const textCell = [];
    const textComment = document.createComment(' field:text ');
    textCell.push(textComment);

    // Category tag (e.g., FINANZA, AZIONI, MEDIA)
    const tag = cardLink.querySelector('.tagsList .tag, .tagsList li');
    if (tag) {
      const tagP = document.createElement('p');
      tagP.textContent = tag.textContent.trim();
      textCell.push(tagP);
    }

    // Headline
    const heading = cardLink.querySelector('h5.eni-h5, h5, .description h5, .description h4, .description h3');
    if (heading) {
      textCell.push(heading);
    }

    // Preserve the link — wrap heading text as a link in the cell
    const href = cardLink.getAttribute('href');
    if (href) {
      const link = document.createElement('a');
      link.setAttribute('href', href);
      link.textContent = heading ? heading.textContent.trim() : 'Read more';
      textCell.push(link);
    }

    if (imageCell.length > 0 || textCell.length > 0) {
      cells.push([imageCell, textCell]);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-mosaic', cells });
  element.replaceWith(block);
}

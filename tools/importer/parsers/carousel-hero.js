/* eslint-disable */
/* global WebImporter */

/**
 * Parser: carousel-hero
 * Base block: carousel
 * Source: https://www.eni.com/it-IT/home.html
 * Selector: .homepage-slider-v2
 * Generated: 2026-05-21
 *
 * Container block (carousel-item model):
 *   - media_image (reference): background image
 *   - media_imageAlt (collapsed): alt text for image
 *   - content_text (richtext): heading + description + CTA
 *
 * Each slide = one row with 2 columns: [media_image] [content_text]
 */
export default function parse(element, { document }) {
  // Find all slides within the splide carousel
  const slides = element.querySelectorAll('.splide__slide article.splide-content, li.splide__slide .splide-content');

  const cells = [];

  slides.forEach((slide) => {
    // Extract image (media_image field group)
    const picture = slide.querySelector('picture');
    const img = slide.querySelector('img.image, img');

    // Build media cell with field hint
    const mediaCell = document.createDocumentFragment();
    mediaCell.appendChild(document.createComment(' field:media_image '));
    if (picture) {
      mediaCell.appendChild(picture);
    } else if (img) {
      mediaCell.appendChild(img);
    }

    // Extract text content (content_text field group - richtext)
    const heading = slide.querySelector('h2.eni-h2, h2, h1, h3, [class*="eni-h"]');
    const description = slide.querySelector('p.body-large, p');
    const cta = slide.querySelector('a.eni-btn, a.button-regular, a[class*="btn"]');

    // Build content cell with field hint - richtext combines heading, description, and CTA
    const contentCell = document.createDocumentFragment();
    contentCell.appendChild(document.createComment(' field:content_text '));
    if (heading) contentCell.appendChild(heading);
    if (description) contentCell.appendChild(description);
    if (cta) contentCell.appendChild(cta);

    // Each slide = one row with two columns [media, content]
    cells.push([mediaCell, contentCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-hero', cells });
  element.replaceWith(block);
}

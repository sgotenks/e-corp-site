/* eslint-disable */
/* global WebImporter */

/**
 * Parser: embed-widget
 * Base block: embed
 * Source: https://www.eni.com/it-IT/home.html
 * Selector: .hp-iframe iframe
 * Generated: 2026-05-21
 *
 * Extracts iframe src URL from the .hp-iframe container and produces
 * an Embed block with the URI field hinted for Universal Editor.
 */
export default function parse(element, { document }) {
  // element is the iframe itself (selector: .hp-iframe iframe)
  // Extract the src attribute which is the embed URL
  const iframeSrc = element.getAttribute('src') || '';

  // Build cells to match block library structure:
  // Single row with the embed URL, with field hints for xwalk UE model
  const cells = [];

  // Row 1: embed_placeholder (image, optional) + embed_uri (URL)
  // Both share prefix "embed" so they go in the same cell
  // No placeholder image exists in source, so only emit embed_uri
  const frag = document.createDocumentFragment();

  // Field hint for embed_uri
  frag.appendChild(document.createComment(' field:embed_uri '));

  // Create a link element for the URL (preserves semantic HTML)
  const link = document.createElement('a');
  link.href = iframeSrc;
  link.textContent = iframeSrc;
  frag.appendChild(link);

  cells.push([frag]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'embed-widget', cells });
  element.replaceWith(block);
}

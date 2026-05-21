/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: ENI Italy section breaks and section metadata.
 * Inserts <hr> between sections and adds Section Metadata blocks for styled sections.
 * Runs only in afterTransform. Uses payload.template.sections from page-templates.json.
 *
 * Sections (from page-templates.json):
 *   1. Hero Carousel - selector: .container.responsivegrid.hero-template (no style)
 *   2. Comunicati Stampa - selector: .homepage-fascia-cs-v2 (no style)
 *   3. Business Highlights - selector: #widget--33891057 (style: dark)
 *   4. Iniziative in Evidenza - selector: #widget-913498274 (style: dark)
 *   5. Scopri Eni - selector: .homepage-approfondisci (no style)
 *   6. Financial Widget - selector: .hp-iframe (no style)
 *
 * All selectors validated from migration-work/cleaned.html.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.afterTransform) {
    const { document } = payload;
    const sections = payload.template && payload.template.sections;

    if (!sections || sections.length < 2) return;

    // Process sections in reverse order to avoid shifting DOM positions
    for (let i = sections.length - 1; i >= 0; i--) {
      const section = sections[i];
      const sectionEl = element.querySelector(section.selector);

      if (!sectionEl) continue;

      // Add Section Metadata block if section has a style
      if (section.style) {
        const sectionMetadata = WebImporter.Blocks.createBlock(document, {
          name: 'Section Metadata',
          cells: { style: section.style },
        });
        sectionEl.after(sectionMetadata);
      }

      // Insert <hr> before each section except the first one
      if (i > 0) {
        const hr = document.createElement('hr');
        sectionEl.before(hr);
      }
    }
  }
}

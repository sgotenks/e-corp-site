/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import carouselHeroParser from './parsers/carousel-hero.js';
import cardsPressreleaseParser from './parsers/cards-pressrelease.js';
import cardsMosaicParser from './parsers/cards-mosaic.js';
import cardsExploreParser from './parsers/cards-explore.js';
import embedWidgetParser from './parsers/embed-widget.js';

// TRANSFORMER IMPORTS
import eniCleanupTransformer from './transformers/eni-cleanup.js';
import eniSectionsTransformer from './transformers/eni-sections.js';

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'ENI Italy homepage with hero, navigation, featured content, and corporate information',
  urls: ['https://www.eni.com/it-IT/home.html'],
  blocks: [
    {
      name: 'carousel-hero',
      instances: ['.homepage-slider-v2'],
    },
    {
      name: 'cards-pressrelease',
      instances: ['.homepage-fascia-cs-v2 .slick-fascia'],
    },
    {
      name: 'cards-mosaic',
      instances: ['#widget--33891057 .mosaico', '#widget-913498274 .mosaico'],
    },
    {
      name: 'cards-explore',
      instances: ['.homepage-approfondisci .containerCard.default'],
    },
    {
      name: 'embed-widget',
      instances: ['.hp-iframe iframe'],
    },
  ],
  sections: [
    {
      id: 'section-1',
      name: 'Hero Carousel',
      selector: '.container.responsivegrid.hero-template',
      style: null,
      blocks: ['carousel-hero'],
      defaultContent: [],
    },
    {
      id: 'section-2',
      name: 'Comunicati Stampa',
      selector: '.homepage-fascia-cs-v2',
      style: null,
      blocks: ['cards-pressrelease'],
      defaultContent: ['.homepage-fascia-cs-v2 .header h2', '.homepage-fascia-cs-v2 .header a'],
    },
    {
      id: 'section-3',
      name: 'Business Highlights',
      selector: '#widget--33891057',
      style: 'dark',
      blocks: ['cards-mosaic'],
      defaultContent: ['#widget--33891057 .title h2'],
    },
    {
      id: 'section-4',
      name: 'Iniziative in Evidenza',
      selector: '#widget-913498274',
      style: 'dark',
      blocks: ['cards-mosaic'],
      defaultContent: ['#widget-913498274 .title h2'],
    },
    {
      id: 'section-5',
      name: 'Scopri Eni',
      selector: '.homepage-approfondisci',
      style: null,
      blocks: ['cards-explore'],
      defaultContent: ['.homepage-approfondisci .title h2', '.homepage-approfondisci .title p'],
    },
    {
      id: 'section-6',
      name: 'Financial Widget',
      selector: '.hp-iframe',
      style: null,
      blocks: ['embed-widget'],
      defaultContent: [],
    },
  ],
};

// PARSER REGISTRY
const parsers = {
  'carousel-hero': carouselHeroParser,
  'cards-pressrelease': cardsPressreleaseParser,
  'cards-mosaic': cardsMosaicParser,
  'cards-explore': cardsExploreParser,
  'embed-widget': embedWidgetParser,
};

// TRANSFORMER REGISTRY
const transformers = [
  eniCleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [eniSectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const { document, url, html, params } = payload;

    const main = document.body;

    // 1. Execute beforeTransform transformers (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
    pageBlocks.forEach((block) => {
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. Execute afterTransform transformers (section breaks + metadata)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, ''),
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};

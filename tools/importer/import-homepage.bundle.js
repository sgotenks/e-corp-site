/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/carousel-hero.js
  function parse(element, { document }) {
    const slides = element.querySelectorAll(".splide__slide article.splide-content, li.splide__slide .splide-content");
    const cells = [];
    slides.forEach((slide) => {
      const picture = slide.querySelector("picture");
      const img = slide.querySelector("img.image, img");
      const mediaCell = document.createDocumentFragment();
      mediaCell.appendChild(document.createComment(" field:media_image "));
      if (picture) {
        mediaCell.appendChild(picture);
      } else if (img) {
        mediaCell.appendChild(img);
      }
      const heading = slide.querySelector('h2.eni-h2, h2, h1, h3, [class*="eni-h"]');
      const description = slide.querySelector("p.body-large, p");
      const cta = slide.querySelector('a.eni-btn, a.button-regular, a[class*="btn"]');
      const contentCell = document.createDocumentFragment();
      contentCell.appendChild(document.createComment(" field:content_text "));
      if (heading) contentCell.appendChild(heading);
      if (description) contentCell.appendChild(description);
      if (cta) contentCell.appendChild(cta);
      cells.push([mediaCell, contentCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "carousel-hero", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-pressrelease.js
  function parse2(element, { document }) {
    const cards = element.querySelectorAll(":scope > div > a.card, :scope > div a.card");
    const cells = [];
    cards.forEach((card) => {
      const time = card.querySelector("time.body-small, time");
      const heading = card.querySelector("h6.eni-h6, h6, h5, h4");
      const href = card.getAttribute("href");
      const imageCell = "";
      const textFrag = document.createDocumentFragment();
      textFrag.appendChild(document.createComment(" field:text "));
      if (time) {
        const p = document.createElement("p");
        p.textContent = time.textContent.trim();
        textFrag.appendChild(p);
      }
      if (heading) {
        const h = document.createElement("strong");
        h.textContent = heading.textContent.trim();
        const p = document.createElement("p");
        p.appendChild(h);
        textFrag.appendChild(p);
      }
      if (href) {
        const link = document.createElement("a");
        link.setAttribute("href", href);
        link.textContent = heading ? heading.textContent.trim() : "Read more";
        textFrag.appendChild(link);
      }
      cells.push([imageCell, textFrag]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-pressrelease", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-mosaic.js
  function parse3(element, { document }) {
    const cardLinks = element.querySelectorAll(":scope > a");
    const cells = [];
    cardLinks.forEach((cardLink) => {
      const img = cardLink.querySelector("img.img-card, picture img");
      const imageCell = [];
      if (img) {
        const imageComment = document.createComment(" field:image ");
        imageCell.push(imageComment);
        imageCell.push(img);
      }
      const textCell = [];
      const textComment = document.createComment(" field:text ");
      textCell.push(textComment);
      const tag = cardLink.querySelector(".tagsList .tag, .tagsList li");
      if (tag) {
        const tagP = document.createElement("p");
        tagP.textContent = tag.textContent.trim();
        textCell.push(tagP);
      }
      const heading = cardLink.querySelector("h5.eni-h5, h5, .description h5, .description h4, .description h3");
      if (heading) {
        textCell.push(heading);
      }
      const href = cardLink.getAttribute("href");
      if (href) {
        const link = document.createElement("a");
        link.setAttribute("href", href);
        link.textContent = heading ? heading.textContent.trim() : "Read more";
        textCell.push(link);
      }
      if (imageCell.length > 0 || textCell.length > 0) {
        cells.push([imageCell, textCell]);
      }
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-mosaic", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-explore.js
  function parse4(element, { document }) {
    const cardLinks = element.querySelectorAll(":scope > a");
    const cells = [];
    cardLinks.forEach((cardLink) => {
      const img = cardLink.querySelector("img.img-card, img");
      const imageCell = document.createDocumentFragment();
      imageCell.appendChild(document.createComment(" field:image "));
      if (img) {
        const picture = document.createElement("picture");
        const imgClone = img.cloneNode(true);
        picture.appendChild(imgClone);
        imageCell.appendChild(picture);
      }
      const textCell = document.createDocumentFragment();
      textCell.appendChild(document.createComment(" field:text "));
      const tag = cardLink.querySelector(".tagsList .tag, .tagsList li");
      if (tag) {
        const tagParagraph = document.createElement("p");
        tagParagraph.textContent = tag.textContent.trim();
        textCell.appendChild(tagParagraph);
      }
      const heading = cardLink.querySelector("h5.eni-h5, h5, h4, h3, h2");
      if (heading) {
        const headingClone = heading.cloneNode(true);
        textCell.appendChild(headingClone);
      }
      const href = cardLink.getAttribute("href");
      if (href) {
        const link = document.createElement("a");
        link.setAttribute("href", href);
        link.textContent = heading ? heading.textContent.trim() : "Read more";
        textCell.appendChild(link);
      }
      cells.push([imageCell, textCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-explore", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/embed-widget.js
  function parse5(element, { document }) {
    const iframeSrc = element.getAttribute("src") || "";
    const cells = [];
    const frag = document.createDocumentFragment();
    frag.appendChild(document.createComment(" field:embed_uri "));
    const link = document.createElement("a");
    link.href = iframeSrc;
    link.textContent = iframeSrc;
    frag.appendChild(link);
    cells.push([frag]);
    const block = WebImporter.Blocks.createBlock(document, { name: "embed-widget", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/eni-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        "#onetrust-banner-sdk",
        "#onetrust-pc-sdk",
        ".onetrust-pc-dark-filter"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "#modalGenAI",
        "#popupWelcome-genAI",
        "#modalScopriAI",
        "#modalDisclaimerAI",
        "#modalInputAI"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "#modal-login",
        "#modal-disclaimer"
      ]);
      if (element.style && element.style.overflow === "hidden") {
        element.style.overflow = "";
      }
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        ".containerHeader",
        ".headerDesktop",
        ".headerNavbar",
        ".headerMobile",
        "#pg"
      ]);
      const { document } = payload;
      const heroTemplate = element.querySelector(".container.responsivegrid.hero-template");
      if (heroTemplate) {
        const parent = heroTemplate.parentElement;
        if (parent) {
          while (parent.firstChild && parent.firstChild !== heroTemplate) {
            parent.removeChild(parent.firstChild);
          }
        }
      }
      WebImporter.DOMUtils.remove(element, [
        ".skipToMainContent",
        "#skipToMainContent"
      ]);
      WebImporter.DOMUtils.remove(element, ["footer"]);
      WebImporter.DOMUtils.remove(element, [
        ".share-box",
        ".align"
      ]);
      const backToTopImgs = element.querySelectorAll('img[alt="Back to top"]');
      backToTopImgs.forEach((img) => {
        const wrapper = img.closest("p") || img.closest("div");
        if (wrapper) wrapper.remove();
      });
      const shareImgs = element.querySelectorAll('img[alt*="Condividi"], img[alt*="Copia link"]');
      shareImgs.forEach((img) => {
        const wrapper = img.closest("p") || img.closest("div");
        if (wrapper) wrapper.remove();
      });
      const downloadLinks = element.querySelectorAll('a[href*="download"]');
      downloadLinks.forEach((link) => {
        const wrapper = link.closest("p") || link.closest("div");
        if (wrapper && wrapper.querySelector('img[alt*="Scarica"]')) wrapper.remove();
      });
      WebImporter.DOMUtils.remove(element, ["noscript", "link"]);
    }
  }

  // tools/importer/transformers/eni-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === TransformHook2.afterTransform) {
      const { document } = payload;
      const sections = payload.template && payload.template.sections;
      if (!sections || sections.length < 2) return;
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        const sectionEl = element.querySelector(section.selector);
        if (!sectionEl) continue;
        if (section.style) {
          const sectionMetadata = WebImporter.Blocks.createBlock(document, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          sectionEl.after(sectionMetadata);
        }
        if (i > 0) {
          const hr = document.createElement("hr");
          sectionEl.before(hr);
        }
      }
    }
  }

  // tools/importer/import-homepage.js
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "ENI Italy homepage with hero, navigation, featured content, and corporate information",
    urls: ["https://www.eni.com/it-IT/home.html"],
    blocks: [
      {
        name: "carousel-hero",
        instances: [".homepage-slider-v2"]
      },
      {
        name: "cards-pressrelease",
        instances: [".homepage-fascia-cs-v2 .slick-fascia"]
      },
      {
        name: "cards-mosaic",
        instances: ["#widget--33891057 .mosaico", "#widget-913498274 .mosaico"]
      },
      {
        name: "cards-explore",
        instances: [".homepage-approfondisci .containerCard.default"]
      },
      {
        name: "embed-widget",
        instances: [".hp-iframe iframe"]
      }
    ],
    sections: [
      {
        id: "section-1",
        name: "Hero Carousel",
        selector: ".container.responsivegrid.hero-template",
        style: null,
        blocks: ["carousel-hero"],
        defaultContent: []
      },
      {
        id: "section-2",
        name: "Comunicati Stampa",
        selector: ".homepage-fascia-cs-v2",
        style: null,
        blocks: ["cards-pressrelease"],
        defaultContent: [".homepage-fascia-cs-v2 .header h2", ".homepage-fascia-cs-v2 .header a"]
      },
      {
        id: "section-3",
        name: "Business Highlights",
        selector: "#widget--33891057",
        style: "dark",
        blocks: ["cards-mosaic"],
        defaultContent: ["#widget--33891057 .title h2"]
      },
      {
        id: "section-4",
        name: "Iniziative in Evidenza",
        selector: "#widget-913498274",
        style: "dark",
        blocks: ["cards-mosaic"],
        defaultContent: ["#widget-913498274 .title h2"]
      },
      {
        id: "section-5",
        name: "Scopri Eni",
        selector: ".homepage-approfondisci",
        style: null,
        blocks: ["cards-explore"],
        defaultContent: [".homepage-approfondisci .title h2", ".homepage-approfondisci .title p"]
      },
      {
        id: "section-6",
        name: "Financial Widget",
        selector: ".hp-iframe",
        style: null,
        blocks: ["embed-widget"],
        defaultContent: []
      }
    ]
  };
  var parsers = {
    "carousel-hero": parse,
    "cards-pressrelease": parse2,
    "cards-mosaic": parse3,
    "cards-explore": parse4,
    "embed-widget": parse5
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
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
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_homepage_default = {
    transform: (payload) => {
      const { document, url, html, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
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
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "")
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_homepage_exports);
})();

# Single Page Migration Plan: ENI Italy Homepage

## Overview

Migrate **https://www.eni.com/it-IT/home.html** to AEM Edge Delivery Services in this XWalk-based project (`e-corp-site`).

**Source URL:** https://www.eni.com/it-IT/home.html  
**Target project:** XWalk (Universal Editor) — uses `component-models.json`, `eslint-plugin-xwalk`  
**Content path:** `/content/e-corp-site/it-IT/home`

## Current Project State

- **Project type:** XWalk (AEM Block Collection based)
- **Available blocks:** accordion, cards, carousel, columns, embed, form, fragment, header, hero, modal, quote, search, table, tabs, video
- **Content directory:** Does not yet exist (`/content/` is empty)
- **Import infrastructure:** Not yet created (`/tools/importer/` does not exist)
- **Migration work:** No prior migration work found

## Approach

Use the **excat:excat-site-migration** skill to orchestrate the full single-page migration workflow:

1. **Page Analysis** — Scrape and analyze the ENI homepage structure, identify sections, blocks, and content patterns
2. **Block Mapping** — Map source page elements to available EDS blocks (hero, cards, columns, etc.) or identify new blocks needed
3. **Import Infrastructure** — Generate block parsers and page transformers for the ENI homepage content
4. **Content Import** — Execute the import to produce the final HTML content in `/content/`
5. **Design Migration** — Extract and apply visual styling from the original page
6. **Verification** — Preview the migrated page and validate rendering

## Checklist

- [ ] Analyze page structure of https://www.eni.com/it-IT/home.html (sections, blocks, metadata)
- [ ] Identify block variants needed (hero, cards, navigation, etc.)
- [ ] Map source DOM elements to EDS blocks (existing or new)
- [ ] Create page template in `page-templates.json`
- [ ] Generate block parsers for each identified block variant
- [ ] Generate page transformers (cleanup + sections)
- [ ] Build and execute the import script
- [ ] Verify imported HTML content renders correctly in local preview
- [ ] Migrate site-level design tokens (fonts, colors, spacing)
- [ ] Migrate block-level CSS styling
- [ ] Final visual comparison against original page

## Risks & Considerations

- **Language:** Page is in Italian — content should be preserved as-is without translation
- **Dynamic content:** Homepage may contain JS-rendered sections (carousels, sliders) that require careful scraping
- **New blocks:** ENI homepage likely uses patterns not covered by current block library — new blocks may need to be created
- **Navigation:** Header/footer may require the navigation skill for proper setup

## Execution

This plan requires **Execute mode** to proceed. The primary entry point will be the `excat:excat-site-migration` skill for single-page migration orchestration.

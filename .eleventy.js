const fs = require("fs");
const path = require("path");
const markdownIt = require("markdown-it");
const markdownItAnchor = require("markdown-it-anchor");
const md = new markdownIt();
const makeToc = require("./lib/shortcodes/toc");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "source/assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "source/css": "css" });
  eleventyConfig.addPassthroughCopy({ "source/scripts": "scripts" });
  eleventyConfig.addPassthroughCopy({ "source/data": "data"});

  eleventyConfig.amendLibrary("md", (mdLib) =>
    mdLib.use(markdownItAnchor, {
      level: [1, 2, 3, 4, 5, 6],
      slugify: (str) => eleventyConfig.getFilter("slugify")(str),
    })
  );

  eleventyConfig.addCollection("guides", function(collectionApi) {
    return collectionApi.getFilteredByTag("guides")
  });

  eleventyConfig.addShortcode("svg", function(filename) {
    const filepath = path.join(process.cwd(), "source/assets", filename);
    return fs.readFileSync(filepath, "utf8");
  });

  eleventyConfig.addShortcode("woodcut", function(filename, transform="") {
    const src = `/assets/${filename}`;
    return `<div class="woodcut-frame"><img class="woodcut" src="${src}" style="transform: ${transform}"></div>`;
  });
  
  eleventyConfig.addFilter("formatPhoneNumber", (phone) => {
    // Strip everything except digits and leading +
    const digits = phone.replace(/[^\d]/g, "");

    // Normalize to 11 digits (add leading 1 if 10-digit US number)
    const normalized = digits.length === 10 ? "1" + digits : digits;

    if (normalized.length !== 11 || normalized[0] !== "1") {
      throw new Error(`Unsupported phone number format: ${phone}`);
    }

    const country = normalized[0];
    const area = normalized.slice(1, 4);
    const exchange = normalized.slice(4, 7);
    const subscriber = normalized.slice(7, 11);

    return `+${country} (${area}) ${exchange}-${subscriber}`;
  });

  eleventyConfig.addShortcode("toc", makeToc(eleventyConfig.getFilter("slugify")));

  return {
    dir: {
      input: "source",
      includes: "_includes",
      layouts: "_includes/layouts",
      output: "public",
    },
    markdownTemplateEngine: "njk",
    passthroughFileCopy: true,
  };
};

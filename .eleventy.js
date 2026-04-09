const fs = require("fs");
const path = require("path");
const markdownIt = require("markdown-it");
const md = new markdownIt();

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "source/assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "source/css": "css" });
  eleventyConfig.addPassthroughCopy({ "source/scripts": "scripts" });
  eleventyConfig.addPassthroughCopy({ "source/data": "data"});

  eleventyConfig.addShortcode("svg", function(filename) {
    const filepath = path.join(process.cwd(), "source/assets", filename);
    return fs.readFileSync(filepath, "utf8");
  });

  eleventyConfig.addShortcode("woodcut", function(filename, transform="") {
    const src = `/assets/${filename}`;
    return `<div class="woodcut-frame"><img class="woodcut" src="${src}" style="transform: ${transform}"></div>`;
  });

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

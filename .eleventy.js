const fs = require("fs");
const path = require("path");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "source/assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "source/css": "css" });
  eleventyConfig.addPassthroughCopy({ "source/scripts": "scripts" });
  eleventyConfig.addPassthroughCopy({ "source/data": "data"});

  eleventyConfig.addShortcode("svg", function(filename) {
    const filepath = path.join(process.cwd(), "source/assets", filename);
    return fs.readFileSync(filepath, "utf8");
  });

  return {
    dir: {
      input: "source",
      includes: "_includes",
      layouts: "_includes/layouts",
      output: "public",
    },
    passthroughFileCopy: true,
  };
};

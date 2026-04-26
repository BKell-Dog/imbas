const fs = require("fs");

function getHeaders(markdown) {
  const headers = [];
  const regex = /^(#{1,6})\s+(.*)$/gm;
  let match;
  while ((match = regex.exec(markdown)) !== null) {
    const text = match[2].trim();
    if (text) headers.push({ level: match[1].length, text });
  }
  return headers;
}

function renderList(headers, slugify) {
  if (!headers.length) return "";

  let html = "<ul>";
  let i = 0;

  while (i < headers.length) {
    const { level, text } = headers[i++];
    html += `<li><a href="#${slugify(text)}">${text}</a>`;

    const children = [];
    while (i < headers.length && headers[i].level > level) {
      children.push(headers[i++]);
    }

    html += renderList(children, slugify) + "</li>";
  }

  return html + "</ul>";
}

// Factory: receives slugify at config time, returns the actual shortcode function
module.exports = function makeToc(slugify) {
  return function tocShortcode(markdownFilePath) {
    const filePath = markdownFilePath || this.page.inputPath;
    const markdown = fs.readFileSync(filePath, "utf-8");
    const headers = getHeaders(markdown);
    return headers.length ? renderList(headers, slugify) : "";
  };
};